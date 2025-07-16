const express = require("express");
const router = express.Router();
const {
  createConsultation,
  getPatientsForConsultation
} = require("../controllers/consultationController");

const protect = require("../middleware/authMiddleware"); // ✅ add this

// Get patients who completed card payment
router.get("/patients", getPatientsForConsultation);

// Create consultation — must be protected so we can access req.user
router.post("/create", protect, createConsultation); // ✅ protect added

module.exports = router;
