import React from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import './BottomNav.css';

function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="bottom-nav">
      <button 
        className={`nav-item ${isActive("/") ? 'active' : ''}`} 
        onClick={() => navigate("/")}
      >
        <img src="/home.svg" alt="Home" className="nav-icon" />
        <span>Home</span>
      </button>
      <button 
        className={`nav-item ${isActive("/Statistics") ? 'active' : ''}`} 
        onClick={() => navigate("/Statistics")}
      >
        <img src="/statistics.svg" alt="Statistics" className="nav-icon" />
        <span>Statistics</span>
      </button>
      <button 
        className={`nav-item ${isActive("/Calendar") ? 'active' : ''}`} 
        onClick={() => navigate("/Calendar")}
      >
        <img src="/calendar.svg" alt="Calendar" className="nav-icon" />
        <span>Calendar</span>
      </button>
      <button 
        className={`nav-item ${isActive("/Profile") ? 'active' : ''}`} 
        onClick={() => navigate("/Profile")}
      >
        <img src="/profile.svg" alt="Profile" className="nav-icon" />
        <span>Profile</span>
      </button>
    </div>
  );
}

export default BottomNav; 