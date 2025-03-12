import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSwipeable } from 'react-swipeable';
import './FlipBefore.css';
import FlipTask from '../../components/FlipTask/FlipTask';
import Header from '../../components/header/Header';
import BottomNav from '../../components/BottomNav/BottomNav';

function FlipBefore() {
    const { taskId } = useParams(); // 从 URL 获取 taskId
    const navigate = useNavigate();
    const taskCount = 3; // 任务总数，防止滑出范围

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
        <div className="Flip-before-page">
            <Header />
            <FlipTask taskId={taskId} />
            <BottomNav />
        </div>
    );
}

export default FlipBefore; 



