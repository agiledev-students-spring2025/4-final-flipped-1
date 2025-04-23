import React, { useState, useEffect } from 'react';
import './AddTaskModal.css';

const COLORS = [ "#6ddefe", "#a8c6e0", "#cbbfe6", "#fde8f2", "#f6bf96","#febe46","#fee767", "#fdec9a", "#cfeb97", "#bafede", "#DFF3E4"];

function AddTaskModal({ isOpen, onClose, onSubmit, editingTask }) {
  const [taskName, setTaskName] = useState('');
  const [taskColor, setTaskColor] = useState(COLORS[0]);

  useEffect(() => {
    // console.log('Effect triggered:', { editingTask, isOpen });
    if (editingTask) {
      setTaskName(editingTask.task_name);
      setTaskColor(editingTask.color);
    } else {
      setTaskName('');
      setTaskColor(COLORS[0]);
    }
  }, [editingTask]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmedName = taskName.trim();
  
    if (trimmedName) {
      const user = JSON.parse(localStorage.getItem("user"));
      const payload = {
        task_name: trimmedName,
        color: taskColor
      };
      if (user?.user_id) {
        payload.user_id = user.user_id;
      }
      onSubmit(payload); // 调用 MainPage.js 的 handleAddTask
    }
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
                // console.log('Input changed:', e.target.value);
                setTaskName(e.target.value);
              }}
              placeholder="Type the name of task"
              className="task-input"
              autoFocus
            />
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
            <button type="submit" className="submit-button">
              {editingTask ? 'Save' : 'Add'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddTaskModal;