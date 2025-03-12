import React from "react";
import "./Calendar.css";

const CalendarMonthView = () => {
  return (
    <div className="month-view">
      <h2>Feb 2025</h2>
      <div className="month-grid">
        {Array.from({ length: 28 }, (_, i) => (
          <div key={i} className="month-day">
            {i + 1}
            {i === 6 && <div className="event">3h</div>}
            {i === 22 && <div className="event">15min</div>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CalendarMonthView;
