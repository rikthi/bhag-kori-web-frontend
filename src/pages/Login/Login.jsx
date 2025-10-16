import React from 'react';
import '../Auth.css';
import './Login.css';
import DotGrid from '../DotGrid';
import Logo from '../../components/Logo/Logo';
import { Link } from 'react-router-dom';

const Login = () => {
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
                <h2>Welcome Back!</h2>
                <p>Log in to continue to Bhag Kori.</p>
                <div className="input-group">
                    <label htmlFor="email">Email</label>
                    <input type="email" id="email" name="email" required />
                </div>
                <div className="input-group">
                    <label htmlFor="password">Password</label>
                    <input type="password" id="password" name="password" required />
                </div>
                <button type="submit">Login</button>
                    <div className="navigation-link">
                        <Link to="/forgot-password">Forgot Password?</Link>
                    </div>
                    <div className="navigation-link">
                        Don't have an account? <Link to="/signup">Sign Up</Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
