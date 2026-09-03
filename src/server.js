require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const surveyRoutes = require('./routes/surveys');
const settingsRoutes = require('./routes/settings');

const app = express();

// CLIENT_ORIGIN admite varios origenes separados por coma, para poder permitir
// a la vez el frontend de produccion y el entorno local de desarrollo.
const allowedOrigins = (process.env.CLIENT_ORIGIN || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean)
  .concat(['http://localhost:5173', 'https://formupfrontend.vercel.app']);

app.use(
  cors({
    origin(origin, callback) {
      // Sin cabecera Origin (curl, health checks, peticiones server-to-server)
      // no aplica CORS, asi que se dejan pasar.
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      // Los deploys de preview de Vercel cambian de URL en cada commit.
      if (/^https:\/\/formupfrontend[a-z0-9-]*\.vercel\.app$/.test(origin)) {
        return callback(null, true);
      }
      return callback(new Error(`Origen no permitido por CORS: ${origin}`));
    },
  })
);
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/auth', authRoutes);
app.use('/api/surveys', surveyRoutes);
app.use('/api/settings', settingsRoutes);

app.use((req, res) => {
  res.status(404).json({ message: 'Ruta no encontrada.' });
});

const PORT = process.env.PORT || 4000;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`[Server] Escuchando en http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('No se pudo conectar a MongoDB:', err.message);
    process.exit(1);
  });
