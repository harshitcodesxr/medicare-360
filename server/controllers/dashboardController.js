const Patient = require('../models/Patient');
const Queue = require('../models/Queue');
const Consultation = require('../models/Consultation');
const Bed = require('../models/Bed');
const LabTest = require('../models/LabTest');
const Prescription = require('../models/Prescription');
const Admission = require('../models/Admission');
const User = require('../models/User');
const BedService = require('../services/bedService');

class DashboardController {
  /**
   * Get dashboard statistics
   */
  static async getDashboardStats(req, res) {
    try {
      // Patient stats
      const totalPatients = await Patient.countDocuments();
      const todayPatients = await Queue.countDocuments({
        createdAt: {
          $gte: new Date(new Date().setHours(0, 0, 0, 0)),
          $lte: new Date(new Date().setHours(23, 59, 59, 999))
        }
      });

      // Queue stats
      const waitingPatients = await Queue.countDocuments({ status: 'waiting' });
      const criticalPatients = await Queue.countDocuments({
        status: 'waiting',
        priority: 'CRITICAL'
      });
      const mediumPatients = await Queue.countDocuments({
        status: 'waiting',
        priority: 'MEDIUM'
      });
      const normalPatients = await Queue.countDocuments({
        status: 'waiting',
        priority: 'NORMAL'
      });

      // Consultation stats
      const completedConsultations = await Consultation.countDocuments({
        status: 'completed',
        startedAt: {
          $gte: new Date(new Date().setHours(0, 0, 0, 0))
        }
      });

      // User stats
      const activeDoctors = await User.countDocuments({
        role: 'doctor',
        isActive: true
      });

      // Lab stats
      const pendingLabTests = await LabTest.countDocuments({
        status: { $in: ['pending', 'sample_collected', 'processing'] }
      });
      const completedLabTests = await LabTest.countDocuments({
        status: 'completed',
        completedAt: {
          $gte: new Date(new Date().setHours(0, 0, 0, 0))
        }
      });

      // Prescription stats
      const pendingPrescriptions = await Prescription.countDocuments({
        status: { $in: ['pending', 'processing'] }
      });
      const dispensedPrescriptions = await Prescription.countDocuments({
        status: 'dispensed',
        dispensedAt: {
          $gte: new Date(new Date().setHours(0, 0, 0, 0))
        }
      });

      // Bed stats
      const bedOccupancy = await BedService.getBedOccupancy();
      const totalBeds = bedOccupancy.icu.total + bedOccupancy.general_ward.total;
      const occupiedBeds = bedOccupancy.icu.occupied + bedOccupancy.general_ward.occupied;
      const availableBeds = bedOccupancy.icu.available + bedOccupancy.general_ward.available;

      // Current admissions
      const currentAdmissions = await Admission.countDocuments({
        status: 'admitted'
      });

      // Average wait time
      const completedQueue = await Queue.find({ status: 'completed' })
        .select('enteredAt consultationCompletedAt')
        .limit(10)
        .lean();

      let avgWaitTime = 0;
      if (completedQueue.length > 0) {
        const totalWait = completedQueue.reduce((sum, item) => {
          if (item.consultationCompletedAt && item.enteredAt) {
            return sum + (item.consultationCompletedAt - item.enteredAt);
          }
          return sum;
        }, 0);
        avgWaitTime = Math.floor(totalWait / completedQueue.length / (1000 * 60));
      }

      res.json({
        patients: {
          total: totalPatients,
          today: todayPatients
        },
        queue: {
          waiting: waitingPatients,
          critical: criticalPatients,
          medium: mediumPatients,
          normal: normalPatients
        },
        consultations: {
          completed: completedConsultations
        },
        staff: {
          activeDoctors
        },
        lab: {
          pending: pendingLabTests,
          completed: completedLabTests
        },
        pharmacy: {
          pending: pendingPrescriptions,
          dispensed: dispensedPrescriptions
        },
        beds: {
          total: totalBeds,
          occupied: occupiedBeds,
          available: availableBeds,
          occupancyRate: ((occupiedBeds / totalBeds) * 100).toFixed(1),
          icu: bedOccupancy.icu,
          general_ward: bedOccupancy.general_ward
        },
        admissions: {
          current: currentAdmissions
        },
        averageWaitTime: avgWaitTime,
        lastUpdated: new Date()
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      res.status(500).json({ message: 'Error fetching dashboard stats', error: error.message });
    }
  }

  /**
   * Get priority distribution chart data
   */
  static async getPriorityDistribution(req, res) {
    try {
      const critical = await Queue.countDocuments({
        status: 'waiting',
        priority: 'CRITICAL'
      });
      const medium = await Queue.countDocuments({
        status: 'waiting',
        priority: 'MEDIUM'
      });
      const normal = await Queue.countDocuments({
        status: 'waiting',
        priority: 'NORMAL'
      });

      res.json({
        labels: ['Critical', 'Medium', 'Normal'],
        data: [critical, medium, normal],
        colors: ['#dc3545', '#ffc107', '#28a745']
      });
    } catch (error) {
      console.error('Error fetching priority distribution:', error);
      res.status(500).json({ message: 'Error fetching priority distribution', error: error.message });
    }
  }

  /**
   * Get patient flow data
   */
  static async getPatientFlow(req, res) {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const patientsByHour = await Queue.aggregate([
        {
          $match: {
            createdAt: { $gte: today }
          }
        },
        {
          $group: {
            _id: { $hour: '$createdAt' },
            count: { $sum: 1 }
          }
        },
        {
          $sort: { _id: 1 }
        }
      ]);

      const hours = [];
      const data = [];
      for (let i = 0; i < 24; i++) {
        const hourData = patientsByHour.find(item => item._id === i);
        hours.push(`${String(i).padStart(2, '0')}:00`);
        data.push(hourData ? hourData.count : 0);
      }

      res.json({
        labels: hours,
        data
      });
    } catch (error) {
      console.error('Error fetching patient flow:', error);
      res.status(500).json({ message: 'Error fetching patient flow', error: error.message });
    }
  }

  /**
   * Get bed occupancy data
   */
  static async getBedOccupancyData(req, res) {
    try {
      const occupancy = await BedService.getBedOccupancy();

      res.json({
        labels: ['ICU', 'General Ward'],
        data: [
          occupancy.icu.occupied,
          occupancy.general_ward.occupied
        ],
        total: [
          occupancy.icu.total,
          occupancy.general_ward.total
        ],
        occupancyRates: [
          occupancy.icu.occupancyRate,
          occupancy.general_ward.occupancyRate
        ]
      });
    } catch (error) {
      console.error('Error fetching bed occupancy data:', error);
      res.status(500).json({ message: 'Error fetching bed occupancy data', error: error.message });
    }
  }
}

module.exports = DashboardController;