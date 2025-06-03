// routes/cropRoutes.js
const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Crop = require("../models/Crop");
const auth = require("../middleware/auth");

// Get user's crops
router.get("/user", auth, async (req, res) => {
    try {
        console.log('Fetching crops for user:', req.user.id);

        const crops = await Crop.find({ farmer: req.user.id })
            .sort({ createdAt: -1 });

        console.log(`Found ${crops.length} crops for user`);

        res.json({ crops });
    } catch (error) {
        console.error('Error fetching user crops:', error);
        res.status(500).json({
            message: 'Error fetching crops',
            error: error.message
        });
    }
});

// Register a new crop
router.post("/register", auth, async (req, res) => {
    console.log('Crop registration request received:', {
        body: req.body,
        userId: req.user.id,
        headers: req.headers
    });

    try {
        // Validate required fields
        const { name, dateOfPlanting, area, region } = req.body;
        const numericArea = Number(area);
        if (!name || !dateOfPlanting || !area || !region) {
            console.log('Missing required fields:', { name, dateOfPlanting, area, region });
            return res.status(400).json({
                message: 'All fields are required',
                missing: {
                    name: !name,
                    dateOfPlanting: !dateOfPlanting,
                    area: !area,
                    region: !region
                }
            });
        }
        if (isNaN(numericArea)) {
            console.log('Area is not a valid number:', area);
            return res.status(400).json({ message: 'Area must be a number' });
        }

        // Find the user
        const user = await User.findById(req.user.id);
        console.log('Found user:', user ? {
            id: user._id,
            username: user.username,
            mobileNumber: user.mobileNumber
        } : 'User not found');

        if (!user) {
            console.log('User not found with ID:', req.user.id);
            return res.status(404).json({ message: 'User not found' });
        }

        // Create new crop
        const crop = new Crop({
            name,
            dateOfPlanting,
            area: numericArea,
            region,
            farmer: user._id,
            farmerName: user.username,
            farmerMobile: user.mobileNumber,
            status: 'active'
        });

        console.log('Creating new crop:', {
            name: crop.name,
            farmerId: crop.farmer,
            farmerName: crop.farmerName
        });

        // Save the crop
        const savedCrop = await crop.save();
        console.log('Crop saved successfully:', {
            cropId: savedCrop._id,
            name: savedCrop.name
        });

        // Update user's crops array
        user.crops.push(savedCrop._id);
        await user.save();
        console.log('User updated with new crop:', {
            userId: user._id,
            cropsCount: user.crops.length
        });

        res.status(201).json({
            message: 'Crop registered successfully',
            crop: savedCrop
        });
    } catch (error) {
        console.error('Error in crop registration:', {
            name: error.name,
            message: error.message,
            stack: error.stack
        });
        res.status(500).json({
            message: 'Error registering farmer',
            error: error.message
        });
    }
});

module.exports = router;