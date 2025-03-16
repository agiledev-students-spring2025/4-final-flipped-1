import React, { useState } from 'react';
import './AddTaskModal.css';

const COLORS = [ "#6ddefe", "#a8c6e0", "#cbbfe6", "#fde8f2", "#f6bf96","#febe46","#fee767", "#fdec9a", "#cfeb97", "#bafede", "#DFF3E4"];

function AddTaskModal({ isOpen, onClose, onSubmit }) {
  const [taskName, setTaskName] = useState('');
  const [taskColor, setTaskColor] = useState(COLORS[0]); // 默认选中第一个颜色

  const handleSubmit = (e) => {
    e.preventDefault();
    if (taskName.trim()) {
      onSubmit({ name: taskName, color: taskColor });
      setTaskName('');
      setTaskColor(COLORS[0]);  // 重置颜色选择
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Add Task</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="input-container">
            <input
              type="text"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              placeholder="Type the name of task"
              className="task-input"
              autoFocus
            />
          </div>

          {/* 任务颜色选择器 */}
          <div className="color-picker-container">
            <div className="color-options">
              {COLORS.map((color) => (
                <button
                  key={color}
                  className={`color-button ${taskColor === color ? 'selected' : ''}`}
                  style={{ backgroundColor: color }}
                  onClick={(e) => {
                    e.preventDefault(); // 阻止提交
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
              Add
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddTaskModal; 