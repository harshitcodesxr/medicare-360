const mongoose = require('mongoose');

const admissionSchema = new mongoose.Schema({
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
    ref: 'User',
    required: true
  },
  bedId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Bed',
    required: true
  },
  ward: {
    type: String,
    enum: ['ICU', 'GENERAL_WARD', 'EMERGENCY', 'ISOLATION'],
    required: true
  },
  admissionReason: String,
  admissionDate: {
    type: Date,
    default: Date.now
  },
  estimatedDischargeDate: Date,
  status: {
    type: String,
    enum: ['admitted', 'discharged', 'transferred', 'cancelled'],
    default: 'admitted'
  },
  dischargeSummary: String,
  dischargeDate: Date,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Admission', admissionSchema);