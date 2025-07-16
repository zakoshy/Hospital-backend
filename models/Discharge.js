const mongoose = require("mongoose");

const dischargeSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },
    departmentNotes: String,
    missingMedications: [String],
    messageToPatient: String,
    phone: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Discharge", dischargeSchema);
