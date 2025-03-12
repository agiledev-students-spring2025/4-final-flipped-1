import React from 'react';
import './Header.css';


function Header({ title = "Flipped" }) {
  return (
    <div className="header">
      <h1>{title}</h1>
      <button className="add-button">+</button>
    </div>
  );
}



export default Header; 