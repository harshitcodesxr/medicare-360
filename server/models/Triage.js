const mongoose = require('mongoose');

const triageSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true
  },
  symptoms: [String],
  mainSymptom: String,
  duration: String,
  painLevel: Number,
  temperature: Number,
  heartRate: Number,
  bloodPressureSystolic: Number,
  bloodPressureDiastolic: Number,
  oxygenSaturation: Number,
  breathingDifficulty: String,
  chestPain: Boolean,
  lossOfConsciousness: Boolean,
  existingMedicalConditions: [String],
  riskScore: {
    type: Number,
    min: 0,
    max: 100
  },
  priority: {
    type: String,
    enum: ['CRITICAL', 'MEDIUM', 'NORMAL'],
    default: 'NORMAL'
  },
  reason: String,
  emergencyKeywords: [String],
  status: {
    type: String,
    enum: ['evaluated', 'processed', 'reviewed'],
    default: 'evaluated'
  },
  triageDate: {
    type: Date,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Triage', triageSchema);