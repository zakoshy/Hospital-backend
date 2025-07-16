// models/Bed.js

const mongoose = require('mongoose');

const bedSchema = new mongoose.Schema({
  ward: { type: mongoose.Schema.Types.ObjectId, ref: 'Ward', required: true },
  bedNumber: { type: Number, required: true },
  isOccupied: { type: Boolean, default: false },
  currentPatient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', default: null }
});

module.exports = mongoose.model('Bed', bedSchema);
