import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { UserContext } from '../../context/UserContext';
import '../Auth.css';
import './Login.css';
import DotGrid from '../DotGrid';
import Logo from '../../components/Logo/Logo';
import { Link } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const { login } = useContext(UserContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null); // Reset error on new submission
        try {
            const response = await axios.post('http://localhost:8080/api/v1/user/login', {
                email,
                password
            });
            if (response.data) {
                login(response.data);
                navigate('/homepage');
            } else {
                setError('Wrong credentials');
            }
        } catch (error) {
            setError('Wrong credentials');
            console.error('Login failed:', error);
        }
    };

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
                <form className="auth-form" onSubmit={handleSubmit}>
                    <h2>Welcome Back!</h2>
                    <p>Log in to continue to Bhag Kori.</p>
                    <div className="input-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit">Login</button>
                    {error && (
                        <div className="error-message">
                            <span className="error-icon">✖</span> {error}
                        </div>
                    )}
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
