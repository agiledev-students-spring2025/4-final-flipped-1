import React, { useState } from "react";
import "./Calendar.css";

const CalendarDayView = ({ selectedDate, toDoList, onDelete }) => {
  const [completedTasks, setCompletedTasks] = useState({});

  const handleCheckboxChange = (date, id) => {
    setCompletedTasks((prev) => ({
      ...prev,
      [`${date}-${id}`]: !prev[`${date}-${id}`],
    }));
  };

  // Filter and sort tasks for the selected day
  const tasksForDay = toDoList
    .filter((task) => task.date === selectedDate)
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  return (
    <div className="day-view-container">
      <h3>To-Do List</h3>
      <h2>{selectedDate}</h2>
      {tasksForDay.length > 0 ? (
        <ul className="toDo-list">
          {tasksForDay.map((task) => (
            <li
              key={task._id}
              className={`toDo-item ${
                completedTasks[`${task.date}-${task._id}`] ? "completed" : ""
              }`}
            >
              <span>
                {task.toDo} — {task.startTime} to {task.endTime}
              </span>
              <button className="delete-btn" onClick={() => onDelete(task._id)}>
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
