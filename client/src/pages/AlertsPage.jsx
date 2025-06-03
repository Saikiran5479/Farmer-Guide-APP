// File: src/pages/AlertsPage.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./AlertsPage.css";

const AlertsPage = () => {
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

    const generateAlerts = (crop) => {
        const stage = getCropStage(crop.dateOfPlanting);
        const alerts = [];

        // Add stage-specific alerts
        switch (stage) {
            case "Germination":
                alerts.push({
                    date: new Date(),
                    task: `Monitor ${crop.name} for proper germination`,
                    priority: "high"
                });
                break;
            case "Tillering":
                alerts.push({
                    date: new Date(),
                    task: `Apply nitrogen fertilizer to ${crop.name}`,
                    priority: "high"
                });
                break;
            case "Booting":
                alerts.push({
                    date: new Date(),
                    task: `Check ${crop.name} for diseases`,
                    priority: "medium"
                });
                break;
            case "Flowering":
                alerts.push({
                    date: new Date(),
                    task: `Monitor water level for ${crop.name}`,
                    priority: "high"
                });
                break;
            case "Maturity":
                alerts.push({
                    date: new Date(),
                    task: `Prepare for ${crop.name} harvest`,
                    priority: "high"
                });
                break;
        }

        // Add general maintenance alerts
        alerts.push({
            date: new Date(),
            task: `Regular pest check for ${crop.name}`,
            priority: "medium"
        });

        return alerts;
    };

    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    const allAlerts = crops.flatMap(crop => generateAlerts(crop));

    return (
        <div className="alerts-container">
            <h2>Crop Alerts</h2>
            {allAlerts.length === 0 ? (
                <p className="no-alerts">No active alerts. Register a crop to receive alerts.</p>
            ) : (
                <ul className="alerts-list">
                    {allAlerts.map((alert, index) => (
                        <li key={index} className="alert-item">
                            <div className="alert-header">
                                <h3 className="alert-title">{alert.task}</h3>
                                <span className="alert-date">
                                    {new Date(alert.date).toLocaleDateString()}
                                </span>
                            </div>
                            <p className="alert-message">{alert.task}</p>
                            <span className={`alert-priority ${alert.priority}`}>
                                {alert.priority.toUpperCase()}
                            </span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default AlertsPage;