const Consultation = require('../models/Consultation');
const Queue = require('../models/Queue');

class ConsultationController {
  /**
   * Create consultation
   */
  static async createConsultation(req, res) {
    try {
      const { patientId, queueId, symptoms, vitals } = req.body;
      const doctorId = req.userId;

      const consultation = new Consultation({
        patientId,
        doctorId,
        queueId,
        symptoms,
        vitals: vitals || {},
        status: 'ongoing'
      });

      await consultation.save();

      res.status(201).json({
        message: 'Consultation started',
        consultation
      });
    } catch (error) {
      console.error('Error creating consultation:', error);
      res.status(500).json({ message: 'Error creating consultation', error: error.message });
    }
  }

  /**
   * Update consultation
   */
  static async updateConsultation(req, res) {
    try {
      const { id } = req.params;
      const { diagnosis, treatmentPlan, notes, followUpDate, vitals } = req.body;

      const consultation = await Consultation.findByIdAndUpdate(
        id,
        {
          diagnosis,
          treatmentPlan,
          notes,
          followUpDate,
          vitals: vitals || {}
        },
        { new: true }
      );

      if (!consultation) {
        return res.status(404).json({ message: 'Consultation not found' });
      }

      res.json({
        message: 'Consultation updated',
        consultation
      });
    } catch (error) {
      console.error('Error updating consultation:', error);
      res.status(500).json({ message: 'Error updating consultation', error: error.message });
    }
  }

  /**
   * Complete consultation
   */
  static async completeConsultation(req, res) {
    try {
      const { id } = req.params;
      const { followUpNotes } = req.body;

      const consultation = await Consultation.findByIdAndUpdate(
        id,
        {
          status: 'completed',
          completedAt: new Date(),
          followUpNotes
        },
        { new: true }
      );

      if (!consultation) {
        return res.status(404).json({ message: 'Consultation not found' });
      }

      res.json({
        message: 'Consultation completed',
        consultation
      });
    } catch (error) {
      console.error('Error completing consultation:', error);
      res.status(500).json({ message: 'Error completing consultation', error: error.message });
    }
  }

  /**
   * Get consultation by ID
   */
  static async getConsultation(req, res) {
    try {
      const { id } = req.params;
      const consultation = await Consultation.findById(id)
        .populate('patientId')
        .populate('doctorId', 'name specialization');

      if (!consultation) {
        return res.status(404).json({ message: 'Consultation not found' });
      }

      res.json({ consultation });
    } catch (error) {
      console.error('Error fetching consultation:', error);
      res.status(500).json({ message: 'Error fetching consultation', error: error.message });
    }
  }

  /**
   * Get patient consultations
   */
  static async getPatientConsultations(req, res) {
    try {
      const { patientId } = req.params;
      const consultations = await Consultation.find({ patientId })
        .populate('doctorId', 'name specialization')
        .sort({ createdAt: -1 });

      res.json({ consultations });
    } catch (error) {
      console.error('Error fetching consultations:', error);
      res.status(500).json({ message: 'Error fetching consultations', error: error.message });
    }
  }
}

module.exports = ConsultationController;