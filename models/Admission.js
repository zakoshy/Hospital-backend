const mongoose = require('mongoose');

const admissionSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  department: String,
  ward: { type: mongoose.Schema.Types.ObjectId, ref: 'Ward' },
  bed: { type: mongoose.Schema.Types.ObjectId, ref: 'Bed' },
  admittedAt: { type: Date, default: Date.now },
  dischargedAt: Date,
  isActive: { type: Boolean, default: true }
});

module.exports = mongoose.model('Admission', admissionSchema);
