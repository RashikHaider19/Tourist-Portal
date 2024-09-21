const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
  name: { 
    type: String,
    required: true },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address']  // Regular expression for email validation
  },
  password: 
  { type: String,
    required: true },
},
{ timestamps: true });

const Admin = mongoose.model('Admin', adminSchema);

module.exports = Admin;
 