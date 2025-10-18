import React, { useState, useContext } from 'react'; // Import useContext
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate
import { UserContext } from '../../context/UserContext'; // Import UserContext
import './Navigation.css';

const Navigation = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { logout } = useContext(UserContext); // Get logout function from context
    const navigate = useNavigate(); // Initialize navigate

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    const handleLogout = () => {
        logout(); // Call logout function from context
        navigate('/login'); // Redirect to login page
        toggleMenu(); // Close menu
    };

    return (
        <div className="navigation-wrapper">
            <div className="menu-icon" onClick={toggleMenu}>
                <div className={`bar ${isOpen ? 'open' : ''}`}></div>
                <div className={`bar ${isOpen ? 'open' : ''}`}></div>
                <div className={`bar ${isOpen ? 'open' : ''}`}></div>
            </div>
            <nav className={`nav-menu ${isOpen ? 'open' : ''}`}>
                <button className="nav-close-btn" onClick={toggleMenu} aria-label="Close navigation">&rarr;</button>
                <ul>
                    <li><Link to="/homepage" onClick={toggleMenu}>Homepage</Link></li>
                    <li><Link to="/create-group" onClick={toggleMenu}>Create Group</Link></li>
                    <li><Link to="/view-groups" onClick={toggleMenu}>View Groups</Link></li>
                    <li><Link to="/in-progress" onClick={toggleMenu}>Request Payment</Link></li> {/* Redirect to in-progress */}
                    <li><Link to="/in-progress" onClick={toggleMenu}>View Activity</Link></li> {/* Redirect to in-progress */}
                    <li><Link to="/in-progress" onClick={toggleMenu}>Friends</Link></li> {/* Redirect to in-progress */}
                    <li className="nav-menu-divider"></li> {/* Divider for logout/account */}
                    <li><Link to="/in-progress" onClick={toggleMenu}>Account</Link></li> {/* Redirect to in-progress */}
                    <li><button onClick={handleLogout} className="logout-button">Logout</button></li>
                </ul>
            </nav>
        </div>
    );
};

export default Navigation;
