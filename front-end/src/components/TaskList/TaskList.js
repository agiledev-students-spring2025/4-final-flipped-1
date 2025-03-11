import React from 'react';
import './TaskList.css';

function TaskList() {
  return (
    <div className="task-list">
      <div className="task-item">
        <div className="task-text">Task 1</div>
        <button className="flip-button">Flip</button>
      </div>
      <div className="task-item">
        <div className="task-text">Task 2</div>
        <button className="flip-button">Flip</button>
      </div>
      <div className="task-item">
        <div className="task-text">Task 3</div>
        <button className="flip-button">Flip</button>
      </div>
    </div>
  );
}

export default TaskList; 