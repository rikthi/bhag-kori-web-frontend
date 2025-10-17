import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ExpenseModal.css';
import { API_BASE_URL } from '../../config.js';

export default function ExpenseModal({ roomId, userId, onClose, onCreated }) {
  const [members, setMembers] = useState([]);
  const [loadingMembers, setLoadingMembers] = useState(true);

  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [splitType, setSplitType] = useState('EQUAL'); // EQUAL, PERCENTAGE, EXACT

  const [selected, setSelected] = useState({}); // { id: boolean }
  const [values, setValues] = useState({}); // { id: number/string } for percent or exact

  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    const fetchMembers = async () => {
      setLoadingMembers(true);
      try {
        const res = await axios.get(`${API_BASE_URL}/api/v1/room/get/${roomId}/users`);
        const list = Array.isArray(res.data) ? res.data : [];
        setMembers(list);
        const initSel = {};
        const initVals = {};
        list.forEach((m) => {
          initSel[m.id] = false;
          initVals[m.id] = '';
        });
        setSelected(initSel);
        setValues(initVals);
      } catch (e) {
        console.error('Failed to load members', e);
      } finally {
        setLoadingMembers(false);
      }
    };
    fetchMembers();
  }, [roomId]);

  const toggleMember = (id) => {
    setSelected((s) => {
      const next = { ...s, [id]: !s[id] };
      // clear value if unselected
      if (!next[id]) {
        setValues((v) => ({ ...v, [id]: '' }));
      }
      return next;
    });
    setError(null);
  };

  const changeValue = (id, v) => {
    // only allow numeric input (and dot)
    const sanitized = v.replace(/[^\d.]/g, '');
    setValues((prev) => ({ ...prev, [id]: sanitized }));
    setError(null);
  };

  // realtime validation: runs whenever relevant inputs change
  useEffect(() => {
    setError(null);
    const amt = parseFloat(amount);
    if (!name.trim()) {
      setIsValid(false);
      setError('Expense name is required.');
      return;
    }
    if (!amt || amt <= 0) {
      setIsValid(false);
      setError('Amount should be a number greater than 0.');
      return;
    }
    const selectedIds = members.filter((m) => selected[m.id]).map((m) => m.id);
    if (selectedIds.length === 0) {
      setIsValid(false);
      setError('Select at least one member.');
      return;
    }

    if (splitType === 'PERCENTAGE') {
      let total = 0;
      for (const id of selectedIds) {
        const v = parseFloat(values[id] || '0');
        if (isNaN(v)) {
          setIsValid(false);
          setError('All percentage values must be numbers.');
          return;
        }
        total += v;
      }
      // require exact 100 (allow tiny float epsilon)
      if (Math.abs(total - 100) > 0.0001) {
        setIsValid(false);
        setError('Total percentage needs to be 100.');
        return;
      }
    } else if (splitType === 'EXACT') {
      let total = 0;
      for (const id of selectedIds) {
        const v = parseFloat(values[id] || '0');
        if (isNaN(v)) {
          setIsValid(false);
          setError('All exact values must be numbers.');
          return;
        }
        total += v;
      }
      if (Math.abs(total - amt) > 0.0001) {
        setIsValid(false);
        setError('Exact amounts must add up to total amount.');
        return;
      }
    }
    // all validations passed
    setError(null);
    setIsValid(true);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name, amount, splitType, selected, values, members]);

  const handleCreate = async () => {
    if (!isValid) return;
    setSubmitting(true);
    setError(null);

    const payload = {
      id: null,
      name: name.trim(),
      createTime: new Date().toISOString(),
      payerId: userId,
      roomId: Number(roomId),
      amount: parseFloat(amount),
      splitType: splitType,
      userSplits: {}
    };

    const selectedIds = members.filter((m) => selected[m.id]).map((m) => m.id);

    if (splitType === 'EQUAL') {
      selectedIds.forEach((id) => {
        payload.userSplits[id] = 0;
      });
    } else if (splitType === 'PERCENTAGE') {
      selectedIds.forEach((id) => {
        payload.userSplits[id] = parseFloat(values[id] || 0);
      });
    } else if (splitType === 'EXACT') {
      selectedIds.forEach((id) => {
        payload.userSplits[id] = parseFloat(values[id] || 0);
      });
    }

    try {
      await axios.post(`${API_BASE_URL}/api/v1/expense/create`, payload);
      onCreated && onCreated();
    } catch (e) {
      console.error('create expense error', e);
      setError('Failed to create expense. Try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="expense-modal-overlay" onMouseDown={onClose}>
      <div className="expense-modal" onMouseDown={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Create Expense</h3>
          <button className="modal-close" onClick={onClose} aria-label="Close">✖</button>
        </div>

        <div className="modal-body">
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <label className="field">
              <span className="field-label">Name</span>
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Dinner at Italian Restaurant" />
            </label>

            <label className="field">
              <span className="field-label">Amount</span>
              <input value={amount} onChange={(e) => setAmount(e.target.value.replace(/[^\d.]/g, ''))} placeholder="1000.00" />
            </label>

            <label className="field">
              <span className="field-label">Split Type</span>
              <select value={splitType} onChange={(e) => setSplitType(e.target.value)}>
                <option value="EQUAL">Equal</option>
                <option value="PERCENTAGE">Percentage</option>
                <option value="EXACT">Exact</option>
              </select>
            </label>
          </div>

          <div className="members-section">
            <div className="members-header">Members</div>
            {loadingMembers ? (
              <div className="members-loading">Loading members...</div>
            ) : (
              <div className="members-list">
                {members.map((m) => (
                  <div className="member-row" key={m.id}>
                    <label className="member-checkbox">
                      <input type="checkbox" checked={!!selected[m.id]} onChange={() => toggleMember(m.id)} />
                      <span className="member-name">{m.name}</span>
                    </label>

                    {(splitType === 'PERCENTAGE' || splitType === 'EXACT') && (
                      <input
                        className="member-value"
                        type="text"
                        value={values[m.id] || ''}
                        onChange={(e) => changeValue(m.id, e.target.value)}
                        disabled={!selected[m.id]}
                        placeholder={splitType === 'PERCENTAGE' ? '%' : 'amount'}
                      />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {error && <div className="error-message">{error}</div>}

          <div className="modal-actions">
            <button className="cancel-btn" onClick={onClose} disabled={submitting}>Cancel</button>
            <button className="create-btn" onClick={handleCreate} disabled={!isValid || submitting}>
              {submitting ? 'Creating...' : 'Create'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
