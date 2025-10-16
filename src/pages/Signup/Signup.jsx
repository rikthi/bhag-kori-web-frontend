import React from 'react';
import '../Auth.css';
import './Signup.css';
import DotGrid from '../DotGrid';
import Logo from '../../components/Logo/Logo';
import { Link } from 'react-router-dom';

const Signup = () => {
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
                <h2>Create Your Account</h2>
                <p>Join Bhag Kori today!</p>
                <div className="input-group">
                    <label htmlFor="name">Name</label>
                    <input type="text" id="name" name="name" required />
                </div>
                <div className="input-group">
                    <label htmlFor="email">Email</label>
                    <input type="email" id="email" name="email" required />
                </div>
                <div className="input-group">
                    <label htmlFor="phonenumber">Phone Number</label>
                    <input type="tel" id="phonenumber" name="phonenumber" required />
                </div>
                <div className="input-group">
                    <label htmlFor="password">Password</label>
                    <input type="password" id="password" name="password" required />
                </div>
                <div className="input-group">
                    <label htmlFor="confirm-password">Confirm Password</label>
                    <input type="password" id="confirm-password" name="confirm-password" required />
                </div>
                <button type="submit">Sign Up</button>
                    <div className="navigation-link">
                        Already have an account? <Link to="/login">Log In</Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Signup;
