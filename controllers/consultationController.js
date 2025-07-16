const Consultation = require("../models/Consultation");
const Patient = require("../models/Patient");
const DepartmentVisit = require('../models/DepartmentVisit');


// Create a new consultation record
exports.createConsultation = async (req, res) => {
  const { patientId, complaints, referredDepartment } = req.body;

  try {
    // Optional: validate patient
    const patient = await Patient.findById(patientId);
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    // Save the referral to DepartmentVisit
    await DepartmentVisit.create({
  patientId,
  department: referredDepartment.toLowerCase(),
  complaint: complaints,
  status: 'pending',
});

    res.status(201).json({ message: `Patient referred to ${referredDepartment}` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error during consultation' });
  }
};
// Get all patients ready for consultation (cardIssued = true)
exports.getPatientsForConsultation = async (req, res) => {
  try {
    const patients = await Patient.find({ cardIssued: true });

    res.status(200).json(patients);
  } catch (error) {
    res.status(500).json({ message: "Error fetching patients", error: error.message });
  }
};
