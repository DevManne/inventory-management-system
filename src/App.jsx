import React, { useReducer, useEffect } from 'react';
import { reducer, initialState } from './reducer';
import FilterPanel from './FilterPanel';
import InventoryTable from './InventoryTable';
import LowStockDashboard from './LowStockDashboard';
import StockChart from './StockChart';

export default function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { all, filtered, filters, loading, error } = state;

  // ── Load inventory JSON ──────────────────────────────────
  const loadData = async () => {
    dispatch({ type: 'LOAD_START' });
    try {
      const res  = await fetch('/inventory.json');
      const data = await res.json();
      dispatch({ type: 'LOAD_DATA', payload: data });
    } catch (e) {
      dispatch({ type: 'LOAD_ERROR', payload: 'Failed to load inventory data.' });
    }
  };

  // Auto-load on mount
  useEffect(() => { loadData(); }, []);

  // ── Export inventory JSON ────────────────────────────────
  const downloadData = () => {
    const file = new Blob([JSON.stringify(all, null, 2)], { type: 'application/json' });
    const url  = URL.createObjectURL(file);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = 'inventory_report.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const reset = () => {
    dispatch({ type: 'RESET' });
    loadData();
  };

  return (
    <div className="app">
      {/* ── Header ── */}
      <header className="app-header">
        <div className="header-left">
          <span className="header-icon">📦</span>
          <div>
            <h1 className="header-title">Inventory Management System</h1>
            <p className="header-sub">React · useReducer · Recharts · PWA</p>
          </div>
        </div>
        <div className="header-actions">
          <button className="btn btn-load" onClick={loadData} disabled={loading}>
            {loading ? 'Loading…' : '⟳ Reload'}
          </button>
          <button className="btn btn-download" onClick={downloadData} disabled={all.length === 0}>
            ↓ Export JSON
          </button>
          <button className="btn btn-reset" onClick={reset}>
            ↺ Reset
          </button>
        </div>
      </header>

      {/* ── Error ── */}
      {error && <div className="error-banner">⚠ {error}</div>}

      {/* ── Filter Panel ── */}
      <FilterPanel filters={filters} dispatch={dispatch} />

      {/* ── Stats Bar ── */}
      {all.length > 0 && (
        <div className="stats-bar">
          <span>Total Products: <strong>{all.length}</strong></span>
          <span>Showing: <strong>{filtered.length}</strong></span>
          <span>Total Stock Units: <strong>{all.reduce((s, p) => s + p.stock, 0)}</strong></span>
          <span>Inventory Value: <strong>₹{all.reduce((s, p) => s + p.stock * p.price, 0).toLocaleString()}</strong></span>
        </div>
      )}

      {/* ── Main Inventory Table ── */}
      <section className="section">
        <h2 className="section-title">🗂 Product Inventory</h2>
        {loading ? (
          <div className="loading">Loading inventory…</div>
        ) : (
          <InventoryTable items={filtered} dispatch={dispatch} />
        )}
      </section>

      {/* ── Low Stock Dashboard ── */}
      {all.length > 0 && <LowStockDashboard all={all} />}

      {/* ── Recharts ── */}
      {all.length > 0 && <StockChart all={all} />}

      <footer className="app-footer">
        Hemanth Manne (2023003773) · GITAM School of Technology · Web Application Development
      </footer>
    </div>
  );
}
