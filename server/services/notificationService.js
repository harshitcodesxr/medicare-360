// Notification Service
// Handle all notifications

const Notification = require('../models/Notification');

class NotificationService {
  /**
   * Create and save notification
   */
  static async createNotification({
    userId,
    type,
    title,
    message,
    relatedPatientId,
    relatedData,
    priority = 'medium'
  }) {
    try {
      const notification = new Notification({
        userId,
        type,
        title,
        message,
        relatedPatientId,
        relatedData,
        priority,
        createdAt: new Date()
      });

      await notification.save();
      return notification;
    } catch (error) {
      console.error('Error creating notification:', error);
      throw error;
    }
  }

  /**
   * Get notifications for user
   */
  static async getNotifications(userId, limit = 20) {
    try {
      return await Notification.find({ userId })
        .sort({ createdAt: -1 })
        .limit(limit)
        .lean();
    } catch (error) {
      console.error('Error getting notifications:', error);
      throw error;
    }
  }

  /**
   * Mark notification as read
   */
  static async markAsRead(notificationId) {
    try {
      return await Notification.findByIdAndUpdate(
        notificationId,
        {
          isRead: true,
          readAt: new Date()
        },
        { new: true }
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  }

  /**
   * Get unread count
   */
  static async getUnreadCount(userId) {
    try {
      return await Notification.countDocuments({
        userId,
        isRead: false
      });
    } catch (error) {
      console.error('Error getting unread count:', error);
      throw error;
    }
  }

  /**
   * Notify patient of queue position change
   */
  static async notifyQueuePositionChange(userId, patientId, oldPosition, newPosition) {
    if (oldPosition > newPosition) {
      return this.createNotification({
        userId,
        type: 'queue',
        title: 'Queue Position Updated',
        message: `Your queue position has improved from ${oldPosition} to ${newPosition}. You will be seen soon!`,
        relatedPatientId: patientId,
        priority: 'high'
      });
    }
  }

  /**
   * Notify doctor of critical patient
   */
  static async notifyCriticalPatient(doctorId, patientId, patientName) {
    return this.createNotification({
      userId: doctorId,
      type: 'alert',
      title: '⚠️ Critical Patient Alert',
      message: `Critical priority patient ${patientName} has entered the queue`,
      relatedPatientId: patientId,
      priority: 'high'
    });
  }

  /**
   * Notify lab technician of new test
   */
  static async notifyNewLabTest(labTechId, patientName, testName) {
    return this.createNotification({
      userId: labTechId,
      type: 'lab',
      title: 'New Lab Test Request',
      message: `New ${testName} test requested for ${patientName}`,
      priority: 'medium'
    });
  }

  /**
   * Notify doctor of completed lab test
   */
  static async notifyLabTestCompleted(doctorId, patientName, testName) {
    return this.createNotification({
      userId: doctorId,
      type: 'lab',
      title: 'Lab Test Completed',
      message: `${testName} test results are ready for ${patientName}`,
      priority: 'high'
    });
  }

  /**
   * Notify pharmacist of new prescription
   */
  static async notifyNewPrescription(pharmacistId, patientName) {
    return this.createNotification({
      userId: pharmacistId,
      type: 'prescription',
      title: 'New Prescription',
      message: `New prescription received for ${patientName}`,
      priority: 'medium'
    });
  }

  /**
   * Notify admin of high ICU occupancy
   */
  static async notifyHighOccupancy(adminId, ward, occupancyRate) {
    return this.createNotification({
      userId: adminId,
      type: 'alert',
      title: `High ${ward} Occupancy`,
      message: `${ward} occupancy has reached ${occupancyRate}%`,
      priority: occupancyRate > 95 ? 'high' : 'medium'
    });
  }
}

module.exports = NotificationService;