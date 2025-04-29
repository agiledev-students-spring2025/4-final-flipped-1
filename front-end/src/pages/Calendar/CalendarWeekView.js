import React from "react";
import "./Calendar.css";

const CalendarWeekView = ({ toDoList, selectedDate, setSelectedDate }) => {
  const getStartOfWeek = (date) => {
    const d = new Date(date);
    const day = d.getDay();
    return new Date(d.setDate(d.getDate() - day + (day === 0 ? -6 : 1))); // Monday
  };

  const getEndOfWeek = (date) => {
    const start = getStartOfWeek(date);
    return new Date(start.getTime() + 6 * 24 * 60 * 60 * 1000); // Sunday
  };

  const startOfWeek = getStartOfWeek(selectedDate).toISOString().split("T")[0];
  const endOfWeek = getEndOfWeek(selectedDate).toISOString().split("T")[0];

  // Filter todos within the week range
  const tasksForWeek = toDoList.filter((task) => {
    return task.date >= startOfWeek && task.date <= endOfWeek;
  });

  // Group and sort tasks by date
  const groupedToDo = tasksForWeek.reduce((acc, toDo) => {
    if (!acc[toDo.date]) acc[toDo.date] = [];
    acc[toDo.date].push(toDo);
    return acc;
  }, {});

  Object.keys(groupedToDo).forEach((date) => {
    groupedToDo[date].sort((a, b) => a.startTime.localeCompare(b.startTime));
  });

  return (
    <div className="week-view-container">
      <h2>To-Do List for {startOfWeek} to {endOfWeek}</h2>

      {/* Display grouped tasks */}
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
