import React, { useState } from 'react';
import './MainPage.css';
import Header from '../../components/header/Header';
import TaskList from '../../components/TaskList/TaskList';
import BottomNav from '../../components/BottomNav/BottomNav';

function MainPage() {
  const [tasks, setTasks] = useState([
    { id: 1, name: 'Read Books' },
    { id: 2, name: 'Study' },
    { id: 3, name: 'Watching Video' }
  ]);

  const handleAddTask = (taskName) => {
    const newTask = {
      id: tasks.length > 0 ? Math.max(...tasks.map(task => task.id)) + 1 : 1,
      name: taskName
    };
    setTasks([...tasks, newTask]);
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