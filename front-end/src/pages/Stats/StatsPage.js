import React, { useState, useEffect } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  LineChart,
  Line,
  CartesianGrid,
  LabelList,
} from "recharts";

import "./StatsPage.css";
import Header2 from "../../components/header/Header2";
import BottomNav from "../../components/BottomNav/BottomNav";

const StatsPage = () => {
  const [timeframe, setTimeframe] = useState("Daily");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [chartData, setChartData] = useState([]);
  const [totalHours, setTotalHours] = useState(0);
  const [totalMinutes, setTotalMinutes] = useState(0);

  const flipLogs = [
    { task_name: "Study", date: "2025.3.27", start_time: "14:00:00", end_time: "14:11:00", duration: 660 },
    { task_name: "Study", date: "2025.3.26", start_time: "19:51:00", end_time: "06:56:46", duration: 36346 },
    { task_name: "Study", date: "2025.3.24", start_time: "20:45:00", end_time: "21:26:05", duration: 2465 },
    { task_name: "Read Books", date: "2025.3.21", start_time: "11:09:00", end_time: "13:11:00", duration: 7320 },
    { task_name: "Read Books", date: "2025.3.20", start_time: "01:00:00", end_time: "01:00:22", duration: 22 },
    { task_name: "Study", date: "2025.3.18", start_time: "21:19:00", end_time: "22:49:00", duration: 5400 },
    { task_name: "Haha", date: "2025.3.16", start_time: "21:22:00", end_time: "23:59:00", duration: 9540 },
    { task_name: "Exercise", date: "2025.3.13", start_time: "19:55:00", end_time: "20:32:43", duration: 2203 },
    { task_name: "Study", date: "2025.4.16", start_time: "11:35:00", end_time: "20:35:07", duration: 5400 },
    { task_name: "Exercise", date: "2025.4.16", start_time: "15:35:00", end_time: "20:35:07", duration: 2200 },
    { task_name: "Read Books", date: "2025.4.16", start_time: "9:35:00", end_time: "20:35:07", duration: 1200 },
  ];

  // Utility: format date to YYYY.M.D
  const formatDate = (date) => `${date.getFullYear()}.${date.getMonth() + 1}.${date.getDate()}`;

  // Utility: parse a YYYY.M.D string to JS date
  const parseLogDate = (dateStr) => {
    const [y, m, d] = dateStr.split(".").map(Number);
    return new Date(y, m - 1, d);
  };

  // Utility: format minutes → "Xh Ym"
  const formatHoursMinutes = (minutesTotal) => {
    const h = Math.floor(minutesTotal / 60);
    const m = minutesTotal % 60;
    return `${h > 0 ? `${h}h ` : ""}${m}m`;
  };

  useEffect(() => {
    const formattedDate = formatDate(selectedDate);

    if (timeframe === "Daily") {
      // Filter logs for the selected day
      const logs = flipLogs.filter((log) => log.date === formattedDate);
      const hourBuckets = Array(24).fill(0);

      logs.forEach((log) => {
        const [startHour] = log.start_time.split(":").map(Number);
        const minutes = Math.round(log.duration / 60);
        hourBuckets[startHour] += minutes;
      });

      const timeline = hourBuckets.map((minutes, hour) => ({
        time: `${String(hour).padStart(2, "0")}:00`,
        minutes,
      }));

      const total = logs.reduce((sum, log) => sum + log.duration, 0);
      setTotalHours(Math.floor(total / 3600));
      setTotalMinutes(Math.floor((total % 3600) / 60));
      setChartData(timeline);

    } else if (timeframe === "Weekly") {
      const getStartOfWeek = (date) => {
        const d = new Date(date);
        const day = d.getDay();
        d.setDate(d.getDate() - day);
        d.setHours(0, 0, 0, 0);
        return d;
      };

      const startOfWeek = getStartOfWeek(selectedDate);
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);

      const logs = flipLogs.filter((log) => {
        const logDate = parseLogDate(log.date);
        return logDate >= startOfWeek && logDate <= endOfWeek;
      });

      const dayBuckets = Array(7).fill(0);
      logs.forEach((log) => {
        const logDate = parseLogDate(log.date);
        const dayIndex = logDate.getDay();
        const minutes = Math.round(log.duration / 60);
        dayBuckets[dayIndex] += minutes;
      });

      const days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
      const weeklyChart = days.map((day, i) => ({
        day,
        minutes: dayBuckets[i],
        label: formatHoursMinutes(dayBuckets[i]),
      }));

      const total = logs.reduce((sum, log) => sum + log.duration, 0);
      setTotalHours(Math.floor(total / 3600));
      setTotalMinutes(Math.floor((total % 3600) / 60));
      setChartData(weeklyChart);

    } else if (timeframe === "Monthly") {
      // Filter logs for the selected month/year
      const year = selectedDate.getFullYear();
      const month = selectedDate.getMonth();

      const logs = flipLogs.filter((log) => {
        const logDate = parseLogDate(log.date);
        return logDate.getFullYear() === year && logDate.getMonth() === month;
      });

      const weekBuckets = Array(6).fill(0);

      logs.forEach((log) => {
        const logDate = parseLogDate(log.date);
        const weekIndex = Math.floor((logDate.getDate() - 1) / 7);
        const minutes = Math.round(log.duration / 60);
        weekBuckets[weekIndex] += minutes;
      });

      // Keep the first 4 "weeks" so the shape is consistent
      const monthlyChart = weekBuckets.slice(0, 4).map((minutes, i) => ({
        week: `W${i + 1}`,
        minutes,
        label: formatHoursMinutes(minutes),
      }));

      const total = logs.reduce((sum, log) => sum + log.duration, 0);
      setTotalHours(Math.floor(total / 3600));
      setTotalMinutes(Math.floor((total % 3600) / 60));
      setChartData(monthlyChart);
    }
  }, [selectedDate, timeframe]);

  // Generate array of dates for the date navigation
  const getDateNumbers = () => {
    const dates = [];
    const currentDate = new Date(selectedDate);
    currentDate.setDate(currentDate.getDate() - 3); // Start 3 days before
    
    for (let i = 0; i < 7; i++) {
      dates.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return dates;
  };

  return (
    <div className="stats-container">
      <Header2 title="Statistics" />
      <div className="stats-content">
        <div className="concentration-card">
          {/* <h2>Concentration</h2> */}
          
          {/* Time Frame Selector */}
          <div className="time-selector-container">
            <button 
              className={`time-option ${timeframe === 'Daily' ? 'active' : ''}`}
              onClick={() => setTimeframe('Daily')}
            >
              Daily
            </button>
            <button 
              className={`time-option ${timeframe === 'Weekly' ? 'active' : ''}`}
              onClick={() => setTimeframe('Weekly')}
            >
              Weekly
            </button>
            <button 
              className={`time-option ${timeframe === 'Monthly' ? 'active' : ''}`}
              onClick={() => setTimeframe('Monthly')}
            >
              Monthly
            </button>
          </div>

          {/* Date Navigation */}
          {timeframe === 'Daily' && (
            <div className="date-navigation">
              <div className="date-numbers">
                {getDateNumbers().map((date, index) => (
                  <div
                    key={index}
                    className={`date-number ${
                      date.getDate() === selectedDate.getDate() ? 'active' : ''
                    }`}
                    onClick={() => setSelectedDate(new Date(date))}
                  >
                    {date.getDate()}
                  </div>
                ))}
              </div>
              <div className="date-text">
                <label 
                  htmlFor="date-picker-input" 
                  className="date-picker-label"
                  onClick={(e) => {
                    e.preventDefault();
                    const input = document.getElementById('date-picker-input');
                    if (input) {
                      input.showPicker();
                    }
                  }}
                >
                  <span className="date-display">
                    {selectedDate.toLocaleDateString('en-US', { 
                      weekday: 'long',
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </span>
                  <span className="calendar-icon">📅</span>
                </label>
                <input
                  type="date"
                  id="date-picker-input"
                  value={selectedDate.toISOString().split('T')[0]}
                  onChange={(e) => {
                    const newDate = new Date(e.target.value);
                    newDate.setMinutes(newDate.getMinutes() + newDate.getTimezoneOffset());
                    if (!isNaN(newDate)) {
                      setSelectedDate(newDate);
                    }
                  }}
                  className="date-picker"
                />
              </div>
            </div>
          )}

          {/* Hidden date pickers for Weekly and Monthly views */}
          {timeframe === "Weekly" && (
            <input
              type="week"
              value={`${selectedDate.getFullYear()}-W${Math.ceil(
                (selectedDate.getDate() + selectedDate.getDay()) / 7
              )}`}
              onChange={(e) => {
                const [year, week] = e.target.value.split("-W");
                const firstDayOfYear = new Date(year, 0, 1);
                const days = (week - 1) * 7;
                const newDate = new Date(firstDayOfYear);
                newDate.setDate(firstDayOfYear.getDate() + days);
                setSelectedDate(newDate);
              }}
            />
          )}

          {timeframe === "Monthly" && (
            <input
              type="month"
              value={selectedDate.toISOString().slice(0, 7)}
              onChange={(e) => {
                const newDate = new Date(e.target.value + "-01");
                if (!isNaN(newDate)) setSelectedDate(newDate);
              }}
            />
          )}
        </div>

        <div className="distribution-card">
          {/* Time Display */}
          <h3>Total Time</h3>
          <div className="time-display">
            {totalHours}<span>Hours</span>{totalMinutes}<span>Mins</span>
          </div>
          
          <h3>{timeframe} Time Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            {timeframe === "Daily" ? (
              <AreaChart data={chartData}>
                <XAxis dataKey="time" />
                <YAxis allowDecimals={false} tickFormatter={(val) => `${val}m`} />
                <Tooltip formatter={(value) => `${value} min`} />
                <Area
                  type="monotone"
                  dataKey="minutes"
                  stroke="#1E90FF"
                  fill="url(#colorGradient)"
                />
                <defs>
                  <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1E90FF" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#99BADD" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
              </AreaChart>
            ) : (
              <LineChart
                data={chartData}
                // ADD MARGIN PROPS HERE
                margin={{
                  top: 20,    // extra space at the top
                  right: 30,  // extra space on the right
                  left: 20,   // extra space on the left
                  bottom: 10, // extra space at the bottom
                }}
              >
                <XAxis dataKey={timeframe === "Monthly" ? "week" : "day"} />
                <YAxis tickFormatter={(val) => `${Math.floor(val / 60)}h`} />
                <CartesianGrid strokeDasharray="3 3" />
                <Tooltip formatter={(val) => `${Math.floor(val / 60)}h ${val % 60}m`} />
                <Line
                  type="monotone"
                  dataKey="minutes"
                  stroke="#1E90FF"
                  strokeWidth={2}
                  dot={{ r: 4, fill: "#1E90FF", strokeWidth: 2 }}
                  activeDot={{ r: 6, fill: "#1E90FF", stroke: "#fff", strokeWidth: 2 }}
                >
                  {/* OFFSET THE LABELS TO GIVE THEM MORE ROOM */}
                  <LabelList dataKey="label" position="top" offset={10} />
                </Line>
              </LineChart>

            )}
          </ResponsiveContainer>
        </div>
      </div>
      <BottomNav />
    </div>
  );
};

export default StatsPage;
