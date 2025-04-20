import React, { useState } from 'react';
import './AddTodoModal.css';

function AddTodoModal({ isOpen, onClose, onSubmit }) {
  const [todoData, setTodoData] = useState({
    date: '',
    toDo: '',
    startTime: '',
    endTime: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTodoData({ ...todoData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      todoData.date.trim() &&
      todoData.toDo.trim() &&
      todoData.startTime.trim() &&
      todoData.endTime.trim()
    ) {
      onSubmit(todoData);
      setTodoData({
        date: '',
        toDo: '',
        startTime: '',
        endTime: '',
      });
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Add Todo</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="input-container">
            <input
              type="date"
              name="date"
              value={todoData.date}
              onChange={handleChange}
              className="todo-input"
              autoFocus
              required
            />
          </div>
          <div className="input-container">
            <input
              type="text"
              name="toDo"
              value={todoData.toDo}
              onChange={handleChange}
              placeholder="Enter To-do (e.g., Interview with A)"
              className="todo-input"
              required
            />
          </div>
          <div className="input-container">
          <div className="field-label">Enter Start-time (e.g., 14:00)</div>
            <input
              type="time"
              name="startTime"
              value={todoData.startTime}
              onChange={handleChange}
              className="todo-input"
              required
            />
          </div>
          <div className="input-container">
          <div className="field-label">Enter End-time (e.g., 15:00)</div>
            <input
              type="time"
              name="endTime"
              value={todoData.endTime}
              onChange={handleChange}
              className="todo-input"
              required
            />
          </div>
          <div className="button-container">
            <button type="button" className="cancel-button" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="submit-button">
              Add Todo
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddTodoModal;
