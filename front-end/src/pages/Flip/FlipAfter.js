import React, { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useSwipeable } from 'react-swipeable';
import './FlipAfter.css';
import FlipTask from '../../components/FlipTask/FlipTask';
import Header from '../../components/header/Header';
import BottomNav from '../../components/BottomNav/BottomNav';
import axios from 'axios';

function FlipAfter() {
    const { taskId } = useParams();
    const location = useLocation();
    const taskName = location.state?.taskName || "Unknown Task"; // 获取 taskName
    const taskColor = location.state?.taskColor || "#eeecf9";
    // const todayTime = location.state?.todayTime ?? 0;
    const [todayTime, setTodayTime] = useState(0);  


    const navigate = useNavigate();

    const queryParams = new URLSearchParams(location.search);

    const duration = queryParams.get("duration");
    const [startTime, setStartTime] = useState(null);
    const [flipDuration, setFlipDuration] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [totalFlipTime, setTotalFlipTime] = useState(
        parseFloat(localStorage.getItem("totalFlipTime")) || 0
    );



    const sendFlipLog = async (task_name, duration, startTimestamp, setTodayTime) => {
        const startDate = new Date(startTimestamp);
        const endDate = new Date(startDate.getTime() + duration * 1000);
      
        const formatTime = date => date.toLocaleTimeString('en-GB', {
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        });
      
        const formatDate = date => {
          const year = date.getFullYear();
          const month = date.getMonth() + 1;
          const day = date.getDate();
          return `${year}.${month}.${day}`;
        };
      
        const flipData = {
          task_name,
          date: formatDate(startDate),
          start_time: formatTime(startDate),
          end_time: formatTime(endDate),
          duration
        };

        console.log("this is a test print of send flip log",task_name);
        console.log(formatDate(startDate));
        console.log(formatTime(startDate));
        console.log(formatTime(endDate));
        console.log(duration);
      
        try {
          const res = await axios.post('http://localhost:3001/api/fliplog', flipData);
          const todayTotal = res.data.todayTotalTime;
          setTodayTime(todayTotal); 
        } catch (err) {
          console.error("发送打卡失败：", err);
        }
      };

    useEffect(() => {
        const fetchTodayTime = async () => {
            try {
            const today = new Date();
            const dateStr = `${today.getFullYear()}.${today.getMonth() + 1}.${today.getDate()}`;
            const res = await axios.get("http://localhost:3001/api/fliplog");

            const taskLogs = res.data.filter(log => log.task_name === taskName && log.date === dateStr);
            const total = taskLogs.reduce((sum, log) => sum + log.duration, 0);

            setTodayTime(total);
            } catch (err) {
            console.error("获取今日时间失败：", err);
            }
        };

        fetchTodayTime();
    }, [taskName]); // 👈 注意依赖 taskName


    useEffect(() => {
        const handleOrientation = (event) => {
            const beta = event.beta;   // 前后倾斜角度
            

            if ( ( beta<-120 || beta > 120 ) && !isFlipped) {
                // 手机翻转超过 90°，进入黑屏状态并开始计时
                setIsFlipped(true);
                setStartTime(Date.now());
                // console.log(event)
                // console.log("this is flipped",isFlipped) 
            } else if ( (beta>-90 && beta < 90) && isFlipped) {
                // 手机翻转回去，退出黑屏状态，并计算时间
                if (startTime){
                    const duration = (Date.now() - startTime) / 1000; // 计算翻转时间（秒）
                    setFlipDuration(duration);

                    //计算今天计算的总时间
                    const newTotalFlipTime = totalFlipTime + duration
                    setTotalFlipTime(newTotalFlipTime);
                    localStorage.setItem("totalFlipTime", newTotalFlipTime);

                    setIsFlipped(false);
                    // console.log(duration)
                    // console.log(isFlipped)

                    sendFlipLog(taskName, duration, startTime, setTodayTime);

                    // 刷新 FlipAfter 页面，并更新翻转时长
                    navigate(`/flipafter/${taskId}?duration=${duration}`);
                }  
            }

        };

        // try{
            // const permissionState = await DeviceOrientationEvent.requestPerission()
            // if (permissionState === 'granted'){
        window.addEventListener("deviceorientation", handleOrientation);
            // }
        // } catch(error){
        //     console.log(error)
        // }

        return () => {
            window.removeEventListener("deviceorientation", handleOrientation);
        };
    }, [isFlipped, startTime, taskId, navigate, totalFlipTime]);


    return (
        <div className={`flip-after-page ${isFlipped ? 'black-screen' : ''}`}>
            {/* <Header /> */}

            <FlipTask taskName={taskName} mode="after" duration={duration} />

            {/* <BottomNav /> */}
        </div>
    );
}

export default FlipAfter;
