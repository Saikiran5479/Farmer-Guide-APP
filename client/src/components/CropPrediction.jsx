import React, { useState } from 'react';
import api from '../services/api';

const CropPrediction = () => {
    const [features, setFeatures] = useState({
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
    const [error, setError] = useState(null);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFeatures(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await api.post('/ml/predict', features);

            if (response.data.recommendations) {
                setPrediction(response.data.recommendations);
            } else {
                setError('Invalid response from server');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to get prediction');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="prediction-container">
            <h2>Crop Recommendation</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Nitrogen (N):</label>
                    <input
                        type="number"
                        name="N"
                        value={features.N}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Phosphorus (P):</label>
                    <input
                        type="number"
                        name="P"
                        value={features.P}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Potassium (K):</label>
                    <input
                        type="number"
                        name="K"
                        value={features.K}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Temperature (°C):</label>
                    <input
                        type="number"
                        name="temperature"
                        value={features.temperature}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Humidity (%):</label>
                    <input
                        type="number"
                        name="humidity"
                        value={features.humidity}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>pH:</label>
                    <input
                        type="number"
                        name="ph"
                        value={features.ph}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Rainfall (mm):</label>
                    <input
                        type="number"
                        name="rainfall"
                        value={features.rainfall}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                <button type="submit" disabled={loading}>
                    {loading ? 'Getting Prediction...' : 'Get Recommendation'}
                </button>
            </form>

            {error && (
                <div className="error-message">
                    {error}
                </div>
            )}

            {prediction && (
                <div className="prediction-result">
                    <h3>Recommended Crop:</h3>
                    <p>{prediction.prediction}</p>
                    <h4>Probabilities:</h4>
                    <ul>
                        {Object.entries(prediction.probabilities).map(([crop, prob]) => (
                            <li key={crop}>
                                {crop}: {(prob * 100).toFixed(2)}%
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default CropPrediction; 