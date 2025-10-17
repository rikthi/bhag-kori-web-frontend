import React from 'react';
import './Homepage.css';
import Logo from '../../components/Logo/Logo';
import Navigation from '../../components/Navigation/Navigation';
import Aurora from '../Aurora';
import { useNavigate } from 'react-router-dom';

const Homepage = () => {
    const navigate = useNavigate();

    const features = [
        { title: 'Create a Group', description: 'Start a new group for your activities.', path: '/create-group' },
        { title: 'View Groups', description: 'See all the groups you are a part of.', path: '/view-groups' },
        { title: 'Request Payment', description: 'Request payment from your friends.', path: '#' },
        { title: 'View Activity', description: 'Check your recent activities.', path: '#' },
        { title: 'Friends', description: 'Manage your friends list.', path: '#' }
    ];

    const handleCardClick = (path) => {
        if (path && path !== '#') {
            navigate(path);
        }
    };

    return (
        <div className="homepage-container">

            <Logo />
            <Navigation />
            <div className="homepage-content">
                <h1>Welcome to Bhag Kori</h1>
                <div className="features-grid">
                    {features.map((feature, index) => (
                        <div key={index} className="feature-card" onClick={() => handleCardClick(feature.path)}>
                            <h2>{feature.title}</h2>
                            <p>{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>
            <Aurora
                colorStops={["#3A29FF", "#FF94B4", "#FF3232"]}
                blend={0.2}
                amplitude={0.5}
                speed={0.3}
            />
        </div>
    );
};

export default Homepage;
