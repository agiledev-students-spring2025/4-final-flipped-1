import React, { useState } from 'react';
import './Header.css';
import AddTaskModal from '../AddTodoModal/AddTodoModal';

function Header({ onAddTask }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="header">
      <h1>Flipped</h1>
      <button className="add-button" onClick={() => setIsModalOpen(true)}>+</button>
      <AddTaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={(taskName) => {
          onAddTask(taskName);
          setIsModalOpen(false);
        }}
      />

    </div>
  );
}



export default Header; 