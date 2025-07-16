const express = require('express');
const router = express.Router();
const LaboratoryReferral = require('../models/LaboratoryReferral');

router.post('/', async (req, res) => {
  const { patientId, department, testsRequested } = req.body;

  try {
    const referral = await LaboratoryReferral.create({
      patientId,
      department,
      testsRequested,
    });

    res.status(201).json(referral);
  } catch (error) {
    console.error('❌ Lab referral failed:', error);
    res.status(500).json({ message: 'Lab referral failed' });
  }
});

module.exports = router;
