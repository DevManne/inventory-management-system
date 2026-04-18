import React from 'react';
import { CRITICAL, WARNING, getStockLevel } from './reducer';

export default function LowStockDashboard({ all }) {
  const critical = all.filter((p) => p.stock <= CRITICAL);
  const warning  = all.filter((p) => p.stock > CRITICAL && p.stock <= WARNING);

  if (critical.length === 0 && warning.length === 0) {
    return (
      <div className="dashboard">
        <h2 className="dash-title">📊 Low-Stock Dashboard</h2>
        <div className="dash-all-ok">✅ All products are sufficiently stocked.</div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <h2 className="dash-title">📊 Low-Stock Dashboard</h2>

      <div className="dash-summary">
        <div className="summary-card card-critical">
          <span className="summary-count">{critical.length}</span>
          <span className="summary-label">Critical Items</span>
        </div>
        <div className="summary-card card-warning">
          <span className="summary-count">{warning.length}</span>
          <span className="summary-label">Warning Items</span>
        </div>
        <div className="summary-card card-ok">
          <span className="summary-count">{all.length - critical.length - warning.length}</span>
          <span className="summary-label">OK Items</span>
        </div>
      </div>

      {critical.length > 0 && (
        <div className="alert-section">
          <h3 className="alert-heading critical-heading">🔴 Critical — Restock Immediately (≤ {CRITICAL} units)</h3>
          <div className="alert-cards">
            {critical.map((p) => (
              <div key={p.id} className="alert-card critical-card">
                <div className="ac-name">{p.name}</div>
                <div className="ac-meta">{p.category} · {p.supplier}</div>
                <div className="ac-stock">Stock: <strong>{p.stock}</strong></div>
              </div>
            ))}
          </div>
        </div>
      )}

      {warning.length > 0 && (
        <div className="alert-section">
          <h3 className="alert-heading warning-heading">🟡 Warning — Stock Running Low (≤ {WARNING} units)</h3>
          <div className="alert-cards">
            {warning.map((p) => (
              <div key={p.id} className="alert-card warning-card">
                <div className="ac-name">{p.name}</div>
                <div className="ac-meta">{p.category} · {p.supplier}</div>
                <div className="ac-stock">Stock: <strong>{p.stock}</strong></div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
