const Ward = require('../models/Ward');
const Bed = require('../models/Bed');
const Admission = require('../models/Admission');

exports.getAllWards = async (req, res) => {
  const wards = await Ward.find();
  res.json(wards);
};

exports.getWardBeds = async (req, res) => {
  const beds = await Bed.find({ ward: req.params.wardId })
    .populate('currentPatient', 'name');

  res.json(beds.map(bed => ({
    _id: bed._id,
    bedNumber: bed.bedNumber,
    isOccupied: bed.isOccupied,
    currentPatient: bed.currentPatient
      ? {
          _id: bed.currentPatient._id,
          name: bed.currentPatient.name
        }
      : null
  })));
};


exports.admitPatient = async (req, res) => {
  const { patientId, wardId, bedId, department } = req.body;

  const bed = await Bed.findById(bedId);
  if (!bed || bed.isOccupied) {
    return res.status(400).json({ error: 'Bed is already occupied or does not exist' });
  }

  await Bed.findByIdAndUpdate(bedId, {
    isOccupied: true,
    currentPatient: patientId,
  });

  const admission = await Admission.create({
    patientId,
    ward: wardId,
    bed: bedId,
    department
  });

  res.json({
    message: 'Patient admitted successfully',
    admission: {
      _id: admission._id,
      ward: wardId,
      bedId: bedId,
      bedNumber: bed.bedNumber,
      department,
      patientId
    }
  });
};


exports.dischargePatient = async (req, res) => {
  const patientId = req.params.patientId;

  const admission = await Admission.findOne({ patientId, isActive: true });
  if (!admission) return res.status(404).json({ error: 'Admission not found' });

  await Bed.findByIdAndUpdate(admission.bed, {
    isOccupied: false,
    currentPatient: null,
  });

  admission.isActive = false;
  admission.dischargedAt = new Date();
  await admission.save();

  res.json({ message: 'Patient discharged successfully' });
};
