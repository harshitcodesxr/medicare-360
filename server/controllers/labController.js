const LabTest = require('../models/LabTest');
const LabReport = require('../models/LabReport');
const NotificationService = require('../services/notificationService');

class LabController {
  /**
   * Get all lab test requests
   */
  static async getLabTests(req, res) {
    try {
      const { status, page = 1, limit = 20 } = req.query;
      const skip = (page - 1) * limit;

      let query = {};
      if (status) query.status = status;

      const tests = await LabTest.find(query)
        .populate('patientId', 'patientId')
        .populate('doctorId', 'name')
        .skip(skip)
        .limit(parseInt(limit))
        .sort({ orderedAt: -1 });

      const total = await LabTest.countDocuments(query);

      res.json({
        tests,
        pagination: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(total / limit)
        }
      });
    } catch (error) {
      console.error('Error fetching lab tests:', error);
      res.status(500).json({ message: 'Error fetching lab tests', error: error.message });
    }
  }

  /**
   * Order lab test
   */
  static async orderLabTest(req, res) {
    try {
      const { patientId, consultationId, testName, description, priority } = req.body;
      const doctorId = req.userId;

      if (!patientId || !testName) {
        return res.status(400).json({ message: 'Patient ID and test name required' });
      }

      const labTest = new LabTest({
        patientId,
        consultationId,
        doctorId,
        testName,
        description,
        priority: priority || 'routine',
        status: 'pending'
      });

      await labTest.save();

      // Notify lab technicians
      // In real app, notify all lab techs via Socket.IO

      res.status(201).json({
        message: 'Lab test ordered successfully',
        test: labTest
      });
    } catch (error) {
      console.error('Error ordering lab test:', error);
      res.status(500).json({ message: 'Error ordering lab test', error: error.message });
    }
  }

  /**
   * Update lab test status
   */
  static async updateTestStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const test = await LabTest.findByIdAndUpdate(
        id,
        { status, labTechnicianId: req.userId },
        { new: true }
      );

      if (!test) {
        return res.status(404).json({ message: 'Lab test not found' });
      }

      // Update timestamps based on status
      if (status === 'sample_collected') {
        test.sampleCollectedAt = new Date();
      } else if (status === 'processing') {
        test.processingStartedAt = new Date();
      } else if (status === 'completed') {
        test.completedAt = new Date();
      }
      await test.save();

      res.json({
        message: 'Test status updated',
        test
      });
    } catch (error) {
      console.error('Error updating test status:', error);
      res.status(500).json({ message: 'Error updating test status', error: error.message });
    }
  }

  /**
   * Submit lab report
   */
  static async submitLabReport(req, res) {
    try {
      const { labTestId, result, referenceRange, remarks, normalAbnormal } = req.body;
      const labTechnicianId = req.userId;

      if (!labTestId || !result) {
        return res.status(400).json({ message: 'Lab test ID and result required' });
      }

      // Get lab test
      const labTest = await LabTest.findById(labTestId);
      if (!labTest) {
        return res.status(404).json({ message: 'Lab test not found' });
      }

      const report = new LabReport({
        labTestId,
        patientId: labTest.patientId,
        testName: labTest.testName,
        result,
        referenceRange,
        remarks,
        normalAbnormal: normalAbnormal || 'normal',
        labTechnicianId,
        reportDate: new Date()
      });

      await report.save();

      // Update lab test status
      labTest.status = 'completed';
      labTest.completedAt = new Date();
      await labTest.save();

      // Notify doctor
      if (labTest.doctorId) {
        await NotificationService.createNotification({
          userId: labTest.doctorId,
          type: 'lab',
          title: 'Lab Report Ready',
          message: `${labTest.testName} results are ready for patient ${labTest.patientId}`,
          relatedPatientId: labTest.patientId,
          priority: 'high'
        });
      }

      res.status(201).json({
        message: 'Lab report submitted successfully',
        report
      });
    } catch (error) {
      console.error('Error submitting lab report:', error);
      res.status(500).json({ message: 'Error submitting lab report', error: error.message });
    }
  }

  /**
   * Get lab report
   */
  static async getLabReport(req, res) {
    try {
      const { labTestId } = req.params;
      const report = await LabReport.findOne({ labTestId })
        .populate('patientId')
        .populate('labTechnicianId', 'name');

      if (!report) {
        return res.status(404).json({ message: 'Lab report not found' });
      }

      res.json({ report });
    } catch (error) {
      console.error('Error fetching lab report:', error);
      res.status(500).json({ message: 'Error fetching lab report', error: error.message });
    }
  }

  /**
   * Get patient lab reports
   */
  static async getPatientLabReports(req, res) {
    try {
      const { patientId } = req.params;
      const reports = await LabReport.find({ patientId })
        .populate('labTechnicianId', 'name')
        .sort({ reportDate: -1 });

      res.json({ reports });
    } catch (error) {
      console.error('Error fetching patient lab reports:', error);
      res.status(500).json({ message: 'Error fetching lab reports', error: error.message });
    }
  }
}

module.exports = LabController;