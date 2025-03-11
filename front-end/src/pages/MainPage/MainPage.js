import React from 'react';
import './MainPage.css';
import Header from '../../components/header/Header';
import TaskList from '../../components/TaskList/TaskList';
import BottomNav from '../../components/BottomNav/BottomNav';



function MainPage() {
  return (
    <div className="main-page">
      <Header />
      <TaskList />
      <BottomNav />
    </div>
  );
}

export default MainPage; 