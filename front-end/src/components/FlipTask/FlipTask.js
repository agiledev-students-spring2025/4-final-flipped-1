import React, { useState } from 'react';
import './FlipTask.css';
import TaskOptionsModal from '../TaskOptionsModal/TaskOptionsModal';

function FlipTask({ taskId, taskName, mode, duration, onDelete, onRename, onChangeColor }) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    console.log(taskName, mode, duration)
    return (
        <div className="flip-container" onClick={() => setIsModalOpen(true)}>
            <h2 className="task-title">{taskName}</h2>

            {mode === "before" ? (
                <p className="flip-time">Total Flip Time Today: {duration} seconds</p>
            ) : (
                <p className="flip-time">You have flipped for {duration} seconds</p>
            )}

            <button className="return-home" onClick={(e) => { e.stopPropagation(); window.location.href = '/'; }}>
                Return Home
            </button>

            <p className="flip-start" onClick={(e) => e.stopPropagation()}>Flip to Start!</p>

            {isModalOpen && (
                <TaskOptionsModal
                    taskId={taskId}
                    taskName={taskName}
                    onClose={() => setIsModalOpen(false)}
                    onDelete={(id) => { console.log(`Delete task with id: ${id}`); onDelete(id); }}
                    onRename={(id, newName) => { console.log(`Rename task with id: ${id} to ${newName}`); onRename(id, newName); }}
                    onChangeColor={(id, color) => { console.log(`Change color of task with id: ${id} to ${color}`); onChangeColor(id, color); }}
                />
            )}
        </div>
    );
}

export default FlipTask;
