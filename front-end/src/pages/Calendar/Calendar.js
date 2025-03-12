import React, { useState } from "react";
import CalendarDayView from "./CalendarDayView";
import CalendarWeekView from "./CalendarWeekView";
import CalendarMonthView from "./CalendarMonthView";
import Header from "../../components/header/Header";  
import BottomNav from "../../components/BottomNav/BottomNav";  
import "./Calendar.css"; // Import shared styles

const Calendar = () => {
  const [view, setView] = useState("daily"); // Manage current view

  return (
    <div className="calendar-container"> {/* Added wrapper div */}
      <Header title="Calendar" />

      {/* View Selector */}
      <div className="view-selector">
        <button
          className={view === "daily" ? "active" : ""}
          onClick={() => setView("daily")}
        >
          Daily
        </button>
        <button
          className={view === "weekly" ? "active" : ""}
          onClick={() => setView("weekly")}
        >
          Weekly
        </button>
        <button
          className={view === "monthly" ? "active" : ""}
          onClick={() => setView("monthly")}
        >
          Monthly
        </button>
      </div>

      {/* Render the selected view */}
      <div className="calendar-view">
        {view === "daily" && <CalendarDayView />}
        {view === "weekly" && <CalendarWeekView />}
        {view === "monthly" && <CalendarMonthView />}
      </div>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
};

export default Calendar;
