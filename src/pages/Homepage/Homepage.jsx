import React from 'react';
import './Homepage.css';
import Logo from '../../components/Logo/Logo';
import Navigation from '../../components/Navigation/Navigation';

const Homepage = () => {
    const features = [
        { title: 'Create a Group', description: 'Start a new group for your activities.' },
        { title: 'View Groups', description: 'See all the groups you are a part of.' },
        { title: 'Request Payment', description: 'Request payment from your friends.' },
        { title: 'View Activity', description: 'Check your recent activities.' },
        { title: 'Friends', description: 'Manage your friends list.' }
    ];

    return (
        <div className="homepage-container">
            <Logo />
            <Navigation />
            <div className="homepage-content">
                <h1>Welcome to Bhag Kori</h1>
                <div className="features-grid">
                    {features.map((feature, index) => (
                        <div key={index} className="feature-card">
                            <h2>{feature.title}</h2>
                            <p>{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Homepage;
