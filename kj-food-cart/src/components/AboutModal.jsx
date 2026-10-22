import React from 'react';

export default function AboutModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-sheet" onClick={(e) => e.stopPropagation()}>
        <button className="close-modal-btn" onClick={onClose} aria-label="Close modal">
          ✕
        </button>
        <h2 className="modal-title">🍦 About Kenneth Jay's Fun Food Carts</h2>
        <p className="about-text">
          We bring sweetness, fun, and party excitement across Davao City!
          Located at the vibrant <strong>Roxas Night Market</strong>, we specialize in food cart rentals including:
        </p>
        <ul className="about-list">
          <li>🍦 Ice Cream (Charcoal, Durian, Dragon Fruit & Classic flavors)</li>
          <li>🍿 Fresh Flavored Popcorn</li>
          <li>🍭 Fluffy Blue & Pink Cotton Candy</li>
          <li>🥤 Classic Hot Taho</li>
          <li>🍟 Crispy Flavored Fries</li>
        </ul>
        <p className="about-footer">Book us for birthdays, weddings, corporate events, and reunions!</p>
      </div>
    </div>
  );
}