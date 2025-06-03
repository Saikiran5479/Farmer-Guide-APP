// File: src/pages/RegisterCropPage.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./PageStyles.css";

const RegisterCropPage = () => {
    const navigate = useNavigate();
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [token, setToken] = useState("");

    const [formData, setFormData] = useState({
        name: "",
        dateOfPlanting: "",
        area: "",
        region: ""
    });

    useEffect(() => {
        // Check if user is logged in
        const storedToken = localStorage.getItem("token");
        console.log("Stored token:", storedToken ? "Token exists" : "No token");

        if (!storedToken) {
            console.log("No token found, redirecting to login");
            navigate("/login");
            return;
        }

        setToken(storedToken);
    }, [navigate]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError(""); // Clear error when user types
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            if (!token) {
                throw new Error("Please login first");
            }

            console.log("Submitting crop registration with data:", {
                ...formData,
                token: token ? "Token exists" : "No token"
            });

            const dataToSend = { ...formData, area: Number(formData.area) };

            const response = await axios.post(
                "http://localhost:5000/api/crops/register",
                dataToSend,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            console.log("Crop registration response:", response.data);

            alert("Crop registered successfully!");
            navigate("/dashboard");
        } catch (err) {
            console.error("Error registering crop:", {
                message: err.message,
                response: err.response?.data,
                status: err.response?.status
            });

            const errorMessage = err.response?.data?.message ||
                err.response?.data?.error ||
                err.message ||
                "Failed to register crop. Please try again.";
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    if (!token) {
        return <div>Loading...</div>;
    }

    return (
        <div className="form-container">
            <h2>Register Your Crop</h2>
            {error && <div className="error-message">{error}</div>}
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="name"
                    placeholder="Crop Name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    disabled={loading}
                />
                <input
                    type="date"
                    name="dateOfPlanting"
                    value={formData.dateOfPlanting}
                    onChange={handleChange}
                    required
                    disabled={loading}
                />
                <input
                    type="text"
                    name="area"
                    placeholder="Area (e.g., 2 acres)"
                    value={formData.area}
                    onChange={handleChange}
                    required
                    disabled={loading}
                />
                <input
                    type="text"
                    name="region"
                    placeholder="Region"
                    value={formData.region}
                    onChange={handleChange}
                    required
                    disabled={loading}
                />
                <button type="submit" disabled={loading}>
                    {loading ? "Registering..." : "Register Crop"}
                </button>
            </form>
        </div>
    );
};

export default RegisterCropPage;
