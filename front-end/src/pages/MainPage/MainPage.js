import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
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
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  //抓最开始显示的task显示在主页面上
  //后端会判断是否登陆 - 展示对应id的task或者展示默认task
  useEffect(() => {
    console.log("🚀 API endpoint:", API_ENDPOINTS.TASKS.LIST);
    fetchTasks();

    if (location.state?.fromFlipAfter) {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user || !user.token) {
        setShowLoginPrompt(true);
      }
    }
  }, [location.state]);

  const fetchTasks = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const config = { withCredentials: true, };
  
      if (user?.token) {
        config.headers = { Authorization: `jwt ${user.token}`, };
      }
  
      const response = await axios.get(API_ENDPOINTS.TASKS.LIST, config);
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };
  
  //Add
  const handleAddTask = async (newTask) => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const config = { 
        withCredentials: true,
        headers: { Authorization: `jwt ${user.token}` }
      };

      let response;
      if (editingTask) {
        console.log('Updating existing task:', editingTask.task_name);
        console.log('Request URL:', API_ENDPOINTS.TASKS.UPDATE(editingTask.task_name));
        console.log('Request data:', newTask);
        console.log('Request config:', config);
        
        response = await axios.put(
          API_ENDPOINTS.TASKS.UPDATE(editingTask.task_name), 
          newTask,
          config
        );
      } else {
        console.log('Creating new task');
        response = await axios.post(
          API_ENDPOINTS.TASKS.CREATE, 
          newTask,
          config
        );
      }
      
      await fetchTasks();
      handleCloseModal();
    } catch (error) {
      console.error('Error adding/updating task:', error);
    }
  };

  //Edit
  const handleEditTask = (task) => {
    console.log('handleEditTask called with:', task);
    setEditingTask(task);
    setIsAddTaskModalOpen(true);
  };

  //Delete
  const handleDeleteTask = async (taskName) => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const config = { 
        withCredentials: true,
        headers: { Authorization: `jwt ${user.token}` }
      };

      await axios.post(API_ENDPOINTS.TASKS.DELETE(taskName), null, config);
      await fetchTasks(); // 删除后重新获取任务列表
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

  const handleConfirmLogin = () => {
    navigate('/login');
  };

  const handleCancelPrompt = () => {
    setShowLoginPrompt(false);
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
        tasks={tasks}
      />

      {showLoginPrompt && (
        <div className="overlay">
          <div className="modal-card">
            <h2 className="modal-title">Not Logged In</h2>
            <p className="modal-message">You haven't logged in yet, so your Flip record will not be saved. Would you like to login now?</p>
            <div className="modal-actions">
              <button className="modal-button cancel" onClick={handleCancelPrompt}>Cancel</button>
              <button className="modal-button confirm" onClick={handleConfirmLogin}>Go to Login</button>
            </div>
          </div>
        </div>
      )}



    </div>
  );
}

export default MainPage;