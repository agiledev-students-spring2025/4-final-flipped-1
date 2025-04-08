
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import MainPage from './pages/MainPage/MainPage';
import FlipBefore from './pages/Flip/FlipBefore';
import FlipAfter from './pages/Flip/FlipAfter';
import StatsPage from './pages/Stats/StatsPage';
import Calendar from './pages/Calendar/Calendar';
import Profile from './pages/Profile/Profile';
import SignIn from './pages/Profile/SignIn';
import Register from './pages/Profile/Register';




function App() {
  return (

    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/FlipBefore/:taskName" element={<FlipBefore />} />
        <Route path="/FlipAfter/:taskName" element={<FlipAfter />} />
        <Route path="/Statistics" element={<StatsPage />} />
        <Route path="/Calendar" element={<Calendar />} />
        <Route path="/Profile" element={<Profile />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>

  );
}

export default App;

