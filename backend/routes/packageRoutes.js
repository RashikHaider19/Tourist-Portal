const express = require('express');
const router = express.Router();
const Package = require('../models/Package');
const multer = require('multer');
const path = require('path');

// Set up Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Specify the uploads directory
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Append timestamp to the filename
  },
});

const upload = multer({ storage: storage });

// GET all packages
router.get('/', async (req, res) => {
  try {
    const packages = await Package.find();
    res.json(packages);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching packages', error: error.message });
  }
});

// POST create a new package
router.post('/', upload.single('image'), async (req, res) => {
  const { name, price, description } = req.body;
  const image = req.file ? req.file.filename : null; // Ensure file exists
  try {
    const newPackage = new Package({
      name,
      description,
      price,
      image  // Save the image filename in the database
    });
    await newPackage.save();
    res.status(201).json(newPackage);
  } catch (error) {
    res.status(500).json({ message: 'Error creating package', error: error.message });
  }
});

// PUT update an existing package
router.put('/:id', upload.single('image'), async (req, res) => {
  const { id } = req.params;
  const { name, price, description } = req.body;
  const imageUrl = req.file ? `http://localhost:5000/uploads/${req.file.filename}` : null; // Construct the image URL
  try {
    const updatedPackage = await Package.findByIdAndUpdate(
      id,
      { name, price, description, image: imageUrl },
      { new: true }
    );
    if (!updatedPackage) return res.status(404).json({ message: 'Package not found' });
    res.json(updatedPackage);
  } catch (error) {
    res.status(500).json({ message: 'Error updating package', error: error.message });
  }
});

// DELETE a package
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const deletedPackage = await Package.findByIdAndDelete(id);
    if (!deletedPackage) return res.status(404).json({ message: 'Package not found' });
    res.json({ message: 'Package deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting package', error: error.message });
  }
});

module.exports = router;
