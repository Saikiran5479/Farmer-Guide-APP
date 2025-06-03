// File: src/pages/HomePage.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './PageStyles.css';

const HomePage = () => {
    const navigate = useNavigate();
    const username = localStorage.getItem("username");
    const token = localStorage.getItem("token");

    return (
        <div className="home-container">
            <div className="banner-overlay"></div>
            <div className="home-content">
                <div className="welcome-section">
                    <h1>Welcome to Farmer Guide</h1>
                    <p className="welcome-subtitle">Your Personal Farming Assistant</p>
                </div>

                <div className="welcome-message">
                    <h2>Start Your Farming Journey</h2>
                    <p>Track your paddy crop stages, get expert recommendations, and manage your crop information all in one place.</p>
                </div>

                {token ? (
                    <div className="quick-actions">
                        <h2>Quick Actions</h2>
                        <div className="action-buttons">
                            <button onClick={() => navigate('/register')} className="action-button">
                                Register New Crop
                            </button>
                            <button onClick={() => navigate('/guide')} className="action-button">
                                View Crop Guide
                            </button>
                            <button onClick={() => navigate('/alerts')} className="action-button">
                                Check Alerts
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="quick-actions">
                        <h2>Get Started</h2>
                        <div className="action-buttons">
                            <button onClick={() => navigate('/signup')} className="action-button">
                                Sign Up
                            </button>
                            <button onClick={() => navigate('/login')} className="action-button">
                                Login
                            </button>
                        </div>
                    </div>
                )}

                <div className="features">
                    <h2>What You Can Do</h2>
                    <ul>
                        <li>Track and monitor your crop growth stages</li>
                        <li>Receive personalized farming recommendations</li>
                        <li>Get timely alerts for important farming activities</li>
                        <li>Access comprehensive crop management guides</li>
                        <li>Connect with farming experts</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default HomePage;