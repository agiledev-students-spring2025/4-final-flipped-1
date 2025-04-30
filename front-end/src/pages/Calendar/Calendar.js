import React, { useState, useEffect } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import "react-calendar/dist/Calendar.css";
import CalendarDayView from "./CalendarDayView";
import CalendarWeekView from "./CalendarWeekView";
import CalendarMonthView from "./CalendarMonthView";

import CalendarUI from "../../components/CalendarUI/CalendarUI";
import Header3 from "../../components/header/Header3";  
import BottomNav from "../../components/BottomNav/BottomNav";  
import { API_ENDPOINTS } from "../../config/api"; //import API_ENDPOINTS
import "./Calendar.css"; 

const Calendar = () => {
  const [authorized, setAuthorized] = useState(false);
  // const [view, setView] = useState("daily"); 
  const [timeframe, setTimeframe] = useState("Daily");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [toDoList, setToDoList] = useState([]);
  const navigate = useNavigate();

  // 1) the 7-day nav dates
  const getDateNumbers = () => {
    const dates = [];
    const current = new Date(selectedDate);
    current.setDate(current.getDate() - 3);
    for (let i = 0; i < 7; i++) {
      dates.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    return dates;
  };

  // 2) prev button shifts by one unit
  const handlePrevious = () => {
    if (timeframe === "Daily") {
      setSelectedDate(d => {
        const nd = new Date(d);
        nd.setDate(nd.getDate() - 1);
        return nd;
      });
    } else if (timeframe === "Weekly") {
      setSelectedDate(d => {
        const nd = new Date(d);
        nd.setDate(nd.getDate() - 7);
        return nd;
      });
    } else {
      setSelectedDate(d => {
        const nd = new Date(d);
        nd.setMonth(nd.getMonth() - 1);
        return nd;
      });
    }
  };

  // 3) next button shifts by one unit
  const handleNext = () => {
    if (timeframe === "Daily") {
      setSelectedDate(d => {
        const nd = new Date(d);
        nd.setDate(nd.getDate() + 1);
        return nd;
      });
    } else if (timeframe === "Weekly") {
      setSelectedDate(d => {
        const nd = new Date(d);
        nd.setDate(nd.getDate() + 7);
        return nd;
      });
    } else {
      setSelectedDate(d => {
        const nd = new Date(d);
        nd.setMonth(nd.getMonth() + 1);
        return nd;
      });
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      localStorage.setItem("loginMessage", "Please log in to access the Calendar page.");
      localStorage.setItem("redirectAfterLogin", "/calendar");
      navigate("/signin");
      return;
    }

    setAuthorized(true);

    const fetchToDos = async () => {
      try {
        const response = await axios.get(API_ENDPOINTS.TODOS.LIST, {
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
      const response = await axios.post(API_ENDPOINTS.TODOS.ADD, newToDo, {
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
      await axios.delete(API_ENDPOINTS.TODOS.DELETE(id), {
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

      <div className="stats-content">
        <div className="concentration-card">
          <CalendarUI
            timeframe={timeframe}
            setTimeframe={setTimeframe}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            getDateNumbers={getDateNumbers}
            handlePrevious={handlePrevious}
            handleNext={handleNext}
          />
        </div>

        <div className="distribution-card">
          {timeframe === "Daily" && (
            <CalendarDayView
              selectedDate={selectedDate.toISOString().split("T")[0]}
              toDoList={toDoList}
              onDelete={handleDeleteToDo}
            />
          )}
          {timeframe === "Weekly" && (
            <CalendarWeekView
              toDoList={toDoList}
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
              onDelete={handleDeleteToDo}
            />
          )}
          {timeframe === "Monthly" && (
            <CalendarMonthView
              toDoList={toDoList}
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
              onDelete={handleDeleteToDo}
            />
          )}
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default Calendar;
