import React, { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useSwipeable } from 'react-swipeable';
import './FlipAfter.css';
import FlipTask from '../../components/FlipTask/FlipTask';
import Header from '../../components/header/Header';
import BottomNav from '../../components/BottomNav/BottomNav';
import axios from 'axios';
import { API_ENDPOINTS } from '../../config/api';

function FlipAfter() {
    const location = useLocation();
    const taskName = location.state?.taskName || "Unknown Task"; // 获取 taskName
    const taskColor = location.state?.taskColor || "#eeecf9";
    const [todayTime, setTodayTime] = useState(0);  

    const navigate = useNavigate();

    const queryParams = new URLSearchParams(location.search);
    const duration = queryParams.get("duration");
    const [startTime, setStartTime] = useState(null);
    const [isFlipped, setIsFlipped] = useState(false);

    //定义赋值一下flipbefore传来的today time
    useEffect(() => {
        if (location.state?.todayTime != null) {
          setTodayTime(location.state.todayTime);
        }
      }, [location.state]);      


    //send flip log data to database
    const sendFlipLog = async (task_name, startTimestamp, duration) => {
        const user = JSON.parse(localStorage.getItem("user"));
        const startDate = new Date(startTimestamp); 
        const endDate = new Date(startDate.getTime() + duration * 1000); 
      
        const flipData = {
            task_name,
            start_time: startDate.toISOString(),
            end_time: endDate.toISOString(),
            duration
        };

        try {
            const config = { withCredentials: true,};
            if (user?.token) {
              config.headers = { Authorization: `jwt ${user.token}`};
            }
            const res = await axios.post(API_ENDPOINTS.FLIPLOG.INSERT, flipData, config);
            
            if (res.data.fromDB === false) {
              // toast.info("You're not logged in, so your data won't be saved.");
              return duration; // 未登录时就直接返回本次 flip duration
            } else {
              const todayTotal = res.data.todayTotalTime;
              return todayTotal
            }
        } catch (err) {
          console.error("Fail to send flip log data:", err);
        }
    };


    //检测orientation翻
    useEffect( () => {
        const handleOrientation = (event) => {
        const beta = event.beta;
        // console.log(event.beta)

        if ( ( beta<-120 || beta > 120 ) && !isFlipped) {
            setIsFlipped(true);
            setStartTime(Date.now());
            // console.log(event)
            // console.log("this is flipped",isFlipped) 
        } else if ( (beta>-90 && beta < 90) && isFlipped) {
            if (startTime){
                const duration = Math.floor((Date.now() - startTime) / 1000); 
                setIsFlipped(false);
                // console.log(duration)
                // console.log(isFlipped)
                
                (async () => {
                    try {
                    //在这里调用函数之后return today time会，然后我们把today time也用setTodayTime set掉
                    const todayTotal = await sendFlipLog(taskName, startTime, duration);
                    setTodayTime(todayTotal);
                    
                    // 刷新 FlipAfter 页面，传递翻转时长
                    navigate(`/flipafter/${taskName}?duration=${duration}`, {
                        state: {
                        taskName,
                        taskColor,
                        todayTime: todayTotal
                        }
                    });
                    } catch (err) {
                    console.error("Failed to handle flip log:", err);
                    }
                })();
            }  
        }
        };

        //监听设备方向变化
        //浏览器调试用
        window.addEventListener("deviceorientation", handleOrientation);

        // 组件卸载时，移除事件监听
        return () => {
            window.removeEventListener("deviceorientation", handleOrientation);
        };
    }, [isFlipped, startTime, taskName, navigate, todayTime]);


    return (
        <div className={`flip-after-page ${isFlipped ? 'black-screen' : ''}`}
            style={{ backgroundColor: isFlipped ? 'black' : taskColor }}>
            {/* <Header /> */}

            <FlipTask taskName={taskName} mode="after" duration={duration} />

            {/* <BottomNav /> */}
        </div>
    );
}

export default FlipAfter;
