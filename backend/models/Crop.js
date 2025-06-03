// models/Crop.js
const mongoose = require("mongoose");

const cropSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    dateOfPlanting: {
        type: Date,
        required: true
    },
    area: {
        type: String,
        required: true
    },
    region: {
        type: String,
        required: true
    },
    farmer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    farmerName: {
        type: String,
        required: true
    },
    farmerMobile: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['active', 'harvested', 'failed'],
        default: 'active'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Crop", cropSchema);
