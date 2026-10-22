import React, { useState } from 'react';
import { DOWNPAYMENT, FB_URL, peso, fmtDate, fmtTime } from '../data/constants';

const API_URL = 'http://localhost:5000';

// Local money formatter (never shows NaN, always 2 decimals)
const peso2 = (n) =>
  '₱' + (Number(n) || 0).toLocaleString('en-PH', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
// Uses the constant from constants.js when it is a valid number, otherwise 500
const DP_AMOUNT = Number(DOWNPAYMENT) || 500;

export default function CartModal({
  isOpen,
  onClose,
  cart,
  onRemoveItem,
  onClearCart,
  onShowToast
}) {
  const [step, setStep] = useState(1);
  const [dateMsg, setDateMsg] = useState({ text: '', isError: false });
  const [dateFull, setDateFull] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [qrError, setQrError] = useState(false);

  const [formData, setFormData] = useState({
    customerName: '',
    phone: '',
    eventName: '',
    eventDate: '',
    eventTime: '',
    instructions: ''
  });

  const [lastOrder, setLastOrder] = useState(null);

  if (!isOpen) return null;

  const totalAmount = cart.reduce((s, i) => s + (Number(i.price) || 0), 0);
  const minDate = new Date().toISOString().slice(0, 10);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const checkDateAvailability = async (date) => {
    if (!date) return;
    setDateMsg({ text: '⏳ Checking date availability...', isError: false });
    try {
      const res = await fetch(`${API_URL}/api/availability?date=${date}`);
      const r = await res.json();
      const full = !!r.full;
      setDateFull(full);
      if (r.full !== undefined) {
        setDateMsg({
          text: full
            ? '🚫 ORDER FULL: 3 party orders booked. Please pick another date.'
            : '✅ Date is open for booking!',
          isError: full
        });
      }
    } catch (_) {
      setDateFull(false);
      setDateMsg({ text: '✅ Date selected', isError: false });
    }
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    if (dateFull || !cart.length) return;
    setSubmitting(true);

    try {
      const res = await fetch(`${API_URL}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          subtotal: totalAmount,
          items: cart.map(i => ({ pkgId: i.pkgId, qty: i.qty, flavors: i.flavors }))
        })
      });
      const d = await res.json();

      if (!d.success) {
        onShowToast('Could not save your order. Please try again. ⚠️');
        setSubmitting(false);
        return;
      }

      const orderObj = {
        id: d.orderId,
        total: Number(d.total ?? totalAmount),
        ...formData,
        issued: new Date(),
        items: cart.map(i => ({ name: i.name, flavors: [...i.flavors], price: i.price }))
      };

      setLastOrder(orderObj);
      setStep(3);
    } catch (_) {
      onShowToast("Could not reach the server. Make sure 'node server.js' is running. ⚠️");
    }

    setSubmitting(false);
  };

  const handleConfirmPaid = async () => {
    if (!lastOrder || confirming) return;
    setConfirming(true);

    try {
      const res = await fetch(`${API_URL}/api/orders/${lastOrder.id}/paid`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reference: '',
          downpayment: Math.min(DP_AMOUNT, lastOrder.total)
        })
      });
      const d = await res.json();

      if (!d.success) {
        onShowToast('Could not record your downpayment. Please try again. ⚠️');
        setConfirming(false);
        return;
      }
    } catch (_) {
      onShowToast("Could not reach the server. Make sure 'node server.js' is running. ⚠️");
      setConfirming(false);
      return;
    }

    onClearCart();
    setConfirming(false);
    setStep(4);
  };

  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text);
    onShowToast(`Copied ${label} to clipboard! 📋`);
  };

  const orderTotal = lastOrder ? Number(lastOrder.total) || 0 : totalAmount;
  const dp = Math.min(DP_AMOUNT, orderTotal);
  const bal = Math.max(orderTotal - dp, 0);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-sheet" onClick={(e) => e.stopPropagation()}>
        {/* Floating 3D Close Button */}
        <button className="close-modal-btn" onClick={onClose} aria-label="Close modal">
          ✕
        </button>

        {/* Progress Steps Header */}
        <div className="checkout-progress-bar">
          <div className={`progress-step ${step >= 1 ? 'active' : ''}`}>
            <span className="step-num">1</span> Cart
          </div>
          <div className={`progress-step ${step >= 2 ? 'active' : ''}`}>
            <span className="step-num">2</span> Event
          </div>
          <div className={`progress-step ${step >= 3 ? 'active' : ''}`}>
            <span className="step-num">3</span> Payment
          </div>
          <div className={`progress-step ${step >= 4 ? 'active' : ''}`}>
            <span className="step-num">4</span> Invoice
          </div>
        </div>

        {/* STEP 1: CART */}
        {step === 1 && (
          <div className="step-content">
            <h2 className="modal-title">🛒 Shopping Cart</h2>

            {cart.length === 0 ? (
              <div className="empty-cart-view">
                <p>Your cart is empty. Tap a food cart box to start your order!</p>
              </div>
            ) : (
              <div className="cart-items-wrapper">
                {cart.map((item, idx) => (
                  <div key={idx} className="cart-item-card">
                    <div className="cart-item-details">
                      <b>{item.name}</b>
                      {item.flavors.length > 0 && (
                        <small>{item.flavors.join(', ')}</small>
                      )}
                    </div>
                    <div className="cart-item-price-actions">
                      <span className="cart-item-price">{peso(item.price)}</span>
                      <button
                        className="btn-3d btn-danger"
                        onClick={() => onRemoveItem(idx)}
                        aria-label="Remove item"
                      >
                        🗑
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="cart-summary-footer">
              <div className="cart-total-row">
                <span>Total:</span>
                <span className="amount">{peso(totalAmount)}</span>
              </div>
              <button
                className="btn-3d btn-primary btn-block"
                disabled={!cart.length}
                onClick={() => setStep(2)}
              >
                Proceed to Event Details ➔
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: EVENT DETAILS FORM */}
        {step === 2 && (
          <form onSubmit={handleSubmitOrder} className="step-content">
            <h2 className="modal-title">📋 Customer & Event Info</h2>

            <div className="form-fields-grid">
              <div className="form-group">
                <label>Your Name:</label>
                <input
                  type="text"
                  name="customerName"
                  className="form-input"
                  required
                  placeholder="e.g. Maria Santos"
                  value={formData.customerName}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label>Phone Number:</label>
                <input
                  type="tel"
                  name="phone"
                  className="form-input"
                  required
                  placeholder="09XXXXXXXXX"
                  value={formData.phone}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label>Event Name:</label>
                <input
                  type="text"
                  name="eventName"
                  className="form-input"
                  required
                  placeholder="e.g. Maya's 7th Birthday"
                  value={formData.eventName}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label>Event Date:</label>
                <input
                  type="date"
                  name="eventDate"
                  className="form-input"
                  required
                  min={minDate}
                  value={formData.eventDate}
                  onChange={(e) => {
                    handleInputChange(e);
                    checkDateAvailability(e.target.value);
                  }}
                />
                {dateMsg.text && (
                  <p className={`date-status-msg ${dateMsg.isError ? 'error' : 'success'}`}>
                    {dateMsg.text}
                  </p>
                )}
              </div>

              <div className="form-group">
                <label>Event Time:</label>
                <input
                  type="time"
                  name="eventTime"
                  className="form-input"
                  required
                  value={formData.eventTime}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label>Special Instructions / Venue:</label>
                <textarea
                  name="instructions"
                  className="form-input"
                  rows="2"
                  placeholder="e.g. Function Hall B, landmark near main gate"
                  value={formData.instructions}
                  onChange={handleInputChange}
                ></textarea>
              </div>
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="btn-3d btn-secondary"
                onClick={() => setStep(1)}
              >
                Back
              </button>
              <button
                type="submit"
                className="btn-3d btn-primary"
                disabled={dateFull || submitting}
              >
                {submitting ? 'Processing...' : 'Proceed to Payment ➔'}
              </button>
            </div>
          </form>
        )}

        {/* STEP 3: PAYMENT & INSTAPAY QR */}
        {step === 3 && (
          <div className="step-content text-center">
            <h2 className="modal-title">💳 Send Downpayment</h2>
            <p className="order-id-subtitle">Order Reference: <strong>{lastOrder?.id}</strong></p>

            <div className="dp-box">
              <span>Required Downpayment:</span>
              <strong className="dp-amount-text">{peso2(dp)}</strong>
            </div>

            <div className="qr-card">
              {!qrError ? (
                <img
                  src="/images/qr.png"
                  alt="InstaPay QR Code"
                  className="qr-image"
                  onError={() => setQrError(true)}
                />
              ) : (
                <div className="qr-fallback-icon">📲</div>
              )}
              <p className="gcash-num-label">GCash / InstaPay: <strong>0961-980-3328</strong></p>
              <button
                type="button"
                className="btn-3d btn-secondary btn-sm"
                onClick={() => copyToClipboard('0961-980-3328', 'GCash Number')}
              >
                📋 Copy GCash Number
              </button>
            </div>

            <button
              className="btn-3d btn-primary btn-block"
              onClick={handleConfirmPaid}
              disabled={confirming}
            >
              {confirming ? 'Saving...' : 'I have sent the downpayment ➔'}
            </button>
          </div>
        )}

        {/* STEP 4: PRINTABLE INVOICE */}
        {step === 4 && lastOrder && (
          <div className="step-content">
            <h2 className="modal-title text-center">🎉 Booking Confirmed!</h2>

            <div className="inv">
              <div className="inv-head">
                <div>
                  <h3>Kenneth Jay's Fun Food Carts</h3>
                  <p>Roxas Night Market, Davao City</p>
                </div>
                <div className="inv-tag">NON-VAT<br />INVOICE</div>
              </div>

              <div className="inv-info-row">
                <p><strong>Invoice No:</strong> {lastOrder.id}</p>
                <p><strong>Customer:</strong> {lastOrder.customerName} ({lastOrder.phone})</p>
                <p><strong>Event:</strong> {lastOrder.eventName} — {fmtDate(lastOrder.eventDate)} @ {fmtTime(lastOrder.eventTime)}</p>
              </div>

              <div className="inv-divider"></div>
              <h4>Order Breakdown:</h4>
              <div className="inv-items-list">
                {lastOrder.items.map((i, idx) => (
                  <div key={idx} className="inv-item-row">
                    <span>{i.name}</span>
                    <b>{peso2(i.price)}</b>
                  </div>
                ))}
              </div>

              <div className="inv-divider"></div>
              <div className="inv-totals">
                <p>Total Amount: <b>{peso2(orderTotal)}</b></p>
                <p>Downpayment Sent: <b>− {peso2(dp)}</b></p>
                <p className="balance-due">Balance Due: <strong>{peso2(bal)}</strong></p>
              </div>
            </div>

            <div className="invoice-actions">
              <button className="btn-3d btn-secondary btn-block" onClick={() => window.print()}>
                🖨️ Print Invoice / Save as PDF
              </button>

              {FB_URL && (
                <a href={FB_URL} target="_blank" rel="noopener noreferrer" className="fb-link-btn">
                  <button className="btn-3d btn-primary btn-block">
                    📩 Send Receipt Screenshot on Messenger
                  </button>
                </a>
              )}

              <button className="btn-3d btn-teal btn-block" onClick={onClose}>
                Done & Return Home
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}