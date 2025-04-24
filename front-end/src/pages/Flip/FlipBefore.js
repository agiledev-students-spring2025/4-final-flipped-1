import React, { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useSwipeable } from 'react-swipeable';
import './FlipBefore.css';
import FlipTask from '../../components/FlipTask/FlipTask';
import Header from '../../components/header/Header';
import BottomNav from '../../components/BottomNav/BottomNav';
import axios from 'axios';
import { API_ENDPOINTS } from '../../config/api';
import { ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function FlipBefore() {

    const location = useLocation();
    const taskName = location.state?.taskName || "Unknown Task"; // 从navigate（tasklist.js）得到 taskName
    const taskColor = location.state?.taskColor || "#eeecf9";

    const navigate = useNavigate();
    const taskCount = 3;  // 任务总数，防止滑出范围


    const [isFlipped, setIsFlipped] = useState(false); //true的话代表现在正在flipped
    const [startTime, setStartTime] = useState(null); //标记每次开始flip的时候
    const [todayTime, setTodayTime] = useState(0);  //用来显示标记和update一天该task的总flip时长

    //进入页面的时候抓今天的该task的使用时长
    useEffect(() => {
      const fetchTodayTime = async () => {
        try {
          const user = JSON.parse(localStorage.getItem("user"));
    
          const config = {
            withCredentials: true, // 如果你的 JWT 是基于 cookie 的
          };
    
          if (user?.token) {
            config.headers = {
              Authorization: `jwt ${user.token}`
            };
          }
    
          const res = await axios.get(API_ENDPOINTS.FLIPLOG.GET_TODAY(taskName), config);
          setTodayTime(res.data.todayTotalTime);
        } catch (err) {
          console.error("fail to get total flip time today:", err);
          // 如果未登录（401）也可以选择 setTodayTime(0);
          setTodayTime(0);
        }
      };
    
      fetchTodayTime();
    }, [taskName]);


    //用来发送flip log data的函数
    const sendFlipLog = async (task_name, startTimestamp, duration) => {
      const user = JSON.parse(localStorage.getItem("user"));
      const startDate = new Date(startTimestamp); // 开始时间对象
      const endDate = new Date(startDate.getTime() + duration * 1000); // 结束时间对象（加 duration 秒）
    
      const flipData = {
        task_name,
        start_time: startDate,
        end_time: endDate, 
        duration
      };
    
      try {
        //登陆否？
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
        const beta = event.beta; // `beta` 代表前后倾斜角度 绕x轴
        // console.log(event.beta)

        if ( ( beta<-120 || beta > 120 ) && !isFlipped) {
            // 手机翻转超过 90°，进入黑屏状态并开始计时
            setIsFlipped(true);
            setStartTime(Date.now());
            // console.log(event)
            // console.log("this is flipped",isFlipped) 
        } else if ( (beta>-90 && beta < 90) && isFlipped) {
            // 手机翻转回去，退出黑屏状态，并计算时间
            if (startTime){
              const duration = Math.floor((Date.now() - startTime) / 1000); // 计算翻转时间（秒）（向下取整）
                setIsFlipped(false);
                // console.log(duration)
                // console.log(isFlipped)
                
                (async () => {
                  try {
                    //在这里调用函数之后return today time会，然后我们把today time也用setTodayTime set掉
                    const todayTotal = await sendFlipLog(taskName, startTime, duration);
                    setTodayTime(todayTotal);
                    
                    // 跳转到 FlipAfter 页面，并传递翻转时长
                    navigate(`/flipafter/${taskName}?duration=${duration}`, {
                      state: {
                        taskName,
                        taskColor,
                        todayTime: todayTotal
                      }
                    });
                  } catch (err) {
                    console.error("Failed to handle flip log:", err);
                    // 你可以加 UI 提示，toast 等
                  }
                })(); // 匿名 async 函数立即执行
            }  
        }
      };

      // function handleOrientation(e){
      //     console.log(e);
      // }

      // const requestPermissionAndAddListener = () => {
      //     if (
      //         typeof DeviceOrientationEvent !== "undefined" &&
      //         typeof DeviceOrientationEvent.requestPermission === "function"
      //     ) {
      //         // alert("Gamma: ");
      //         DeviceOrientationEvent.requestPermission()
      //             .then((permissionState) => {
      //                 if (permissionState === "granted") {
      //                     window.addEventListener("deviceorientation", handleOrientation);
      //                 }
      //             })
      //             .catch((error) => {
      //                 console.error("Error requesting permission:", error);
      //             });
      //     } else if ("DeviceOrientationEvent" in window) {
      //         console.log("DeviceOrientationEvent supported, adding listener");
      //         alert("Alpha: " + handleOrientation.beta + handleOrientation.beta);
      //         window.addEventListener("deviceorientation", handleOrientation);
      //     } else {
      //         alert("Device orientation not supported");
      //     }
      // };

      // const setupGyroOnUserAction = () => {
      //     // alert("A: " );
      //     requestPermissionAndAddListener();
      //     document.removeEventListener("touchstart", setupGyroOnUserAction);
      //     document.removeEventListener("click", setupGyroOnUserAction);
      // };
      
      // document.addEventListener("touchstart", setupGyroOnUserAction, { once: true });
      // // alert("B: " );
      // document.addEventListener("click", setupGyroOnUserAction, { once: true });
      // alert("C: " );
      

      //监听设备方向变化
      //浏览器调试用
      window.addEventListener("deviceorientation", handleOrientation);

      // 组件卸载时，移除事件监听
      return () => {
          window.removeEventListener("deviceorientation", handleOrientation);
      };
    }, [isFlipped, startTime, taskName, navigate, todayTime]);



    // 处理左滑（上一个任务）
    // const taskLeftSwipe = () => {
    //     const prevTask = Math.max(parseInt(taskId) - 1, 1);
    //     navigate(`/flipbefore/${prevTask}`);
    // };

    // // 处理右滑（下一个任务）
    // const taskRightSwipe = () => {
    //     const nextTask = Math.min(parseInt(taskId) + 1, taskCount);
    //     navigate(`/flipbefore/${nextTask}`);
    // };

    // //这东西目前滑不了啊
    // const handlers = useSwipeable({
    //     onSwipedLeft: taskLeftSwipe, 
    //     onSwipedRight: taskRightSwipe, 
    //     preventDefaultTouchmoveEvent: true,
    //     trackMouse: true, // 允许鼠标滑动（适用于桌面浏览器）
    // });


    return (
      <>
        <div className={`flip-before-page ${isFlipped ? 'black-screen' : ''}`}
            style={{ backgroundColor: isFlipped ? 'black' : taskColor }}>

            <FlipTask taskName={taskName} mode = "before" duration={todayTime} />
            {/* <ToastContainer /> */}

        </div>
        {/* <ToastContainer /> */}
      </>
    );
}

export default FlipBefore; 



