// Queue Management Service
// Smart queue prioritization algorithm

const Queue = require('../models/Queue');
const Patient = require('../models/Patient');

class QueueService {
  /**
   * Calculate priority score for a queue item
   * Formula: urgency (60%) + waitingTime (25%) + fairnessAdjustment (15%)
   */
  static calculatePriorityScore(queueItem, allQueueItems = []) {
    // 1. Urgency Score (0-100, mapped from priority)
    let urgencyScore = 0;
    switch (queueItem.priority) {
      case 'CRITICAL':
        urgencyScore = 100;
        break;
      case 'MEDIUM':
        urgencyScore = 60;
        break;
      case 'NORMAL':
        urgencyScore = 30;
        break;
      default:
        urgencyScore = 30;
    }

    // 2. Waiting Time Score (0-100, longer wait = higher score)
    const waitingMinutes = this.getWaitingTime(queueItem);
    // Scale: 0 min = 0, 120 min = 100
    let waitingTimeScore = Math.min((waitingMinutes / 120) * 100, 100);

    // 3. Fairness Adjustment (0-100)
    // Very long wait times get a boost to prevent indefinite waiting
    let fairnessAdjustment = 0;
    if (waitingMinutes > 60) {
      fairnessAdjustment = Math.min(((waitingMinutes - 60) / 60) * 100, 100);
    }

    // Combined score
    const priorityScore = (
      (urgencyScore * 0.6) +
      (waitingTimeScore * 0.25) +
      (fairnessAdjustment * 0.15)
    );

    return Math.round(priorityScore);
  }

  /**
   * Get waiting time in minutes
   */
  static getWaitingTime(queueItem) {
    const now = new Date();
    const waitMs = now - new Date(queueItem.enteredAt);
    return Math.floor(waitMs / (1000 * 60));
  }

  /**
   * Recalculate and sort entire queue
   */
  static async recalculateQueue() {
    try {
      // Get all waiting queue items
      const waitingQueue = await Queue.find({ status: 'waiting' });

      // Calculate priority score for each
      const scoredQueue = waitingQueue.map(item => ({
        ...item.toObject(),
        priorityScore: this.calculatePriorityScore(item, waitingQueue)
      }));

      // Sort by priority score (highest first)
      scoredQueue.sort((a, b) => b.priorityScore - a.priorityScore);

      // Update positions and save
      for (let i = 0; i < scoredQueue.length; i++) {
        await Queue.findByIdAndUpdate(scoredQueue[i]._id, {
          position: i + 1,
          priorityScore: scoredQueue[i].priorityScore,
          waitingTime: this.getWaitingTime(scoredQueue[i])
        });
      }

      return scoredQueue;
    } catch (error) {
      console.error('Error recalculating queue:', error);
      throw error;
    }
  }

  /**
   * Add patient to queue
   */
  static async addToQueue(patientId, triageId, priority, riskScore) {
    try {
      const newQueueItem = new Queue({
        patientId,
        triageId,
        priority,
        riskScore,
        status: 'waiting',
        enteredAt: new Date()
      });

      await newQueueItem.save();

      // Recalculate entire queue
      await this.recalculateQueue();

      return newQueueItem;
    } catch (error) {
      console.error('Error adding to queue:', error);
      throw error;
    }
  }

  /**
   * Get current queue sorted by priority
   */
  static async getCurrentQueue() {
    try {
      const queue = await Queue.find({ status: 'waiting' })
        .populate('patientId', 'patientId')
        .populate('assignedDoctor', 'name')
        .sort({ priorityScore: -1 })
        .lean();

      // Add waiting time to each item
      return queue.map((item, index) => ({
        ...item,
        position: index + 1,
        waitingTime: this.getWaitingTime(item),
        estimatedWaitTime: this.estimateWaitTime(index)
      }));
    } catch (error) {
      console.error('Error getting queue:', error);
      throw error;
    }
  }

  /**
   * Estimate wait time based on position
   * Assumption: ~15 minutes per consultation
   */
  static estimateWaitTime(position) {
    return position * 15; // minutes
  }

  /**
   * Call next patient (move to in_progress)
   */
  static async callNextPatient(doctorId) {
    try {
      const nextPatient = await Queue.findOne({ status: 'waiting' })
        .sort({ priorityScore: -1 })
        .populate('patientId');

      if (!nextPatient) {
        return null;
      }

      nextPatient.status = 'in_progress';
      nextPatient.assignedDoctor = doctorId;
      nextPatient.consultationStartedAt = new Date();
      await nextPatient.save();

      // Recalculate queue
      await this.recalculateQueue();

      return nextPatient;
    } catch (error) {
      console.error('Error calling next patient:', error);
      throw error;
    }
  }

  /**
   * Complete patient consultation
   */
  static async completeConsultation(queueId) {
    try {
      const queueItem = await Queue.findByIdAndUpdate(
        queueId,
        {
          status: 'completed',
          consultationCompletedAt: new Date()
        },
        { new: true }
      );

      // Recalculate queue
      await this.recalculateQueue();

      return queueItem;
    } catch (error) {
      console.error('Error completing consultation:', error);
      throw error;
    }
  }

  /**
   * Get queue statistics
   */
  static async getQueueStats() {
    try {
      const waiting = await Queue.countDocuments({ status: 'waiting' });
      const inProgress = await Queue.countDocuments({ status: 'in_progress' });
      const completed = await Queue.countDocuments({ status: 'completed' });

      const criticalCount = await Queue.countDocuments({
        status: 'waiting',
        priority: 'CRITICAL'
      });

      const mediumCount = await Queue.countDocuments({
        status: 'waiting',
        priority: 'MEDIUM'
      });

      return {
        totalWaiting: waiting,
        inProgress,
        completed,
        critical: criticalCount,
        medium: mediumCount,
        normal: waiting - criticalCount - mediumCount
      };
    } catch (error) {
      console.error('Error getting queue stats:', error);
      throw error;
    }
  }
}

module.exports = QueueService;