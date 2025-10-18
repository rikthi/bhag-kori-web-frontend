import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { UserContext } from '../../context/UserContext';
import Logo from '../../components/Logo/Logo';
import Navigation from '../../components/Navigation/Navigation';
import Aurora from '../Aurora';
import '../Auth.css'; // For shared styles like input-group, button, error-message
import './CreateGroup.css';
import {API_BASE_URL} from "../../config.js";

const CreateGroup = () => {
    const [groupName, setGroupName] = useState('');
    const [description, setDescription] = useState('');
    const [memberInput, setMemberInput] = useState('');
    const [members, setMembers] = useState([]);
    const [successMessage, setSuccessMessage] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);
    const { user } = useContext(UserContext);

    const handleAddMember = () => {
        if (memberInput.trim() && !members.includes(memberInput.trim())) {
            setMembers([...members, memberInput.trim()]);
            setMemberInput('');
        }
    };

    const handleRemoveMember = (memberToRemove) => {
        setMembers(members.filter(member => member !== memberToRemove));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSuccessMessage(null);
        setErrorMessage(null);

        if (!user || !user.id) {
            setErrorMessage('User not logged in. Please log in to create a group.');
            return;
        }

        if (!groupName.trim()) {
            setErrorMessage('Group name cannot be empty.');
            return;
        }

        const newGroup = {
            roomDto: {
                id: null,
                name: groupName,
                description: description,
                createTime: new Date().toISOString(),
                creatorId: user.id,
                memberIds: [] // Assuming memberIds are handled by emails
            },
            emails: members
        };

        try {
            const response = await axios.post(`${API_BASE_URL}/api/v1/room/create/new`, newGroup);
            if (response.status === 200) {
                setSuccessMessage('Group created successfully!');
                setGroupName('');
                setDescription('');
                setMembers([]);
                setMemberInput('');
                setTimeout(() => setSuccessMessage(null), 3000); // Clear message after 3 seconds
            } else {
                setErrorMessage('Failed to create group. Please try again.');
            }
        } catch (error) {
            console.error('Error creating group:', error);
            setErrorMessage('Failed to create group. Please try again.');
        }
    };

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
            <div className="create-group-content-wrapper">
                <form className="create-group-form" onSubmit={handleSubmit}>
                    <h2>Create New Group</h2>
                    {successMessage && (
                        <div className="success-message">
                            <span className="success-icon">✔</span> {successMessage}
                        </div>
                    )}
                    {errorMessage && (
                        <div className="error-message">
                            <span className="error-icon">✖</span> {errorMessage}
                        </div>
                    )}

                    <div className="input-group">
                        <label htmlFor="groupName">Group Name</label>
                        <input
                            type="text"
                            id="groupName"
                            name="groupName"
                            value={groupName}
                            onChange={(e) => setGroupName(e.target.value)}
                            required
                        />
                    </div>

                    <div className="input-group">
                        <label htmlFor="description">Description</label>
                        <textarea
                            id="description"
                            name="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows="4"
                        ></textarea>
                    </div>

                    <div className="input-group">
                        <label htmlFor="addMember">Add Members (Email or Phone)</label>
                        <div className="member-input-wrapper">
                            <input
                                type="text"
                                id="addMember"
                                name="addMember"
                                value={memberInput}
                                onChange={(e) => setMemberInput(e.target.value)}
                                placeholder="Enter email or phone number"
                            />
                            <button type="button" onClick={handleAddMember} className="add-member-button">Add</button>
                        </div>
                    </div>

                    <button type="submit">Create Group</button>
                </form>

                {members.length > 0 && (
                    <div className="members-list-container">
                        <h3>Added Members:</h3>
                        <ul className="members-list">
                            {members.map((member, index) => (
                                <li key={index} className="member-item">
                                    {member}
                                    <button type="button" onClick={() => handleRemoveMember(member)} className="remove-member-button">
                                        ✖
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CreateGroup;
