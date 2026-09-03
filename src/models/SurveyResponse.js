const mongoose = require('mongoose');

const surveyResponseSchema = new mongoose.Schema(
  {
    consent: {
      type: String,
      enum: ['acepto', 'no_acepto'],
      required: true,
    },
    // Respuestas dinamicas: { idPregunta: valor } donde valor puede ser
    // string, numero, boolean o arreglo (preguntas de seleccion multiple).
    answers: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    submittedAt: {
      type: Date,
      default: Date.now,
    },
    ip: {
      type: String,
      default: '',
    },
    period: {
      type: Number,
      default: 1,
    },
    periodLabel: {
      type: String,
      default: 'Periodo 1',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('SurveyResponse', surveyResponseSchema);
