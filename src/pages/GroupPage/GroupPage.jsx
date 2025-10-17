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
import ExpenseDetailModal from './ExpenseDetailModal';
import ExpenseGraph from './ExpenseGraph';
import PaymentModal from './PaymentModal';
import AddMemberModal from './AddMemberModal'; // Import the new modal
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
  const [detailExpense, setDetailExpense] = useState(null);
  const [members, setMembers] = useState([]);
  const [payments, setPayments] = useState([]);
  const [activities, setActivities] = useState([]);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false); // State for AddMemberModal

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

        // Members (used for payments display & mapping)
        let membersList = [];
        try {
          const membersRes = await axios.get(`${API_BASE_URL}/api/v1/room/get/${roomId}/users`);
          membersList = Array.isArray(membersRes.data) ? membersRes.data : [];
          setMembers(membersList);
        } catch (e) {
          console.error('members fetch error', e);
          membersList = [];
          setMembers([]);
        }

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

        // Payments
        let paymentsList = [];
        try {
          const paymentsRes = await axios.get(`${API_BASE_URL}/api/v1/payment/get/room/${roomId}`);
          paymentsList = Array.isArray(paymentsRes.data) ? paymentsRes.data : [];
        } catch (e) {
          console.error('payments fetch error', e);
          paymentsList = [];
        }

        // save payments to state so other UI can use them
        setPayments(paymentsList);

        // Build unified activity list: expenses (type EXPENSE) and payments (type PAYMENT)
        const mappedExpenses = expensesWithShares.map((exp) => ({
          id: `expense-${exp.id}`,
          type: 'EXPENSE',
          name: exp.name,
          amount: Number(exp.amount),
          time: exp.createTime,
          payerId: exp.payerId ?? exp.payerId,
          raw: exp,
        }));

        const mappedPayments = paymentsList.map((p) => ({
          id: `payment-${p.id}`,
          type: 'PAYMENT',
          payerId: p.payerId,
          payeeId: p.payeeId,
          amount: Number(p.amount),
          time: p.paymentTime,
          raw: p,
        }));

        const combined = [...mappedExpenses, ...mappedPayments].sort(
          (a, b) => new Date(b.time) - new Date(a.time)
        );

        setActivities(combined);

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
      <Aurora colorStops={['#3A29FF', '#FF94B4', '#FF3232']} blend={0.2} amplitude={0.5} speed={0.3} />
      <Logo />
      <Navigation />
      <div className="add-member-button-container-global"> {/* New container for the add member button */}
        <button
          type="button"
          className="add-member-button-global"
          onClick={() => setShowAddMemberModal(true)}
          aria-label="Add member"
        >
          <span className="plus">＋</span>
          <span className="label">Add Member</span>
        </button>
      </div>

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
                  <div style={{ display: 'flex', gap: '10px' }}> {/* Container for buttons */}
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
              </div>

              <div className="expenses-list-container">
                <h3>Activity</h3>
                {activities.length === 0 ? (
                  <p className="no-expenses-message">No activity recorded yet.</p>
                ) : (
                  <div className="expenses-grid">
                    {activities.map((act) => {
                      if (act.type === 'EXPENSE') {
                        return (
                          <div
                            key={act.id}
                            className="expense-card"
                            onClick={() => setDetailExpense(act.raw)}
                            style={{ cursor: 'pointer' }}
                          >
                            <p className="expense-name">Expense — {act.name}</p>
                            <p className="expense-date">{formatDateTime(act.time)}</p>
                            <p className={`expense-share ${act.raw.userShare < 0 ? 'borrowed' : 'paid'}`}>
                              {expenseShareText(act.raw.userShare)}
                            </p>
                          </div>
                        );
                      }

                      // PAYMENT
                      const payerName = members.find((m) => m.id === act.payerId)?.name || `User ${act.payerId}`;
                      const payeeName = members.find((m) => m.id === act.payeeId)?.name || `User ${act.payeeId}`;
                      return (
                        <div key={act.id} className="expense-card" style={{ cursor: 'default' }}>
                          <p className="expense-name">Payment</p>
                          <p className="expense-date">{formatDateTime(act.time)}</p>
                          <p className="expense-share paid">
                            {`${payerName} paid ${payeeName}: $${act.amount.toFixed(2)}`}
                          </p>
                        </div>
                      );
                    })}
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

                <button
                  type="button"
                  className="add-expense-button make-payment-button"
                  onClick={() => setShowPaymentModal(true)}
                  aria-label="Make payment"
                  style={{ marginTop: 12 }}
                >
                  <span className="plus">＋</span>
                  <span className="label">Make Payment</span>
                </button>
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
        <div className="graph-panel">
          <ExpenseGraph expenses={expenses} userId={user?.id} title="Expense Graph" sub="Per-expense shares (paid vs borrowed)" />
          <ExpenseGraph
            expenses={payments.map((p) => {
              let share = 0;
              if (Number(user?.id) === Number(p.payerId)) {
                share = -Number(p.amount); // User paid, so it's an outflow (red)
              } else if (Number(user?.id) === Number(p.payeeId)) {
                share = Number(p.amount); // User received, so it's an inflow (green)
              }
              return { id: `p-${p.id}`, createTime: p.paymentTime, userShare: share };
            })}
            userId={user?.id}
            title="Payment Graph"
            sub="Payments over time (You paid: red, You received: green)"
          />
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

      {showPaymentModal && (
        <PaymentModal
          roomId={roomId}
          userId={user?.id}
          onClose={() => setShowPaymentModal(false)}
          onCreated={() => {
            setShowPaymentModal(false);
            setReloadKey((k) => k + 1);
          }}
        />
      )}

      {detailExpense && (
        <ExpenseDetailModal
          expense={detailExpense}
          onClose={() => setDetailExpense(null)}
        />
      )}

      {showAddMemberModal && (
        <AddMemberModal
          roomId={roomId}
          onClose={() => setShowAddMemberModal(false)}
          onMemberAdded={(updatedGroup) => {
            setShowAddMemberModal(false);
            setReloadKey((k) => k + 1); // Reload data to show new member
            // Optionally update groupDetails if the response contains the latest group info
            if (updatedGroup) {
              setGroupDetails(updatedGroup);
            }
          }}
        />
      )}
    </div>
  );
}
