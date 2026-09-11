const Prescription = require('../models/Prescription');
const Medicine = require('../models/Medicine');
const NotificationService = require('../services/notificationService');

class PharmacyController {
  /**
   * Get all prescriptions
   */
  static async getPrescriptions(req, res) {
    try {
      const { status, page = 1, limit = 20 } = req.query;
      const skip = (page - 1) * limit;

      let query = {};
      if (status) query.status = status;

      const prescriptions = await Prescription.find(query)
        .populate('patientId', 'patientId')
        .populate('doctorId', 'name')
        .populate('pharmacistId', 'name')
        .skip(skip)
        .limit(parseInt(limit))
        .sort({ issuedAt: -1 });

      const total = await Prescription.countDocuments(query);

      res.json({
        prescriptions,
        pagination: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(total / limit)
        }
      });
    } catch (error) {
      console.error('Error fetching prescriptions:', error);
      res.status(500).json({ message: 'Error fetching prescriptions', error: error.message });
    }
  }

  /**
   * Create prescription
   */
  static async createPrescription(req, res) {
    try {
      const { patientId, consultationId, medicines, instructions } = req.body;
      const doctorId = req.userId;

      if (!patientId || !medicines || medicines.length === 0) {
        return res.status(400).json({ message: 'Patient ID and medicines required' });
      }

      const prescription = new Prescription({
        patientId,
        consultationId,
        doctorId,
        medicines,
        instructions,
        status: 'pending',
        issuedAt: new Date()
      });

      await prescription.save();

      // Notify pharmacist
      // In real app, notify all pharmacists via Socket.IO

      res.status(201).json({
        message: 'Prescription created successfully',
        prescription
      });
    } catch (error) {
      console.error('Error creating prescription:', error);
      res.status(500).json({ message: 'Error creating prescription', error: error.message });
    }
  }

  /**
   * Update prescription status
   */
  static async updatePrescriptionStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const pharmacistId = req.userId;

      const prescription = await Prescription.findByIdAndUpdate(
        id,
        {
          status,
          pharmacistId: status === 'dispensed' ? pharmacistId : undefined,
          dispensedAt: status === 'dispensed' ? new Date() : undefined
        },
        { new: true }
      );

      if (!prescription) {
        return res.status(404).json({ message: 'Prescription not found' });
      }

      res.json({
        message: 'Prescription status updated',
        prescription
      });
    } catch (error) {
      console.error('Error updating prescription status:', error);
      res.status(500).json({ message: 'Error updating prescription status', error: error.message });
    }
  }

  /**
   * Get patient prescriptions
   */
  static async getPatientPrescriptions(req, res) {
    try {
      const { patientId } = req.params;
      const prescriptions = await Prescription.find({ patientId })
        .populate('doctorId', 'name')
        .sort({ issuedAt: -1 });

      res.json({ prescriptions });
    } catch (error) {
      console.error('Error fetching patient prescriptions:', error);
      res.status(500).json({ message: 'Error fetching prescriptions', error: error.message });
    }
  }

  /**
   * Get medicines inventory
   */
  static async getMedicines(req, res) {
    try {
      const medicines = await Medicine.find().sort({ name: 1 });
      res.json({ medicines });
    } catch (error) {
      console.error('Error fetching medicines:', error);
      res.status(500).json({ message: 'Error fetching medicines', error: error.message });
    }
  }

  /**
   * Update medicine stock
   */
  static async updateMedicineStock(req, res) {
    try {
      const { id } = req.params;
      const { availableQuantity } = req.body;

      const medicine = await Medicine.findByIdAndUpdate(
        id,
        {
          availableQuantity,
          status: availableQuantity === 0 ? 'out_of_stock' : 
                  availableQuantity < medicine.minimumThreshold ? 'low_stock' : 'available'
        },
        { new: true }
      );

      if (!medicine) {
        return res.status(404).json({ message: 'Medicine not found' });
      }

      res.json({
        message: 'Medicine stock updated',
        medicine
      });
    } catch (error) {
      console.error('Error updating medicine stock:', error);
      res.status(500).json({ message: 'Error updating medicine stock', error: error.message });
    }
  }
}

module.exports = PharmacyController;