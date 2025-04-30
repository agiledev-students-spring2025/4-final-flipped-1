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

  const getWeekInputValue = (date) => {
    const temp = new Date(date);
    temp.setHours(0, 0, 0, 0);
    const firstDayOfYear = new Date(temp.getFullYear(), 0, 1);
    const dayOffset = (firstDayOfYear.getDay() + 6) % 7;
    const firstMonday = new Date(firstDayOfYear);
    firstMonday.setDate(firstDayOfYear.getDate() - dayOffset + 1);
    const daysSinceFirstMonday = Math.floor((temp - firstMonday) / (1000 * 60 * 60 * 24));
    const weekNumber = Math.floor(daysSinceFirstMonday / 7) + 1;
    return `${temp.getFullYear()}-W${String(weekNumber).padStart(2, "0")}`;
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
            onChange={e=>setSelectedDate(new Date(e.target.value))}
          />
        )}
        {timeframe==='Weekly' && (
          <input
            type="week"
            className="week-picker"
            value={getWeekInputValue(selectedDate)}
            onChange={e => {
              const [year, week] = e.target.value.split("-W").map(Number);
              const firstDayOfYear = new Date(year, 0, 1);
              const dayOffset = (firstDayOfYear.getDay() + 6) % 7;
              const firstMonday = new Date(firstDayOfYear);
              firstMonday.setDate(firstDayOfYear.getDate() - dayOffset + 1);
              const selectedWeekStart = new Date(firstMonday);
              selectedWeekStart.setDate(firstMonday.getDate() + (week - 1) * 7);
              setSelectedDate(selectedWeekStart);
            }}
            
          />
        )}
        {timeframe==='Monthly' && (
          <input
            type="month"
            className="month-picker"
            value={selectedDate.toISOString().slice(0,7)}
            onChange={e=>{
              const d = new Date(e.target.value+'-01')
              if(!isNaN(d)) setSelectedDate(d)
            }}
          />
        )}
      </div>
    </div>
  )
}
