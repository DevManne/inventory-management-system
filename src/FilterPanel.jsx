import React from 'react';

const CATEGORIES = ['Electronics', 'Stationery', 'Furniture', 'Hygiene'];

export default function FilterPanel({ filters, dispatch }) {
  const set = (key, value) => dispatch({ type: 'FILTER', payload: { [key]: value } });

  return (
    <div className="filter-panel">
      <input
        className="filter-input"
        type="text"
        placeholder="🔍  Search by product name…"
        value={filters.name}
        onChange={(e) => set('name', e.target.value)}
      />

      <select
        className="filter-select"
        value={filters.category}
        onChange={(e) => set('category', e.target.value)}
      >
        <option value="">All Categories</option>
        {CATEGORIES.map((c) => (
          <option key={c} value={c}>{c}</option>
        ))}
      </select>

      <select
        className="filter-select"
        value={filters.level}
        onChange={(e) => set('level', e.target.value)}
      >
        <option value="all">All Stock Levels</option>
        <option value="critical">🔴 Critical (≤ 5)</option>
        <option value="warning">🟡 Warning (≤ 15)</option>
        <option value="ok">🟢 OK (&gt; 15)</option>
      </select>
    </div>
  );
}
