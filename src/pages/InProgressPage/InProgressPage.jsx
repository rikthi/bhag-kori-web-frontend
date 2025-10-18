import React from 'react';
import './InProgressPage.css';
import Logo from '../../components/Logo/Logo';
import Navigation from '../../components/Navigation/Navigation';
import Aurora from '../Aurora';

export default function InProgressPage() {
  return (
    <div className="page-wrapper">
      <Aurora colorStops={['#B19EEF', '#8A6EDB', '#4A2B86']} blend={0.2} amplitude={0.5} speed={0.3} />
      <Logo />
      <Navigation />
      <div className="in-progress-container">
        <h2 className="in-progress-title">Feature In Progress</h2>
        <p className="in-progress-message">
          We're working hard to bring you this feature! Please check back later.
        </p>
      </div>
    </div>
  );
}
