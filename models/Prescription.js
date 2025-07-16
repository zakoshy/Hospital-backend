const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const prescriptionSchema = new Schema({
  patientId: { type: Schema.Types.ObjectId, ref: "Patient" },
  department: String,
  prescribedBy: String,
  medications: [
    {
      name: String,
      quantity: Number
    }
  ],
  fulfilledMeds: [
    {
      name: String,
      available: Boolean
    }
  ],
  fulfilledAt: { type: Date, default: null }
}, { timestamps: true });

module.exports = mongoose.model("Prescription", prescriptionSchema);
