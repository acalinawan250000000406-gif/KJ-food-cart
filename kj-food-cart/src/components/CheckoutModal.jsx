import React, { useState } from 'react';

const API_URL = 'http://localhost:5000';

export default function CheckoutModal({ isOpen, onClose, cartItems, onCompleteOrder }) {
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Cash');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [orderId, setOrderId] = useState('');

  if (!isOpen) return null;

  const totalAmount = cartItems.reduce(
    (sum, item) => sum + (Number(item.price) || 0) * (Number(item.quantity) || 1),
    0
  );

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    if (!customerName.trim()) return;

    setIsSending(true);

    const now = new Date();

    // Fields match what server.js expects. The server creates the OrderID.
    const orderPayload = {
      customerName: customerName.trim(),
      phone: phone.trim(),
      eventName: 'Store Pickup',
      eventDate: now.toISOString().split('T')[0],
      eventTime: now.toTimeString().slice(0, 5),
      eventAddress: 'Store Pickup',
      subtotal: totalAmount,
      instructions: `Payment: ${paymentMethod}`,
      items: cartItems.map((item) => ({
        pkgId: item.pkgId || item.id,
        qty: item.quantity || 1,
        flavors: item.flavors || []
      }))
    };

    try {
      const response = await fetch(`${API_URL}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload)
      });

      const result = await response.json();

      if (result.success) {
        console.log('Order logged into MS SQL successfully!', result.orderId);
        setOrderId(result.orderId);
        setIsSubmitted(true);
      } else {
        alert('Failed to save order to database: ' + result.error);
      }
    } catch (error) {
      console.error('Error connecting to backend server:', error);
      alert("Could not reach backend server on http://localhost:5000. Ensure 'node server.js' is running.");
    } finally {
      setIsSending(false);
    }
  };

  const handleFinish = () => {
    setIsSubmitted(false);
    setCustomerName('');
    setPhone('');
    setOrderId('');
    onCompleteOrder();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content checkout-dialog" onClick={(e) => e.stopPropagation()}>
        {!isSubmitted ? (
          <>
            <div className="modal-header">
              <h2>📋 Checkout Details</h2>
              <button className="close-btn" onClick={onClose}>✕</button>
            </div>

            <form onSubmit={handleSubmitOrder} className="checkout-form">
              <div className="form-group">
                <label>Customer Name:</label>
                <input
                  type="text"
                  required
                  placeholder="Enter your name"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Phone Number:</label>
                <input
                  type="tel"
                  required
                  placeholder="09XXXXXXXXX"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Payment Method:</label>
                <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
                  <option value="Cash">Cash on Pickup / Counter</option>
                  <option value="GCash">GCash</option>
                  <option value="Maya">Maya</option>
                </select>
              </div>

              <div className="order-summary-box">
                <h4>Order Summary:</h4>
                <ul>
                  {cartItems.map((item, index) => (
                    <li key={item.id || index}>
                      {item.name} x {item.quantity || 1} - ₱{((Number(item.price) || 0) * (Number(item.quantity) || 1)).toFixed(2)}
                    </li>
                  ))}
                </ul>
                <div className="order-total-highlight">
                  Total: ₱{totalAmount.toFixed(2)}
                </div>
              </div>

              <div className="modal-actions">
                <button type="button" className="cancel-btn" onClick={onClose}>Cancel</button>
                <button type="submit" className="confirm-btn" disabled={isSending}>
                  {isSending ? 'Processing...' : 'Confirm Order'}
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="order-success">
            <span className="success-icon">🎉</span>
            <h2>Thank You, {customerName}!</h2>
            <p>Your order <strong>{orderId}</strong> has been placed using <strong>{paymentMethod}</strong>.</p>
            <p className="order-total-receipt">Order Total: ₱{totalAmount.toFixed(2)}</p>
            <button className="confirm-btn" onClick={handleFinish}>Done</button>
          </div>
        )}
      </div>
    </div>
  );
}