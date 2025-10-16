import React from 'react';
import '../Auth.css';
import './ForgotPassword.css';
import DotGrid from '../DotGrid';
import Logo from '../../components/Logo/Logo';
import { Link } from 'react-router-dom';

const ForgotPassword = () => {
    return (
        <div className="page-wrapper">
            <Logo />
            <DotGrid
                dotSize={2}
                gap={20}
                baseColor="#e0e0e0"
                activeColor="#ffffff"
                proximity={100}
                shockRadius={250}
                shockStrength={5}
                resistance={750}
                returnDuration={1.5}
            />
            <div className="auth-container">
                <form className="auth-form">
                <h2>Reset Your Password</h2>
                <p>Enter your email to receive a reset link.</p>
                <div className="input-group">
                    <label htmlFor="email">Email</label>
                    <input type="email" id="email" name="email" required />
                </div>
                <button type="submit">Submit</button>
                    <div className="navigation-link">
                        Remember your password? <Link to="/login">Log In</Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ForgotPassword;
