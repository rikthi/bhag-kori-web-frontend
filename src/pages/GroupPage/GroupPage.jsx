import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { UserContext } from '../../context/UserContext';
import Logo from '../../components/Logo/Logo';
import Navigation from '../../components/Navigation/Navigation';
import Aurora from '../Aurora';
import '../Auth.css';
import './GroupPage.css';
import ExpenseModal from './ExpenseModal';
import { API_BASE_URL } from '../../config.js';

export default function GroupPage() {
  const { roomId } = useParams();
  const { user } = useContext(UserContext);

  const [groupDetails, setGroupDetails] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [roomTotal, setRoomTotal] = useState(null);
  const [shares, setShares] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (!roomId) return;
    const fetchData = async () => {
      if (!user || !user.id) {
        setError('User not logged in.');
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        // Group details
        const groupRes = await axios.get(`${API_BASE_URL}/api/v1/room/get/${roomId}`);
        setGroupDetails(groupRes.data);

        // Expenses
        const expensesRes = await axios.get(`${API_BASE_URL}/api/v1/expense/get/room/${roomId}`);
        const fetchedExpenses = Array.isArray(expensesRes.data) ? expensesRes.data : [];

        // For each expense fetch user's share
        const expensesWithShares = await Promise.all(
          fetchedExpenses.map(async (expense) => {
            try {
              const shareRes = await axios.get(
                `${API_BASE_URL}/api/v1/expense/get/${expense.id}/user/${user.id}/share`
              );
              return { ...expense, userShare: shareRes.data };
            } catch (e) {
              // If per-expense share fails, set null but continue
              console.error('share fetch error', expense.id, e);
              return { ...expense, userShare: null };
            }
          })
        );
        // sort by createTime descending (newest first)
        expensesWithShares.sort((a, b) => new Date(b.createTime) - new Date(a.createTime));
        setExpenses(expensesWithShares);

        // Room total for user
        try {
          const totalRes = await axios.get(
            `${API_BASE_URL}/api/v1/room/get/${roomId}/total/user/${user.id}`
          );
          setRoomTotal(totalRes.data);
        } catch (e) {
          console.error('room total fetch error', e);
          setRoomTotal(null);
        }

        // Shares summary
        try {
          const sharesRes = await axios.get(
            `${API_BASE_URL}/api/v1/room/get/${roomId}/shares/${user.id}`
          );
          setShares(Array.isArray(sharesRes.data) ? sharesRes.data : []);
        } catch (e) {
          console.error('shares summary fetch error', e);
          setShares([]);
        }
      } catch (err) {
        console.error('Error fetching group data:', err);
        setError('Failed to load group data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [roomId, user, reloadKey]);

  const formatDateTime = (isoString) => {
    if (!isoString) return 'N/A';
    const d = new Date(isoString);
    return d.toLocaleString();
  };

  // Helper for expense share text
  const expenseShareText = (share) => {
    if (share == null) return 'Share unavailable';
    const amount = Number(share);
    if (Number.isNaN(amount)) return 'Share unavailable';
    if (amount < 0) return `You borrowed: $${Math.abs(amount).toFixed(2)}`;
    return `You paid: $${amount.toFixed(2)}`;
  };

  return (
    <div className="page-wrapper">
      <Aurora colorStops={['#3A29FF', '#FF94B4', '#FF3232']} blend={0.2} amplitude={0.5} speed={0.3} />
      <Logo />
      <Navigation />

      <div className="group-page-content-wrapper">
        <div className="group-details-section">
          {loading ? (
            <h2 className="page-title">Loading...</h2>
          ) : error ? (
            <h2 className="page-title error-message">{error}</h2>
          ) : (
            <>

              <div className="group-header">
                <div className="group-header-left">
                  <h2 className="group-name">{groupDetails?.name || 'Group'}</h2>
                  {groupDetails?.description ? (
                    <p className="group-description">{groupDetails.description}</p>
                  ) : null}
                </div>

                <div className="group-header-right" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
                  <span className="create-date">Created: {formatDateTime(groupDetails?.createTime)}</span>
                  <button
                    type="button"
                    className="add-expense-button"
                    onClick={() => setShowModal(true)}
                    aria-label="Add expense"
                  >
                    <span className="plus">＋</span>
                    <span className="label">Add Expense</span>
                  </button>
                </div>
              </div>

              <div className="expenses-list-container">
                <h3>Expenses</h3>
                {expenses.length === 0 ? (
                  <p className="no-expenses-message">No expenses recorded yet.</p>
                ) : (
                  <div className="expenses-grid">
                    {expenses.map((expense) => (
                      <div key={expense.id} className="expense-card">
                        <p className="expense-name">{expense.name}</p>
                        <p className="expense-date">{formatDateTime(expense.createTime)}</p>
                        <p className={`expense-share ${expense.userShare < 0 ? 'borrowed' : 'paid'}`}>
                          {expenseShareText(expense.userShare)}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        <div className="summary-section">
          <div className="summary-total">
            <h3>Overall Balance</h3>
            {roomTotal === null ? (
              <p className="total-amount-unavailable">Balance unavailable</p>
            ) : Number(roomTotal) === 0 ? (
              <p className="total-amount neutral">You have no balance</p>
            ) : (
              <p className={`total-amount ${roomTotal < 0 ? 'owe' : 'get'}`}>
                {roomTotal < 0 ? `You owe: $${Math.abs(roomTotal).toFixed(2)}` : `You will get: $${Number(roomTotal).toFixed(2)}`}
              </p>
            )}
          </div>

          <div className="shares-list-container">
            <h3>Individual Shares</h3>

            {Number(roomTotal) === 0 ? (
              <p className="no-shares-message">No current shares.</p>
            ) : shares.length === 0 ? (
              <p className="no-shares-message">No individual shares to display.</p>
            ) : (
              <ul className="shares-list">
                {shares.map((share, i) => (
                  <li key={i} className={`share-item ${share.amount < 0 ? 'owe' : 'get'}`}>
                    {share.amount < 0
                      ? `You owe ${share.user.name}: $${Math.abs(share.amount).toFixed(2)}`
                      : `${share.user.name} owes you: $${share.amount.toFixed(2)}`}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      {showModal && (
        <ExpenseModal
          roomId={roomId}
          userId={user?.id}
          onClose={() => setShowModal(false)}
          onCreated={() => {
            setShowModal(false);
            setReloadKey((k) => k + 1);
          }}
        />
      )}
    </div>
  );
}
