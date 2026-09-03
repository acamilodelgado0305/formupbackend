const express = require('express');
const {
  getPublicStatus,
  getSettings,
  updateStatus,
  closePeriod,
  listPeriods,
} = require('../controllers/settingsController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Publica
router.get('/public', getPublicStatus);

// Protegidas
router.get('/', protect, getSettings);
router.put('/status', protect, updateStatus);
router.post('/close-period', protect, closePeriod);
router.get('/periods', protect, listPeriods);

module.exports = router;
