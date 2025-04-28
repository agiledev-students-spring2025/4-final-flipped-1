import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './TaskList.css';
import TaskOptionsModal from '../TaskOptionsModal/TaskOptionsModal';

function TaskList({ tasks, onEditTask, onDeleteTask }) {
  const navigate = useNavigate();
  const [selectedTask, setSelectedTask] = useState(null);
  const totalFlipTime = parseFloat(localStorage.getItem("totalFlipTime")) || 0;
  // console.log("this is a test print of tasks", tasks)
  

  //函数，点对应task的flip按钮跳转对应flipbefore page
  const FlipTaskClick = (task) => {
    navigate(`/flipbefore/${task.task_name}`, { state: { taskName: task.task_name, taskColor: task.color } }); 
    console.log("Navigating to flip page with task name:", task.task_name);
  };

  const handleTaskClick = (task, e) => {
    // 如果点击的是 Flip 按钮，不要打开选项弹窗
    if (e.target.className === 'flip-button') return;
    setSelectedTask(task);
  };

  return (
    <div className="task-list">
      {tasks.map(task => (
        <div 
          key={task._id}
          className="task-item"
          onClick={(e) => handleTaskClick(task, e)}
        >
          <div className="task-text">{task.task_name}</div>
          <button className="flip-button" onClick={() => FlipTaskClick(task)}>Flip</button>
        </div>
      ))}

      <TaskOptionsModal
        isOpen={selectedTask !== null}
        onClose={() => setSelectedTask(null)}
        onEdit={() => onEditTask(selectedTask)}
        onDelete={() => onDeleteTask(selectedTask?.task_name)}
      />
    </div>
  );
}

// {tasks.map(task => (
//   <li key={task.id} style={{ color: task.color }}> 
//     {task.name} 
//   </li>
// ))}


export default TaskList;
