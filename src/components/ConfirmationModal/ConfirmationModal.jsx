import React from 'react';
import './ConfirmationModal.css';

export default function ConfirmationModal({
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  isDestructive = false, // To apply red styling for destructive actions
  submitting = false,
}) {
  return (
    <div className="confirmation-modal-overlay" onMouseDown={onCancel}>
      <div className="confirmation-modal" onMouseDown={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{title}</h3>
          <button className="modal-close" onClick={onCancel} aria-label="Close" disabled={submitting}>✖</button>
        </div>

        <div className="cm-body">
          <p className="cm-message">{message}</p>

          <div className="cm-actions">
            <button className="cm-cancel" onClick={onCancel} disabled={submitting}>
              {cancelText}
            </button>
            <button
              className={`cm-confirm ${isDestructive ? 'destructive' : ''}`}
              onClick={onConfirm}
              disabled={submitting}
            >
              {submitting ? 'Processing...' : confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
