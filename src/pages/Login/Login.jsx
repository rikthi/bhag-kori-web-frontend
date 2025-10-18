import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { UserContext } from '../../context/UserContext';
import '../Auth.css';
import './Login.css';
import PixelBlast from '../../components/PixelBlast/PixelBlast';
import Logo from '../../components/Logo/Logo';
import { Link } from 'react-router-dom';
import { API_BASE_URL } from '../../config';

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
            const response = await axios.post(`${API_BASE_URL}/api/v1/user/login`, {
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
            <PixelBlast
                variant="circle"
                pixelSize={6}
                color="#B19EEF"
                patternScale={3}
                patternDensity={1.2}
                pixelSizeJitter={0.5}
                enableRipples
                rippleSpeed={0.4}
                rippleThickness={0.12}
                rippleIntensityScale={1.5}
                liquid
                liquidStrength={0.12}
                liquidRadius={1.2}
                liquidWobbleSpeed={5}
                speed={0.6}
                edgeFade={0.25}
                transparent
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
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
