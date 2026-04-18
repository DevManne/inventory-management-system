import React, { useState } from 'react';
import { getStockLevel } from './reducer';

const PAGE_SIZE = 7;

export default function InventoryTable({ items, dispatch }) {
  const [page, setPage] = useState(1);
  const [restockMap, setRestockMap] = useState({});

  const totalPages = Math.max(1, Math.ceil(items.length / PAGE_SIZE));
  const visible = items.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const sell = (id) => dispatch({ type: 'SELL_ITEM', payload: id });

  const restock = (id) => {
    const qty = parseInt(restockMap[id] || 10, 10);
    if (qty > 0) dispatch({ type: 'RESTOCK', payload: { id, qty } });
    setRestockMap((m) => ({ ...m, [id]: '' }));
  };

  const levelLabel = { ok: '🟢 OK', warning: '🟡 Low', critical: '🔴 Critical' };

  return (
    <div className="table-wrapper">
      {items.length === 0 ? (
        <div className="empty-state">No products match the current filters.</div>
      ) : (
        <>
          <table className="inv-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Product</th>
                <th>Category</th>
                <th>Stock</th>
                <th>Price (₹)</th>
                <th>Supplier</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((p) => {
                const level = getStockLevel(p.stock);
                return (
                  <tr key={p.id} className={`row-${level}`}>
                    <td className="td-id">{p.id}</td>
                    <td className="td-name">{p.name}</td>
                    <td><span className="chip">{p.category}</span></td>
                    <td className={`td-stock stock-${level}`}>{p.stock}</td>
                    <td>₹{p.price.toLocaleString()}</td>
                    <td className="td-supplier">{p.supplier}</td>
                    <td><span className={`badge badge-${level}`}>{levelLabel[level]}</span></td>
                    <td className="td-actions">
                      <button
                        className="btn btn-sell"
                        onClick={() => sell(p.id)}
                        disabled={p.stock === 0}
                      >
                        Sell
                      </button>
                      <input
                        className="restock-input"
                        type="number"
                        min="1"
                        placeholder="Qty"
                        value={restockMap[p.id] || ''}
                        onChange={(e) =>
                          setRestockMap((m) => ({ ...m, [p.id]: e.target.value }))
                        }
                      />
                      <button className="btn btn-restock" onClick={() => restock(p.id)}>
                        +Stock
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="pagination">
            <button
              className="page-btn"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              ‹ Prev
            </button>
            <span className="page-info">Page {page} of {totalPages}</span>
            <button
              className="page-btn"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              Next ›
            </button>
          </div>
        </>
      )}
    </div>
  );
}
