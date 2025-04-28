import React, { useState, useEffect } from 'react';
import './AddTaskModal.css';

const COLORS = [ "#6ddefe", "#a8c6e0", "#cbbfe6", "#fde8f2", "#f6bf96","#febe46","#fee767", "#fdec9a", "#cfeb97", "#bafede", "#DFF3E4"];
const MAX_TASKS = 10;

function AddTaskModal({ isOpen, onClose, onSubmit, editingTask, tasks }) {
  const [taskName, setTaskName] = useState('');
  const [taskColor, setTaskColor] = useState(COLORS[0]);
  const [error, setError] = useState('');

  useEffect(() => {
    // console.log('Effect triggered:', { editingTask, isOpen });
    if (editingTask) {
      setTaskName(editingTask.task_name);
      setTaskColor(editingTask.color);
    } else {
      setTaskName('');
      setTaskColor(COLORS[0]);
    }
    // Set error message for task limit
    if (!editingTask && tasks.length >= MAX_TASKS) {
      setError('Maximum number of tasks reached');
    } else {
      setError('');
    }
  }, [editingTask, isOpen, tasks.length]);

  const validateTaskName = (name) => {
    const trimmedName = name.trim();
    
    // Check task limit first
    if (!editingTask && tasks.length >= MAX_TASKS) {
      setError('Maximum number of tasks (10) reached');
      return false;
    }

    if (!trimmedName) {
      setError('Task name cannot be empty');
      return false;
    }

    const isDuplicate = tasks.some(task => 
      task.task_name === trimmedName && 
      (!editingTask || task._id !== editingTask._id)
    );

    if (isDuplicate) {
      setError('Task name already exists');
      return false;
    }

    setError('');
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateTaskName(taskName)) {
      return;
    }

    const user = JSON.parse(localStorage.getItem("user"));
    const payload = {
      task_name: taskName.trim(),
      color: taskColor
    };
    if (user?.user_id) {
      payload.user_id = user.user_id;
    }
    onSubmit(payload); // 调用 MainPage.js 的 handleAddTask
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{editingTask ? 'Edit Task' : 'Add Task'}</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="input-container">
            <input
              type="text"
              value={taskName}
              onChange={(e) => {
                setTaskName(e.target.value);
                validateTaskName(e.target.value);
              }}
              placeholder="Type the name of task"
              className={`task-input ${error ? 'error' : ''}`}
              autoFocus
              disabled={!editingTask && tasks.length >= MAX_TASKS}
            />
            <div className="input-message-container">
              {!editingTask && (
                <div className="task-count">
                  {tasks.length}/{MAX_TASKS} tasks
                </div>
              )}
              {error && <div className="error-message">{error}</div>}
            </div>
          </div>

          <div className="color-picker-container">
            <div className="color-options">
              {COLORS.map((color) => (
                <button
                  key={color}
                  className={`color-button ${taskColor === color ? 'selected' : ''}`}
                  style={{ backgroundColor: color }}
                  onClick={(e) => {
                    e.preventDefault();
                    setTaskColor(color);
                  }}
                />
              ))}
            </div>
          </div>

          <div className="button-container">
            <button type="button" className="cancel-button" onClick={onClose}>
              Cancel
            </button>
            <button 
              type="submit" 
              className="submit-button" 
              disabled={!!error || (!editingTask && tasks.length >= MAX_TASKS)}
            >
              {editingTask ? 'Save' : 'Add'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddTaskModal;