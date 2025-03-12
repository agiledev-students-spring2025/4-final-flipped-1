import React, { useState } from "react";
import "./StatsPage.css";
import Header from "../../components/header/Header";  
import BottomNav from "../../components/BottomNav/BottomNav";  

const StatsPage = () => {
  const [timeframe, setTimeframe] = useState("Daily");

  return (
    <div className="stats-container">

      <Header title="Statistics" />

      {/* Main Content */}
      <div className="stats-content">
        {/* Concentration Card */}
        <div className="concentration-card">
          <div className="concentration-info">
            <h2>Concentration</h2>
            <p>02.28.2025</p>
            <h1>
              10 <span>Hours</span> 59 <span>Mins</span>
            </h1>
          </div>
          <select
            className="timeframe-selector"
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
          >
            <option>Daily</option>
            <option>Weekly</option>
            <option>Monthly</option>
            <option>Yearly</option>
          </select>
        </div>

        {/* Daily Time Distribution */}
        <div className="distribution-card">
          <h3>Daily Time Distribution</h3>
          <div className="chart-container">
            <div className="bars">
              <div className="bar"></div>
              <div className="bar"></div>
              <div className="bar"></div>
              <div className="bar"></div>
            </div>
            <div className="chart">chart</div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
};

export default StatsPage;
