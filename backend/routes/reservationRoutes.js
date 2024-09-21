const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware'); 
const Reservation = require('../models/Reservation'); 
const Package = require('../models/Package'); 

// Reserve a package
router.post('/', authMiddleware, async (req, res) => {
  const userId = req.user.id; // Make sure to use 'id' if that's how you're setting it in the token
  console.log('User ID:', userId); 

  const { packageId } = req.body;
  console.log('Package ID:', packageId); 

  try {
    const selectedPackage = await Package.findById(packageId);
    console.log('Selected Package:', selectedPackage); 

    if (!selectedPackage) {
      return res.status(404).json({ message: 'Package not found' });
    }

    const existingReservation = await Reservation.findOne({ userId });
    if (existingReservation) {
      return res.status(400).json({ message: 'You have already reserved a package' });
    }

    const newReservation = new Reservation({
      userId,
      packageId: selectedPackage._id,
    });

    console.log('New Reservation Data:', newReservation); // Log the new reservation

    await newReservation.save();

    res.status(201).json({ message: 'Package reserved successfully', reservation: newReservation });
  } catch (error) {
    console.error('Error reserving package:', error);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
});

// Cancel a reservation
router.delete('/:id', authMiddleware, async (req, res) => {
  const reservationId = req.params.id;

  try {
    const deletedReservation = await Reservation.findByIdAndDelete(reservationId);
    if (!deletedReservation) {
      return res.status(404).json({ message: 'Reservation not found' });
    }

    res.status(200).json({ message: 'Reservation cancelled successfully' });
  } catch (error) {
    console.error('Error cancelling reservation:', error);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
});

module.exports = router;
