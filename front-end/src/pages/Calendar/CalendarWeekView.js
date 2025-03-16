import React from "react";

const CalendarWeekView = ({ toDoList }) => {
  // Helper function to convert a date string into a Date object for sorting
  const parseDate = (dateStr) => new Date(`${dateStr} 2025`);

  // Sort tasks by date first, then sorts by time
  const sortedToDoList = [...toDoList].sort((a, b) => {
    const dateA = parseDate(a.date);
    const dateB = parseDate(b.date);

    if (dateA.getTime() !== dateB.getTime()) {
      return dateA - dateB; // Sort by date first
    }

    // Same date, sort by time
    const [hourA, minA] = a.time.split(":").map(Number);
    const [hourB, minB] = b.time.split(":").map(Number);
    return hourA * 60 + minA - (hourB * 60 + minB);
  });

  // Group tasks by date
  const groupedToDo = sortedToDoList.reduce((acc, toDo) => {
    acc[toDo.date] = acc[toDo.date] || [];
    acc[toDo.date].push(toDo);
    return acc;
  }, {});

  return (
    <div className="week-view-container">
      <h2>To-Do List for 20 Feb - 26 Feb</h2>

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
