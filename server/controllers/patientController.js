const Patient = require('../models/Patient');
const User = require('../models/User');

class PatientController {
  /**
   * Create new patient
   */
  static async createPatient(req, res) {
    try {
      const { age, gender, bloodGroup, address, emergencyContact, emergencyPhone, existingConditions, allergies, currentMedications, height, weight } = req.body;
      const userId = req.userId;

      // Get user details
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Check if patient already exists for this user
      const existingPatient = await Patient.findOne({ userId });
      if (existingPatient) {
        return res.status(400).json({ message: 'Patient profile already exists for this user' });
      }

      const patient = new Patient({
        userId,
        age,
        gender,
        bloodGroup,
        address,
        emergencyContact,
        emergencyPhone,
        existingConditions: existingConditions || [],
        allergies: allergies || [],
        currentMedications: currentMedications || [],
        height,
        weight
      });

      await patient.save();

      res.status(201).json({
        message: 'Patient profile created successfully',
        patient
      });
    } catch (error) {
      console.error('Error creating patient:', error);
      res.status(500).json({ message: 'Error creating patient', error: error.message });
    }
  }

  /**
   * Get patient by ID
   */
  static async getPatient(req, res) {
    try {
      const { id } = req.params;
      const patient = await Patient.findById(id).populate('userId', 'name email phone');

      if (!patient) {
        return res.status(404).json({ message: 'Patient not found' });
      }

      res.json({ patient });
    } catch (error) {
      console.error('Error fetching patient:', error);
      res.status(500).json({ message: 'Error fetching patient', error: error.message });
    }
  }

  /**
   * Get patient by userId
   */
  static async getPatientByUserId(req, res) {
    try {
      const userId = req.userId;
      const patient = await Patient.findOne({ userId });

      if (!patient) {
        return res.status(404).json({ message: 'Patient profile not found' });
      }

      res.json({ patient });
    } catch (error) {
      console.error('Error fetching patient:', error);
      res.status(500).json({ message: 'Error fetching patient', error: error.message });
    }
  }

  /**
   * Update patient
   */
  static async updatePatient(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const patient = await Patient.findByIdAndUpdate(id, updateData, { new: true });

      if (!patient) {
        return res.status(404).json({ message: 'Patient not found' });
      }

      res.json({
        message: 'Patient updated successfully',
        patient
      });
    } catch (error) {
      console.error('Error updating patient:', error);
      res.status(500).json({ message: 'Error updating patient', error: error.message });
    }
  }

  /**
   * Get all patients
   */
  static async getAllPatients(req, res) {
    try {
      const { page = 1, limit = 20 } = req.query;
      const skip = (page - 1) * limit;

      const patients = await Patient.find()
        .populate('userId', 'name email phone')
        .skip(skip)
        .limit(parseInt(limit))
        .lean();

      const total = await Patient.countDocuments();

      res.json({
        patients,
        pagination: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(total / limit)
        }
      });
    } catch (error) {
      console.error('Error fetching patients:', error);
      res.status(500).json({ message: 'Error fetching patients', error: error.message });
    }
  }
}

module.exports = PatientController;