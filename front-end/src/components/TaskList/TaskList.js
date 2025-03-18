import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './TaskList.css';
import TaskOptionsModal from '../TaskOptionsModal/TaskOptionsModal';
import AddTaskModal from '../AddTaskModal/AddTaskModal';

function TaskList({ tasks, onDelete, onRename, onChangeColor }) {
  const navigate = useNavigate();
  const [selectedTask, setSelectedTask] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleTaskClick = (task) => {
    setSelectedTask(task);
  };

  const handleEditTask = (taskId) => {
    setIsEditModalOpen(true);
  };

  return (
    <div className="task-list">
      {tasks.map(task => (
        <div key={task.id} className="task-item" onClick={() => handleTaskClick(task)}>
          <div className="task-text">{task.name}</div>
          <button className="flip-button" onClick={() => navigate(`/flipbefore/${task.id}`)}>Flip</button>
        </div>
      ))}

      {selectedTask && (
        <TaskOptionsModal
          taskId={selectedTask.id}
          taskName={selectedTask.name}
          onClose={() => setSelectedTask(null)}
          onDelete={(id) => { console.log(`Delete task with id: ${id}`); onDelete(id); setSelectedTask(null); }}
          onEdit={() => { setIsEditModalOpen(true); setSelectedTask(selectedTask); }}
        />
      )}

      {isEditModalOpen && selectedTask && (
        <AddTaskModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onSubmit={(taskName) => { console.log(`Task name to submit: ${taskName}`); /* onRename(selectedTask.id, taskName); */ setIsEditModalOpen(false); setSelectedTask(null); }}
        />
      )}
    </div>
  );
}

// {tasks.map(task => (
//   <li key={task.id} style={{ color: task.color }}> 
//     {task.name} 
//   </li>
// ))}


export default TaskList;
