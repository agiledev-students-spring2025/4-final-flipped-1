import React from 'react';
import { useNavigate } from 'react-router-dom';
import './TaskList.css';

function TaskList({ tasks }) {
  const navigate = useNavigate();

  const FlipTaskClick = (taskId) => {
    navigate(`/flipbefore/${taskId}`);
  };

  return (
    <div className="task-list">
      {tasks.map(task => (
        <div key={task.id} className="task-item">
          <div className="task-text">{task.name}</div>
          <button className="flip-button" onClick={() => FlipTaskClick(task.id)}>Flip</button>
        </div>
      ))}
    </div>
  );
}

export default TaskList;
