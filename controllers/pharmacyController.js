const Prescription = require("../models/Prescription");
const PharmacyDischarge = require("../models/PharmacyDischarge");
const DepartmentVisit = require("../models/DepartmentVisit");
const sendSMS = require("../utils/sendSMS");

// ✅ Create a new prescription (called by doctors)
exports.createPrescription = async (req, res) => {
  try {
    const { patientId, department, prescribedBy, medications } = req.body;

    const newPrescription = new Prescription({
      patientId,
      department,
      prescribedBy,
      medications,
      fulfilledMeds: [],
      fulfilledAt: null
    });

    await newPrescription.save();
    res.status(201).json(newPrescription);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create prescription", error: error.message });
  }
};

// ✅ Fetch prescription by patient
exports.getPrescriptionByPatient = async (req, res) => {
  try {
    const { patientId } = req.params;
    const prescription = await Prescription.findOne({ patientId }).populate("patientId");

    if (!prescription) {
      return res.status(404).json({ message: "Prescription not found for patient" });
    }

    res.status(200).json(prescription);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving prescription", error: error.message });
  }
};

// ✅ Pharmacist fulfills prescription
exports.fulfillPrescription = async (req, res) => {
  try {
    const { prescriptionId, fulfilledMeds } = req.body;

    const updated = await Prescription.findByIdAndUpdate(
      prescriptionId,
      {
        fulfilledMeds,
        fulfilledAt: new Date()
      },
      { new: true }
    );

    res.status(200).json({ message: "Prescription updated", prescription: updated });
  } catch (error) {
    res.status(500).json({ message: "Failed to fulfill prescription", error: error.message });
  }
};

// ✅ Get all pending prescriptions for pharmacy dashboard
exports.getPendingPrescriptions = async (req, res) => {
  try {
    const pendingPrescriptions = await Prescription.find({
      fulfilledAt: null
    }).populate("patientId");

    res.status(200).json(pendingPrescriptions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch pending prescriptions", error: error.message });
  }
};

exports.dischargePatient = async (req, res) => {
  try {
    const { patientId, patientName, phone, unavailableMeds } = req.body;

    console.log("➡️ Incoming pharmacy discharge:", req.body);

    if (!patientId || !patientName) {
      return res.status(400).json({ message: "Missing discharge data." });
    }


    
    await PharmacyDischarge.create({
      patientId,
      unavailableMeds,
      dischargedAt: new Date()
    });

    // ✅ Update pharmacy prescriptions as complete
    const prescriptions = await Prescription.updateMany(
      { patientId, status: { $ne: "complete" } },
      { status: "complete" }
    );

    console.log(`✅ Updated ${prescriptions.modifiedCount} pharmacy prescriptions to complete.`);

    // ✅ Update department visit
    const visitUpdate = await DepartmentVisit.findOneAndUpdate(
      { patientId },
      { status: "discharged" }
    );

    if (!visitUpdate) {
      console.warn(`⚠️ No DepartmentVisit found for patient ${patientId}`);
    } else {
      console.log(`✅ DepartmentVisit updated to 'discharged' for patient ${patientId}.`);
    }

    // ✅ Send SMS
    let message = `Dear ${patientName}, you have been discharged from the hospital.`;

    if (unavailableMeds && unavailableMeds.length > 0) {
      message += ` The following medicines were not available and should be purchased outside: ${unavailableMeds.join(", ")}.`;
    } else {
      message += ` All your prescribed medicines were provided.`;
    }

    if (phone) {
      await sendSMS(phone, message);
      console.log(`✅ Discharge SMS sent to ${phone}`);
    } else {
      console.warn(`⚠️ No phone number for patient ${patientId}`);
    }

    res.status(200).json({ message: "Patient discharged successfully." });
  } catch (err) {
    console.error("❌ Error discharging patient:", err);
    res.status(500).json({ message: "Server error." });
  }
};
