import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { UserContext } from '../../context/UserContext';
import Logo from '../../components/Logo/Logo';
import Navigation from '../../components/Navigation/Navigation';
import Aurora from '../Aurora';
import '../Auth.css'; // For shared styles
import './GroupPage.css';
import {API_BASE_URL} from "../../config.js";

const GroupPage = () => {
    const { roomId } = useParams();
    const { user } = useContext(UserContext);
    const [groupDetails, setGroupDetails] = useState(null);
    const [expenses, setExpenses] = useState([]);
    const [roomTotal, setRoomTotal] = useState(null);
    const [shares, setShares] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            if (!user || !user.id || !roomId) {
                setError('User not logged in or room ID is missing.');
                setLoading(false);
                return;
            }

            try {
                // Fetch group details
                const groupDetailsResponse = await axios.get(`${API_BASE_URL}/api/v1/room/get/${roomId}`);
                setGroupDetails(groupDetailsResponse.data);

                // Fetch expenses
                const expensesResponse = await axios.get(`${API_BASE_URL}/api/v1/expense/get/room/${roomId}`);
                const fetchedExpenses = expensesResponse.data;

                // Fetch individual share for each expense
                const expensesWithShares = await Promise.all(
                    fetchedExpenses.map(async (expense) => {
                        try {
                            const shareResponse = await axios.get(`${API_BASE_URL}/api/v1/expense/get/${expense.id}/user/${user.id}/share`);
                            return { ...expense, userShare: shareResponse.data };
                        } catch (shareError) {
                            console.error(`Error fetching share for expense ${expense.id}:`, shareError);
                            return { ...expense, userShare: null };
                        }
                    })
                );
                setExpenses(expensesWithShares);

                // Fetch room total for the user
                const totalResponse = await axios.get(`${API_BASE_URL}/api/v1/room/get/${roomId}/total/user/${user.id}`);
                setRoomTotal(totalResponse.data);

                // Fetch shares summary
                const sharesResponse = await axios.get(`${API_BASE_URL}/api/v1/room/get/${roomId}/shares/${user.id}`);
                setShares(sharesResponse.data);

            } catch (err) {
                console.error('Error fetching group data:', err);
                setError('Failed to load group data. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [roomId, user]);

    if (loading) {
        return (
            <div className="page-wrapper">
                <Aurora
                    colorStops={["#3A29FF", "#FF94B4", "#FF3232"]}
                    blend={0.2}
                    amplitude={0.5}
                    speed={0.3}
                />
                <Logo />
                <Navigation />
                <div className="group-page-container">
                    <h2 className="page-title">Loading Group...</h2>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="page-wrapper">
                <Aurora
                    colorStops={["#3A29FF", "#FF94B4", "#FF3232"]}
                    blend={0.2}
                    amplitude={0.5}
                    speed={0.3}
                />
                <Logo />
                <Navigation />
                <div className="group-page-container">
                    <h2 className="page-title error-message">Error: {error}</h2>
                </div>
            </div>
        );
    }

    const formatDateTime = (isoString) => {
        if (!isoString) return 'N/A';
        const date = new Date(isoString);
        return date.toLocaleString(); // Formats to "M/D/YYYY, H:MM:SS AM/PM"
    };

    return (
        <div className="page-wrapper">
            <Aurora
                colorStops={["#3A29FF", "#FF94B4", "#FF3232"]}
                blend={0.2}
                amplitude={0.5}
                speed={0.3}
            />
            <Logo />
            <Navigation />
            <div className="group-page-content-wrapper">
                <div className="group-details-section">
                    <div className="group-header">
                        <h2 className="group-name">{groupDetails?.name}</h2>
                        <span className="create-date">Created: {formatDateTime(groupDetails?.createTime)}</span>
                    </div>
                    <p className="group-description">{groupDetails?.description}</p>

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
                                        {expense.userShare !== null && (
                                            <p className={`expense-share ${expense.userShare < 0 ? 'borrowed' : 'paid'}`}>
                                                {expense.userShare < 0 ? `You borrowed: $${Math.abs(expense.userShare).toFixed(2)}` : `You paid: $${expense.userShare.toFixed(2)}`}
                                            </p>
                                        )}
                                        {expense.userShare === null && (
                                            <p className="expense-share-unavailable">Share unavailable.</p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div className="summary-section">
                    <div className="summary-total">
                        <h3>Overall Balance</h3>
                        {roomTotal !== null ? (
                            <p className={`total-amount ${roomTotal < 0 ? 'owe' : 'get'}`}>
                                {roomTotal < 0 ? `You owe: $${Math.abs(roomTotal).toFixed(2)}` : `You will get: $${roomTotal.toFixed(2)}`}
                            </p>
                        ) : (
                            <p className="total-amount-unavailable">Balance unavailable.</p>
                        )}
                    </div>

                    <div className="shares-list-container">
                        <h3>Individual Shares</h3>
                        {shares.length === 0 ? (
                            <p className="no-shares-message">No individual shares to display.</p>
                        ) : (
                            <ul className="shares-list">
                                {shares.map((share, index) => (
                                    <li key={index} className={`share-item ${share.amount < 0 ? 'owe' : 'get'}`}>
                                        {share.amount < 0 ?
                                            `You owe ${share.user.name}: $${Math.abs(share.amount).toFixed(2)}` :
                                            `${share.user.name} owes you: $${share.amount.toFixed(2)}`
                                        }
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GroupPage;
