import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection
import './AdminLoginPage.css';

const AdminLoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate(); // Initialize useNavigate

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/admin/login', {
        email,
        password
      });
      
      // Store the JWT token in localStorage
      localStorage.setItem('token', response.data.token);
      setMessage('Admin login successful!');
  
      navigate('/admin-dashboard'); // Redirect after successful login
    } catch (error) {
      // Display specific error messages from the server
      if (error.response && error.response.status === 400) {
        setMessage(error.response.data.message || 'Invalid credentials');
      } else {
        setMessage('An error occurred');
      }
      console.error('Error logging in admin:', error);
    }
  };

  return (
    <div className="admin-login-container">
      <form onSubmit={handleSubmit}>
        <h2>Admin Login</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
        {message && <p>{message}</p>}
      </form>
    </div>
  );
};

export default AdminLoginPage;
