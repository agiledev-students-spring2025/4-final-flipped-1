import React, { useState } from "react";
import ReactCalendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./Calendar.css"; 

const CalendarMonthView = ({ toDoList }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Get selected month and year
  const selectedYear = selectedDate.getFullYear();
  const selectedMonth = selectedDate.getMonth(); // 0-based (0 = Jan)

  // Format tasks to match YYYY-MM-DD for filtering
  const formattedTasks = toDoList.filter((task) => {
    const taskDate = new Date(task.date);
    return taskDate.getFullYear() === selectedYear && taskDate.getMonth() === selectedMonth;
  });

  // Group tasks by date
  const tasksByDate = formattedTasks.reduce((acc, toDo) => {
    acc[toDo.date] = acc[toDo.date] || [];
    acc[toDo.date].push(toDo);
    return acc;
  }, {});

  return (
    <div className="week-view-container">
      <h2>To-do List for {selectedDate.toLocaleString("default", { month: "long" })} {selectedYear}</h2>
  
      {/* Month Picker using React Calendar */}
      <div className="calendar-wrapper">
        <ReactCalendar
          onChange={setSelectedDate}
          value={selectedDate}
          locale="en-US"
          view="month"
          onClickMonth={(value) => setSelectedDate(value)} // Allow month selection
        />
      </div>
  
      {/* Display Tasks for Selected Month */}
      <div className="month-view">
        {Object.keys(tasksByDate).length === 0 ? (
          <p>No tasks for this month.</p>
        ) : (
          <div className="week-view">
            {Object.entries(tasksByDate).map(([date, toDos]) => (
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
    </div> 
  );
}
  export default CalendarMonthView;