import React from 'react';
import { useNavigate } from 'react-router-dom';
import './TaskList.css';

function TaskList() {
  const navigate = useNavigate();

  const tasks = [
    { id: 1, name: 'Read Books' },
    { id: 2, name: 'Study' },
    { id: 3, name: 'Watching Video' }
  ];

  const FlipTaskClick = (taskId) => {
    navigate(`/flipbefore/${taskId}`);  // 使用反引号（`）
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
