const mongoose = require('mongoose');

const departmentVisitSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true,
  },
  department: {
    type: String,
    required: true,
  },
  complaint: String,
  status: {
    type: String,
    enum: ['pending', 'waiting_lab_results', 'complete'],
    default: 'pending',
  },
  cleared: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('DepartmentVisit', departmentVisitSchema);
