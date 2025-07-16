const Prescription = require("../models/Prescription");
const Patient = require("../models/Patient");

exports.createPrescription = async (req, res) => {
  try {
    const { patientId, prescribedBy, medications, additionalNotes } = req.body;

    const prescription = new Prescription({
      patientId,
      prescribedBy,
      medications,
      additionalNotes
    });

    await prescription.save();

    // Attach prescription to patient
    await Patient.findByIdAndUpdate(patientId, {
      prescription: prescription._id
    });

    res.status(201).json({ message: "Prescription recorded", prescription });
  } catch (error) {
    res.status(500).json({ message: "Error creating prescription", error: error.message });
  }
};
