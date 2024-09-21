// src/Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/login">User Login</Link></li>
        <li><Link to="/register">User Register</Link></li>
        <li><Link to="/admin-login">Admin Login</Link></li>
        <li><Link to="/admin-register">Admin Register</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;
