import React, { useState } from 'react';
import './AddTodoModal.css';

function AddTodoModal({ isOpen, onClose, onSubmit }) {
  const [todoData, setTodoData] = useState({
    date: '',
    toDo: '',
    time: '',
    TimeRange: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTodoData({ ...todoData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validate that all fields are provided
    if (
      todoData.date.trim() &&
      todoData.toDo.trim() &&
      todoData.time.trim() &&
      todoData.TimeRange.trim()
    ) {
      onSubmit(todoData);
      // Reset the form fields
      setTodoData({
        date: '',
        toDo: '',
        time: '',
        TimeRange: '',
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
              type="text"
              name="date"
              value={todoData.date}
              onChange={handleChange}
              placeholder="Enter Date (e.g., 20 Feb)"
              className="todo-input"
              autoFocus
            />
          </div>
          <div className="input-container">
            <input
              type="text"
              name="toDo"
              value={todoData.toDo}
              onChange={handleChange}
              placeholder="Enter Todo (e.g., Interview with A)"
              className="todo-input"
            />
          </div>
          <div className="input-container">
            <input
              type="text"
              name="time"
              value={todoData.time}
              onChange={handleChange}
              placeholder="Enter Time (e.g., 14:00)"
              className="todo-input"
            />
          </div>
          <div className="input-container">
            <input
              type="text"
              name="TimeRange"
              value={todoData.TimeRange}
              onChange={handleChange}
              placeholder="Enter Duration (e.g., 15min)"
              className="todo-input"
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
