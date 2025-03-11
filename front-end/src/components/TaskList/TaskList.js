import React from 'react';
import { useNavigate } from 'react-router-dom';
import './TaskList.css';

function TaskList() {
  const navigate = useNavigate();
  const totalFlipTime = parseFloat(localStorage.getItem("totalFlipTime")) || 0;


  const tasks = [
    { id: 1, name: 'Read Books' },
    { id: 2, name: 'Study' },
    { id: 3, name: 'Watching Video' }
  ];

  const FlipTaskClick = (taskId) => {
    navigate(`/flipbefore/${taskId}?mode=before&totalTime=${totalFlipTime}`);  // 传递 mode=before
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
