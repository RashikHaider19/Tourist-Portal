const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  packageId: { type: mongoose.Schema.Types.ObjectId, ref: 'Package', required: true },
  reservedAt: { type: Date, default: Date.now },
});

// const Reservation = mongoose.model('Reservation', reservationSchema);

module.exports = mongoose.model('Reservation', reservationSchema);
