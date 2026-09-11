// Bed Management Service
// Real-time ICU and ward allocation

const Bed = require('../models/Bed');
const Admission = require('../models/Admission');

class BedService {
  /**
   * Initialize beds in the system
   */
  static async initializeBeds() {
    try {
      const existingBeds = await Bed.countDocuments();
      if (existingBeds > 0) return;

      const beds = [];

      // ICU Beds (20)
      for (let i = 1; i <= 20; i++) {
        beds.push({
          bedId: `ICU-${String(i).padStart(2, '0')}`,
          ward: 'ICU',
          roomNumber: `ICU-${i}`,
          status: 'available',
          features: ['ventilator', 'monitor', 'oxygen']
        });
      }

      // General Ward Beds (50)
      for (let i = 1; i <= 50; i++) {
        beds.push({
          bedId: `WARD-${String(i).padStart(2, '0')}`,
          ward: 'GENERAL_WARD',
          roomNumber: `Ward-${Math.ceil(i / 5)}-${((i - 1) % 5) + 1}`,
          status: 'available',
          features: ['monitor', 'oxygen']
        });
      }

      // Emergency Beds (5)
      for (let i = 1; i <= 5; i++) {
        beds.push({
          bedId: `EMERG-${i}`,
          ward: 'EMERGENCY',
          roomNumber: `ER-${i}`,
          status: 'available',
          features: ['monitor', 'oxygen', 'emergency_kit']
        });
      }

      // Isolation Beds (5)
      for (let i = 1; i <= 5; i++) {
        beds.push({
          bedId: `ISOL-${i}`,
          ward: 'ISOLATION',
          roomNumber: `Isolation-${i}`,
          status: 'available',
          features: ['monitor', 'oxygen', 'hepa_filter']
        });
      }

      await Bed.insertMany(beds);
      console.log('Beds initialized successfully');
    } catch (error) {
      console.error('Error initializing beds:', error);
    }
  }

  /**
   * Find available bed in a ward
   */
  static async findAvailableBed(wardType) {
    try {
      const bed = await Bed.findOne({
        ward: wardType,
        status: 'available'
      });
      return bed;
    } catch (error) {
      console.error('Error finding available bed:', error);
      return null;
    }
  }

  /**
   * Allocate bed to patient
   */
  static async allocateBed(patientId, patientName, wardType) {
    try {
      const availableBed = await this.findAvailableBed(wardType);

      if (!availableBed) {
        return {
          success: false,
          message: `No available ${wardType} bed at the moment`
        };
      }

      // Update bed status
      availableBed.status = 'occupied';
      availableBed.occupantPatientId = patientId;
      availableBed.occupantName = patientName;
      availableBed.admissionDate = new Date();
      availableBed.assignedAt = new Date();
      await availableBed.save();

      return {
        success: true,
        bed: availableBed,
        message: `Bed ${availableBed.bedId} allocated successfully`
      };
    } catch (error) {
      console.error('Error allocating bed:', error);
      return {
        success: false,
        message: 'Error allocating bed',
        error: error.message
      };
    }
  }

  /**
   * Release bed (patient discharge)
   */
  static async releaseBed(bedId) {
    try {
      const bed = await Bed.findById(bedId);
      if (!bed) {
        return { success: false, message: 'Bed not found' };
      }

      bed.status = 'cleaning';
      bed.occupantPatientId = null;
      bed.occupantName = null;
      bed.lastCleanedAt = new Date();
      await bed.save();

      // Mark as available after cleaning
      setTimeout(async () => {
        bed.status = 'available';
        await bed.save();
      }, 30 * 60 * 1000); // 30 minutes cleaning time

      return { success: true, message: 'Bed released for cleaning' };
    } catch (error) {
      console.error('Error releasing bed:', error);
      return {
        success: false,
        message: 'Error releasing bed',
        error: error.message
      };
    }
  }

  /**
   * Get bed occupancy status
   */
  static async getBedOccupancy() {
    try {
      const icu = await Bed.find({ ward: 'ICU' });
      const ward = await Bed.find({ ward: 'GENERAL_WARD' });
      const emergency = await Bed.find({ ward: 'EMERGENCY' });
      const isolation = await Bed.find({ ward: 'ISOLATION' });

      const calculateStats = (beds) => {
        const total = beds.length;
        const occupied = beds.filter(b => b.status === 'occupied').length;
        const available = beds.filter(b => b.status === 'available').length;
        const cleaning = beds.filter(b => b.status === 'cleaning').length;
        const occupancyRate = ((occupied / total) * 100).toFixed(1);

        return { total, occupied, available, cleaning, occupancyRate };
      };

      return {
        icu: calculateStats(icu),
        general_ward: calculateStats(ward),
        emergency: calculateStats(emergency),
        isolation: calculateStats(isolation)
      };
    } catch (error) {
      console.error('Error getting bed occupancy:', error);
      throw error;
    }
  }

  /**
   * Get all beds with details
   */
  static async getAllBeds() {
    try {
      return await Bed.find().lean();
    } catch (error) {
      console.error('Error getting all beds:', error);
      throw error;
    }
  }

  /**
   * Get beds by ward
   */
  static async getBedsByWard(ward) {
    try {
      return await Bed.find({ ward }).lean();
    } catch (error) {
      console.error('Error getting beds by ward:', error);
      throw error;
    }
  }
}

module.exports = BedService;