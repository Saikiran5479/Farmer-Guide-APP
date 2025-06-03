# Farmer Guide

A comprehensive web application designed to assist farmers with crop management, stage prediction, and recommendations using machine learning.

## 🌟 Features

- **Crop Stage Prediction**: Predicts the growth stage of crops based on days since planting
- **Crop Recommendations**: Provides intelligent crop recommendations based on various factors
- **Data Analysis**: Includes tools for analyzing crop datasets and generating insights
- **Modern Web Interface**: Built with React and Vite for a smooth user experience
- **RESTful API**: Backend services built with Node.js and Express
- **Machine Learning Integration**: Python-based ML models for accurate predictions

## 🏗️ Project Structure

```
Farmer Guide/
├── client/                 # Frontend React application
│   ├── src/               # Source code
│   ├── public/            # Static assets
│   └── package.json       # Frontend dependencies
│
├── backend/               # Node.js backend server
│   ├── ml_model/         # Python ML models and scripts
│   ├── routes/           # API routes
│   ├── controllers/      # Route controllers
│   ├── models/           # Database models
│   ├── middleware/       # Custom middleware
│   ├── utils/            # Utility functions
│   └── config/           # Configuration files
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- Python 3.8 or higher
- MongoDB
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone [repository-url]
   cd Farmer-Guide
   ```

2. **Install Frontend Dependencies**
   ```bash
   cd client
   npm install
   ```

3. **Install Backend Dependencies**
   ```bash
   cd ../backend
   npm install
   ```

4. **Install Python Dependencies**
   ```bash
   cd ml_model
   pip install -r requirements.txt
   ```

### Running the Application

1. **Start the Backend Server**
   ```bash
   cd backend
   npm run dev
   ```

2. **Start the Frontend Development Server**
   ```bash
   cd client
   npm run dev
   ```

## 🛠️ Technology Stack

### Frontend
- React
- Vite
- React Router DOM
- Axios

### Backend
- Node.js
- Express.js
- MongoDB
- JWT Authentication
- Twilio (for notifications)

### Machine Learning
- Python
- NumPy
- scikit-learn
- pandas
- joblib

## 📊 ML Models

The project includes several machine learning models:
- Crop Stage Predictor
- Crop Recommender
- Dataset Analysis Tools

## 🔒 Environment Variables

Create a `.env` file in the backend directory with the following variables:
```
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
```

## 📝 API Documentation

The API documentation is available at `/api-docs` when running the backend server.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 👥 Authors

- Your Name - Initial work

## 🙏 Acknowledgments

- Thanks to all contributors who have helped shape this project
- Special thanks to the open-source community for the amazing tools and libraries 