import React from "react";
import "./Calendar.css";

const CalendarWeekView = () => {
  return (
    <div className="week-view">
      <h2>Feb 2025 - Week 4</h2>
      <div className="week-day">
        <span>23 Feb</span>
        <input type="checkbox" /> Interview with A <span>15min</span>
      </div>
      <div className="week-day">
        <span>28 Feb</span>
        <input type="checkbox" /> Course B <span>2h 5min</span>
      </div>
    </div>
  );
};

export default CalendarWeekView;
