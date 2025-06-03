// controllers/cropControllers.js
const Crop = require("../models/Crop");

// Register new crop
exports.registerCrop = async (req, res) => {
  try {
    const newCrop = new Crop(req.body);
    await newCrop.save();
    res.status(201).json(newCrop);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get all crops
exports.getAllCrops = async (req, res) => {
  try {
    const crops = await Crop.find();
    res.json(crops);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
exports.registerCrop = async (req, res) => {
  try {
    const { name, dateOfPlanting, area, region, mobileNumber } = req.body;

    const newCrop = new Crop({
      name,
      dateOfPlanting,
      area,
      region,
      mobileNumber
    });

    await newCrop.save();
    res.status(201).json(newCrop);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
