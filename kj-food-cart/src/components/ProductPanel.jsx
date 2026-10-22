import React from 'react';
import { PRODUCTS, CUSTOM_UNIT, peso } from '../data/constants';

export default function ProductPanel({
  selectedKey,
  selectedPkIndex,
  selectedFlavors,
  customQty,
  inventory,
  onClose,
  onSelectPackage,
  onToggleFlavor,
  onChangeCustomQty,
  onAddToCart,
  onShowToast
}) {
  if (!selectedKey) return null;

  const p = PRODUCTS[selectedKey];
  const pk = p.pk[selectedPkIndex];

  const calculatePrice = () => {
    return pk.custom ? (customQty || 0) * CUSTOM_UNIT : pk.price;
  };

  const isFlavorAvailable = (flavorName) => {
    const itemKey = `${selectedKey}:${flavorName}`;
    if (!inventory[itemKey]) return true;
    return inventory[itemKey].isEnabled && inventory[itemKey].quantity > 0;
  };

  const bestSellers = p.fl.filter(f => f.best);
  const basicFlavors = p.fl.filter(f => !f.best);

  const renderFlavorChip = (f) => {
    const off = !isFlavorAvailable(f.n);
    const isSel = selectedFlavors.includes(f.n);

    return (
      <button
        key={f.n}
        className={`chip ${isSel ? 'sel' : ''}`}
        disabled={off}
        onClick={() => onToggleFlavor(f.n, p.max)}
      >
        {f.n} {f.e || ''}
        {off && <small> (Sold out)</small>}
      </button>
    );
  };

  const handleAdd = () => {
    if (p.fl.length && !selectedFlavors.length) {
      onShowToast('Pick at least one flavor first 🍦');
      return;
    }
    if (pk.custom && customQty < 100) {
      onShowToast('Custom orders start at 100 cones');
      return;
    }

    onAddToCart({
      key: selectedKey,
      pkgId: pk.id,
      qty: customQty,
      flavors: [...selectedFlavors],
      price: calculatePrice(),
      name: `${p.name} (${pk.custom ? customQty + ' Cones, Custom' : pk.name})`
    });
  };

  return (
    <div className="panel" style={{ '--c': p.color }}>
      <button className="x" onClick={onClose} aria-label="Close">✕</button>

      <h2 className="ph"><span>{p.emoji}</span> {p.name}</h2>
      {p.tag && <p className="tag">{p.tag}</p>}

      {/* Package Card */}
      <div className="card">
        <h3>{p.qtyLabel}</h3>
        {p.pk.length === 1 ? (
          <div className="single">
            <b>{pk.name}</b> <em>({peso(pk.price)})</em>
          </div>
        ) : (
          <div className="chips">
            {p.pk.map((k, i) => (
              <button
                key={k.id}
                className={`chip ${i === selectedPkIndex ? 'sel' : ''}`}
                onClick={() => onSelectPackage(i)}
              >
                {k.name} <small>({k.custom ? '100+ cones' : peso(k.price)})</small>
              </button>
            ))}
          </div>
        )}

        {pk.custom && (
          <label className="qty">
            How many cones?
            <input
              type="number"
              min="100"
              max="5000"
              step="10"
              value={customQty}
              onChange={(e) => onChangeCustomQty(parseInt(e.target.value, 10) || 0)}
            />
            <small>(₱{CUSTOM_UNIT}/cone)</small>
          </label>
        )}
      </div>

      {/* Flavors Card */}
      {p.fl.length > 0 && (
        <div className="card">
          <div className="fhead">
            <h3>Flavors</h3>
            <span className="badge">Selected: {selectedFlavors.length} / {p.max}</span>
          </div>

          {bestSellers.length > 0 ? (
            <>
              <h4>★ Best sellers</h4>
              <div className="chips">{bestSellers.map(renderFlavorChip)}</div>
              <h4>Basic flavors</h4>
              <div className="chips">{basicFlavors.map(renderFlavorChip)}</div>
            </>
          ) : (
            <div className="chips">{p.fl.map(renderFlavorChip)}</div>
          )}
        </div>
      )}

      {/* Panel Footer */}
      <div className="pfoot">
        <span>Price: <b>{peso(calculatePrice())}</b></span>
        <button className="btn-3d btn-teal" onClick={handleAdd}>
          🛒 + Add to Cart
        </button>
      </div>
    </div>
  );
}