import React from 'react';
import './FlipTask.css';
import { useNavigate } from 'react-router-dom';


function FlipTask({ taskName, mode, duration }) {
    const navigate = useNavigate();

    console.log(taskName, mode, duration)

    // input: duration in second 
    // output: duration in hour, min, second
    function formatDuration(seconds) {
        const s = Math.floor(seconds % 60);
        const m = Math.floor((seconds / 60) % 60);
        const h = Math.floor(seconds / 3600);

        if (seconds < 60) {
            return `${s} s`;
        } else if (seconds < 3600) {
            return `${m} m ${s} s`;
        } else {
            return `${h} h ${m} m`;
        }
    }

    return (
        <div className="flip-container">
            <h2 className="task-title">{taskName}</h2>

            {mode === "before" ? (
                <p className="flip-time">Total Flip Time Today: {formatDuration(duration)}</p>
            ) : (
                <p className="flip-time">You have flipped for {formatDuration(duration)}</p>
            )}

            <button
                className="return-home"
                onClick={() => navigate('/', { state: { fromFlipAfter: true } })}
            >
            Return Home
            </button>

            <p className="flip-start">Flip to Start!</p>

        </div>
    );
}

export default FlipTask;
