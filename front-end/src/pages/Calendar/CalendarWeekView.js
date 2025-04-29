import React from "react";
import "./Calendar.css";

const CalendarWeekView = ({ toDoList, selectedDate, setSelectedDate }) => {
  const getStartOfWeek = (date) => {
    const d = new Date(date);
    const day = d.getDay();
    d.setDate(d.getDate() - day + (day === 0 ? -6 : 1)); // modify d
    return d;
  };

  const getEndOfWeek = (date) => {
    const start = getStartOfWeek(date);
    const d = new Date(start);
    d.setDate(d.getDate() + 6);
    return d;
  };

  const startOfWeek = getStartOfWeek(selectedDate).toISOString().split("T")[0];
  const endOfWeek = getEndOfWeek(selectedDate).toISOString().split("T")[0];

  const tasksForWeek = toDoList.filter((task) => {
    return task.date >= startOfWeek && task.date <= endOfWeek;
  });

  const groupedToDo = tasksForWeek.reduce((acc, toDo) => {
    if (!acc[toDo.date]) acc[toDo.date] = [];
    acc[toDo.date].push(toDo);
    return acc;
  }, {});

  Object.keys(groupedToDo).forEach((date) => {
    groupedToDo[date].sort((a, b) => a.startTime.localeCompare(b.startTime));
  });

  const handlePreviousWeek = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() - 7);
    setSelectedDate(newDate);
  };

  const handleNextWeek = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + 7);
    setSelectedDate(newDate);
  };

  return (
    <div className="week-view-container">
      <h3>To-Do List</h3>
      <h2>{startOfWeek} to {endOfWeek}</h2>

      <div className="navigation-buttons">
        <button onClick={handlePreviousWeek}>Previous Week</button>
        <button onClick={handleNextWeek}>Next Week</button>
      </div>

      {Object.keys(groupedToDo).length === 0 ? (
        <p>No tasks for this week.</p>
      ) : (
        <div className="week-view">
          {Object.entries(groupedToDo).map(([date, toDos]) => (
            <div key={date} className="day-group">
              <h3>{date}</h3>
              <ul className="toDo-list">
                {toDos.map((toDo) => (
                  <li key={toDo._id} className="toDo-item">
                    <strong>{toDo.startTime} - {toDo.endTime}</strong> — {toDo.toDo}
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
