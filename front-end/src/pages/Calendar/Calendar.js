import React, { useState } from "react";
import CalendarDayView from "./CalendarDayView";
import CalendarWeekView from "./CalendarWeekView";
import CalendarMonthView from "./CalendarMonthView";
import Header3 from "../../components/header/Header3";  
import BottomNav from "../../components/BottomNav/BottomNav";  
import "./Calendar.css"; // Import shared styles

const Calendar = () => {
  const [view, setView] = useState("daily"); // Manage current view
  const [selectedDate, setSelectedDate] = useState("20 Feb"); //Default select day

  const toDoList = [
    { date: "20 Feb", toDo: "Interview with A", time: "14:00", TimeRange: "15min" },
    { date: "26 Feb", toDo: "Lunch with B", time: "12:30", TimeRange: "45min" },
    { date: "20 Feb", toDo: "Evening Study", time: "18:00", TimeRange: "2h" },
    { date: "23 Feb", toDo: "Course A HW", time: "20:00", TimeRange: "1h" },
    { date: "23 Feb", toDo: "Gym Session", time: "07:30", TimeRange: "1h" },
    { date: "26 Feb", toDo: "Course B", time: "16:00", TimeRange: "2h 15min" },
  ];

  return (
    <div className="calendar-container"> {/* Added wrapper div */}
      <Header3 title="Calendar" />

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

      {/* Date Selector (Only for Daily View) */}
      {view === "daily" && (
        <div className="date-selector">
          <label>Select Date: </label>
          <select onChange={(e) => setSelectedDate(e.target.value)} value={selectedDate}>
            {[...new Set(toDoList.map(toDo => toDo.date))].map(date => (
              <option key={date} value={date}>{date}</option>
            ))}
          </select>
        </div>
      )}

      {/* Render the selected view */}
      <div className="calendar-view">
        {view === "daily" && <CalendarDayView selectedDate={selectedDate} toDoList={toDoList}/>}
        {view === "weekly" && <CalendarWeekView toDoList={toDoList}/>}
        {view === "monthly" && <CalendarMonthView toDoList={toDoList}/>}
      </div>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
};

export default Calendar;
