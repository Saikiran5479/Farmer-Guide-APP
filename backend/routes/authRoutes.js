// routes/authRoutes.js
const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

router.post("/signup", async (req, res) => {
    console.log("Received signup request:", { ...req.body, password: '[REDACTED]' });

    const { username, mobileNumber, password } = req.body;

    // Validate input
    if (!username || !mobileNumber || !password) {
        console.log("Missing required fields:", { username: !!username, mobileNumber: !!mobileNumber, password: !!password });
        return res.status(400).json({ error: "All fields are required" });
    }

    try {
        // Check if user already exists
        const existingUser = await User.findOne({ mobileNumber });
        if (existingUser) {
            console.log("User already exists with mobile number:", mobileNumber);
            return res.status(400).json({ error: "User already exists" });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = new User({
            username,
            mobileNumber,
            password: hashedPassword
        });

        // Save user
        const savedUser = await newUser.save();
        console.log("User registered successfully:", { id: savedUser._id, username: savedUser.username });

        res.status(201).json({ message: "User registered successfully" });
    } catch (err) {
        console.error("Signup error details:", {
            name: err.name,
            message: err.message,
            code: err.code,
            stack: err.stack
        });

        if (err.name === 'ValidationError') {
            return res.status(400).json({
                error: "Validation error",
                details: Object.values(err.errors).map(e => e.message)
            });
        }

        res.status(500).json({
            error: "Server error",
            details: err.message
        });
    }
});

// Login
router.post("/login", async (req, res) => {
    const { mobileNumber, password } = req.body;
    console.log("Login attempt for mobile number:", mobileNumber);

    try {
        const user = await User.findOne({ mobileNumber });
        if (!user) {
            console.log("User not found for mobile number:", mobileNumber);
            return res.status(400).json({ message: "User not found" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log("Invalid password for user:", mobileNumber);
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

        console.log("Login successful for user:", {
            username: user.username,
            mobileNumber: user.mobileNumber
        });

        res.json({
            token,
            username: user.username,
            mobileNumber: user.mobileNumber
        });
    } catch (err) {
        console.error("Login error:", err);
        res.status(500).json({
            error: "Server error",
            details: err.message
        });
    }
});

module.exports = router;