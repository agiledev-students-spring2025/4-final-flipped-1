import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSwipeable } from 'react-swipeable';
import './FlipBefore.css';
import FlipTask from '../../components/FlipTask/FlipTask';
import Header from '../../components/header/Header';
import BottomNav from '../../components/BottomNav/BottomNav';

function FlipBefore() {
    const { taskId } = useParams(); // 从 URL 获取 taskId
    const navigate = useNavigate();
    const taskCount = 3;  // 任务总数，防止滑出范围
    const [isFlipped, setIsFlipped] = useState(false); //true的话代表现在正在flipped
    const [startTime, setStartTime] = useState(null);   
    const [flipDuration, setFlipDuration] = useState(0);
    const [totalFlipTime, setTotalFlipTime] = useState(
        parseFloat(localStorage.getItem("totalFlipTime")) || 0
    );


    useEffect(() => {
        const handleOrientation = (event) => {
            const beta = event.beta; // `beta` 代表前后倾斜角度 绕x轴
            console.log(event.beta)

            if ( ( beta<-120 || beta > 120 ) && !isFlipped) {
                // 手机翻转超过 90°，进入黑屏状态并开始计时
                setIsFlipped(true);
                setStartTime(Date.now());
                console.log(event)
                console.log("this is flipped",isFlipped) 
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
                    console.log(duration)
                    console.log(isFlipped)

                    // 跳转到 FlipAfter 页面，并传递翻转时长
                    navigate(`/flipafter/${taskId}?duration=${duration}`);
                }  
            }
        };

        // gamma = 0-89
        //         0--89


        // function handleOrientation(e){
        //     console.log(e);
        // }

        try{
            // const permissionState = await DeviceOrientationEvent.requestPerission()
            // if (permissionState === 'granted'){
                window.addEventListener("deviceorientation", handleOrientation);
            // }
        } catch(error){
            console.log(error)
        }

        // 监听设备方向变化
        // window.addEventListener("deviceorientation", handleOrientation);

        return () => {
            // 组件卸载时，移除事件监听
            window.removeEventListener("deviceorientation", handleOrientation);
        };
    }, [isFlipped, startTime, taskId, navigate, totalFlipTime]);



    // 处理左滑（上一个任务）
    const taskLeftSwipe = () => {
        const prevTask = Math.max(parseInt(taskId) - 1, 1);
        navigate(`/flipbefore/${prevTask}`);
    };

    // 处理右滑（下一个任务）
    const taskRightSwipe = () => {
        const nextTask = Math.min(parseInt(taskId) + 1, taskCount);
        navigate(`/flipbefore/${nextTask}`);
    };

    //这东西目前滑不了啊
    const handlers = useSwipeable({
        onSwipedLeft: taskLeftSwipe, 
        onSwipedRight: taskRightSwipe, 
        preventDefaultTouchmoveEvent: true,
        trackMouse: true, // 允许鼠标滑动（适用于桌面浏览器）
    });


    return (
        <div className={`flip-before-page ${isFlipped ? 'black-screen' : ''}`}>
            <Header />

            <FlipTask taskId={taskId} mode = "before" duration={totalFlipTime} />

            <BottomNav />
        </div>
    );
}

export default FlipBefore; 



