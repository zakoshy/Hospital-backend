const express = require("express");
const router = express.Router();
const { dischargePatient } = require("../controllers/dischargeController");

router.post("/pharmacy-discharge", dischargePatient);

module.exports = router;
