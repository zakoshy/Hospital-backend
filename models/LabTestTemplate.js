// models/LabTestTemplate.js
const mongoose = require('mongoose');

const labTestTemplateSchema = new mongoose.Schema({
  testName: String,
  fields: [String], // e.g., ['T3', 'T4', 'TSH']
});

module.exports = mongoose.model('LabTestTemplate', labTestTemplateSchema);
