const express = require("express");
const router = express.Router();
const {
  createPrescription
} = require("../controllers/prescriptionController");

router.post("/create", createPrescription);

module.exports = router;
