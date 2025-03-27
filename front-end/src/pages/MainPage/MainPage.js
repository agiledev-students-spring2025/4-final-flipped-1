import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './MainPage.css';
import Header from '../../components/header/Header';
import TaskList from '../../components/TaskList/TaskList';
import BottomNav from '../../components/BottomNav/BottomNav';

function MainPage() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    // Fetch tasks when component mounts
    const fetchTasks = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/tasks');
        setTasks(response.data);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };

    fetchTasks();
  }, []); // Empty dependency array means this runs once when component mounts

  const handleAddTask = async (newTask) => {
    try {
      const response = await axios.post('http://localhost:3001/api/tasks', newTask);
      setTasks([...tasks, response.data]);
    } catch (error) {
      console.error('Error adding task:', error);
    }
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