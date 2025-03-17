import React, { useState } from "react";
import "./StatsPage.css";
import Header2 from "../../components/header/Header2";
import BottomNav from "../../components/BottomNav/BottomNav";

const StatsPage = () => {
  const [timeframe, setTimeframe] = useState("Daily");
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Function to handle week selection
  const handleWeekChange = (e) => {
    const selectedWeek = e.target.value; // Format: "2025-W11"
    const year = parseInt(selectedWeek.substring(0, 4));
    const weekNumber = parseInt(selectedWeek.substring(6));

    // Get the first day of the year
    const firstDayOfYear = new Date(year, 0, 1);
    const firstWeekStart =
      firstDayOfYear.getDay() === 0
        ? firstDayOfYear
        : new Date(
            firstDayOfYear.setDate(
              firstDayOfYear.getDate() - firstDayOfYear.getDay()
            )
          );

    // Calculate start of selected week
    const startOfWeek = new Date(firstWeekStart);
    startOfWeek.setDate(startOfWeek.getDate() + (weekNumber - 1) * 7);

    setSelectedDate(startOfWeek);
  };

  // Function to select month
  const handleMonthChange = (e) => {
    const newDate = new Date(e.target.value + "-01"); // Ensures valid date format (YYYY-MM-01)
    if (!isNaN(newDate)) {
      setSelectedDate(newDate);
    }
  };

  // Functions for year selection with arrows
  const incrementYear = () => {
    const currentYear = selectedDate.getFullYear();
    if (currentYear < 2100) {
      const newDate = new Date(selectedDate);
      newDate.setFullYear(currentYear + 1);
      setSelectedDate(newDate);
    }
  };

  const decrementYear = () => {
    const currentYear = selectedDate.getFullYear();
    if (currentYear > 1900) {
      const newDate = new Date(selectedDate);
      newDate.setFullYear(currentYear - 1);
      setSelectedDate(newDate);
    }
  };

  return (
    <div className="stats-container">
      <Header2 title="Statistics" />

      {/* Main Content */}
      <div className="stats-content">
        {/* Concentration Card */}
        <div className="concentration-card">
          <h2>Concentration</h2>

          {/* This container holds the timeframe selector AND the date pickers */}
          <div className="concentration-info">
            {/* Timeframe Selector */}
            <select
              className="timeframe-selector"
              value={timeframe}
              onChange={(e) => {
                setTimeframe(e.target.value);
                setSelectedDate(new Date()); // Reset to today when switching timeframe
              }}
            >
              <option value="Daily">Daily</option>
              <option value="Weekly">Weekly</option>
              <option value="Monthly">Monthly</option>
              <option value="Yearly">Yearly</option>
            </select>

            {/* Date/Week/Month/Year Pickers */}
            {timeframe === "Daily" && (
              <input
                type="date"
                className="date-picker"
                value={selectedDate.toISOString().split("T")[0]}
                onChange={(e) => {
                  const newDate = new Date(e.target.value);
                  if (!isNaN(newDate)) {
                    setSelectedDate(newDate);
                  }
                }}
              />
            )}

            {timeframe === "Weekly" && (
              <input
                type="week"
                className="week-picker"
                onChange={handleWeekChange}
              />
            )}

            {timeframe === "Monthly" && (
              <input
                type="month"
                className="month-picker"
                value={selectedDate.toISOString().slice(0, 7)} // Format: YYYY-MM
                onChange={handleMonthChange}
              />
            )}

            {timeframe === "Yearly" && (
              <div className="year-picker-container">
                <input
                  type="number"
                  className="year-picker"
                  value={selectedDate.getFullYear()}
                  readOnly
                />
                <div className="year-arrows">
                  <button onClick={incrementYear} className="arrow-btn">
                    ▲
                  </button>
                  <button onClick={decrementYear} className="arrow-btn">
                    ▼
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Display the total hours/minutes */}
          <h1>
            10 <span>Hours</span> 59 <span>Mins</span>
          </h1>
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

      <BottomNav />
    </div>
  );
};

export default StatsPage;
