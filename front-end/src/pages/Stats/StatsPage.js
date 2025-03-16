import React, { useState } from "react";
import "./StatsPage.css";
import Header from "../../components/header/Header";
import BottomNav from "../../components/BottomNav/BottomNav";

const StatsPage = () => {
  const [timeframe, setTimeframe] = useState("Daily");

  // Function to get the correct date format based on timeframe
  const getFormattedDate = () => {
    const today = new Date();

    if (timeframe === "Daily") {
      return today.toLocaleDateString("en-US", { month: "2-digit", day: "2-digit", year: "numeric" });
    }

    if (timeframe === "Weekly") {
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - today.getDay()); // Start of the week (Sunday)
      const endOfWeek = new Date(today);
      endOfWeek.setDate(startOfWeek.getDate() + 6); // End of the week (Saturday)

      return `${startOfWeek.toLocaleDateString("en-US", { month: "2-digit", day: "2-digit" })} - ${endOfWeek.toLocaleDateString("en-US", { month: "2-digit", day: "2-digit" })}`;
    }

    if (timeframe === "Monthly") {
      return today.toLocaleDateString("en-US", { month: "long" }); // Example: "March"
    }

    if (timeframe === "Yearly") {
      return today.getFullYear(); // Example: "2025"
    }

    return "";
  };

  return (
    <div className="stats-container">
      <Header title="Statistics" />

      {/* Main Content */}
      <div className="stats-content">
        {/* Concentration Card */}
        <div className="concentration-card">
          <div className="concentration-info">
            <h2>Concentration</h2>
            <p>{getFormattedDate()}</p > {/* ✅ Displays correct period */}
            <h1>
              10 <span>Hours</span> 59 <span>Mins</span>
            </h1>
          </div>
          <select
            className="timeframe-selector"
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
          >
            <option value="Daily">Daily</option>
            <option value="Weekly">Weekly</option>
            <option value="Monthly">Monthly</option>
            <option value="Yearly">Yearly</option>
          </select>
        </div>

        {/* Dynamic Rendering Based on Timeframe */}
        {timeframe === "Daily" && (
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
        )}

        {timeframe === "Weekly" && (
          <div className="distribution-card">
            <h3>Weekly Time Distribution</h3>
            <div className="chart-container">
              <div className="bars">
                <div className="bar weekly"></div>
                <div className="bar weekly"></div>
                <div className="bar weekly"></div>
                <div className="bar weekly"></div>
              </div>
              <div className="chart">weekly chart</div>
            </div>
          </div>
        )}

        {timeframe === "Monthly" && (
          <div className="distribution-card">
            <h3>Monthly Time Distribution</h3>
            <div className="chart-container">
              <div className="bars">
                <div className="bar monthly"></div>
                <div className="bar monthly"></div>
                <div className="bar monthly"></div>
                <div className="bar monthly"></div>
              </div>
              <div className="chart">monthly chart</div>
            </div>
          </div>
        )}

        {timeframe === "Yearly" && (
          <div className="distribution-card">
            <h3>Yearly Time Distribution</h3>
            <div className="chart-container">
              <div className="bars">
                <div className="bar yearly"></div>
                <div className="bar yearly"></div>
                <div className="bar yearly"></div>
                <div className="bar yearly"></div>
              </div>
              <div className="chart">yearly chart</div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
};

export default StatsPage;