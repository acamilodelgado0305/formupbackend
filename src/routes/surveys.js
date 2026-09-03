const express = require('express');
const {
  createResponse,
  listResponses,
  getResponse,
  getStats,
  exportExcel,
  getPivot,
} = require('../controllers/surveyController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Publica: cualquier estudiante puede enviar sus respuestas
router.post('/', createResponse);

// Protegidas: solo usuarios autenticados (investigadores/admin) pueden ver resultados
router.get('/', protect, listResponses);
router.get('/stats', protect, getStats);
router.get('/export', protect, exportExcel);
router.get('/pivot', protect, getPivot);
router.get('/:id', protect, getResponse);

module.exports = router;
