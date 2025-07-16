const express = require('express');
const router = express.Router();
const departmentController = require('../controllers/departmentController');
const DepartmentVisit = require('../models/DepartmentVisit');
const mongoose = require("mongoose");



router.get('/:name/latest', departmentController.getLatestPatientByDepartment);
router.get('/:name/list', departmentController.getPatientsByDepartment); // ✅ this is the one you need
router.put('/:visitId/status', departmentController.updateVisitStatus);
router.delete('/:departmentName/patients/:visitId', async (req, res) => {
  const { departmentName, visitId } = req.params;
  console.log('🟡 DELETE route hit');
  console.log('✅ Department:', departmentName);
  console.log('✅ Visit ID:', visitId);

  try {
    const deleted = await DepartmentVisit.findByIdAndDelete(visitId);
    if (!deleted) {
      console.log('❌ No DepartmentVisit found with this ID.');
      return res.status(404).json({ message: 'Visit not found' });
    }

    console.log('✅ Visit deleted successfully');
    res.json({ message: 'Visit deleted successfully' });
  } catch (error) {
    console.error('❌ Error deleting visit:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});



module.exports = router;
