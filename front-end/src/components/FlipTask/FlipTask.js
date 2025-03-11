import React from 'react';
import './FlipTask.css';

function FlipTask({ taskId, mode, duration }) {
    console.log(taskId, mode, duration)
    return (
        <div className="flip-container">
            <h2 className="task-title">Task {taskId}</h2>

            {mode === "before" ? (
                <p className="flip-time">Total Flip Time Today: {duration} seconds</p>
            ) : (
                <p className="flip-time">You have flipped for {duration} seconds</p>
            )}

            <button className="return-home" onClick={() => window.location.href = '/'}>
                Return Home
            </button>

            <p className="flip-start">Flip to Start!</p>

        </div>
    );
}

export default FlipTask;
