import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './PaymentModal.css';
import { API_BASE_URL } from '../../config.js';

export default function PaymentModal({ roomId, userId, onClose, onCreated }) {
  const [members, setMembers] = useState([]);
  const [loadingMembers, setLoadingMembers] = useState(true);
  const [selectedPayee, setSelectedPayee] = useState(null);
  const [amount, setAmount] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    const fetchMembers = async () => {
      setLoadingMembers(true);
      try {
        const res = await axios.get(`${API_BASE_URL}/api/v1/room/get/${roomId}/users`);
        if (!mounted) return;
        const list = Array.isArray(res.data) ? res.data : [];
        setMembers(list);
      } catch (e) {
        console.error('Failed to load members for payment', e);
      } finally {
        if (!mounted) return;
        setLoadingMembers(false);
      }
    };
    fetchMembers();
    return () => { mounted = false; };
  }, [roomId]);

  const isValid = selectedPayee && amount && Number(amount) > 0;

  const handleCreate = async () => {
    if (!isValid) return;
    setSubmitting(true);
    setError(null);
    const payload = {
      id: null,
      roomId: Number(roomId),
      paymentTime: new Date().toISOString(),
      payerId: Number(userId),
      payeeId: Number(selectedPayee),
      amount: Number(amount),
    };

    try {
      await axios.post(`${API_BASE_URL}/api/v1/payment/create`, payload);
      onCreated && onCreated();
    } catch (e) {
      console.error('create payment error', e);
      setError('Failed to create payment. Try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="payment-modal-overlay" onMouseDown={onClose}>
      <div className="payment-modal" onMouseDown={(e) => e.stopPropagation()}>
      <div className="modal-header">
          <h3>Make Payment</h3>
          <button className="modal-close" onClick={onClose} aria-label="Close">✖</button>
        </div>

        <div className="pm-body">
          <label className="pm-field">
            <span className="pm-label">Payee</span>
            {loadingMembers ? (
              <div className="pm-loading">Loading members...</div>
            ) : (
<select value={selectedPayee || ''} onChange={(e) => setSelectedPayee(e.target.value)}>
                <option value="">Select a member</option>
                {members
                  .filter((m) => Number(m.id) !== Number(userId))
                  .map((m) => (
                    <option key={m.id} value={m.id}>{m.name}</option>
                  ))}
              </select>
            )}
          </label>

          <label className="pm-field">
            <span className="pm-label">Amount</span>
            <input
              type="text"
              value={amount}
              onChange={(e) => setAmount(e.target.value.replace(/[^\d.]/g, ''))}
              placeholder="100.00"
            />
          </label>

          {error && <div className="pm-error">{error}</div>}

          <div className="pm-actions">
            <button className="pm-cancel" onClick={onClose} disabled={submitting}>Cancel</button>
            <button className="pm-create" onClick={handleCreate} disabled={!isValid || submitting}>
              {submitting ? 'Creating...' : 'Create'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
