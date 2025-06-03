import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './PageStyles.css';

const Dashboard = () => {
    const navigate = useNavigate();
    const [crops, setCrops] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [username, setUsername] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('token');
        const storedUsername = localStorage.getItem('username');

        if (!token) {
            navigate('/login');
            return;
        }

        setUsername(storedUsername);
        fetchCrops(token);
    }, [navigate]);

    const fetchCrops = async (token) => {
        try {
            const response = await axios.get('http://localhost:5000/api/crops/user', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setCrops(response.data.crops);
        } catch (err) {
            setError('Failed to fetch crops');
            console.error('Error fetching crops:', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    return (
        <div className="dashboard-container">
            <h2>Welcome, {username}!</h2>

            <div className="dashboard-stats">
                <div className="stat-card">
                    <h3>Total Crops</h3>
                    <p>{crops.length}</p>
                </div>
                <div className="stat-card">
                    <h3>Active Crops</h3>
                    <p>{crops.filter(crop => crop.status === 'active').length}</p>
                </div>
            </div>

            <div className="crops-section">
                <h3>Your Crops</h3>
                {error && <div className="error-message">{error}</div>}

                {crops.length === 0 ? (
                    <p>No crops registered yet. <button onClick={() => navigate('/register-crop')}>Register a Crop</button></p>
                ) : (
                    <div className="crops-grid">
                        {crops.map(crop => (
                            <div key={crop._id} className="crop-card">
                                <h4>{crop.name}</h4>
                                <p>Planted: {new Date(crop.dateOfPlanting).toLocaleDateString()}</p>
                                <p>Area: {crop.area}</p>
                                <p>Region: {crop.region}</p>
                                <p>Status: <span className={`status ${crop.status}`}>{crop.status}</span></p>
                                <button onClick={() => navigate(`/crop-guide/${crop._id}`)}>View Guide</button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard; 