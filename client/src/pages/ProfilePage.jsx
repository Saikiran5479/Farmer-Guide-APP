// File: src/pages/ProfilePage.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./ProfilePage.css";

const ProfilePage = () => {
    const [userData, setUserData] = useState(null);
    const [crops, setCrops] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/login");
            return;
        }

        const fetchUserData = async () => {
            try {
                const response = await axios.get("http://localhost:5000/api/auth/profile", {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setUserData(response.data);
            } catch (err) {
                setError("Failed to fetch user data");
                console.error("Error fetching user data:", err);
            }
        };

        const fetchUserCrops = async () => {
            try {
                const response = await axios.get("http://localhost:5000/api/crops/user", {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setCrops(response.data.crops);
            } catch (err) {
                setError("Failed to fetch crops");
                console.error("Error fetching crops:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
        fetchUserCrops();
    }, [navigate]);

    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    return (
        <div className="profile-container">
            <div className="profile-header">
                <img src="/default-avatar.png" alt="Profile" className="profile-avatar" />
                <div className="profile-info">
                    <h1>{userData?.username || 'User'}</h1>
                    <p>Mobile: {userData?.mobileNumber}</p>
                    <p>Region: {userData?.region || "Not specified"}</p>
                    <p>Area: {userData?.area || "Not specified"}</p>
                </div>
            </div>

            <div className="profile-stats">
                <div className="stat-box">
                    <h3>Total Crops</h3>
                    <p>{crops.length}</p>
                </div>
                <div className="stat-box">
                    <h3>Active Crops</h3>
                    <p>{crops.filter(crop => crop.status === 'active').length}</p>
                </div>
                <div className="stat-box">
                    <h3>Total Area</h3>
                    <p>{crops.reduce((sum, crop) => sum + (Number(crop.area) || 0), 0)} acres</p>
                </div>
            </div>

            <div className="profile-sections">
                <div className="profile-section">
                    <h2>Recent Activity</h2>
                    <ul className="activity-list">
                        {crops.slice(0, 5).map((crop) => (
                            <li key={crop._id} className="activity-item">
                                <div className="activity-icon">🌾</div>
                                <div className="activity-details">
                                    <h4>{crop.name}</h4>
                                    <p>Planted on {new Date(crop.dateOfPlanting).toLocaleDateString()}</p>
                                </div>
                                <span className="activity-time">
                                    {new Date(crop.dateOfPlanting).toLocaleDateString()}
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="profile-section">
                    <h2>Settings</h2>
                    <ul className="settings-list">
                        <li className="setting-item">
                            <span className="setting-label">Email Notifications</span>
                            <label className="toggle-switch">
                                <input type="checkbox" />
                                <span className="toggle-slider"></span>
                            </label>
                        </li>
                        <li className="setting-item">
                            <span className="setting-label">SMS Alerts</span>
                            <label className="toggle-switch">
                                <input type="checkbox" />
                                <span className="toggle-slider"></span>
                            </label>
                        </li>
                        <li className="setting-item">
                            <span className="setting-label">Weather Updates</span>
                            <label className="toggle-switch">
                                <input type="checkbox" />
                                <span className="toggle-slider"></span>
                            </label>
                        </li>
                    </ul>
                    <button className="edit-profile-btn">Edit Profile</button>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;