// models/User.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true
    },
    mobileNumber: {
        type: String,
        required: true,
        unique: true,
        match: /^[0-9]{10}$/
    },
    password: {
        type: String,
        required: true
    },
    // Additional fields for farmers
    dateOfPlanting: { type: Date },
    area: { type: String },
    region: { type: String },
    role: {
        type: String,
        enum: ['farmer', 'admin'],
        default: 'farmer'
    },
    crops: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Crop'
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Create the model
const User = mongoose.model("User", userSchema);

// Drop the collection to remove old indexes
User.collection.dropIndexes().catch(err => {
    if (err.code !== 26) { // Ignore "namespace not found" error
        console.error("Error dropping indexes:", err);
    }
});

module.exports = User;