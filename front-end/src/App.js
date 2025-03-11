
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import MainPage from './pages/MainPage/MainPage';
import FlipBefore from './pages/Flip/FlipBefore';



function App() {
  return (

    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/flipbefore/:taskId" element={<FlipBefore />} />
      </Routes>
    </Router>

  );
}

export default App;

