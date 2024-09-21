import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './UserDashboard.css';

const UserDashboard = () => {
  const [packages, setPackages] = useState([]);
  const [reservations, setReservations] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/packages');
        setPackages(response.data);
      } catch (error) {
        console.error('Error fetching packages:', error);
      }
    };
    fetchPackages();
  }, []);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/reservations', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setReservations(response.data);
      } catch (error) {
        console.error('Error fetching reservations:', error);
      }
    };

    fetchReservations();
  }, []);

  const handleReservePackage = async (packageId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('You need to log in to reserve a package.');
        return;
      }

      const existingReservation = reservations.find(r => r.packageId._id === packageId);
      if (existingReservation) {
        alert("Can't pick more than one package at a time.");
        return;
      }

      // const response = await axios.post(
      //   'http://localhost:5000/api/reservations',
      //   { packageId },
      //   {
      //     headers: {
      //       Authorization: `Bearer ${token}`,
      //     },
      //   }
      // );
      
      
          const response = await fetch('http://localhost:5000/api/reservations', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`, // Assuming token is used for auth
            },
            body: JSON.stringify({ packageId }),
          });
          const data = await response.json();

      if (response.data) {
        const reservedPackage = packages.find(pkg => pkg._id === packageId);
        console.log('Reserved Package:', reservedPackage); // Log the reserved package
        alert('Package reserved successfully!');
        
        //reservedPackage.push(reservedPackage);
        localStorage.setItem('reservedPackage', JSON.stringify(reservedPackage));
        console.log('Stored in localStorage:', localStorage.getItem('reservedPackage')); // Log the stored value

      console.log('Navigating to Cart');
      navigate('/cart');
        window.location.reload(); // Reload to update the UI
        
      alert('Package reserved successfully!');
      // navigate('/cart'); // Navigate to Cart page
      }else {
        alert(data.message);} 


    } catch (error) {
      console.error('Error reserving package:', error);
      alert('Failed to reserve package. Please try again.');
    }
  };

  const handleCancelReservation = async (reservationId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('You need to log in to cancel a reservation.');
        return;
      }

      await axios.delete(`http://localhost:5000/api/reservations/${reservationId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert('Reservation cancelled successfully!');
      setReservations(reservations.filter((r) => r._id !== reservationId));
      localStorage.removeItem('reservedPackage'); // Clear reserved package on cancellation
    } catch (error) {
      console.error('Error cancelling reservation:', error);
      alert('Failed to cancel reservation. Please try again.');
    }
  };

  const isPackageReserved = (packageId) => {
    return reservations.some((r) => r.packageId._id === packageId);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('reservedPackage'); // Clear reserved package on logout
    navigate('/user/login');
  };

  const handleViewCart = () => {
    navigate('/cart'); // Navigate to the cart page
  };

  return (
    <div className="user-dashboard">
      <div className="header-container">
        <h2 className="dashboard-title">User Dashboard</h2>
        <button className="logout-button" onClick={handleLogout}>Logout</button>
      </div>
      <h2 className="packages-title">Available Tour Packages</h2>
      <button className="view-cart-button" onClick={handleViewCart}>View Cart</button>
      <div className="package-list">
        {packages.map((pkg) => (
          <div className="package-item" key={pkg._id}>
            {pkg.image && <img src={`http://localhost:5000/uploads/${pkg.image}`} alt={pkg.name} className="package-image" />}
            <h4>{pkg.name}</h4>
            <p>{pkg.description}</p>
            <p><strong>Price:</strong> {pkg.price}</p>
            {isPackageReserved(pkg._id) ? (
              <button
                className="cancel-button"
                onClick={() => handleCancelReservation(reservations.find((r) => r.packageId._id === pkg._id)._id)}
              >
                Cancel Reservation
              </button>
            ) : (
              <button
                className="reserve-button"
                onClick={() => handleReservePackage(pkg._id)} // Make sure this line exists
              >
                Reserve
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserDashboard;
