import React from 'react';
import '../Auth.css';
import './ForgotPassword.css';
import PixelBlast from '../../components/PixelBlast/PixelBlast';
import Logo from '../../components/Logo/Logo';
import { Link } from 'react-router-dom';

const ForgotPassword = () => {
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
