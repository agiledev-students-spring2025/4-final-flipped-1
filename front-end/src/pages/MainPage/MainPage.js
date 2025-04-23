import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TaskList from '../../components/TaskList/TaskList';
import AddTaskModal from '../../components/AddTaskModal/AddTaskModal';
import { API_ENDPOINTS } from '../../config/api';
import BottomNav from '../../components/BottomNav/BottomNav';
import './MainPage.css';

function MainPage() {
  const [tasks, setTasks] = useState([]);
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const config = {
        withCredentials: true,
      };
  
      if (user?.token) {
        config.headers = {
          Authorization: `jwt ${user.token}`,
        };
      }
  
      const response = await axios.get(API_ENDPOINTS.TASKS.LIST, config);
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };
  

  const handleAddTask = async (newTask) => {
    //console.log('handleAddTask called with:', newTask);
    try {
      let response;
      if (editingTask) {
        console.log('Updating existing task:', editingTask.task_id);
        response = await axios.put(API_ENDPOINTS.TASKS.UPDATE(editingTask.task_id), newTask);
        setTasks(tasks.map(task => 
          task.task_id === editingTask.task_id ? response.data : task
        ));
      } else {
        console.log('Creating new task');
        response = await axios.post(API_ENDPOINTS.TASKS.CREATE, newTask);
        setTasks([...tasks, response.data]);
      }
      handleCloseModal();
    } catch (error) {
      console.error('Error adding/updating task:', error);
    }
  };

  const handleEditTask = (task) => {
    console.log('handleEditTask called with:', task);
    setEditingTask(task);
    setIsAddTaskModalOpen(true);
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await axios.post(API_ENDPOINTS.TASKS.DELETE(taskId));
      setTasks(tasks.filter(task => task.task_id !== taskId));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleOpenAddModal = () => {
    console.log('Opening add modal');
    setEditingTask(null);
    setIsAddTaskModalOpen(true);
  };

  const handleCloseModal = () => {
    console.log('Closing modal');
    setIsAddTaskModalOpen(false);
    setEditingTask(null);
  };

  return (
    <div className="main-page">
      <header className="header">
        <h1>Flipped</h1>
        <button className="add-button" onClick={handleOpenAddModal}>+</button>
      </header>

      <div className="main-content">
        <TaskList 
          tasks={tasks} 
          onEditTask={handleEditTask}
          onDeleteTask={handleDeleteTask}
        />
      </div>

      <BottomNav />

      <AddTaskModal
        isOpen={isAddTaskModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleAddTask}
        editingTask={editingTask}
      />
    </div>
  );
}

export default MainPage;