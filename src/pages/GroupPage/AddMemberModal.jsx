import React, { useState } from 'react';
import axios from 'axios';
import './AddMemberModal.css';
import { API_BASE_URL } from '../../config.js';

export default function AddMemberModal({ roomId, onClose, onMemberAdded }) {
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const isValid = email.length > 0;

  const handleAddMember = async () => {
    if (!isValid) return;
    setSubmitting(true);
    setError(null);

    try {
      const res = await axios.post(`${API_BASE_URL}/api/v1/room/add/${roomId}/member/email/${email}`);
      if (res.data && res.data.id) { // Check if the response contains group data, indicating success
        onMemberAdded && onMemberAdded(res.data);
        onClose(); // Close on success
      } else {
        setError(`User with email ${email} couldn't be added.`);
      }
    } catch (e) {
      console.error('add member error', e);
      setError(`User with email ${email} couldn't be added. Please check the email and try again.`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="add-member-modal-overlay" onMouseDown={onClose}>
      <div className="add-member-modal" onMouseDown={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Add Member</h3>
          <button className="modal-close" onClick={onClose} aria-label="Close">✖</button>
        </div>

        <div className="amm-body">
          <label className="amm-field">
            <span className="amm-label">Member Email</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="member@example.com"
            />
          </label>

          {error && <div className="amm-error">{error}</div>}

          <div className="amm-actions">
            <button className="amm-cancel" onClick={onClose} disabled={submitting}>Cancel</button>
            <button className="amm-create" onClick={handleAddMember} disabled={!isValid || submitting}>
              {submitting ? 'Adding...' : 'Add Member'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
