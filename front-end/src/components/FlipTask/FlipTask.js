import React from 'react';
import './FlipTask.css';

function FlipTask({ taskName, mode, duration }) {
    console.log(taskName, mode, duration)
    return (
        <div className="flip-container">
            <h2 className="task-title">{taskName}</h2>

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
