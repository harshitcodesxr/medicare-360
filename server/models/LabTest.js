const mongoose = require('mongoose');

const labTestSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true
  },
  consultationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Consultation'
  },
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  testName: {
    type: String,
    required: true
  },
  description: String,
  status: {
    type: String,
    enum: ['pending', 'sample_collected', 'processing', 'completed', 'cancelled'],
    default: 'pending'
  },
  sampleCollectedAt: Date,
  processingStartedAt: Date,
  completedAt: Date,
  labTechnicianId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  priority: {
    type: String,
    enum: ['routine', 'urgent'],
    default: 'routine'
  },
  orderedAt: {
    type: Date,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('LabTest', labTestSchema);