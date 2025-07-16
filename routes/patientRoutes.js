// routes/patientRoutes.js

const express = require("express");
const router = express.Router();
const {
  registerPatient,
  searchPatient, // ✅ Import the search controller
} = require("../controllers/patientController");

// ✅ Register route
router.post("/register", registerPatient);

// ✅ Search route
router.get("/search/:query", searchPatient);

module.exports = router;
