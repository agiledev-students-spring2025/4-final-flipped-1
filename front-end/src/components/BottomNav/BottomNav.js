import React from 'react';
import './BottomNav.css';

function BottomNav() {
  return (
    <div className="bottom-nav">
      <button className="nav-item">
        <img src="/home.svg" alt="Home" className="nav-icon" />
        <span>Home</span>
      </button>
      <button className="nav-item">
        <img src="/statistics.svg" alt="Statistics" className="nav-icon" />
        <span>Statistics</span>
      </button>
      <button className="nav-item">
        <img src="/calendar.svg" alt="Calendar" className="nav-icon" />
        <span>Calendar</span>
      </button>
      <button className="nav-item">
        <img src="/profile.svg" alt="Profile" className="nav-icon" />
        <span>Profile</span>
      </button>
    </div>
  );
}

export default BottomNav; 