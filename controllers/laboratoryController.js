const LaboratoryReferral = require('../models/LaboratoryReferral');
const LaboratoryResult = require('../models/LaboratoryResult');
const DepartmentVisit = require('../models/DepartmentVisit');
const Patient = require('../models/Patient');
const LabPayment = require('../models/LabPayment');
const sendSMS = require('../utils/africasTalking');
const mongoose = require('mongoose');


exports.confirmPayment = async (req, res) => {
  try {
    const { patientId, department } = req.body;

    const existing = await LabPayment.findOne({ patientId, department });

    if (existing) {
      existing.paid = true;
      existing.paidAt = new Date();
      await existing.save();
    } else {
      await LabPayment.create({ patientId, department, paid: true });
    }

    res.status(200).json({ message: '✅ Payment confirmed' });
  } catch (err) {
    console.error('❌ Lab payment confirmation failed:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.createReferral = async (req, res) => {
  try {
    const { patientId, department, testsRequested } = req.body;

    console.log("🚀 Incoming lab referral:", { patientId, department, testsRequested });

    if (!patientId || !department || !testsRequested) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const referral = new LaboratoryReferral({ patientId, department, testsRequested });
    await referral.save();

    res.status(201).json(referral);
  } catch (err) {
    console.error("❌ Lab referral creation failed:", err);
    res.status(500).json({ message: "Server error" });
  }
};


exports.getLatestReferral = async (req, res) => {
  try {
    const referrals = await LaboratoryReferral.find()
      .sort({ createdAt: 1 }) // FIFO
      .populate('patientId');

    for (const ref of referrals) {
      const payment = await LabPayment.findOne({
        patientId: ref.patientId._id,
        department: ref.department,
        paid: true,
      });

      if (payment) {
        return res.json({
          patientId: ref.patientId._id,
          name: ref.patientId.name,
          idNumber: ref.patientId.idNumber,
          department: ref.department,
          testsRequested: ref.testsRequested,
        });
      }
    }

    res.status(404).json({ message: '❌ No paid referrals found' });
  } catch (err) {
    console.error('❌ Fetch latest paid referral error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getPendingReferrals = async (req, res) => {
  try {
    console.log("🚀 [getPendingReferrals] Called.");

    const referrals = await LaboratoryReferral.find()
      .sort({ createdAt: 1 })
      .populate('patientId');

    console.log(`✅ Found ${referrals.length} referrals.`);

    const result = [];

    for (const ref of referrals) {
      console.log(`🔎 Processing referral ID: ${ref._id}`);

      if (!ref.patientId) {
        console.warn(`⚠️ Skipping referral ${ref._id} because patientId is missing.`);
        continue;
      }

      console.log(`➡️ Patient ID: ${ref.patientId._id}`);
      console.log(`➡️ Department: ${ref.department}`);
      console.log(`➡️ Tests requested: ${ref.testsRequested}`);

      const payment = await LabPayment.findOne({
        patientId: ref.patientId._id,
        department: ref.department,
      });

      console.log(
        `💰 Payment found for patient ${ref.patientId._id}:`,
        payment ? payment : "None"
      );

      result.push({
        _id: ref._id,
        patientId: ref.patientId._id,
        name: ref.patientId.name,
        idNumber: ref.patientId.idNumber,
        phoneNumber: ref.patientId.phoneNumber,
        department: ref.department,
        testsRequested: ref.testsRequested,
        referralTime: ref.createdAt,
        paymentStatus: payment?.paid ? 'paid' : 'pending'
      });
    }

    console.log(`✅ Final referrals result length: ${result.length}`);

    res.status(200).json(result);
  } catch (err) {
    console.error("❌ Fetch pending referrals error:", err);
    res.status(500).json({ message: "Server error" });
  }
};


exports.getLabResults = async (req, res) => {
  try {
    const { patientId } = req.params;
    const { department } = req.query;

    if (!department) {
      return res.status(400).json({ message: "Missing department in request." });
    }

    const labResult = await LaboratoryResult.findOne({
      patientId,
      department
    }).sort({ createdAt: -1 });

    if (!labResult) {
      return res.status(404).json({ message: "No lab results found for this department." });
    }

    res.json(labResult.results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
exports.submitResults = async (req, res) => {
  try {
    const { patientId, department, results } = req.body;

    console.log("➡️ Incoming lab result submission:", req.body);

    if (!patientId || !department || !results || Object.keys(results).length === 0) {
      return res.status(400).json({ message: "Missing lab result data." });
    }

    // ✅ Save lab results
    await LaboratoryResult.create({
      patientId,
      department,
      results
    });

    // ✅ Update referral status to 'complete'
    const referralUpdate = await LaboratoryReferral.findOneAndUpdate(
      { patientId, department },
      { status: 'complete' }
    );

    if (!referralUpdate) {
      console.warn(`⚠️ No referral found for patient ${patientId} in department ${department}.`);
    } else {
      console.log(`✅ Updated referral status to complete for patient ${patientId}.`);
    }

    // ✅ Update department visit status
    const visitUpdate = await DepartmentVisit.findOneAndUpdate(
      { patientId, department },
      { status: 'lab_results_ready' }
    );

    if (!visitUpdate) {
      console.warn(`⚠️ No department visit found for patient ${patientId} in department ${department}.`);
    } else {
      console.log(`✅ Updated DepartmentVisit to lab_results_ready for patient ${patientId}.`);
    }

    // ✅ Optional: Send SMS notification
    const patient = await Patient.findById(patientId);
    console.log("🕵️ Patient lookup result:", patient);
    if (patient?.phone) {
      const smsBody = `Hello ${patient.name}, your lab results for ${department} are ready. Please return for follow-up.`;
      await sendSMS(patient.phoneNumber, smsBody);
      console.log(`✅ SMS sent to ${patient.phoneNumber}`);
    }

    res.status(201).json({ message: "Results submitted successfully." });

  } catch (err) {
    console.error("❌ Submit lab results error:", err);
    res.status(500).json({ message: "Server error" });
  }
};


exports.deleteReferral = async (req, res) => {
  try {
    const { id } = req.params;

    await LaboratoryReferral.findByIdAndDelete(id);

    res.status(200).json({ message: 'Referral deleted successfully.' });
  } catch (err) {
    console.error("❌ Delete referral error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
exports.updateReferralStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const referral = await LaboratoryReferral.findById(id);
    if (!referral) {
      return res.status(404).json({ message: 'Referral not found.' });
    }

    referral.status = status;
    await referral.save();

    res.status(200).json({ message: 'Referral status updated successfully.' });
  } catch (err) {
    console.error('❌ Error updating referral status:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

