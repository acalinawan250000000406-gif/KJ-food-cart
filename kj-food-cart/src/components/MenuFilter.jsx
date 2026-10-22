import React from 'react';

export default function MenuFilter({
  categories,
  activeCategory,
  onSelectCategory,
  searchTerm,
  onSearchChange
}) {
  return (
    <div className="filter-section">
      <div className="search-bar">
        <span className="search-icon">🔍</span>
        <input
          type="text"
          placeholder="Search food or drinks..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        {searchTerm && (
          <button className="clear-search" onClick={() => onSearchChange('')}>
            ✕
          </button>
        )}
      </div>

      <div className="category-list">
        {categories.map((cat) => (
          <button
            key={cat}
            className={`category-btn ${activeCategory === cat ? 'active' : ''}`}
            onClick={() => onSelectCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  );
}