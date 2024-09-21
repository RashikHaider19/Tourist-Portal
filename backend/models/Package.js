const mongoose = require('mongoose');

const packageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: String, required: true },
  image: { type: String }  // This is the field that stores the image filename or path
});

const Package = mongoose.model('Package', packageSchema);

module.exports = Package;
