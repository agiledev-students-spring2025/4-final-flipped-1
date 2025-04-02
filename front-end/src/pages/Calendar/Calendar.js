import React, { useState, useEffect } from "react";
import axios from 'axios';
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
  const [toDoList, setToDoList] = useState([])

  useEffect(() => {
    const fetchToDos = async () => {
      try{
        const response = await axios.get('http://localhost:3001/api/todos');
        setToDoList(response.data);
      } catch (error) {
        console.error('Error fetching todos:', error);
      }
    };

    fetchToDos();
  },[]);

  const handleAddToDos = async (newToDo) => {
    try{
      const response = await axios.post('http://localhost:3001/api/todos', newToDo);
      setToDoList([...toDoList, response.data]);
    } catch (error) {
      console.error('Error adding todo:', error);
    }
  };

  return (
    <div className="calendar-container">
      {/* Pass handleAddTask as a prop */}
      <Header3 title="Calendar" onAddTask={handleAddToDos} />

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
