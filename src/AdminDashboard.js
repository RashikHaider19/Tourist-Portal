import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import for navigation
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [packages, setPackages] = useState([]);
  const [newPackage, setNewPackage] = useState({ name: '', price: '', description: '', image: null });
  const [editingPackage, setEditingPackage] = useState(null);
  const [updatedPackage, setUpdatedPackage] = useState({ name: '', price: '', description: '', image: null });
  const navigate = useNavigate(); // Initialize navigate hook

  // Fetch existing packages from backend when component mounts
  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const token = localStorage.getItem('token'); // Get token from localStorage
        const response = await axios.get('http://localhost:5000/api/packages', {
          headers: {
            Authorization: `Bearer ${token}` // Pass token in the header
          }
        });
        setPackages(response.data);
      } catch (error) {
        console.error('Error fetching packages:', error);
      }
    };
    fetchPackages();
  }, []);

  const handleCreatePackage = async () => {
    try {
      const token = localStorage.getItem('token'); // Get token from localStorage
      const formData = new FormData();
      formData.append('name', newPackage.name);
      formData.append('price', newPackage.price);
      formData.append('description', newPackage.description);
      if (newPackage.image) {
        formData.append('image', newPackage.image); // Append image if provided
      }

      // Send POST request to create a new package
      const response = await axios.post('http://localhost:5000/api/packages', formData, {
        headers: {
          Authorization: `Bearer ${token}`, // Pass token in the header
          'Content-Type': 'multipart/form-data' // Set content type for file upload
        }
      });

      // Update state with new package and clear form
      setPackages([...packages, response.data]);
      setNewPackage({ name: '', price: '', description: '', image: null });
    } catch (error) {
      console.error('Error creating package:', error);
      alert('Failed to create package. Please try again.');
    }
  };

  const handleUpdatePackage = (pkg) => {
    setEditingPackage(pkg);
    setUpdatedPackage({ name: pkg.name, price: pkg.price, description: pkg.description, image: null });
  };

  const handleSaveUpdate = async (id) => {
    try {
      const token = localStorage.getItem('token'); // Get token from localStorage
      const formData = new FormData();
      formData.append('name', updatedPackage.name);
      formData.append('price', updatedPackage.price);
      formData.append('description', updatedPackage.description);
      if (updatedPackage.image) {
        formData.append('image', updatedPackage.image); // Append image if updated
      }

      const response = await axios.put(`http://localhost:5000/api/packages/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`, // Pass token in the header
          'Content-Type': 'multipart/form-data' // Set content type for file upload
        }
      });
      setPackages(packages.map((pkg) => (pkg._id === id ? { ...pkg, ...response.data } : pkg)));
      setEditingPackage(null);
    } catch (error) {
      console.error('Error updating package:', error);
    }
  };

  const handleDeletePackage = async (id) => {
    try {
      const token = localStorage.getItem('token'); // Get token from localStorage
      await axios.delete(`http://localhost:5000/api/packages/${id}`, {
        headers: {
          Authorization: `Bearer ${token}` // Pass token in the header
        }
      });
      setPackages(packages.filter((pkg) => pkg._id !== id));
    } catch (error) {
      console.error('Error deleting package:', error);
    }
  };

  // Logout function to clear token and navigate to login page
  const handleLogout = () => {
    localStorage.removeItem('token'); // Remove token from localStorage
    navigate('/admin/login'); // Redirect to login page
  };

  return (
    <div className="admin-dashboard">
      <h2>Admin Dashboard</h2>
      <button className="logout-button" onClick={handleLogout}>Logout</button> {/* Logout button */}
      <h3>Manage Tour Packages</h3>
      <div className="package-list">
        {packages.map((pkg) => (
          <div className="package-item" key={pkg._id}>
            {pkg.image && <img src={pkg.image} alt={pkg.name} className="package-image" />}
            <h4>{pkg.name}</h4>
            <p>{pkg.description}</p>
            <p><strong>Price:</strong> {pkg.price}</p>
            <button onClick={() => handleUpdatePackage(pkg)}>Update</button>
            <button onClick={() => handleDeletePackage(pkg._id)}>Delete</button>
          </div>
        ))}
      </div>

      {editingPackage && (
        <div className="edit-form">
          <h3>Edit Package: {editingPackage.name}</h3>
          <label>
            Name:
            <input
              type="text"
              value={updatedPackage.name}
              onChange={(e) => setUpdatedPackage({ ...updatedPackage, name: e.target.value })}
            />
          </label>
          <label>
            Price:
            <input
              type="text"
              value={updatedPackage.price}
              onChange={(e) => setUpdatedPackage({ ...updatedPackage, price: e.target.value })}
            />
          </label>
          <label>
            Description:
            <textarea
              value={updatedPackage.description}
              onChange={(e) => setUpdatedPackage({ ...updatedPackage, description: e.target.value })}
            />
          </label>
          <label>
            Image:
            <input
              type="file"
              onChange={(e) => setUpdatedPackage({ ...updatedPackage, image: e.target.files[0] })}
            />
          </label>
          <button onClick={() => handleSaveUpdate(editingPackage._id)}>Save</button>
          <button onClick={() => setEditingPackage(null)}>Cancel</button>
        </div>
      )}

      <div className="create-form">
        <h3>Create New Package</h3>
        <label>
          Name:
          <input
            type="text"
            value={newPackage.name}
            onChange={(e) => setNewPackage({ ...newPackage, name: e.target.value })}
          />
        </label>
        <label>
          Price:
          <input
            type="text"
            value={newPackage.price}
            onChange={(e) => setNewPackage({ ...newPackage, price: e.target.value })}
          />
        </label>
        <label>
          Description:
          <textarea
            value={newPackage.description}
            onChange={(e) => setNewPackage({ ...newPackage, description: e.target.value })}
          />
        </label>
        <label>
          Image:
          <input
            type="file"
            onChange={(e) => setNewPackage({ ...newPackage, image: e.target.files[0] })}
          />
        </label>
        <button onClick={handleCreatePackage}>Create Package</button>
      </div>
    </div>
  );
};

export default AdminDashboard;
