import React, { useState, useEffect } from 'react';

import Header from './components/Header';
import BackgroundConfetti from './components/BackgroundConfetti';
import ProductGrid from './components/ProductGrid';
import ProductPanel from './components/ProductPanel';
import SocialLinks from './components/SocialLinks';
import CartModal from './components/CartModal';
import AboutModal from './components/AboutModal';
import Toast from './components/Toast';
import Footer from './components/Footer';

import { COLORS } from './data/constants';

export default function App() {
  const [inventory, setInventory] = useState({});
  const [cart, setCart] = useState([]);
  const [selectedKey, setSelectedKey] = useState(null);
  const [selectedPkIndex, setSelectedPkIndex] = useState(0);
  const [selectedFlavors, setSelectedFlavors] = useState([]);
  const [customQty, setCustomQty] = useState(100);

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  const loadInventory = async () => {
    try {
      const res = await fetch('/api/inventory');
      const data = await res.json();
      const map = {};
      data.forEach(i => map[i.itemKey] = i);
      setInventory(map);
    } catch (_) {}
  };

  useEffect(() => {
    loadInventory();
    const interval = setInterval(loadInventory, 60000);
    return () => clearInterval(interval);
  }, []);

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3500);
  };

  const triggerBurstConfetti = (particleCount = 70, spread = 75) => {
    if (typeof window !== 'undefined' && window.confetti) {
      window.confetti({ particleCount, spread, origin: { y: 0.7 }, colors: COLORS, zIndex: 100 });
    }
  };

  const handlePickProduct = (key) => {
    if (!key || selectedKey === key) {
      setSelectedKey(null);
      return;
    }
    setSelectedKey(key);
    setSelectedPkIndex(0);
    setSelectedFlavors([]);
    setCustomQty(100);
    triggerBurstConfetti(35, 60);
  };

  const handleToggleFlavor = (flavorName, max) => {
    if (selectedFlavors.includes(flavorName)) {
      setSelectedFlavors(selectedFlavors.filter(f => f !== flavorName));
    } else {
      if (selectedFlavors.length >= max) {
        showToast(`You can pick up to ${max} flavors`);
        return;
      }
      setSelectedFlavors([...selectedFlavors, flavorName]);
    }
  };

  const handleAddToCart = (item) => {
    setCart([...cart, item]);
    setSelectedKey(null);
    triggerBurstConfetti(120, 100);
    showToast('Added to cart! 🎉');
  };

  const handleRemoveFromCart = (index) => {
    setCart(cart.filter((_, i) => i !== index));
  };

  return (
    <div className="app-container">
      <BackgroundConfetti />

      <Header
        cartCount={cart.length}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenAbout={() => setIsAboutOpen(true)}
      />

      <Toast message={toastMsg} onOpenCart={() => setIsCartOpen(true)} />

      <main className="main-layout">
        <section className="hero-card">
          <h2>Let's make your party sweet!</h2>
          <p>Mindanao's best! Sorbetes Davao. Tap a box to see packages and flavors.</p>
        </section>

        <ProductGrid
          selectedKey={selectedKey}
          inventory={inventory}
          onPickProduct={handlePickProduct}
        />

        <ProductPanel
          selectedKey={selectedKey}
          selectedPkIndex={selectedPkIndex}
          selectedFlavors={selectedFlavors}
          customQty={customQty}
          inventory={inventory}
          onClose={() => setSelectedKey(null)}
          onSelectPackage={setSelectedPkIndex}
          onToggleFlavor={handleToggleFlavor}
          onChangeCustomQty={setCustomQty}
          onAddToCart={handleAddToCart}
          onShowToast={showToast}
        />

        <SocialLinks />
      </main>

      <CartModal
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onRemoveItem={handleRemoveFromCart}
        onClearCart={() => setCart([])}
        onShowToast={showToast}
      />

      <AboutModal
        isOpen={isAboutOpen}
        onClose={() => setIsAboutOpen(false)}
      />

      <Footer />
    </div>
  );
}