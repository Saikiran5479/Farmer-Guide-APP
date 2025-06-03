import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CropStagePredictor.css';

const CropStagePredictor = () => {
    const [features, setFeatures] = useState({
        temperature: '',
        humidity: '',
        soil_moisture: '',
        days_planted: '',
        light_intensity: '',
        crop: ''
    });
    const [prediction, setPrediction] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [probabilities, setProbabilities] = useState({});

    useEffect(() => {
        if (prediction?.all_probabilities) {
            // Animate probability bars
            Object.entries(prediction.all_probabilities).forEach(([stage, prob]) => {
                setTimeout(() => {
                    setProbabilities(prev => ({
                        ...prev,
                        [stage]: prob
                    }));
                }, 100);
            });
        }
    }, [prediction]);

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
        setPrediction(null);
        setProbabilities({});

        try {
            const requestData = {
                features: {
                    crop: features.crop.toLowerCase().trim(),
                    days_since_planting: parseInt(features.days_planted)
                }
            };
            console.log('Sending request:', requestData);

            const response = await axios.post('/api/ml/predict-crop-stage', requestData);
            console.log('Response:', response.data);

            if (response.data.success) {
                setPrediction(response.data.prediction);
            } else {
                setError(response.data.error || 'Failed to get prediction');
            }
        } catch (err) {
            console.error('Error:', err);
            setError(err.response?.data?.error || 'Failed to get prediction');
        } finally {
            setLoading(false);
        }
    };

    const predictCropStage = async (features) => {
        try {
            const response = await axios.post('http://localhost:5000/api/ml/predict-crop-stage', { features });
            console.log('Prediction:', response.data);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div className="crop-predictor-container">
            <div className="crop-predictor-content">
                <div className="crop-predictor-header">
                    <h2 className="crop-predictor-title">Crop Stage Predictor</h2>
                    <p className="crop-predictor-subtitle">
                        Enter your crop details to predict its current growth stage
                    </p>
                </div>

                <div className="crop-predictor-card">
                    <form onSubmit={handleSubmit} className="crop-predictor-form">
                        <div className="input-group">
                            <label className="input-label">Crop Name</label>
                            <input
                                type="text"
                                name="crop"
                                value={features.crop}
                                onChange={handleInputChange}
                                className="input-field"
                                placeholder="Enter crop name (e.g., paddy)"
                                required
                            />
                        </div>

                        <div className="input-group">
                            <label className="input-label">Days Planted</label>
                            <input
                                type="number"
                                name="days_planted"
                                value={features.days_planted}
                                onChange={handleInputChange}
                                className="input-field"
                                placeholder="Enter number of days"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="predict-button"
                        >
                            {loading ? (
                                <>
                                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Predicting...
                                </>
                            ) : (
                                'Predict Stage'
                            )}
                        </button>
                    </form>

                    {error && (
                        <div className="error-message">
                            <svg className="error-icon h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                            <p>{error}</p>
                        </div>
                    )}

                    {prediction && (
                        <div className="prediction-results">
                            <h3 className="prediction-header">Prediction Results</h3>

                            <div className="prediction-card">
                                <div className="prediction-row">
                                    <span className="prediction-label">Current Stage:</span>
                                    <span className="prediction-value">{prediction.stage}</span>
                                </div>
                                <div className="prediction-row">
                                    <span className="prediction-label">Confidence:</span>
                                    <span className="prediction-value">
                                        {(prediction.confidence * 100).toFixed(2)}%
                                    </span>
                                </div>
                            </div>

                            <div className="prediction-card">
                                <h4 className="prediction-header">Stage Probabilities</h4>
                                <div className="space-y-4">
                                    {Object.entries(prediction.all_probabilities).map(([stage, prob]) => (
                                        <div key={stage}>
                                            <div className="prediction-row">
                                                <span className="prediction-label">{stage}</span>
                                                <span className="prediction-value">
                                                    {(probabilities[stage] * 100 || 0).toFixed(2)}%
                                                </span>
                                            </div>
                                            <div className="probability-bar">
                                                <div
                                                    className="probability-fill"
                                                    style={{ width: `${(probabilities[stage] * 100 || 0)}%` }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CropStagePredictor; 