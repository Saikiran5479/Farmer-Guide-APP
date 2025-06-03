// config/db.js
const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is not defined in environment variables");
    }

    const options = {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      dbName: 'farmer_guide'
    };

    console.log("Attempting to connect to MongoDB...");
    await mongoose.connect(process.env.MONGO_URI, options);
    console.log("MongoDB connected successfully to database: farmer_guide");
  } catch (error) {
    console.error("MongoDB connection error details:", {
      name: error.name,
      message: error.message,
      code: error.code
    });

    if (error.name === 'MongoServerSelectionError') {
      console.error("Could not connect to MongoDB. Please check your connection string and network.");
    } else if (error.name === 'MongoParseError') {
      console.error("Invalid MongoDB connection string. Please check your MONGO_URI in .env file.");
    }

    process.exit(1);
  }
};

// Handle connection events
mongoose.connection.on('error', err => {
  console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
});

process.on('SIGINT', async () => {
  await mongoose.connection.close();
  process.exit(0);
});

module.exports = connectDB;
