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
import axios from 'axios';
import CalendarUI from "../../components/CalendarUI/CalendarUI";
import Header2 from "../../components/header/Header2";
import BottomNav from "../../components/BottomNav/BottomNav";
import { API_ENDPOINTS } from '../../config/api';


const StatsPage = () => {
  const [timeframe, setTimeframe] = useState("Daily");
  // const [selectedDate, setSelectedDate] = useState(new Date(2025, 2, 1));
  const [selectedDate, setSelectedDate] = useState(() => new Date());
  const [logs, setLogs] = useState([]);
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
        const user = JSON.parse(localStorage.getItem("user"));
        // if (!user?.token) {
        //   console.warn("User not logged in");
        //   return;
        // }
    
        const config = {
          withCredentials: true, 
        };
  
        if (user?.token) {
          config.headers = {
            Authorization: `jwt ${user.token}`
          };
        }
        console.log("fliplogs with date:");
        
        let res;
        if (timeframe === "Daily") {
          const dateStr = selectedDate.toISOString().slice(0, 10);
          res = await axios.get(API_ENDPOINTS.FLIPLOG.TODAY_LIST(dateStr), config);
        } else {
          const start = new Date(selectedDate);
          const end = new Date(selectedDate);
          if (timeframe === "Weekly") {
            start.setDate(start.getDate() - start.getDay());
            end.setDate(start.getDate() + 6);
          } else if (timeframe === "Monthly") {
            start.setDate(1);
            end.setMonth(start.getMonth() + 1, 0); 
          }

          const startStr = start.toISOString().slice(0, 10);
          const endStr = end.toISOString().slice(0, 10);
          res = await axios.get(API_ENDPOINTS.FLIPLOG.GET_RANGE(startStr, endStr), config);
        }

        const data = res.data.map(log => ({

          ...log,
          date: formatDate(new Date(log.start_time))
        }));

        setLogs(data);
        console.log("this is modified",data);
  
        // const dateStr = selectedDate.toISOString().slice(0, 10); //2025-4-30
        // const res = await axios.get(API_ENDPOINTS.FLIPLOG.TODAY_LIST(dateStr), config);
        // const data = res.data;

        // console.log("fliplogs with date1:", dateStr, data);
    
    
        // const withDate = data.map((log) => ({
        //   ...log,
        //   date: formatDate(new Date(log.start_time)), //新增一个date字段格式为2025.4.30
        // }));
        // console.log("fliplogs with date2:", withDate);
    
        // setLogs(withDate);
      } catch (err) {
        console.error("Error fetching flip logs:", err);
      }
    };
  
    fetchLogs();
  }, [timeframe, selectedDate]);


  useEffect(() => {
    let filtered = [];
    //formate: 2025.4.30
    const formattedDate = formatDate(selectedDate);


    if (timeframe === "Daily") {
      // 按天：筛出 date = 选中日期
      // console.log("this is a checkprint",logs)
      //logs = withDate data抓过来的数据
      filtered = logs.filter((log) => {
        const logDateStr = formatDate(new Date(log.start_time));
        return logDateStr === formattedDate;
      });

      console.log("this is flitered", filtered)

      // 按小时汇总
      const hourBuckets = Array(24).fill(0);
      filtered.forEach((log) => {
        const h = new Date(log.start_time).getHours(); // ✅ 正确提取小时
        hourBuckets[h] += Math.round(log.duration / 60);
      });

      // filtered.forEach((log) => {
      //   const [h] = log.start_time.split(":").map(Number);
      //   hourBuckets[h] += Math.round(log.duration / 60);
      // });

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
      const year = selectedDate.getFullYear();
      const month = selectedDate.getMonth();
    
      const weekCount = getWeeksInMonth(year, month); // 动态周数
    
      filtered = logs.filter((log) => {
        const dt = parseLogDate(log.date);
        return dt.getFullYear() === year && dt.getMonth() === month;
      });
    
      const weekBuckets = Array(weekCount).fill(0);
    
      filtered.forEach((log) => {
        const wk = Math.floor((parseLogDate(log.date).getDate() - 1) / 7);
        weekBuckets[wk] += Math.round(log.duration / 60);
      });
    
      const monthlyChart = weekBuckets.map((minutes, i) => ({
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
      dates.push(new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return dates;
  };

  //计算一个月有几个礼拜
  const getWeeksInMonth = (year, month) => {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const firstWeekDay = firstDay.getDay();
    const totalDays = lastDay.getDate();
  
    return Math.ceil((firstWeekDay + totalDays) / 7);
  };  

  const getWeekRange = (date) => {
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - date.getDay());
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    return { startOfWeek, endOfWeek };
  };

  const getWeekInputValue = (date) => {
    const temp = new Date(date);
    temp.setHours(0, 0, 0, 0);
    const firstDayOfYear = new Date(temp.getFullYear(), 0, 1);
    const dayOffset = (firstDayOfYear.getDay() + 6) % 7;
    const firstMonday = new Date(firstDayOfYear);
    firstMonday.setDate(firstMonday.getDate() - dayOffset + 1);
    const daysSinceFirstMonday = Math.floor((temp - firstMonday) / (1000 * 60 * 60 * 24));
    const weekNumber = Math.floor(daysSinceFirstMonday / 7) + 1;
    return `${temp.getFullYear()}-W${String(weekNumber).padStart(2, "0")}`;
  };
  

  const handlePrevious = () => {
    if (timeframe === "Daily") {
      setSelectedDate(new Date(selectedDate.setDate(selectedDate.getDate() - 1)));
    } else if (timeframe === "Weekly") {
      setSelectedDate(new Date(selectedDate.setDate(selectedDate.getDate() - 7)));
    } else if (timeframe === "Monthly") {
      setSelectedDate(new Date(selectedDate.setMonth(selectedDate.getMonth() - 1)));
    }
  };

  const handleNext = () => {
    if (timeframe === "Daily") {
      setSelectedDate(new Date(selectedDate.setDate(selectedDate.getDate() + 1)));
    } else if (timeframe === "Weekly") {
      setSelectedDate(new Date(selectedDate.setDate(selectedDate.getDate() + 7)));
    } else if (timeframe === "Monthly") {
      setSelectedDate(new Date(selectedDate.setMonth(selectedDate.getMonth() + 1)));
    }
  };

  const formatDateInput = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // 月份从0开始
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };
  
  return (
    <div className="stats-container">
      <Header2 title="Statistics" />
      <div className="stats-content">
        {/* —— 上半部分保持不变 —— */}
        <div className="concentration-card">
          {/* <h2>Concentration</h2> */}
          <CalendarUI
            timeframe={timeframe}
            setTimeframe={setTimeframe}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            getDateNumbers={getDateNumbers}
            handlePrevious={handlePrevious}
            handleNext={handleNext}
          />

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
                {/* <XAxis dataKey="time" /> */}
                <XAxis
                  dataKey={
                    timeframe === "Monthly"
                      ? "week"      // Monthly 用的是 W1, W2...
                      : timeframe === "Weekly"
                      ? "day"       // Weekly 用的是 MON, TUE...
                      : "time"      // Daily 用的是 00:00, 01:00...
                  }
                />

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
                <XAxis dataKey={
                  timeframe === "Monthly"
                    ? "week"
                    : timeframe === "Weekly"
                    ? "day"
                    : "time"
                } />

                <YAxis
                  allowDecimals={false}
                  tickFormatter={(v) => {
                    // console.log(chartData.map(d => d.time)); // 看看 time 字段都是什么
                    // console.log("chartData", chartData);
                //     console.log("weekly selected week:", startOfWeek, endOfWeek);
                // console.log("weekly filtered logs:", filtered);

                    if (v < 60) return `${v}m`;
                    const h = Math.floor(v / 60);
                    const m = v % 60;
                    return m === 0 ? `${h}h` : `${h}h ${m}m`;
                  }}
                />
                <Tooltip
                  formatter={(v) => {
                    const h = Math.floor(v / 60);
                    const m = v % 60;
                    return h === 0 ? `${m} min` : `${h}h ${m}m`;
                  }}
                />

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
