// src/pages/StatsPage.js
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
  const [timeframe, setTimeframe] = useState("Monthly");
  const [selectedDate, setSelectedDate] = useState(new Date(2025, 2, 1));
  const [logs, setLogs] = useState([]);            
  const [chartData, setChartData] = useState([]);
  const [totalHours, setTotalHours] = useState(0);
  const [totalMinutes, setTotalMinutes] = useState(0);

  // helper: 把 Date 对象格式化成 "YYYY.M.D"
  const formatDate = (date) =>
    `${date.getFullYear()}.${date.getMonth() + 1}.${date.getDate()}`;

  // helper: 反向将 "YYYY.M.D" 字符串 parse 回 Date
  const parseLogDate = (dateStr) => {
    const [y, m, d] = dateStr.split(".").map(Number);
    return new Date(y, m - 1, d);
  };

  // helper: 把总分钟数转成 "xh ym" 格式
  const formatHoursMinutes = (minutesTotal) => {
    const h = Math.floor(minutesTotal / 60);
    const m = minutesTotal % 60;
    return `${h > 0 ? `${h}h ` : ""}${m}m`;
  };

  // ───────────────────────────────────────────────────────────
  // 第一个 effect：拉取日志，并给每条记录加上 date 字段
  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await fetch(API_ENDPOINTS.FLIPLOG.LIST);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const data = await res.json();
        console.log("raw fliplogs:", data);

        // 映射出新的数组，每条记录都带上 date 字段
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

  // ───────────────────────────────────────────────────────────
  // 第二个 effect：根据 timeframe+selectedDate 生成 chartData & 汇总时长
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

  // ───────────────────────────────────────────────────────────
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
                  start.setDate(isoStart.getDate() + (week - 1) * 7);
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
                  stroke="#fcd34d"
                  fill="#fde68a"
                />
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
                  stroke="#fcd34d"
                  strokeWidth={3}
                  dot={{ r: 6 }}
                  activeDot={{ r: 8 }}
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
