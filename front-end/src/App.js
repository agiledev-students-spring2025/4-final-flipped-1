
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import MainPage from './pages/MainPage/MainPage';
import FlipBefore from './pages/Flip/FlipBefore';
import FlipAfter from './pages/Flip/FlipAfter';
import StatsPage from './pages/Stats/StatsPage';





function App() {
  return (

    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/FlipBefore/:taskId" element={<FlipBefore />} />
        <Route path="/FlipAfter/:taskId" element={<FlipAfter />} />
        <Route path="/Statistics" element={<StatsPage />} />
      </Routes>
    </Router>

  );
}

export default App;

