import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ExpenseDetailModal.css';
import { API_BASE_URL } from '../../config.js';

export default function ExpenseDetailModal({ expense, onClose }) {
  const [splits, setSplits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!expense || !expense.id) return;
    let mounted = true;
    const fetchSplits = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get(`${API_BASE_URL}/api/v1/expense/get/${expense.id}/splits`);
        if (!mounted) return;
        const list = Array.isArray(res.data) ? res.data : [];
        setSplits(list);
      } catch (e) {
        console.error('Failed to load expense splits', e);
        if (!mounted) return;
        setError('Failed to load details.');
      } finally {
        if (!mounted) return;
        setLoading(false);
      }
    };
    fetchSplits();
    return () => { mounted = false; };
  }, [expense]);

  const formatMoney = (num) => {
    if (num == null || Number.isNaN(Number(num))) return 'N/A';
    const n = Number(num);
    return `${n < 0 ? '-' : ''}$${Math.abs(n).toFixed(2)}`;
  };

  return (
    <div className="expense-detail-overlay" onMouseDown={onClose}>
      <div className="expense-detail-modal" onMouseDown={(e) => e.stopPropagation()}>
        <div className="detail-header">
          <div className="detail-title">
            <h3 className="expense-title">{expense?.name || 'Expense'}</h3>
            <div className="expense-meta">
              <span className="expense-amount">{expense?.amount ? `$${Number(expense.amount).toFixed(2)}` : ''}</span>
              <span className="expense-date">{expense?.createTime ? new Date(expense.createTime).toLocaleString() : ''}</span>
            </div>
          </div>

          <button className="detail-close" onClick={onClose} aria-label="Close">✖</button>
        </div>

        <div className="detail-body">
          <h4 className="detail-section-title">Splits</h4>

        {loading ? (
            <div className="detail-loading">Loading...</div>
          ) : error ? (
            <div className="detail-error">{error}</div>
          ) : splits.length === 0 ? (
            <div className="detail-empty">No split information available.</div>
          ) : (
            <div className="detail-list">
              {(() => {
                // show paid entries first (amount > 0), then borrowed (amount < 0)
                const sorted = [...splits].sort((a, b) => Number(b.amount) - Number(a.amount));
                return sorted.map((s, i) => {
                  const amt = Number(s.amount);
                  const positive = amt > 0;
                  const initials = s.username ? s.username.split(' ').map(p => p[0]).slice(0,2).join('').toUpperCase() : '';
                  const absAmount = Math.abs(amt);
                  const verb = positive ? 'paid' : 'borrowed';
                  const sentence = `${s.username} ${verb} $${absAmount.toFixed(2)}`;
                  return (
                    <div key={i} className={`detail-row ${positive ? 'paid' : 'borrowed'}`}>
                      <div className="username">
                        <div className="avatar">{initials}</div>
                        <div className="username-and-desc">
                          <div className="name-text">{s.username}</div>
                          <div className="desc-text">{sentence}</div>
                        </div>
                      </div>
                      <div className="amount">{`$${absAmount.toFixed(2)}`}</div>
                    </div>
                  );
                });
              })()}
            </div>
          )}
        </div>

        <div className="detail-actions">
          <button className="close-btn" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}
