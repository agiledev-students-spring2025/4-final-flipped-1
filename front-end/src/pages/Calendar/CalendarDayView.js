import React, { useState } from "react";
import "./Calendar.css";

const CalendarDayView = ({ selectedDate, toDoList }) => {
  // Store completed tasks(for use of checkbox)
  const [completedTasks, setCompletedTasks] = useState({});

  // Toggle task completion
  const handleCheckboxChange = (date, index) => {
    setCompletedTasks((prev) => ({
      ...prev,
      [`${date}-${index}`]: !prev[`${date}-${index}`], // Toggle completion
    }));
  };

  // Filter tasks for the selected day
  const tasksForDay = toDoList.filter((task) => task.date === selectedDate);

  return (
    <div className="day-view-container">
      <h3>Tasks for {selectedDate}</h3>
      {tasksForDay.length > 0 ? (
        <ul className="toDo-list">
          {tasksForDay.map((task, index) => (
            <li key={index} className={`toDo-item ${completedTasks[`${task.date}-${index}`] ? "completed" : ""}`}>
              <input
                type="checkbox"
                checked={completedTasks[`${task.date}-${index}`] || false}
                onChange={() => handleCheckboxChange(task.date, index)}
              />
              <span>{task.toDo} at {task.time} ({task.TimeRange})</span>
            </li>
          ))}
        </ul>
      ) : (
        <p>No tasks for this day.</p>
      )}
    </div>
  );
};

export default CalendarDayView;
