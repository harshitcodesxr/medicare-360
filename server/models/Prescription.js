const mongoose = require('mongoose');

const prescriptionSchema = new mongoose.Schema({
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
  medicines: [{
    medicineName: String,
    dosage: String,
    frequency: String,
    duration: String,
    quantity: Number,
    notes: String
  }],
  status: {
    type: String,
    enum: ['pending', 'processing', 'dispensed', 'cancelled'],
    default: 'pending'
  },
  pharmacistId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  dispensedAt: Date,
  instructions: String,
  issuedAt: {
    type: Date,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Prescription', prescriptionSchema);