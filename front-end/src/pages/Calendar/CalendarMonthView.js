import React from "react";
import "./Calendar.css";

// Function to generate days for a given month
const generateMonthDays = (year, month) => {
  const daysInMonth = new Date(year, month + 1, 0).getDate(); // Get total days
  return Array.from({ length: daysInMonth }, (_, i) => i + 1); // Generate array of days
};

const CalendarMonthView = ({ toDoList }) => {
  const currentYear = 2025;
  const currentMonth = 1; // February (Months are 0-based)

  // Generate days for the current month
  const days = generateMonthDays(currentYear, currentMonth);

  // Group tasks by date
  const tasksByDate = toDoList.reduce((acc, toDo) => {
    acc[toDo.date] = acc[toDo.date] || [];
    acc[toDo.date].push(toDo);
    return acc;
  }, {});

  return (
    <div className="month-view-container">
      <h2>To-do List for February 2025</h2>
      <div className="calendar-grid">
        {days.map((day) => {
          const dateKey = `${day} Feb`; // Match task date format
          return (
            <div key={day} className="calendar-day">
              <div className="day-number">{day}</div>
              <ul className="task-lists">
                {tasksByDate[dateKey]?.map((toDo, index) => (
                  <li key={index} className="task-items">
                    {toDo.toDo} ({toDo.time})
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CalendarMonthView;

