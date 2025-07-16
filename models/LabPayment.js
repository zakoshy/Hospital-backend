// models/LabPayment.js
const mongoose = require('mongoose');

const labPaymentSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true
  },
  department: {
    type: String,
    required: true
  },
  paid: {
    type: Boolean,
    default: false
  },
  paidAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('LabPayment', labPaymentSchema);
