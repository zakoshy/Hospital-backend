const express = require("express");
const router = express.Router();

const Medicine = require("../models/Medicine");
const Prescription = require("../models/Prescription");
const {
  getPrescriptionByPatient,
  fulfillPrescription,
    createPrescription,
    dischargePatient,
  getPendingPrescriptions
} = require("../controllers/pharmacyController");

// ✅ Create a prescription (called from Department)
router.post("/prescriptions/create", createPrescription);

// ✅ Fetch a single patient's prescription
router.get("/patient/:patientId", getPrescriptionByPatient);

// ✅ Pharmacist marks prescription as fulfilled
router.post("/fulfill", fulfillPrescription);

// ✅ Fetch all pending prescriptions
router.get("/pending", getPendingPrescriptions);

// ✅ Fetch all medicines
router.get("/medicines", async (req, res) => {
  try {
    const medicines = await Medicine.find({});
    res.json(medicines);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch medicines." });
  }
});
router.delete("/prescriptions/:id", async (req, res) => {
  try {
    const { id } = req.params;

    await Prescription.findByIdAndDelete(id);

    res.status(200).json({ message: "Prescription deleted." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete prescription." });
  }
});

router.post("/discharge", dischargePatient);

module.exports = router;
