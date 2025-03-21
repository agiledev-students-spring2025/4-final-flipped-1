import React, { useState } from "react";
import ReactCalendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import CalendarDayView from "./CalendarDayView";
import CalendarWeekView from "./CalendarWeekView";
import CalendarMonthView from "./CalendarMonthView";
import Header3 from "../../components/header/Header3";  
import BottomNav from "../../components/BottomNav/BottomNav";  
import "./Calendar.css"; 

const Calendar = () => {
  const [view, setView] = useState("daily"); 
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [toDoList, setToDoList] = useState([
    { date: "2025-02-20", toDo: "Interview with A", time: "14:00", TimeRange: "15min" },
    { date: "2025-02-26", toDo: "Lunch with B", time: "12:30", TimeRange: "45min" },
    { date: "2025-02-20", toDo: "Evening Study", time: "18:00", TimeRange: "2h" },
    { date: "2025-02-23", toDo: "Course A HW", time: "20:00", TimeRange: "1h" },
    { date: "2025-02-23", toDo: "Gym Session", time: "07:30", TimeRange: "1h" },
    { date: "2025-02-26", toDo: "Course B", time: "16:00", TimeRange: "2h 15min" },
    { date: "2025-02-26", toDo: "Course C", time: "19:00", TimeRange: "2h 15min" },
    { date: "2025-02-26", toDo: "Course D", time: "22:00", TimeRange: "2h 15min" },
    { date: "2025-03-25", toDo: "Course B", time: "16:00", TimeRange: "2h 15min" },
    { date: "2025-03-17", toDo: "Course B", time: "16:00", TimeRange: "2h 15min" },
  ]);

  // Function to add a new task
  const handleAddTask = (newTask) => {
    console.log("Adding new task:", newTask);
    setToDoList([...toDoList, newTask]); // Update the task list
  };

  return (
    <div className="calendar-container">
      {/* Pass handleAddTask as a prop */}
      <Header3 title="Calendar" onAddTask={handleAddTask} />

      {/* View Selector */}
      <div className="view-selector">
        <button className={view === "daily" ? "active" : ""} onClick={() => setView("daily")}>Daily</button>
        <button className={view === "weekly" ? "active" : ""} onClick={() => setView("weekly")}>Weekly</button>
        <button className={view === "monthly" ? "active" : ""} onClick={() => setView("monthly")}>Monthly</button>
      </div>

      {/* Date Selector */}
      {view === "daily" && (
        <div className="calendar-wrapper">
          <ReactCalendar 
            onChange={setSelectedDate} 
            value={selectedDate} 
            locale="en-US"
            style={{ width: "300px", fontSize: "14px", padding: "10px" }} 
          />
        </div>
      )}

      {/* Render the selected view */}
      <div className="calendar-view">
        {view === "daily" && <CalendarDayView selectedDate={selectedDate.toISOString().split("T")[0]} toDoList={toDoList}/>}
        {view === "weekly" && <CalendarWeekView toDoList={toDoList}/>}
        {view === "monthly" && <CalendarMonthView toDoList={toDoList}/>}
      </div>

      {/* Bottom Nav */}
      <BottomNav />
    </div>
  );
};

export default Calendar;
