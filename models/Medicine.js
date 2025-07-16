const mongoose = require("mongoose");

const medicineSchema = new mongoose.Schema({
  name: String,
  available: Boolean,
  price: Number,
});

module.exports = mongoose.model("Medicine", medicineSchema);
