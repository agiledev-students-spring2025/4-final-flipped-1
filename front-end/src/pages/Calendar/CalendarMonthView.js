import React from "react";
import "./Calendar.css"; 

const CalendarMonthView = ({ toDoList, selectedDate, onDelete }) => {
  const selectedYear = selectedDate.getFullYear();
  const selectedMonth = selectedDate.getMonth();

  // Filter tasks for the selected month
  const formattedTasks = toDoList.filter((task) => {
    const taskDate = new Date(task.date);
    return (
      taskDate.getFullYear() === selectedYear &&
      taskDate.getMonth() === selectedMonth
    );
  });

  // Group tasks by date
  const tasksByDate = formattedTasks.reduce((acc, toDo) => {
    if (!acc[toDo.date]) acc[toDo.date] = [];
    acc[toDo.date].push(toDo);
    return acc;
  }, {});

  // Sort each day's tasks by startTime
  Object.keys(tasksByDate).forEach((date) => {
    tasksByDate[date].sort((a, b) =>
      a.startTime.localeCompare(b.startTime)
    );
  });

  return (
    <div className="month-view-container">
      <h3>
        To-Do List{" "}
      </h3>
      <h2>
        {selectedDate.toLocaleString("default", { month: "long" })}{" "}
        {selectedYear}
      </h2>

      {/* Display tasks */}
      <div className="month-view">
        {Object.keys(tasksByDate).length === 0 ? (
          <p>No tasks for this month.</p>
        ) : (
          <div className="week-view">
            {Object.entries(tasksByDate).map(([date, toDos]) => (
              <div key={date} className="day-group">
                <h4>{date}</h4>
                <ul className="toDo-list">
                  {toDos.map((toDo) => (
                    <li key={toDo._id} className="toDo-item">
                      <strong>
                        {toDo.startTime} - {toDo.endTime}
                      </strong>{" "}
                      — {toDo.toDo}
                      <button className="delete-btn" onClick={() => onDelete(toDo._id)}>
                        Delete
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CalendarMonthView;
