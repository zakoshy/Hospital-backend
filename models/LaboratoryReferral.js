// models/LaboratoryReferral.js
const mongoose = require('mongoose');

const laboratoryReferralSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true
  },
  department: {
    type: String,
    required: true
  },
  testsRequested: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ["pending", "paid", "results_ready", "complete"],
    default: "pending"
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('LaboratoryReferral', laboratoryReferralSchema);
