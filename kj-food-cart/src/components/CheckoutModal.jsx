import React, { useState } from 'react';

export default function CheckoutModal({ isOpen, onClose, cartItems, onCompleteOrder }) {
  const [customerName, setCustomerName] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Cash');
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const totalAmount = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleSubmitOrder = (e) => {
    e.preventDefault();
    if (!customerName.trim()) return;
    setIsSubmitted(true);
  };

  const handleFinish = () => {
    setIsSubmitted(false);
    setCustomerName('');
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
                  {cartItems.map((item) => (
                    <li key={item.id}>
                      {item.name} x {item.quantity} - ₱{(item.price * item.quantity).toFixed(2)}
                    </li>
                  ))}
                </ul>
                <div className="order-total-highlight">
                  Total: ₱{totalAmount.toFixed(2)}
                </div>
              </div>

              <div className="modal-actions">
                <button type="button" className="cancel-btn" onClick={onClose}>Cancel</button>
                <button type="submit" className="confirm-btn">Confirm Order</button>
              </div>
            </form>
          </>
        ) : (
          <div className="order-success">
            <span className="success-icon">🎉</span>
            <h2>Thank You, {customerName}!</h2>
            <p>Your order has been placed successfully using <strong>{paymentMethod}</strong>.</p>
            <p className="order-total-receipt">Total Amount Paid: ₱{totalAmount.toFixed(2)}</p>
            <button className="confirm-btn" onClick={handleFinish}>Done</button>
          </div>
        )}
      </div>
    </div>
  );
}