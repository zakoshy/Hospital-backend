const express = require('express');
const router = express.Router();
const wardController = require('../controllers/wardController');

router.get('/wards', wardController.getAllWards);
router.get('/wards/:wardId/beds', wardController.getWardBeds);
router.post('/admissions', wardController.admitPatient);
router.put('/discharge/:patientId', wardController.dischargePatient);

module.exports = router;
