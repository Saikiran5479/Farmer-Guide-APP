// File: src/pages/GuidePage.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./GuidePage.css";

const GuidePage = () => {
    const [crops, setCrops] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
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

    const getStageTasks = (stage) => {
        const tasks = {
            "Germination": [
                "Ensure proper water level (2-3 cm)",
                "Monitor for pests",
                "Check soil temperature"
            ],
            "Tillering": [
                "Apply nitrogen fertilizer",
                "Maintain water level",
                "Control weeds"
            ],
            "Booting": [
                "Apply potassium fertilizer",
                "Monitor water level",
                "Check for diseases"
            ],
            "Flowering": [
                "Maintain optimal water level",
                "Monitor for pests",
                "Check for nutrient deficiencies"
            ],
            "Maturity": [
                "Prepare for harvest",
                "Monitor weather conditions",
                "Plan harvesting schedule"
            ]
        };
        return tasks[stage] || [];
    };

    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    return (
        <div className="guide-container">
            <div className="guide-section">
                <h2>Crop Guide</h2>
                <input
                    type="text"
                    placeholder="Search by crop name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />

                {crops.length === 0 ? (
                    <p>No crops registered yet. Register a crop to get personalized guidance.</p>
                ) : (
                    <ul className="guide-list">
                        {crops
                            .filter(crop => crop.name.toLowerCase().includes(searchTerm.toLowerCase()))
                            .map(crop => {
                                const stage = getCropStage(crop.dateOfPlanting);
                                const tasks = getStageTasks(stage);

                                return (
                                    <li key={crop._id} className="guide-item">
                                        <h3>{crop.name}</h3>
                                        <p>Planted on: {new Date(crop.dateOfPlanting).toLocaleDateString()}</p>
                                        <p>Current Stage: {stage}</p>
                                        <h4>Recommended Tasks:</h4>
                                        <ul className="guide-steps">
                                            {tasks.map((task, index) => (
                                                <li key={index} className="guide-step">{task}</li>
                                            ))}
                                        </ul>
                                        <div className="guide-tip">
                                            <h4>Important Tip</h4>
                                            <p>Monitor your crop regularly and maintain proper water levels for optimal growth.</p>
                                        </div>
                                    </li>
                                );
                            })}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default GuidePage;