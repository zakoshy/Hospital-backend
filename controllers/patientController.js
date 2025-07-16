// controllers/patientController.js

const Patient = require("../models/Patient");

// Register a new patient
exports.registerPatient = async (req, res) => {
  try {
    const { name, idNumber, phone, age } = req.body;

    // Check if patient exists (by name and phone)
    const existing = await Patient.findOne({ name, phone });

    if (existing) {
      return res.status(400).json({ message: "Patient already exists." });
    }

    const newPatient = new Patient({
      name,
      idNumber: age >= 18 ? idNumber : undefined,
      phone,
      age,
      isReturning: false,
      cardIssued: false,
    });

    await newPatient.save();
    res.status(201).json({ message: "Patient registered successfully", patient: newPatient });
  } catch (error) {
    res.status(500).json({ message: "Error registering patient", error: error.message });
  }
};

// ✅ Search for a patient by name or ID number
exports.searchPatient = async (req, res) => {
  try {
    const query = req.params.query;

    const patient = await Patient.findOne({
      $or: [
        { name: { $regex: new RegExp(query, "i") } }, // Case-insensitive name search
        { idNumber: query },
      ],
    });

    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    res.status(200).json(patient);
  } catch (error) {
    res.status(500).json({ message: "Error searching patient", error: error.message });
  }
};
