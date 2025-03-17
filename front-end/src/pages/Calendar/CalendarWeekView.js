import React, { useState } from "react";
import ReactCalendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./Calendar.css";

const CalendarWeekView = ({ toDoList }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Get start and end of the selected week
  const getStartOfWeek = (date) => {
    const d = new Date(date);
    const day = d.getDay();
    return new Date(d.setDate(d.getDate() - day + (day === 0 ? -6 : 1))); // Start from Monday
  };

  const getEndOfWeek = (date) => {
    const start = getStartOfWeek(date);
    return new Date(start.setDate(start.getDate() + 6)); // Sunday
  };

  const startOfWeek = getStartOfWeek(selectedDate).toISOString().split("T")[0];
  const endOfWeek = getEndOfWeek(selectedDate).toISOString().split("T")[0];

  // Filter tasks for the selected week
  const tasksForWeek = toDoList.filter((task) => {
    return task.date >= startOfWeek && task.date <= endOfWeek;
  });

  // Group tasks by date
  const groupedToDo = tasksForWeek.reduce((acc, toDo) => {
    acc[toDo.date] = acc[toDo.date] || [];
    acc[toDo.date].push(toDo);
    return acc;
  }, {});

  return (
    <div className="week-view-container">
      <h2>To-Do List for {startOfWeek} to {endOfWeek}</h2>

      {/* Week Selector using react-calendar */}
      <div className="calendar-wrapper">
        <ReactCalendar 
          onChange={setSelectedDate} 
          value={selectedDate} 
          locale="en-US" //Show english by defult
          showWeekNumbers={true} // Show week numbers for better selection
          selectRange={false} // Select only one day to determine the week
        />
      </div>

      {Object.keys(groupedToDo).length === 0 ? (
        <p>No tasks for this week.</p>
      ) : (
        <div className="week-view">
          {Object.entries(groupedToDo).map(([date, toDos]) => (
            <div key={date} className="day-group">
              <h3>{date}</h3>
              <ul className="toDo-list">
                {toDos.map((toDo, index) => (
                  <li key={index} className="toDo-item">
                    <strong>{toDo.time}</strong> - {toDo.toDo} ({toDo.TimeRange})
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CalendarWeekView;