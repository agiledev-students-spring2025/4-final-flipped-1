import React from 'react';
import './TaskOptionsModal.css';

function TaskOptionsModal({ isOpen, onClose, onEdit, onDelete }) {
  if (!isOpen) return null;

  return (
    <div className="task-options-overlay" onClick={onClose}>
      <div className="task-options-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Task Options</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        <button className="option-button edit-button" onClick={() => {
          onEdit();
          onClose();
        }}>
          <span className="material-icons">Edit Task</span>
        </button>
        <button className="option-button delete-button" onClick={() => {
          onDelete();
          onClose();
        }}>
          <span className="material-icons">Delete Task</span>
        </button>
      </div>
    </div>
  );
}

export default TaskOptionsModal;
