// middleware/auth.js
const jwt = require('jsonwebtoken');

const auth = async (req, res, next) => {
    try {
        console.log('Auth middleware - Headers:', req.headers);

        // Get token from header
        const authHeader = req.header('Authorization');
        console.log('Auth header:', authHeader);

        if (!authHeader) {
            console.log('No Authorization header found');
            return res.status(401).json({ message: 'No authentication token, access denied' });
        }

        const token = authHeader.replace('Bearer ', '');
        console.log('Extracted token:', token ? 'Token exists' : 'No token');

        if (!token) {
            console.log('No token found after Bearer removal');
            return res.status(401).json({ message: 'No authentication token, access denied' });
        }

        // Verify token
        console.log('Verifying token with secret:', process.env.JWT_SECRET ? 'Secret exists' : 'No secret');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Token decoded:', decoded);

        // Add user from payload
        req.user = decoded;
        next();
    } catch (err) {
        console.error('Auth middleware error:', {
            name: err.name,
            message: err.message,
            stack: err.stack
        });
        res.status(401).json({
            message: 'Token is not valid',
            error: err.message
        });
    }
};

module.exports = auth; 