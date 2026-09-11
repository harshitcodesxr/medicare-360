const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  patientId: {
    type: String,
    unique: true
  },
  age: Number,
  gender: String,
  bloodGroup: String,
  address: String,
  emergencyContact: String,
  emergencyPhone: String,
  existingConditions: [String],
  allergies: [String],
  currentMedications: [String],
  medicalHistory: [{
    condition: String,
    diagnosisDate: Date,
    status: String
  }],
  height: Number,
  weight: Number,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Auto-increment patient ID
patientSchema.pre('save', async function(next) {
  if (this.isNew && !this.patientId) {
    try {
      const lastPatient = await this.constructor.findOne({}, {}, { sort: { 'createdAt': -1 } });
      let nextNumber = 101;
      if (lastPatient && lastPatient.patientId) {
        const lastNumber = parseInt(lastPatient.patientId.substring(1));
        nextNumber = lastNumber + 1;
      }
      this.patientId = 'P' + nextNumber;
    } catch (error) {
      return next(error);
    }
  }
  next();
});

module.exports = mongoose.model('Patient', patientSchema);