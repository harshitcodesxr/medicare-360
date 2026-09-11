const mongoose = require('mongoose');

const bedSchema = new mongoose.Schema({
  bedId: {
    type: String,
    required: true,
    unique: true
  },
  ward: {
    type: String,
    enum: ['ICU', 'GENERAL_WARD', 'EMERGENCY', 'ISOLATION'],
    required: true
  },
  roomNumber: String,
  status: {
    type: String,
    enum: ['available', 'reserved', 'occupied', 'cleaning', 'maintenance'],
    default: 'available'
  },
  occupantPatientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient'
  },
  occupantName: String,
  admissionDate: Date,
  estimatedDischargeDate: Date,
  features: [String], // e.g., ['ventilator', 'monitor', 'oxygen']
  assignedAt: Date,
  lastCleanedAt: Date,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Bed', bedSchema);