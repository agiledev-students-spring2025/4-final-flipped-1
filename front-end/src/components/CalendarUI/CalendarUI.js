import React from 'react'
import './CalendarUI.css'

export default function CalendarUI({
  timeframe,            // "Daily" | "Weekly" | "Monthly"
  setTimeframe,         // (tf) => void
  selectedDate,         // Date
  setSelectedDate,      // (d:Date) => void
  getDateNumbers,       // () => Date[]
  handlePrevious,       // () => void
  handleNext,           // () => void
}) {
  const formatDateInput = date => {
    const y = date.getFullYear()
    const m = String(date.getMonth()+1).padStart(2,'0')
    const d = String(date.getDate()).padStart(2,'0')
    return `${y}-${m}-${d}`
  }

  const getWeekInputValue = date => {
    const year = date.getFullYear();
    const jan4 = new Date(year, 0, 4); // Jan 4 is always in week 1
    const startOfWeek1 = new Date(jan4);
    startOfWeek1.setDate(jan4.getDate() - ((jan4.getDay() + 6) % 7));
    const diff = Math.floor((date - startOfWeek1) / (7 * 24 * 60 * 60 * 1000));
    const week = String(diff + 1).padStart(2, '0');
    return `${year}-W${week}`;
  };

  return (
    <div className="concentration-info">
      {/* timeframe buttons */}
      <div className="timeframe-buttons">
        {['Daily','Weekly','Monthly'].map(tf => (
          <button
            key={tf}
            className={`timeframe-button ${timeframe===tf?'active':''}`}
            onClick={()=>setTimeframe(tf)}
          >{tf}</button>
        ))}
      </div>

      {/* prev / date nav / next */}
      <div className="navigation-controls">
        <button onClick={handlePrevious}>P</button>
        <div className="date-navigation">
          {getDateNumbers().map((date,i) =>
            <div
              key={i}
              className={`date-item ${
                date.toDateString()===selectedDate.toDateString()
                  ? 'selected':''
              }`}
              onClick={()=>setSelectedDate(date)}
            >
              {date.getDate()}
            </div>
          )}
        </div>
        <button onClick={handleNext}>N</button>
      </div>

      {/* date / week / month picker */}
      <div className="selected-date">
        {timeframe==='Daily' && (
          <input
            type="date"
            className="date-picker"
            value={formatDateInput(selectedDate)}
            onChange={e => {
              // Fix for off-by-one bug from UTC parsing
              const [year, month, day] = e.target.value.split('-');
              const localDate = new Date(Number(year), Number(month) - 1, Number(day)); // Local midnight
              setSelectedDate(localDate);
            }}
          />
        )}
        {timeframe==='Weekly' && (
          <input
            type="week"
            className="week-picker"
            value={getWeekInputValue(selectedDate)}
            onChange={e => {
              // Parse "YYYY-Wxx" ISO week format into the Monday of that week
              const [yearStr, weekStr] = e.target.value.split('-W');
              const year = Number(yearStr);
              const week = Number(weekStr);
              const jan4 = new Date(year, 0, 4);
              const startOfWeek1 = new Date(jan4);
              startOfWeek1.setDate(jan4.getDate() - ((jan4.getDay() + 6) % 7));
              const mondayOfWeek = new Date(startOfWeek1);
              mondayOfWeek.setDate(startOfWeek1.getDate() + (week - 1) * 7);

              // Set local midnight to prevent timezone shift
              const localMonday = new Date(
                mondayOfWeek.getFullYear(),
                mondayOfWeek.getMonth(),
                mondayOfWeek.getDate()
              );

              setSelectedDate(localMonday);
            }}
          />
        )}
        {timeframe==='Monthly' && (
          <input
            type="month"
            className="month-picker"
            value={selectedDate.toISOString().slice(0,7)}
            onChange={e => {
              // Fix: avoid new Date('YYYY-MM-01') UTC parsing
              const [year, month] = e.target.value.split('-');
              const localDate = new Date(Number(year), Number(month) - 1, 1); // Local midnight
              setSelectedDate(localDate);
            }}
          />
        )}
      </div>
    </div>
  )
}
