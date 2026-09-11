const Triage = require('../models/Triage');
const Patient = require('../models/Patient');
const TriageService = require('../services/triageService');
const QueueService = require('../services/queueService');

class TriageController {
  /**
   * Submit symptoms for AI triage evaluation
   */
  static async submitTriage(req, res) {
    try {
      const { patientId, symptoms, mainSymptom, duration, painLevel, temperature, heartRate, bloodPressureSystolic, bloodPressureDiastolic, oxygenSaturation, breathingDifficulty, chestPain, lossOfConsciousness, existingMedicalConditions } = req.body;

      if (!patientId) {
        return res.status(400).json({ message: 'Patient ID required' });
      }

      // Verify patient exists
      const patient = await Patient.findById(patientId);
      if (!patient) {
        return res.status(404).json({ message: 'Patient not found' });
      }

      // Prepare triage data
      const triageData = {
        symptoms: symptoms || [],
        mainSymptom,
        duration,
        painLevel,
        temperature,
        heartRate,
        bloodPressureSystolic,
        bloodPressureDiastolic,
        oxygenSaturation,
        breathingDifficulty,
        chestPain,
        lossOfConsciousness,
        existingMedicalConditions: existingMedicalConditions || []
      };

      // Calculate triage using AI service
      const triageResult = TriageService.calculateTriage(triageData);

      // Save triage record
      const triage = new Triage({
        patientId,
        ...triageData,
        ...triageResult,
        status: 'evaluated'
      });

      await triage.save();

      // Add to queue automatically
      const queueItem = await QueueService.addToQueue(
        patientId,
        triage._id,
        triageResult.priority,
        triageResult.riskScore
      );

      res.status(201).json({
        message: 'Triage completed successfully',
        triage: {
          _id: triage._id,
          priority: triage.priority,
          riskScore: triage.riskScore,
          reason: triage.reason,
          emergencyKeywords: triage.emergencyKeywords
        },
        queue: {
          position: queueItem.position,
          estimatedWaitTime: QueueService.estimateWaitTime(queueItem.position - 1)
        }
      });
    } catch (error) {
      console.error('Triage error:', error);
      res.status(500).json({ message: 'Triage evaluation failed', error: error.message });
    }
  }

  /**
   * Get triage by ID
   */
  static async getTriage(req, res) {
    try {
      const { id } = req.params;
      const triage = await Triage.findById(id).populate('patientId');

      if (!triage) {
        return res.status(404).json({ message: 'Triage not found' });
      }

      res.json({ triage });
    } catch (error) {
      console.error('Error fetching triage:', error);
      res.status(500).json({ message: 'Error fetching triage', error: error.message });
    }
  }

  /**
   * Get latest triage for patient
   */
  static async getPatientTriage(req, res) {
    try {
      const { patientId } = req.params;
      const triage = await Triage.findOne({ patientId })
        .sort({ createdAt: -1 })
        .populate('patientId');

      if (!triage) {
        return res.status(404).json({ message: 'No triage record found for this patient' });
      }

      res.json({ triage });
    } catch (error) {
      console.error('Error fetching patient triage:', error);
      res.status(500).json({ message: 'Error fetching triage', error: error.message });
    }
  }
}

module.exports = TriageController;