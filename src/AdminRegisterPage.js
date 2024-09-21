import axios from 'axios';
import React, { useState } from 'react';
import './AdminRegisterPage.css';

const AdminRegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/admin/register', {
        name,
        email,
        password
      });
      setMessage(response.data.message);
    } catch (error) {
      // Detailed error logging and handling
      console.error('Error registering admin:', error.response ? error.response.data : error.message);
      
      // Display a more detailed error message to the user
      if (error.response) {
        if (error.response.data.errors) {
          // Handle validation errors
          setMessage(error.response.data.errors.join(', '));
        } else {
          setMessage(error.response.data.message || 'An error occurred');
        }
      } else if (error.request) {
        setMessage('No response received from server. Please try again later.');
      } else {
        setMessage('An error occurred while setting up the request.');
      }
    }
  };

  return (
    <div className="admin-register-page">
      <form onSubmit={handleSubmit}>
        <h2>Admin Register</h2>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
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
        <button type="submit">Register</button>
        {message && <p>{message}</p>}
      </form>
    </div>
  );
};

export default AdminRegisterPage;
