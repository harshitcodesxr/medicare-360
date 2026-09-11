const Queue = require('../models/Queue');
const QueueService = require('../services/queueService');

class QueueController {
  /**
   * Get current queue
   */
  static async getQueue(req, res) {
    try {
      const queue = await QueueService.getCurrentQueue();
      const stats = await QueueService.getQueueStats();

      res.json({
        queue,
        stats,
        lastUpdated: new Date()
      });
    } catch (error) {
      console.error('Error fetching queue:', error);
      res.status(500).json({ message: 'Error fetching queue', error: error.message });
    }
  }

  /**
   * Get queue stats
   */
  static async getQueueStats(req, res) {
    try {
      const stats = await QueueService.getQueueStats();
      res.json(stats);
    } catch (error) {
      console.error('Error fetching queue stats:', error);
      res.status(500).json({ message: 'Error fetching queue stats', error: error.message });
    }
  }

  /**
   * Call next patient for consultation
   */
  static async callNextPatient(req, res) {
    try {
      const doctorId = req.userId;
      const nextPatient = await QueueService.callNextPatient(doctorId);

      if (!nextPatient) {
        return res.status(404).json({ message: 'No patients waiting' });
      }

      res.json({
        message: 'Patient called for consultation',
        queueItem: nextPatient
      });
    } catch (error) {
      console.error('Error calling next patient:', error);
      res.status(500).json({ message: 'Error calling next patient', error: error.message });
    }
  }

  /**
   * Complete consultation
   */
  static async completeConsultation(req, res) {
    try {
      const { queueId } = req.params;
      const queueItem = await QueueService.completeConsultation(queueId);

      res.json({
        message: 'Consultation completed',
        queueItem
      });
    } catch (error) {
      console.error('Error completing consultation:', error);
      res.status(500).json({ message: 'Error completing consultation', error: error.message });
    }
  }

  /**
   * Get patient's queue position
   */
  static async getPatientQueuePosition(req, res) {
    try {
      const { patientId } = req.params;
      const queueItem = await Queue.findOne({
        patientId,
        status: 'waiting'
      }).lean();

      if (!queueItem) {
        return res.status(404).json({ message: 'Patient not in queue' });
      }

      const waitingTime = QueueService.getWaitingTime(queueItem);
      const estimatedWaitTime = QueueService.estimateWaitTime(queueItem.position - 1);

      res.json({
        position: queueItem.position,
        priority: queueItem.priority,
        waitingTime,
        estimatedWaitTime,
        status: queueItem.status
      });
    } catch (error) {
      console.error('Error fetching queue position:', error);
      res.status(500).json({ message: 'Error fetching queue position', error: error.message });
    }
  }
}

module.exports = QueueController;