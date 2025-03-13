import React from 'react';
import { useNavigate } from 'react-router-dom';
import './TaskList.css';

function TaskList({ tasks }) {
  const navigate = useNavigate();
  const totalFlipTime = parseFloat(localStorage.getItem("totalFlipTime")) || 0;
  console.log("this is a test print of tasks", tasks)
  

  
  const FlipTaskClick = (task) => {
    navigate(`/flipbefore/${task.id}`, { state: { taskName: task.name } }); // 传递 taskName
    console.log("this is tasklist.js page and forward task name",task.name)
    console.log("this is tasklist.js page and forward task id",task.id)
  };


  return (
    <div className="task-list">
      {tasks.map(task => (
        <div key={task.id} className="task-item">
          <div className="task-text">{task.name}</div>
          <button className="flip-button" onClick={() => FlipTaskClick(task)}>Flip</button>
        </div>
      ))}
    </div>
  );
}

export default TaskList;
