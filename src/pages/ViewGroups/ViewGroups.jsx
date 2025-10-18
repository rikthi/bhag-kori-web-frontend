import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { UserContext } from '../../context/UserContext';
import Logo from '../../components/Logo/Logo';
import Navigation from '../../components/Navigation/Navigation';
import Aurora from '../Aurora';
import '../Auth.css'; // For shared styles
import './ViewGroups.css';
import {API_BASE_URL} from "../../config.js";

const ViewGroups = () => {
    const [groups, setGroups] = useState([]);
    const [filteredGroups, setFilteredGroups] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user } = useContext(UserContext);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchGroups = async () => {
            if (!user || !user.id) {
                setError('User not logged in.');
                setLoading(false);
                return;
            }

            try {
                const groupsResponse = await axios.get(`${API_BASE_URL}/api/v1/room/get/user/${user.id}`);
                const fetchedGroups = groupsResponse.data;

                const groupsWithTotals = await Promise.all(
                    fetchedGroups.map(async (group) => {
                        try {
                            const totalResponse = await axios.get(`${API_BASE_URL}/api/v1/room/get/${group.id}/total/user/${user.id}`);
                            const totalAmount = totalResponse.data;
                            return { ...group, totalAmount };
                        } catch (totalError) {
                            console.error(`Error fetching total for group ${group.id}:`, totalError);
                            return { ...group, totalAmount: null }; // Handle error for individual total
                        }
                    })
                );
                setGroups(groupsWithTotals);
                setFilteredGroups(groupsWithTotals);
            } catch (err) {
                console.error('Error fetching groups:', err);
                setError('Failed to fetch groups. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchGroups();
    }, [user]);

    useEffect(() => {
        const lowercasedSearchTerm = searchTerm.toLowerCase();
        const filtered = groups.filter(group =>
            group.name.toLowerCase().includes(lowercasedSearchTerm) ||
            group.description.toLowerCase().includes(lowercasedSearchTerm)
        );
        setFilteredGroups(filtered);
    }, [searchTerm, groups]);

    const handleGroupClick = (groupId) => {
        navigate(`/group/${groupId}`);
    };

    if (loading) {
        return (
            <div className="page-wrapper">
                <Aurora
                    colorStops={["#B19EEF", "#8A6EDB", "#4A2B86"]}
                    blend={0.2}
                    amplitude={0.5}
                    speed={0.3}
                />
                <Logo />
                <Navigation />
                <div className="view-groups-container">
                    <h2 className="page-title">Loading Groups...</h2>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="page-wrapper">
                <Aurora
                    colorStops={["#B19EEF", "#8A6EDB", "#4A2B86"]}
                    blend={0.2}
                    amplitude={0.5}
                    speed={0.3}
                />
                <Logo />
                <Navigation />
                <div className="view-groups-container">
                    <h2 className="page-title error-message">Error: {error}</h2>
                </div>
            </div>
        );
    }

    return (
        <div className="page-wrapper">
            <Aurora
                colorStops={["#B19EEF", "#8A6EDB", "#4A2B86"]}
                blend={0.2}
                amplitude={0.5}
                speed={0.3}
            />
            <Logo />
            <Navigation />
            <div className="view-groups-container">
                <h2 className="page-title">Your Groups</h2>
                <div className="search-bar-wrapper">
                    <input
                        type="text"
                        placeholder="Search groups by name or description..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                    />
                </div>

                {filteredGroups.length === 0 ? (
                    <p className="no-groups-message">No groups found.</p>
                ) : (
                    <div className="scrollable-groups-container"> {/* New scrollable container */}
                        <div className="groups-grid">
                            {filteredGroups.map((group) => (
                                <div key={group.id} className="group-card" onClick={() => handleGroupClick(group.id)}>
                                    <h3>{group.name}</h3>
                                    <p className="group-description">{group.description}</p>
                                    {group.totalAmount !== null && (
                                        <p className={`group-total ${group.totalAmount < 0 ? 'owe' : 'get'}`}>
                                            {group.totalAmount < 0 ? `You owe: $${Math.abs(group.totalAmount).toFixed(2)}` : `You will get: $${group.totalAmount.toFixed(2)}`}
                                        </p>
                                    )}
                                    {group.totalAmount === null && (
                                        <p className="group-total-unavailable">Total amount unavailable.</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ViewGroups;
