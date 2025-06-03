// File: src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import GuidePage from "./pages/GuidePage";
import AlertsPage from "./pages/AlertsPage";
import CropDashboard from "./pages/CropDashboard";
import ProfilePage from "./pages/ProfilePage";
import RegisterCropPage from "./pages/RegisterCropPage";
import Login from "./pages/Login";
import RegisterUser from './pages/RegisterUser';
import CropStagePredictor from "./components/CropStagePredictor";

const App = () => {
  return (
    <Router>
      <div>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/guide" element={<GuidePage />} />
          <Route path="/alerts" element={<AlertsPage />} />
          <Route path="/dashboard" element={<CropDashboard />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/register" element={<RegisterCropPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<RegisterUser />} />
          <Route path="/predict" element={<CropStagePredictor />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
