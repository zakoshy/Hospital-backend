// models/LaboratoryResult.js
const mongoose = require('mongoose');

const laboratoryResultSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true
  },
  department: {
    type: String,
    required: true
  },
 results: {
  type: mongoose.Schema.Types.Mixed,
  required: true,
},
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('LaboratoryResult', laboratoryResultSchema);
