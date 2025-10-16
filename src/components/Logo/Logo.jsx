import React from 'react';
import './Logo.css';

const Logo = () => {
    return (
        <div className="logo-container">
            <svg className="logo-svg" width="60" height="60" viewBox="0 0 200 200">
                <defs>
                    <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style={{ stopColor: '#8e82ff', stopOpacity: 1 }} />
                        <stop offset="100%" style={{ stopColor: '#a29bfe', stopOpacity: 1 }} />
                    </linearGradient>
                </defs>
                <path
                    d="M 50,50 L 150,50 L 150,150 L 50,150 Z"
                    fill="none"
                    stroke="url(#grad1)"
                    strokeWidth="12"
                    className="logo-path"
                />
                <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" className="logo-text">
                    BK
                </text>
            </svg>
        </div>
    );
};

export default Logo;
