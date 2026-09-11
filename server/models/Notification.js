const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['queue', 'lab', 'prescription', 'admission', 'discharge', 'alert', 'info'],
    required: true
  },
  title: String,
  message: String,
  relatedPatientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient'
  },
  relatedData: mongoose.Schema.Types.Mixed,
  isRead: {
    type: Boolean,
    default: false
  },
  readAt: Date,
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Notification', notificationSchema);