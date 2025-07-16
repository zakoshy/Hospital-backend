const mongoose = require("mongoose");

const consultationSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Patient",
    required: true,
  },
  complaints: {
    type: String,
    required: true,
  },
  referredDepartment: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["Pending", "Referred", "Completed"],
    default: "Referred",
  }
}, {
  timestamps: true,
});

module.exports = mongoose.model("Consultation", consultationSchema);
