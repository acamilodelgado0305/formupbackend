const Settings = require('../models/Settings');
const SurveyResponse = require('../models/SurveyResponse');

// Publica: el formulario la consulta para saber si puede recibir respuestas
async function getPublicStatus(req, res) {
  try {
    const settings = await Settings.getSingleton();
    res.json({ isOpen: settings.isOpen, currentPeriodLabel: settings.currentPeriodLabel });
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener el estado de la encuesta.', error: err.message });
  }
}

// Protegida: detalle completo para el dashboard
async function getSettings(req, res) {
  try {
    const settings = await Settings.getSingleton();
    res.json({ settings });
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener la configuración.', error: err.message });
  }
}

// Protegida: abrir o cerrar la recepcion de respuestas
async function updateStatus(req, res) {
  try {
    const { isOpen } = req.body;
    if (typeof isOpen !== 'boolean') {
      return res.status(400).json({ message: 'isOpen debe ser booleano.' });
    }
    const settings = await Settings.getSingleton();
    settings.isOpen = isOpen;
    await settings.save();
    res.json({ settings });
  } catch (err) {
    res.status(500).json({ message: 'Error al actualizar el estado.', error: err.message });
  }
}

// Protegida: archiva el periodo actual (las respuestas ya quedaron etiquetadas
// con el numero/etiqueta de periodo en el momento de guardarse) e inicia uno nuevo,
// de forma que el conteo del dashboard "reinicia a 0" sin borrar el historico.
async function closePeriod(req, res) {
  try {
    const { nextPeriodLabel } = req.body;
    if (!nextPeriodLabel || !nextPeriodLabel.trim()) {
      return res.status(400).json({ message: 'Debe indicar la etiqueta del nuevo periodo.' });
    }

    const settings = await Settings.getSingleton();
    const closedPeriod = settings.currentPeriod;
    const closedPeriodLabel = settings.currentPeriodLabel;

    settings.currentPeriod = closedPeriod + 1;
    settings.currentPeriodLabel = nextPeriodLabel.trim();
    await settings.save();

    const archivedCount = await SurveyResponse.countDocuments({ period: closedPeriod });

    res.json({
      message: `Periodo "${closedPeriodLabel}" archivado con ${archivedCount} respuestas. Nuevo periodo activo: "${settings.currentPeriodLabel}".`,
      settings,
    });
  } catch (err) {
    res.status(500).json({ message: 'Error al cerrar el periodo.', error: err.message });
  }
}

// Protegida: lista de periodos existentes (para filtrar/exportar)
async function listPeriods(req, res) {
  try {
    const periods = await SurveyResponse.aggregate([
      { $group: { _id: { period: '$period', periodLabel: '$periodLabel' }, total: { $sum: 1 } } },
      { $sort: { '_id.period': 1 } },
    ]);
    res.json({
      periods: periods.map((p) => ({
        period: p._id.period,
        periodLabel: p._id.periodLabel,
        total: p.total,
      })),
    });
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener los periodos.', error: err.message });
  }
}

module.exports = { getPublicStatus, getSettings, updateStatus, closePeriod, listPeriods };
