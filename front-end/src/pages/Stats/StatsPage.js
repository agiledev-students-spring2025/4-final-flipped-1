import React, { useState, useEffect } from "react";
import { ResponsiveContainer, Tooltip, PieChart, Pie } from "recharts";

import "./StatsPage.css";
import Header2 from "../../components/header/Header2";
import BottomNav from "../../components/BottomNav/BottomNav";

const StatsPage = () => {
  // Set initial date to match one of the fake data entries
  const [timeframe, setTimeframe] = useState("Daily");
  const [selectedDate, setSelectedDate] = useState(new Date("2025-03-27"));
  const [totalHours, setTotalHours] = useState(0);
  const [totalMinutes, setTotalMinutes] = useState(0);
  const [distributionData, setDistributionData] = useState([]);

  // Fake data: flipLogs (duration in seconds)
  const flipLogs = [
    {
      task_name: "Study",
      date: "2025.3.27",
      start_time: "14:00:00",
      end_time: "14:11:00",
      duration: 660,
    },
    {
      task_name: "Study",
      date: "2025.3.26",
      start_time: "19:51:00",
      end_time: "06:56:46",
      duration: 36346,
    },
    {
      task_name: "Study",
      date: "2025.3.24",
      start_time: "20:45:00",
      end_time: "21:26:05",
      duration: 2465,
    },
    {
      task_name: "Read Books",
      date: "2025.3.21",
      start_time: "11:09:00",
      end_time: "13:11:00",
      duration: 7320,
    },
    {
      task_name: "Read Books",
      date: "2025.3.20",
      start_time: "01:00:00",
      end_time: "01:00:22",
      duration: 22,
    },
    {
      task_name: "Study",
      date: "2025.3.18",
      start_time: "21:19:00",
      end_time: "22:49:00",
      duration: 5400,
    },
    {
      task_name: "Haha",
      date: "2025.3.16",
      start_time: "21:22:00",
      end_time: "23:59:00",
      duration: 9540,
    },
    {
      task_name: "Exercise",
      date: "2025.3.13",
      start_time: "19:55:00",
      end_time: "20:32:43",
      duration: 2203,
    },
    {
      task_name: "Study",
      date: "2025.2.24",
      start_time: "11:35:00",
      end_time: "11:35:07",
      duration: 7,
    },
  ];

  // Helper function to format Date to match "YYYY.M.D"
  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1; // getMonth() is 0-indexed
    const day = date.getDate();
    return `${year}.${month}.${day}`;
  };

  // Handler for week selection (for "Weekly" timeframe)
  const handleWeekChange = (e) => {
    const selectedWeek = e.target.value; // Format: "YYYY-Www"
    const year = parseInt(selectedWeek.substring(0, 4));
    const weekNumber = parseInt(selectedWeek.substring(6));

    // Get the first day of the year
    const firstDayOfYear = new Date(year, 0, 1);
    const firstWeekStart =
      firstDayOfYear.getDay() === 0
        ? firstDayOfYear
        : new Date(
            firstDayOfYear.setDate(
              firstDayOfYear.getDate() - firstDayOfYear.getDay()
            )
          );

    // Calculate start of selected week
    const startOfWeek = new Date(firstWeekStart);
    startOfWeek.setDate(startOfWeek.getDate() + (weekNumber - 1) * 7);

    setSelectedDate(startOfWeek);
  };


  // useEffect to filter and aggregate data based on selectedDate and timeframe
  useEffect(() => {
    let filteredLogs = [];
    if (timeframe === "Daily") {
      const formattedDate = formatDate(selectedDate);
      filteredLogs = flipLogs.filter((log) => log.date === formattedDate);
    } else if (timeframe === "Weekly") {
      // Compute start and end of week (using Sunday as the first day)
      const dayOfWeek = selectedDate.getDay();
      const startOfWeek = new Date(selectedDate);
      startOfWeek.setDate(selectedDate.getDate() - dayOfWeek);
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);
      filteredLogs = flipLogs.filter((log) => {
        const parts = log.date.split(".");
        const logDate = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
        return logDate >= startOfWeek && logDate <= endOfWeek;
      });
    } else if (timeframe === "Monthly") {
      const month = selectedDate.getMonth();
      const year = selectedDate.getFullYear();
      filteredLogs = flipLogs.filter((log) => {
        const parts = log.date.split(".");
        const logDate = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
        return logDate.getMonth() === month && logDate.getFullYear() === year;
      });
    } else if (timeframe === "Yearly") {
      const year = selectedDate.getFullYear();
      filteredLogs = flipLogs.filter((log) => {
        const parts = log.date.split(".");
        const logDate = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
        return logDate.getFullYear() === year;
      });
    }

    // Aggregate duration per task and convert seconds to minutes
    const aggregated = {};
    filteredLogs.forEach((log) => {
      aggregated[log.task_name] = (aggregated[log.task_name] || 0) + log.duration;
    });
    const chartData = Object.keys(aggregated).map((task) => ({
      name: task,
      minutes: Math.round(aggregated[task] / 60),
    }));

    // Compute total duration for display
    const totalDuration = filteredLogs.reduce((sum, log) => sum + log.duration, 0);
    const hours = Math.floor(totalDuration / 3600);
    const minutes = Math.floor((totalDuration % 3600) / 60);

    setDistributionData(chartData);
    setTotalHours(hours);
    setTotalMinutes(minutes);
  }, [selectedDate, timeframe]);

  return (
    <div className="stats-container">
      <Header2 title="Statistics" />

      {/* Main Content */}
      <div className="stats-content">
        {/* Concentration Card */}
        <div className="concentration-card">
          <h2>Concentration</h2>

          {/* Timeframe Selector & Date Pickers */}
          <div className="concentration-info">
            <select
              className="timeframe-selector"
              value={timeframe}
              onChange={(e) => {
                setTimeframe(e.target.value);
                // Reset the date when switching timeframe if desired
                if (e.target.value === "Daily") {
                  setSelectedDate(new Date("2025-03-27"));
                } else {
                  setSelectedDate(new Date());
                }
              }}
            >
              <option value="Daily">Daily</option>
              <option value="Weekly">Weekly</option>
              <option value="Monthly">Monthly</option>
              <option value="Yearly">Yearly</option>
            </select>

            {timeframe === "Daily" && (
              <input
                type="date"
                className="date-picker"
                value={selectedDate.toISOString().split("T")[0]}
                onChange={(e) => {
                  const newDate = new Date(e.target.value);
                  if (!isNaN(newDate)) setSelectedDate(newDate);
                }}
              />
            )}

            {timeframe === "Weekly" && (
              <input
                type="week"
                className="week-picker"
                onChange={handleWeekChange}
              />
            )}

            {timeframe === "Monthly" && (
              <input
                type="month"
                className="month-picker"
                value={selectedDate.toISOString().slice(0, 7)}
                onChange={(e) => {
                  const newDate = new Date(e.target.value + "-01");
                  if (!isNaN(newDate)) setSelectedDate(newDate);
                }}
              />
            )}

            {timeframe === "Yearly" && (
              <div className="year-picker-container">
                <input
                  type="number"
                  className="year-picker"
                  value={selectedDate.getFullYear()}
                  readOnly
                />
                <div className="year-arrows">
                  <button
                    onClick={() => {
                      const currentYear = selectedDate.getFullYear();
                      if (currentYear < 2100) {
                        const newDate = new Date(selectedDate);
                        newDate.setFullYear(currentYear + 1);
                        setSelectedDate(newDate);
                      }
                    }}
                    className="arrow-btn"
                  >
                    ▲
                  </button>
                  <button
                    onClick={() => {
                      const currentYear = selectedDate.getFullYear();
                      if (currentYear > 1900) {
                        const newDate = new Date(selectedDate);
                        newDate.setFullYear(currentYear - 1);
                        setSelectedDate(newDate);
                      }
                    }}
                    className="arrow-btn"
                  >
                    ▼
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Total Time Display */}
          <h1>
            {totalHours} <span>Hours</span> {totalMinutes} <span>Mins</span>
          </h1>
        </div>

        {/* Distribution Chart Section */}
        {distributionData.length > 0 ? (
          <div className="distribution-card">
            <h3>{timeframe} Time Distribution</h3>
            <div className="chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                  <Pie
                    data={distributionData}
                    dataKey="minutes"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#82ca9d"
                    // Disable the connecting line
                    labelLine={false}
                    // Conditionally place the label
                    label={({ cx, cy, midAngle, innerRadius, outerRadius, value, payload }) => {
                      // If there's only one slice, center the label
                      if (distributionData.length === 1) {
                        return (
                          <text
                            x={cx}
                            y={cy}
                            fill="black"
                            textAnchor="middle"
                            dominantBaseline="central"
                          >
                            {`${payload.name}: ${value} min`}
                          </text>
                        );
                      }

                      // Otherwise, use a normal "outside" placement
                      const RADIAN = Math.PI / 180;
                      const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                      const x = cx + radius * Math.cos(-midAngle * RADIAN);
                      const y = cy + radius * Math.sin(-midAngle * RADIAN);

                      return (
                        <text
                          x={x}
                          y={y}
                          fill="black"
                          textAnchor={x > cx ? "start" : "end"}
                          dominantBaseline="central"
                        >
                          {`${payload.name}: ${value} min`}
                        </text>
                      );
                    }}
                  />
                  <Tooltip formatter={(value) => `${value} min`} />
                </PieChart>
              </ResponsiveContainer>


            </div>
          </div>
        ) : (
          <div className="distribution-card">
            <h3>No data available for the {timeframe} timeframe.</h3>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
};

export default StatsPage;
