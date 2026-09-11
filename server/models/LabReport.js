const mongoose = require('mongoose');

const labReportSchema = new mongoose.Schema({
  labTestId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'LabTest',
    required: true
  },
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true
  },
  testName: String,
  result: String,
  referenceRange: String,
  remarks: String,
  normalAbnormal: {
    type: String,
    enum: ['normal', 'abnormal'],
    default: 'normal'
  },
  labTechnicianId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  reportDate: {
    type: Date,
    default: Date.now
  },
  reviewedByDoctor: Boolean,
  reviewedAt: Date,
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('LabReport', labReportSchema);