const mongoose = require('mongoose');

const wardSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  totalBeds: { type: Number, default: 20 },
});

module.exports = mongoose.model('Ward', wardSchema);
