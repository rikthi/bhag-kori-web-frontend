import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Navigation.css';

const Navigation = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className="navigation-wrapper">
            <div className="menu-icon" onClick={toggleMenu}>
                <div className={`bar ${isOpen ? 'open' : ''}`}></div>
                <div className={`bar ${isOpen ? 'open' : ''}`}></div>
                <div className={`bar ${isOpen ? 'open' : ''}`}></div>
            </div>
            <nav className={`nav-menu ${isOpen ? 'open' : ''}`}>
                <ul>
                    <li><Link to="/homepage" onClick={toggleMenu}>Homepage</Link></li>
                    <li><Link to="/signup" onClick={toggleMenu}>Sign Up</Link></li>
                    <li><Link to="/login" onClick={toggleMenu}>Login</Link></li>
                    <li><Link to="/forgot-password" onClick={toggleMenu}>Forgot Password</Link></li>
                    <li><a href="#" onClick={toggleMenu}>Create Group</a></li>
                    <li><a href="#" onClick={toggleMenu}>View Groups</a></li>
                    <li><a href="#" onClick={toggleMenu}>Request Payment</a></li>
                    <li><a href="#" onClick={toggleMenu}>View Activity</a></li>
                    <li><a href="#" onClick={toggleMenu}>Friends</a></li>
                </ul>
            </nav>
        </div>
    );
};

export default Navigation;
