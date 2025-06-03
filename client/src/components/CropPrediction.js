import React, { useState } from 'react';
import axios from 'axios';
import './CropPrediction.css';

const CropPrediction = () => {
    const [formData, setFormData] = useState({
        N: '',
        P: '',
        K: '',
        temperature: '',
        humidity: '',
        ph: '',
        rainfall: ''
    });
    const [prediction, setPrediction] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setPrediction(null);

        try {
            const response = await axios.post('http://localhost:8080/api/predict', formData);
            setPrediction(response.data);
        } catch (err) {
            console.error('Prediction error:', err);
            setError(err.response?.data?.message || 'An error occurred while making the prediction');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="prediction-container">
            <h2>Crop Recommendation System</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="N">Nitrogen (N) Content in Soil</label>
                    <input
                        type="number"
                        id="N"
                        name="N"
                        value={formData.N}
                        onChange={handleChange}
                        required
                        placeholder="Enter N content"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="P">Phosphorus (P) Content in Soil</label>
                    <input
                        type="number"
                        id="P"
                        name="P"
                        value={formData.P}
                        onChange={handleChange}
                        required
                        placeholder="Enter P content"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="K">Potassium (K) Content in Soil</label>
                    <input
                        type="number"
                        id="K"
                        name="K"
                        value={formData.K}
                        onChange={handleChange}
                        required
                        placeholder="Enter K content"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="temperature">Temperature (°C)</label>
                    <input
                        type="number"
                        id="temperature"
                        name="temperature"
                        value={formData.temperature}
                        onChange={handleChange}
                        required
                        placeholder="Enter temperature"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="humidity">Humidity (%)</label>
                    <input
                        type="number"
                        id="humidity"
                        name="humidity"
                        value={formData.humidity}
                        onChange={handleChange}
                        required
                        placeholder="Enter humidity"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="ph">pH Value</label>
                    <input
                        type="number"
                        id="ph"
                        name="ph"
                        value={formData.ph}
                        onChange={handleChange}
                        required
                        placeholder="Enter pH value"
                        step="0.1"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="rainfall">Rainfall (mm)</label>
                    <input
                        type="number"
                        id="rainfall"
                        name="rainfall"
                        value={formData.rainfall}
                        onChange={handleChange}
                        required
                        placeholder="Enter rainfall"
                    />
                </div>

                <button type="submit" disabled={loading}>
                    {loading ? 'Predicting...' : 'Get Crop Recommendation'}
                </button>
            </form>

            {error && <div className="error-message">{error}</div>}

            {prediction && (
                <div className="prediction-result">
                    <h3>Recommended Crops</h3>
                    <h4>Top 3 Recommendations:</h4>
                    <ul>
                        {prediction.recommendations.map((crop, index) => (
                            <li key={index}>
                                <span>{crop.name}</span>
                                <span>{crop.probability.toFixed(2)}%</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default CropPrediction; 