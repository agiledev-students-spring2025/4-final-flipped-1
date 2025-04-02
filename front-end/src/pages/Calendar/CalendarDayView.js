import React, { useState } from "react";
import "./Calendar.css";

const CalendarDayView = ({ selectedDate, toDoList, onDelete }) => {
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
          {tasksForDay.map((task) => (
            <li key={task.id} className={`toDo-item ${completedTasks[`${task.date}-${task.id}`] ? "completed" : ""}`}>
              <input
                type="checkbox"
                checked={completedTasks[`${task.date}-${task.id}`] || false}
                onChange={() => handleCheckboxChange(task.date, task.id)}
              />
              <span>{task.toDo} at {task.time} ({task.TimeRange})</span>
              <button className="delete-btn" onClick={() => onDelete(task.id)}>
                Delete
              </button>
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
