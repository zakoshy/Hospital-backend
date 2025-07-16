const DepartmentVisit = require('../models/DepartmentVisit');
const Patient = require('../models/Patient');
const LaboratoryResult = require('../models/LaboratoryResult');
exports.getLatestPatientByDepartment = async (req, res) => {
  const slug = req.params.name;

  try {
    const visit = await DepartmentVisit.findOne({
      department: { $regex: new RegExp(`^${slug}$`, 'i') },
    })
      .sort({ createdAt: -1 })
      .populate('patientId');

    if (!visit) {
      return res.status(404).json({ message: 'No patient found for this department' });
    }

    res.json({
      _id: visit.patientId._id,
      name: visit.patientId.name,
      idNumber: visit.patientId.idNumber,
      complaint: visit.complaint,
    });
  } catch (err) {
    console.error("❌ Department fetch error:", err);
    res.status(500).json({ message: 'Server error' });
  }
};
// Get all department visits for a department, sorted oldest to newest, excluding completed

exports.getPatientsByDepartment = async (req, res) => {
  const department = req.params.name;

  try {
    const visits = await DepartmentVisit.find({
      department: { $regex: new RegExp(`^${department}$`, 'i') },
      status: { $ne: 'complete' }
    })
      .sort({ createdAt: 1 })
      .populate('patientId');

    const result = [];

    for (const visit of visits) {
      // ✅ Null check to prevent crash
      if (!visit.patientId) {
        console.warn(`⚠️ Skipping visit ${visit._id} because patientId is null`);
        continue;
      }

      let labResults = null;

      if (visit.status === 'lab_results_ready') {
        const resultDoc = await LaboratoryResult.findOne({
          patientId: visit.patientId._id,
          department: department,
        });

        if (resultDoc) {
          labResults = resultDoc.results;
        }
      }

      result.push({
        _id: visit._id,
        patientId: visit.patientId._id,
        name: visit.patientId.name,
        idNumber: visit.patientId.idNumber,
        complaint: visit.complaint,
        status: visit.status,
        labResults,
      });
    }

    res.json(result);
  } catch (err) {
    console.error("❌ Error fetching department patients:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};


exports.updateVisitStatus = async (req, res) => {
  const { visitId } = req.params;
  const { status } = req.body;

  try {
    const visit = await DepartmentVisit.findByIdAndUpdate(
      visitId,
      { status },
      { new: true }
    );

    if (!visit) {
      return res.status(404).json({ message: "Visit not found" });
    }

    res.json({ message: "Status updated", visit });
  } catch (error) {
    console.error("❌ Failed to update visit status:", error);
    res.status(500).json({ message: "Server error" });
  }
};
