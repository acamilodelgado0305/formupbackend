const mongoose = require('mongoose');

// Documento singleton con la configuracion global de la encuesta:
// si esta abierta para recibir respuestas y cual es el periodo activo.
const settingsSchema = new mongoose.Schema(
  {
    isOpen: { type: Boolean, default: true },
    currentPeriod: { type: Number, default: 1 },
    currentPeriodLabel: { type: String, default: 'Periodo 1' },
  },
  { timestamps: true }
);

settingsSchema.statics.getSingleton = async function getSingleton() {
  let settings = await this.findOne();
  if (!settings) {
    settings = await this.create({});
  }
  return settings;
};

module.exports = mongoose.model('Settings', settingsSchema);
