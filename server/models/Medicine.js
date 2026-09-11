const mongoose = require('mongoose');

const medicineSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  genericName: String,
  manufacturer: String,
  category: String,
  dosageForm: String,
  strength: String,
  availableQuantity: {
    type: Number,
    default: 0
  },
  minimumThreshold: {
    type: Number,
    default: 10
  },
  price: Number,
  expiryDate: Date,
  status: {
    type: String,
    enum: ['available', 'low_stock', 'out_of_stock', 'expired'],
    default: 'available'
  },
  addedAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Medicine', medicineSchema);