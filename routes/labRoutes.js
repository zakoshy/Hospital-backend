const express = require('express');
const router = express.Router();
const labController = require('../controllers/laboratoryController');

router.post('/referrals', labController.createReferral);
router.get('/referrals/latest', labController.getLatestReferral);
router.get('/pending', labController.getPendingReferrals);
router.post('/results', labController.submitResults);
router.get('/results/:patientId', labController.getLabResults);
router.delete('/:id', labController.deleteReferral);
// Update lab referral status
router.put('/status/:id', labController.updateReferralStatus);

// NEW: Confirm payment
router.post('/payments', labController.confirmPayment);

module.exports = router;
