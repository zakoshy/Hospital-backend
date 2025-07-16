const Discharge = require("../models/Discharge");
const Patient = require("../models/Patient");
const sendSMS = require("../utils/twilio");

const dischargePatient = async (req, res) => {
  try {
    const { patientId, missingMedications } = req.body;

    const patient = await Patient.findById(patientId);
    if (!patient) return res.status(404).json({ message: "Patient not found" });

    // Compose message
    const smsMessage = `DISCHARGE SUMMARY:
Name: ${patient.name}
ID: ${patient.idNumber || "N/A"}
Phone: ${patient.phone}
Missing Medications: ${missingMedications.length > 0 ? missingMedications.join(", ") : "None"}
Thank you for visiting. Wishing you a quick recovery.`;

    // Save discharge record
    const discharge = new Discharge({
      patientId,
      phone: patient.phone,
      missingMedications,
      messageToPatient: smsMessage,
    });

    await discharge.save();

    // Send SMS
    await sendSMS(patient.phone, smsMessage);

    res.status(201).json({ message: "Patient discharged and SMS sent", discharge });
  } catch (error) {
    console.error("Discharge error:", error.message);
    res.status(500).json({ message: "Discharge failed" });
  }
};

module.exports = {
  dischargePatient,
};
