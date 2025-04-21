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
import { API_ENDPOINTS } from "../../config/api";

const StatsPage = () => {
-<<<<<<< Larisa
-  const [timeframe, setTimeframe] = useState("Monthly");
-  const [selectedDate, setSelectedDate] = useState(new Date(2025, 2, 1));
-  const [logs, setLogs] = useState([]);            
-=======
-  const [timeframe, setTimeframe] = useState("Daily");
-  const [selectedDate, setSelectedDate] = useState(new Date());
->>>>>>> master
+  const [timeframe, setTimeframe] = useState("Monthly");
+  const [selectedDate, setSelectedDate] = useState(new Date(2025, 2, 1));
+  const [logs, setLogs] = useState([]);

  const [chartData, setChartData] = useState([]);
  const [totalHours, setTotalHours] = useState(0);
  const [totalMinutes, setTotalMinutes] = useState(0);


// Utility: format date to YYYY.M.D
const formatDate = (date) => `${date.getFullYear()}.${date.getMonth() + 1}.${date.getDate()}`;


  
  const parseLogDate = (dateStr) => {
    const [y, m, d] = dateStr.split(".").map(Number);
    return new Date(y, m - 1, d);
  };

  
  const formatHoursMinutes = (minutesTotal) => {
    const h = Math.floor(minutesTotal / 60);
    const m = minutesTotal % 60;
    return `${h > 0 ? `${h}h ` : ""}${m}m`;
  };

  
  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await fetch(API_ENDPOINTS.FLIPLOG.LIST);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const data = await res.json();
        console.log("raw fliplogs:", data);

        const withDate = data.map((log) => ({
          ...log,
          date: formatDate(new Date(log.start_time)),
        }));
        console.log("fliplogs with date:", withDate);

        setLogs(withDate);
      } catch (err) {
        console.error("Error fetching flip logs:", err);
      }
    };

    fetchLogs();
  }, [timeframe, selectedDate]);


  useEffect(() => {
    let filtered = [];
    const formattedDate = formatDate(selectedDate);

    if (timeframe === "Daily") {
      // 按天：筛出 date = 选中日期
      filtered = logs.filter((log) => log.date === formattedDate);

      // 按小时汇总
      const hourBuckets = Array(24).fill(0);
      filtered.forEach((log) => {
        const [h] = log.start_time.split(":").map(Number);
        hourBuckets[h] += Math.round(log.duration / 60);
      });

      const timeline = hourBuckets.map((minutes, hour) => ({
        time: `${String(hour).padStart(2, "0")}:00`,
        minutes,
      }));

      const total = filtered.reduce((sum, l) => sum + l.duration, 0);
      setTotalHours(Math.floor(total / 3600));
      setTotalMinutes(Math.floor((total % 3600) / 60));
      setChartData(timeline);

    } else if (timeframe === "Weekly") {
      // 按周：计算本周起止日
      const getStartOfWeek = (d) => {
        const dt = new Date(d);
        const day = dt.getDay();
        dt.setDate(dt.getDate() - day);
        dt.setHours(0, 0, 0, 0);
        return dt;
      };
      const startOfWeek = getStartOfWeek(selectedDate);
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);

      filtered = logs.filter((log) => {
        const dt = parseLogDate(log.date);
        return dt >= startOfWeek && dt <= endOfWeek;
      });

      const dayBuckets = Array(7).fill(0);
      filtered.forEach((log) => {
        const idx = parseLogDate(log.date).getDay();
        dayBuckets[idx] += Math.round(log.duration / 60);
      });

      const days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
      const weeklyChart = days.map((d, i) => ({
        day: d,
        minutes: dayBuckets[i],
        label: formatHoursMinutes(dayBuckets[i]),
      }));

      const total = filtered.reduce((sum, l) => sum + l.duration, 0);
      setTotalHours(Math.floor(total / 3600));
      setTotalMinutes(Math.floor((total % 3600) / 60));
      setChartData(weeklyChart);

    } else if (timeframe === "Monthly") {
      // 按月：筛出同年同月
      const year = selectedDate.getFullYear();
      const month = selectedDate.getMonth();
      filtered = logs.filter((log) => {
        const dt = parseLogDate(log.date);
        return dt.getFullYear() === year && dt.getMonth() === month;
      });

      const weekBuckets = Array(6).fill(0);
      filtered.forEach((log) => {
        const wk = Math.floor((parseLogDate(log.date).getDate() - 1) / 7);
        weekBuckets[wk] += Math.round(log.duration / 60);
      });

      const monthlyChart = weekBuckets.slice(0, 4).map((minutes, i) => ({
        week: `W${i + 1}`,
        minutes,
        label: formatHoursMinutes(minutes),
      }));

      const total = filtered.reduce((sum, l) => sum + l.duration, 0);
      setTotalHours(Math.floor(total / 3600));
      setTotalMinutes(Math.floor((total % 3600) / 60));
      setChartData(monthlyChart);
    }
  }, [logs, timeframe, selectedDate]);

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
        {/* —— 上半部分保持不变 —— */}
        <div className="concentration-card">
          <h2>Concentration</h2>
          <div className="concentration-info">
            <select
              className="timeframe-selector"
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value)}
            >
              <option value="Daily">Daily</option>
              <option value="Weekly">Weekly</option>
              <option value="Monthly">Monthly</option>
            </select>

            {timeframe === "Daily" && (
              <input
                type="date"
                className="date-picker"
                value={selectedDate.toISOString().split("T")[0]}
                onChange={(e) => setSelectedDate(new Date(e.target.value))}
              />
            )}
            {timeframe === "Weekly" && (
              <input
                type="week"
                className="week-picker"
                onChange={(e) => {
                  const [year, week] = e.target.value.split("-W");
                  const first = new Date(year, 0, 1);
                  const offset = first.getDay();
                  const isoStart = new Date(first);
                  isoStart.setDate(
                    1 + (offset <= 4 ? -offset + 1 : 8 - offset)
                  );
                  const start = new Date(isoStart);
                  start.setDate(start.getDate() + (week - 1) * 7);
                  setSelectedDate(start);
                }}
              />
            )}
            {timeframe === "Monthly" && (
              <input
                type="month"
                className="month-picker"
                value={selectedDate.toISOString().slice(0, 7)}
                onChange={(e) => {
                  const d = new Date(e.target.value + "-01");
                  if (!isNaN(d)) setSelectedDate(d);
                }}
              />
            )}
          </div>
          <h1>
            {totalHours} <span>Hours</span> {totalMinutes} <span>Mins</span>
          </h1>

        </div>

        {/* —— 图表部分 —— */}
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
                <YAxis allowDecimals={false} tickFormatter={(v) => `${v}m`} />
                <Tooltip formatter={(v) => `${v} min`} />
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
                margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
              >
                <XAxis dataKey={timeframe === "Monthly" ? "week" : "day"} />
                <YAxis tickFormatter={(v) => `${Math.floor(v / 60)}h`} />
                <CartesianGrid strokeDasharray="3 3" />
                <Tooltip formatter={(v) => `${Math.floor(v / 60)}h ${v % 60}m`} />
                <Line
                  type="monotone"
                  dataKey="minutes"
                  stroke="#1E90FF"
                  strokeWidth={2}
                  dot={{ r: 4, fill: "#1E90FF", strokeWidth: 2 }}
                  activeDot={{ r: 6, fill: "#1E90FF", stroke: "#fff", strokeWidth: 2 }}
                >
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
