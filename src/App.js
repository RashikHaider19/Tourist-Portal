import React, { useEffect } from 'react';
import { Route, BrowserRouter as Router, Routes, useNavigate } from 'react-router-dom';
import AdminDashboard from './AdminDashboard'; // Import Admin Dashboard component
import AdminLoginPage from './AdminLoginPage'; // Import Admin Login component
import AdminRegisterPage from './AdminRegisterPage'; // Import Admin Register component
import './App.css';
import Cart from './Cart'; // Import Cart component
import HomePage from './HomePage';
import LoginPage from './LoginPage';
import Navbar from './Navbar';
import RegisterPage from './RegisterPage';
import UserDashboard from './UserDashboard'; // Import User Dashboard component

// Protected Route for authenticated access
const ProtectedRoute = ({ element: Element, ...rest }) => {
  const navigate = useNavigate();
  
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      // Redirect to login if no token is found
      navigate('/login');
    }
  }, [navigate]);

  return <Element {...rest} />;
};

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/admin-login" element={<AdminLoginPage />} />  {/* Admin login route */}
          <Route path="/admin-register" element={<AdminRegisterPage />} />  {/* Admin register route */}
          <Route 
            path="/admin-dashboard" 
            element={<ProtectedRoute element={AdminDashboard} />}  // Admin dashboard protected route
          />
          <Route 
            path="/user-dashboard" 
            element={<ProtectedRoute element={UserDashboard} />}  // User dashboard protected route
          />
          <Route 
            path="/cart" 
            element={<ProtectedRoute element={Cart} />}  // Cart page protected route
          />
          <Route path="/" element={<HomePage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
