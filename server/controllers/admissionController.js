const Admission = require('../models/Admission');
const BedService = require('../services/bedService');
const Bed = require('../models/Bed');

class AdmissionController {
  /**
   * Admit patient
   */
  static async admitPatient(req, res) {
    try {
      const { patientId, consultationId, ward, admissionReason, estimatedDischargeDate } = req.body;
      const doctorId = req.userId;

      if (!patientId || !ward) {
        return res.status(400).json({ message: 'Patient ID and ward required' });
      }

      // Find available bed
      const bedResult = await BedService.allocateBed(patientId, '', ward);

      if (!bedResult.success) {
        return res.status(400).json({ message: bedResult.message });
      }

      const admission = new Admission({
        patientId,
        consultationId,
        doctorId,
        bedId: bedResult.bed._id,
        ward,
        admissionReason,
        admissionDate: new Date(),
        estimatedDischargeDate,
        status: 'admitted'
      });

      await admission.save();

      res.status(201).json({
        message: 'Patient admitted successfully',
        admission: {
          ...admission.toObject(),
          bedId: bedResult.bed.bedId
        }
      });
    } catch (error) {
      console.error('Error admitting patient:', error);
      res.status(500).json({ message: 'Error admitting patient', error: error.message });
    }
  }

  /**
   * Discharge patient
   */
  static async dischargePatient(req, res) {
    try {
      const { id } = req.params;
      const { dischargeSummary } = req.body;

      const admission = await Admission.findByIdAndUpdate(
        id,
        {
          status: 'discharged',
          dischargeDate: new Date(),
          dischargeSummary
        },
        { new: true }
      );

      if (!admission) {
        return res.status(404).json({ message: 'Admission not found' });
      }

      // Release bed
      if (admission.bedId) {
        await BedService.releaseBed(admission.bedId);
      }

      res.json({
        message: 'Patient discharged successfully',
        admission
      });
    } catch (error) {
      console.error('Error discharging patient:', error);
      res.status(500).json({ message: 'Error discharging patient', error: error.message });
    }
  }

  /**
   * Get patient admissions
   */
  static async getPatientAdmissions(req, res) {
    try {
      const { patientId } = req.params;
      const admissions = await Admission.find({ patientId })
        .populate('bedId')
        .populate('doctorId', 'name')
        .sort({ admissionDate: -1 });

      res.json({ admissions });
    } catch (error) {
      console.error('Error fetching admissions:', error);
      res.status(500).json({ message: 'Error fetching admissions', error: error.message });
    }
  }

  /**
   * Get admission by ID
   */
  static async getAdmission(req, res) {
    try {
      const { id } = req.params;
      const admission = await Admission.findById(id)
        .populate('patientId')
        .populate('bedId')
        .populate('doctorId', 'name');

      if (!admission) {
        return res.status(404).json({ message: 'Admission not found' });
      }

      res.json({ admission });
    } catch (error) {
      console.error('Error fetching admission:', error);
      res.status(500).json({ message: 'Error fetching admission', error: error.message });
    }
  }

  /**
   * Get current admissions
   */
  static async getCurrentAdmissions(req, res) {
    try {
      const admissions = await Admission.find({ status: 'admitted' })
        .populate('patientId', 'patientId')
        .populate('bedId')
        .populate('doctorId', 'name');

      res.json({ admissions });
    } catch (error) {
      console.error('Error fetching admissions:', error);
      res.status(500).json({ message: 'Error fetching admissions', error: error.message });
    }
  }
}

module.exports = AdmissionController;