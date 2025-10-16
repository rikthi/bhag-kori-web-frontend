import React, {useState} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../Auth.css';
import './Signup.css';
import DotGrid from '../DotGrid';
import Logo from '../../components/Logo/Logo';
import { API_BASE_URL } from '../../config'

const Signup = () => {
    // State to hold the form data
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phoneNumber: '',
        password: '',
        confirmPassword: '',
    });

    // State for handling loading, error, and success messages
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false); // New state for success message
    const navigate = useNavigate(); // Hook for navigation

    // Handler for input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    // Handler for form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match. Please try again.");
            return;
        }

        setLoading(true);

        const payload = {
            id: null,
            name: formData.name,
            email: formData.email,
            phoneNumber: formData.phoneNumber,
            password: formData.password,
        };

        try {
            const response = await fetch(`${API_BASE_URL}/api/v1/user/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                console.log('User created successfully');
                setIsSuccess(true); // Show the success message
                // Wait 1.5 seconds then redirect
                setTimeout(() => {
                    navigate('/login');
                }, 1500);
            } else {
                const errorData = await response.json();
                setError(errorData.message || 'An error occurred during signup.');
                console.error('Signup failed:', errorData);
            }
        } catch (err) {
            setError('Could not connect to the server. Please try again later.');
            console.error('Network error:', err);
        } finally {
            setLoading(false);
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
                {isSuccess && (
                    <div className="success-message">
                        <p>Signed up successfully!</p>
                    </div>
                )}
                <form className="auth-form" onSubmit={handleSubmit}>
                    <h2>Create Your Account</h2>
                    <p>Join Bhag Kori today!</p>
                    {error && <p className="error-message">{error}</p>}
                    <div className="input-group">
                        <label htmlFor="name">Name</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <label htmlFor="phonenumber">Phone Number</label>
                        <input
                            type="tel"
                            id="phonenumber"
                            name="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <label htmlFor="confirm-password">Confirm Password</label>
                        <input
                            type="password"
                            id="confirm-password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <button type="submit" disabled={loading || isSuccess}>
                        {loading ? 'Signing Up...' : 'Sign Up'}
                    </button>
                    <div className="navigation-link">
                        Already have an account? <Link to="/login">Log In</Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Signup;