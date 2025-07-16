// models/PharmacyDischarge.js

const mongoose = require("mongoose");

const PharmacyDischargeSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: "Patient" },
  unavailableMeds: [String],
  dischargedAt: { type: Date, default: Date.now } 
});

module.exports = mongoose.model("PharmacyDischarge", PharmacyDischargeSchema);
