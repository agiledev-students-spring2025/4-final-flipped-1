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
  const [authorized, setAuthorized] = useState(false);
  const [view, setView] = useState("daily"); 
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [toDoList, setToDoList] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      window.location.href = "/signin";
      return;
    }

    setAuthorized(true); // 允许渲染页面

    const fetchToDos = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/todos', {
          headers: {
            Authorization: `jwt ${token}`
          }
        });
        setToDoList(response.data);
      } catch (error) {
        console.error('Error fetching todos:', error);
        if (error.response?.status === 401 || error.response?.status === 403) {
          window.location.href = "/signin";
        }
      }
    };

    fetchToDos();
  }, []);

  const handleAddToDos = async (newToDo) => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.post('http://localhost:3001/api/todos', newToDo, {
        headers: {
          Authorization: `jwt ${token}`
        }
      });
      setToDoList(prevList => [...prevList, response.data]);
    } catch (error) {
      console.error('Error adding todo:', error);
      if (error.response?.status === 401 || error.response?.status === 403) {
        window.location.href = "/signin";
      }
    }
  };

  const handleDeleteToDo = async (id) => {
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`http://localhost:3001/api/todos/${id}`, {
        headers: {
          Authorization: `jwt ${token}`
        }
      });
      setToDoList(prevList => prevList.filter(todo => todo._id !== id));
    } catch (error) {
      console.error('Error deleting todo:', error);
      if (error.response?.status === 401 || error.response?.status === 403) {
        window.location.href = "/signin";
      }
    }
  };

  // 没授权就不渲染内容
  if (!authorized) return null;

  return (
    <div className="calendar-container">
      <Header3 title="Calendar" onAddTask={handleAddToDos} />

      {/* View Selector */}
      <div className="view-selector">
        <button className={view === "daily" ? "active" : ""} onClick={() => setView("daily")}>Daily</button>
        <button className={view === "weekly" ? "active" : ""} onClick={() => setView("weekly")}>Weekly</button>
        <button className={view === "monthly" ? "active" : ""} onClick={() => setView("monthly")}>Monthly</button>
      </div>

      {/* Date Picker for Daily View */}
      {view === "daily" && (
        <div className="calendar-wrapper">
          <ReactCalendar 
            onChange={setSelectedDate} 
            value={selectedDate} 
            locale="en-US"
          />
        </div>
      )}

      {/* Render View */}
      <div className="calendar-view">
        {view === "daily" && (
          <CalendarDayView
            selectedDate={selectedDate.toISOString().split("T")[0]}
            toDoList={toDoList}
            onDelete={handleDeleteToDo}
          />
        )}
        {view === "weekly" && (
          <CalendarWeekView
            toDoList={toDoList}
            onDelete={handleDeleteToDo}
          />
        )}
        {view === "monthly" && (
          <CalendarMonthView
            toDoList={toDoList}
            onDelete={handleDeleteToDo}
          />
        )}
      </div>

      <BottomNav />
    </div>
  );
};

export default Calendar;
