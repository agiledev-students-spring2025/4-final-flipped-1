import React from 'react';
import './TaskOptionsModal.css';

function TaskOptionsModal({ taskId, taskName, onClose, onDelete, onEdit }) {
  return (
    <div className="modal-overlay2">
      <div className="modal-content">
        <h2>Task Options</h2>
        <button onClick={() => onDelete(taskId)}>Delete Task</button>
        <button onClick={() => onEdit({ id: taskId, name: taskName })}>Edit Task</button>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
}

export default TaskOptionsModal; 