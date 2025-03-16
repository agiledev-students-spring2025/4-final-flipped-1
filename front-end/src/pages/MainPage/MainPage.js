import React, { useState } from 'react';
import './MainPage.css';
import Header from '../../components/header/Header';
import TaskList from '../../components/TaskList/TaskList';
import BottomNav from '../../components/BottomNav/BottomNav';

function MainPage() {
  const [tasks, setTasks] = useState([
    { id: 1, name: 'Read Books', color: "#dbf7ff" },
    { id: 2, name: 'Study', color: "#fefbfc" },
    { id: 3, name: 'Watching Video', color: "#fff6e6" }
  ]);

  const handleAddTask = (newTask) => {
    const newTaskWithId = {
      id: tasks.length > 0 ? Math.max(...tasks.map(task => task.id)) + 1 : 1,
      name: newTask.name,
      color: newTask.color
    };
    setTasks([...tasks, newTaskWithId]);
  };

  return (
    <div className="main-page">
      <Header onAddTask={handleAddTask} />
      <TaskList tasks={tasks} />
      <BottomNav />
    </div>
  );
}

export default MainPage; 