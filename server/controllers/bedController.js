const Bed = require('../models/Bed');
const BedService = require('../services/bedService');

class BedController {
  /**
   * Get all beds
   */
  static async getAllBeds(req, res) {
    try {
      const beds = await BedService.getAllBeds();
      res.json({ beds });
    } catch (error) {
      console.error('Error fetching beds:', error);
      res.status(500).json({ message: 'Error fetching beds', error: error.message });
    }
  }

  /**
   * Get beds by ward
   */
  static async getBedsByWard(req, res) {
    try {
      const { ward } = req.params;
      const beds = await BedService.getBedsByWard(ward);
      res.json({ beds });
    } catch (error) {
      console.error('Error fetching beds:', error);
      res.status(500).json({ message: 'Error fetching beds', error: error.message });
    }
  }

  /**
   * Get bed occupancy
   */
  static async getBedOccupancy(req, res) {
    try {
      const occupancy = await BedService.getBedOccupancy();
      res.json(occupancy);
    } catch (error) {
      console.error('Error fetching bed occupancy:', error);
      res.status(500).json({ message: 'Error fetching bed occupancy', error: error.message });
    }
  }

  /**
   * Get available beds
   */
  static async getAvailableBeds(req, res) {
    try {
      const { ward } = req.query;
      const query = { status: 'available' };
      if (ward) query.ward = ward;

      const beds = await Bed.find(query).lean();
      res.json({ beds });
    } catch (error) {
      console.error('Error fetching available beds:', error);
      res.status(500).json({ message: 'Error fetching available beds', error: error.message });
    }
  }

  /**
   * Update bed status
   */
  static async updateBed(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const bed = await Bed.findByIdAndUpdate(id, updateData, { new: true });

      if (!bed) {
        return res.status(404).json({ message: 'Bed not found' });
      }

      res.json({
        message: 'Bed updated successfully',
        bed
      });
    } catch (error) {
      console.error('Error updating bed:', error);
      res.status(500).json({ message: 'Error updating bed', error: error.message });
    }
  }
}

module.exports = BedController;