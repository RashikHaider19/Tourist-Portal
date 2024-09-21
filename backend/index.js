const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path'); // Import path module to work with file paths
const app = express();

// Import routes
const userRoutes = require('./routes/userAuth');
const adminRoutes = require('./routes/adminAuth');
const packageRoutes = require('./routes/packageRoutes'); 
const reservationRoutes = require('./routes/reservationRoutes');  

// Middleware
app.use(express.json());
app.use(cors());

// MongoDB connection
const mongoURI = 'mongodb+srv://rashikbinhaider:1Sibtl0hy4hrzWD8@cluster0.dbdlw.mongodb.net/touristPortal?retryWrites=true&w=majority';
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('Error connecting to MongoDB:', error));

// Serve static files from the 'uploads' directory
app.use('/uploads', express.static('uploads'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/user', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/packages', packageRoutes); 
app.use('/api/reservations', reservationRoutes);  

// Default route
app.get('/', (req, res) => {
  res.send('Backend is working');
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
