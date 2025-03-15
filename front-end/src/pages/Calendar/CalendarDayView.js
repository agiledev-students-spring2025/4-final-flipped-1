import React from "react";
import "./Calendar.css";

const CalendarDayView = ({ selectedDate, toDoList }) => {
  // Filter and sort to-dos by time for the selected date
  const filteredToDoList = toDoList
    .filter(toDo => toDo.date === selectedDate)
    .sort((a, b) => {
      const [hourA, minA] = a.time.split(":").map(Number);
      const [hourB, minB] = b.time.split(":").map(Number);
      return hourA * 60 + minA - (hourB * 60 + minB);
    });

  return (
    <div className="day-view-container">
      <h2>To-Do List for {selectedDate}</h2>
      {filteredToDoList.length === 0 ? (
        <p>No to-dos for this day.</p>
      ) : (
        <ul className="toDo-list">
          {filteredToDoList.map((toDo, index) => (
            <li key={index} className="toDo-item">
              <strong>{toDo.time}</strong> - {toDo.toDo} ({toDo.TimeRange})
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CalendarDayView;
