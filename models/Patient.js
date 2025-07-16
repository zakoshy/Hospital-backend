// models/Patient.js

const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    idNumber: {
      type: String,
      required: function () {
        return this.age >= 18;
      },
    },
    phone: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      required: true,
    },
    isReturning: {
      type: Boolean,
      default: false,
    },
    cardIssued: {
      type: Boolean,
      default: false,
    },
    paymentReceipt: {
      type: String,
    },
    complaints: {
      type: String,
    },
    department: {
      type: String, // ENT, Dental, etc.
    },
    referredToLab: {
      type: Boolean,
      default: false,
    },
    labPayment: {
  type: Boolean,
  default: false
},
labResults: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "LabResult",
  default: null
},
prescription: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Prescription",
  default: null
},
 pharmacyStatus: {
      type: String,
      enum: ["pending", "issued", "partially issued"],
      default: "pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Patient", patientSchema);
