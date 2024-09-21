import axios from 'axios';
import React, { useState } from 'react';
import './RegisterPage.css';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/user/register', {
        name,
        email,
        password
      });
      setMessage(response.data.message); // Success message from the server
    } catch (error) {
      // Detailed error handling
      console.error('Error registering user:', error.response ? error.response.data : error.message);
      
      if (error.response) {
        // Handle validation or other errors from the server
        if (error.response.data.errors) {
          setMessage(error.response.data.errors.join(', ')); // Display validation errors
        } else {
          setMessage(error.response.data.message || 'An error occurred');
        }
      } else if (error.request) {
        setMessage('No response from the server. Please try again later.');
      } else {
        setMessage('Error setting up the request.');
      }
    }
  };

  return (
    <div className="register-page">
      <form onSubmit={handleSubmit}>
        <h2>Register</h2>
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

export default RegisterPage;
