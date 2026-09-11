const mongoose = require('mongoose');

const consultationSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true
  },
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  queueId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Queue'
  },
  symptoms: String,
  diagnosis: String,
  treatmentPlan: String,
  notes: String,
  vitals: {
    temperature: Number,
    heartRate: Number,
    bloodPressure: String,
    oxygenSaturation: Number
  },
  status: {
    type: String,
    enum: ['ongoing', 'completed', 'cancelled'],
    default: 'ongoing'
  },
  followUpDate: Date,
  followUpNotes: String,
  startedAt: {
    type: Date,
    default: Date.now
  },
  completedAt: Date,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Consultation', consultationSchema);