import React, { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useSwipeable } from 'react-swipeable';
import './FlipAfter.css';
import FlipTask from '../../components/FlipTask/FlipTask';
import Header from '../../components/header/Header';
import BottomNav from '../../components/BottomNav/BottomNav';

function FlipAfter() {
    const { taskId } = useParams();
    const location = useLocation();
    const navigate = useNavigate();

    const queryParams = new URLSearchParams(location.search);

    const duration = queryParams.get("duration");
    const [startTime, setStartTime] = useState(null);
    const [flipDuration, setFlipDuration] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [totalFlipTime, setTotalFlipTime] = useState(
        parseFloat(localStorage.getItem("totalFlipTime")) || 0
    );

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

                    // 刷新 FlipAfter 页面，并更新翻转时长
                    navigate(`/flipafter/${taskId}?duration=${duration}`);
                }  
            }

        };

        try{
            // const permissionState = await DeviceOrientationEvent.requestPerission()
            // if (permissionState === 'granted'){
                window.addEventListener("deviceorientation", handleOrientation);
            // }
        } catch(error){
            console.log(error)
        }

        return () => {
            window.removeEventListener("deviceorientation", handleOrientation);
        };
    }, [isFlipped, startTime, taskId, navigate, totalFlipTime]);


    return (
        <div className={`flip-after-page ${isFlipped ? 'black-screen' : ''}`}>
            <Header />

            <FlipTask taskId={taskId} mode="after" duration={duration} />

            <BottomNav />
        </div>
    );
}

export default FlipAfter;
