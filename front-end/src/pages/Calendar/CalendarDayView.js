import React from "react";
import "./Calendar.css";

const CalendarDayView = () => {
  return (
    <div className="day-view">
      <h2>28 Feb 2025</h2>
      <div className="day-timeline">
        <div className="time-slot">
          <span>8:00 AM</span> <div className="event">Focus</div>
        </div>
        <div className="time-slot">
          <span>9:00 AM</span> <div className="event">Interview with A</div>
        </div>
        <div className="time-slot">
          <span>12:00 PM</span> <div className="event">Course B</div>
        </div>
      </div>
    </div>
  );
};

export default CalendarDayView;
