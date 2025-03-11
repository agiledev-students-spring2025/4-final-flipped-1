import React from 'react';
import './FlipTask.css';

function FlipTask({ taskId }) {
    return (
        <div className="flip-container">
            <h2 className="task-title">Task {taskId}</h2>

            <p className="today-text">Today</p>
            <p className="time-text">0 min 0 sec</p>

            <button className="return-home" onClick={() => window.location.href = '/'}>
                Return Home
            </button>

            <p className="flip-start">Flip to Start!</p>
        </div>
    );
}

export default FlipTask;
