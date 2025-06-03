const express = require('express');
const router = express.Router();
const { spawn } = require('child_process');
const path = require('path');

// Get the absolute path to the ml_model directory in the backend folder
const mlModelPath = path.resolve(__dirname, '../ml_model');
console.log('ML Model Path:', mlModelPath); // Debug log

// Route to predict crop stage
router.post('/predict-crop-stage', async (req, res) => {
    try {
        const features = req.body.features;
        console.log('Received features:', features); // Log received features

        // Path to the Python script using absolute path
        const scriptPath = path.join(mlModelPath, 'crop_stage_predictor.py');
        console.log('Script path:', scriptPath); // Debug log

        // Verify if the script exists
        if (!require('fs').existsSync(scriptPath)) {
            console.error('Script file not found at:', scriptPath);
            return res.status(500).json({
                success: false,
                error: `Python script not found at ${scriptPath}`
            });
        }

        // Use the features directly as they are already in the correct format
        console.log('Sending features to Python:', features);

        // Spawn Python process with full path to Python script
        const pythonProcess = spawn('python', [scriptPath, '--predict', JSON.stringify(features)]);

        let prediction = '';
        let error = '';

        pythonProcess.stdout.on('data', (data) => {
            const output = data.toString();
            prediction += output;
            console.log('Python stdout:', output); // Debug log
        });

        pythonProcess.stderr.on('data', (data) => {
            const errorOutput = data.toString();
            error += errorOutput;
            console.log('Python stderr:', errorOutput); // Debug log
        });

        pythonProcess.on('close', (code) => {
            console.log('Python process exited with code:', code); // Debug log
            console.log('Final prediction output:', prediction); // Debug log
            console.log('Final error output:', error); // Debug log

            if (code !== 0) {
                return res.status(500).json({
                    success: false,
                    error: `Python process exited with code ${code}: ${error}`
                });
            }

            try {
                // Try to parse the prediction output
                const result = JSON.parse(prediction.trim());
                console.log('Parsed prediction result:', result); // Debug log

                if (result.success === false) {
                    return res.status(500).json({
                        success: false,
                        error: result.error || 'Failed to make prediction'
                    });
                }

                res.json({
                    success: true,
                    prediction: result.prediction
                });
            } catch (e) {
                console.error('Failed to parse prediction:', e); // Debug log
                console.error('Raw prediction output:', prediction); // Debug log
                res.status(500).json({
                    success: false,
                    error: 'Failed to parse prediction result: ' + e.message
                });
            }
        });
    } catch (error) {
        console.error('Server error:', error); // Debug log
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Route to retrain the model
router.post('/retrain-model', async (req, res) => {
    try {
        // Path to the Python script using absolute path
        const scriptPath = path.join(mlModelPath, 'crop_stage_predictor.py');
        console.log('Script path:', scriptPath); // Debug log

        // Spawn Python process with full path to Python script
        const pythonProcess = spawn('python', [scriptPath, '--train']);

        let output = '';
        let error = '';

        pythonProcess.stdout.on('data', (data) => {
            output += data.toString();
            console.log('Python output:', data.toString()); // Debug log
        });

        pythonProcess.stderr.on('data', (data) => {
            error += data.toString();
            console.log('Python error:', data.toString()); // Debug log
        });

        pythonProcess.on('close', (code) => {
            console.log('Python process exited with code:', code); // Debug log
            if (code !== 0) {
                return res.status(500).json({
                    success: false,
                    error: `Python process exited with code ${code}: ${error}`
                });
            }

            res.json({
                success: true,
                message: 'Model retrained successfully',
                output: output
            });
        });
    } catch (error) {
        console.error('Server error:', error); // Debug log
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

module.exports = router; 