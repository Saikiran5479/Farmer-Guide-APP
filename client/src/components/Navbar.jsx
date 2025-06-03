// File: src/components/Navbar.jsx

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("mobileNumber");
        navigate("/login");
    };

    return (
        <nav className="navbar">
            <div className="logo">
                <img src="/logo.png" alt="Farmer Guide Logo" className="logo-image" />
            </div>

            <div className="nav-links">
                <Link to="/">Home</Link>
                <Link to="/guide">Guide</Link>
                <Link to="/alerts">Alerts</Link>
                <Link to="/dashboard">Dashboard</Link>
                <Link to="/predict">Predict Stage</Link>

                {token ? (
                    <>
                        <Link to="/register">
                            <button className="nav-button">Register Crop</button>
                        </Link>
                        <Link to="/profile">
                            <button className="nav-button">👤 Profile</button>
                        </Link>
                        <button className="nav-button" onClick={handleLogout}>Logout</button>
                    </>
                ) : (
                    <>
                        <Link to="/signup">
                            <button className="nav-button">Sign Up</button>
                        </Link>
                        <Link to="/login">
                            <button className="nav-button">Login</button>
                        </Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
