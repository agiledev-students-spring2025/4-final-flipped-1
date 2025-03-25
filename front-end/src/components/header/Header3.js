import React, { useState } from 'react';
import './Header.css';
import AddTaskModal from '../AddTodoModal/AddTodoModal';

function Header({ onAddTask }) {
  console.log("onAddTask in Header3:", onAddTask); // Debugging log

  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="header">
      <h1>Flipped</h1>
      <button className="add-button" onClick={() => setIsModalOpen(true)}>+</button>
      <AddTaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={(taskData) => {
          console.log("Submitting task:", taskData);
          if (typeof onAddTask === "function") {
            onAddTask(taskData);
          } else {
            console.error("onAddTask is NOT a function!", onAddTask);
          }
          setIsModalOpen(false);
        }}
      />
    </div>
  );
}

export default Header;
