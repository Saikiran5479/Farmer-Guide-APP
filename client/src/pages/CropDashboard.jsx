// File: src/pages/CropDashboard.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./DashboardPage.css";

const CropDashboard = () => {
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

        const fetchCrops = async () => {
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

        fetchCrops();
    }, [navigate]);

    const getCropStage = (dateOfPlanting) => {
        const daysSincePlanting = Math.floor((new Date() - new Date(dateOfPlanting)) / (1000 * 60 * 60 * 24));
        if (daysSincePlanting < 10) return "Germination";
        if (daysSincePlanting < 20) return "Tillering";
        if (daysSincePlanting < 30) return "Booting";
        if (daysSincePlanting < 40) return "Flowering";
        return "Maturity";
    };

    const getNextAction = (stage) => {
        const actions = {
            "Germination": "Monitor water level and soil temperature",
            "Tillering": "Apply nitrogen fertilizer",
            "Booting": "Check for diseases and apply potassium",
            "Flowering": "Maintain optimal water level",
            "Maturity": "Prepare for harvest"
        };
        return actions[stage] || "Monitor crop health";
    };

    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    const activeCrops = crops.filter(crop => crop.status === 'active');
    const totalArea = activeCrops.reduce((sum, crop) => sum + (Number(crop.area) || 0), 0);

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <h1>Crop Dashboard</h1>
            </div>

            <div className="dashboard-stats">
                <div className="stat-card">
                    <h3>Total Crops</h3>
                    <p>{crops.length}</p>
                </div>
                <div className="stat-card">
                    <h3>Active Crops</h3>
                    <p>{activeCrops.length}</p>
                </div>
                <div className="stat-card">
                    <h3>Total Area</h3>
                    <p>{totalArea} acres</p>
                </div>
            </div>

            <div className="crops-section">
                <h2>Your Crops</h2>
                {activeCrops.length === 0 ? (
                    <p>No active crops. Register a crop to see your dashboard.</p>
                ) : (
                    <div className="crops-grid">
                        {activeCrops.map(crop => {
                            const stage = getCropStage(crop.dateOfPlanting);
                            const daysSincePlanting = Math.floor((new Date() - new Date(crop.dateOfPlanting)) / (1000 * 60 * 60 * 24));

                            return (
                                <div key={crop._id} className="crop-card">
                                    <h4>{crop.name}</h4>
                                    <div className="crop-info">
                                        <p>Days since planting: {daysSincePlanting}</p>
                                        <p>Current Stage: {stage}</p>
                                        <p>Area: {crop.area} acres</p>
                                        <p>Region: {crop.region}</p>
                                    </div>
                                    <div className="status active">Active</div>
                                    <div className="crop-actions">
                                        <button onClick={() => navigate(`/crop-guide/${crop._id}`)}>
                                            View Guide
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CropDashboard;