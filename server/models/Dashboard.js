const mongoose = require('mongoose');

const dashboardSchema = new mongoose.Schema({
  date: {
    type: Date,
    default: Date.now
  },
  totalPatients: Number,
  todayPatients: Number,
  criticalPatients: Number,
  waitingPatients: Number,
  completedConsultations: Number,
  activeDoctors: Number,
  pendingLabTests: Number,
  pendingPrescriptions: Number,
  availableBeds: Number,
  occupiedBeds: Number,
  icuOccupancy: Number,
  wardOccupancy: Number,
  averageWaitTime: Number,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Dashboard', dashboardSchema);