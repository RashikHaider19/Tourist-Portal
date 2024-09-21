import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Cart.css';

const Cart = () => {
  const [reservedPackage, setReservedPackage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCart = async () => {
      try {
        // Fetch the reserved package from local storage
        const storedPackage = JSON.parse(localStorage.getItem('reservedPackage'));
        if (storedPackage) {
          setReservedPackage(storedPackage);
        }
      } catch (error) {
        console.error('Failed to fetch cart:', error);
      }
    };

    fetchCart();
  }, []);

  const handleCancel = () => {
    // Clear the reserved package from local storage
    localStorage.removeItem('reservedPackage');
    setReservedPackage(null);
    navigate('/user-dashboard');
  };

  const handleCheckout = () => {
    // Implement payment flow or redirect
    console.log('Proceed to checkout');
  };

  if (!reservedPackage) {
    return <p>Your cart is empty.</p>;
  }

  return (
    <div className="cart">
      <h2>Cart</h2>
      <div className="cart-package-box">
        <img src={`http://localhost:5000/uploads/${reservedPackage.image}`} alt={reservedPackage.name} />
        <h3>{reservedPackage.name}</h3>
        <p>{reservedPackage.description}</p>
        <p>Price: {reservedPackage.price}</p>
        <div className="cart-actions">
          <button onClick={handleCancel}>Cancel</button>
          <button onClick={handleCheckout}>Checkout</button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
