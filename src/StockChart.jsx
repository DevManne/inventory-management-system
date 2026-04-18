import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer, Cell
} from 'recharts';
import { getStockLevel } from './reducer';

const LEVEL_COLORS = { ok: '#22c55e', warning: '#f59e0b', critical: '#ef4444' };

export default function StockChart({ all }) {
  // Group by category: total stock per category
  const categoryMap = {};
  all.forEach((p) => {
    if (!categoryMap[p.category]) {
      categoryMap[p.category] = { category: p.category, totalStock: 0, items: 0 };
    }
    categoryMap[p.category].totalStock += p.stock;
    categoryMap[p.category].items += 1;
  });

  const categoryData = Object.values(categoryMap);

  // Per-product bar data (top 10 by name length for readability)
  const productData = [...all]
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((p) => ({
      name: p.name.length > 14 ? p.name.slice(0, 14) + '…' : p.name,
      stock: p.stock,
      level: getStockLevel(p.stock),
    }));

  return (
    <div className="charts-section">
      <h2 className="dash-title">📈 Stock Visualisation</h2>

      <div className="charts-grid">
        {/* Category totals */}
        <div className="chart-card">
          <h3 className="chart-subtitle">Total Stock by Category</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={categoryData} margin={{ top: 10, right: 10, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="category" tick={{ fill: '#94a3b8', fontSize: 12 }} />
              <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} />
              <Tooltip
                contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8 }}
                labelStyle={{ color: '#f1f5f9' }}
              />
              <Bar dataKey="totalStock" name="Total Stock" radius={[4, 4, 0, 0]} fill="#6366f1" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Per-product stock levels */}
        <div className="chart-card">
          <h3 className="chart-subtitle">Stock Level per Product</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={productData} margin={{ top: 10, right: 10, left: 0, bottom: 40 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis
                dataKey="name"
                tick={{ fill: '#94a3b8', fontSize: 10 }}
                angle={-40}
                textAnchor="end"
                interval={0}
              />
              <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} />
              <Tooltip
                contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8 }}
                labelStyle={{ color: '#f1f5f9' }}
              />
              <Bar dataKey="stock" name="Stock Qty" radius={[4, 4, 0, 0]}>
                {productData.map((entry, i) => (
                  <Cell key={i} fill={LEVEL_COLORS[entry.level]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div className="chart-legend">
            <span style={{ color: '#22c55e' }}>■ OK</span>
            <span style={{ color: '#f59e0b' }}>■ Warning</span>
            <span style={{ color: '#ef4444' }}>■ Critical</span>
          </div>
        </div>
      </div>
    </div>
  );
}
