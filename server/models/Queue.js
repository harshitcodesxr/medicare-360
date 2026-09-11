const mongoose = require('mongoose');

const queueSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true
  },
  triageId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Triage'
  },
  priority: {
    type: String,
    enum: ['CRITICAL', 'MEDIUM', 'NORMAL'],
    default: 'NORMAL'
  },
  riskScore: Number,
  priorityScore: Number,
  status: {
    type: String,
    enum: ['waiting', 'in_progress', 'completed', 'cancelled'],
    default: 'waiting'
  },
  position: Number,
  assignedDoctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  enteredAt: {
    type: Date,
    default: Date.now
  },
  waitingTime: Number, // in minutes
  consultationStartedAt: Date,
  consultationCompletedAt: Date,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Calculate waiting time
queueSchema.methods.getWaitingTime = function() {
  const now = new Date();
  const waitTime = Math.floor((now - this.enteredAt) / (1000 * 60));
  return waitTime;
};

module.exports = mongoose.model('Queue', queueSchema);