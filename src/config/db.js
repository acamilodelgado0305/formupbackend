const mongoose = require('mongoose');

async function connectDB() {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/formup';

  mongoose.connection.on('connected', () => {
    console.log(`[MongoDB] Conectado a ${uri}`);
  });

  mongoose.connection.on('error', (err) => {
    console.error('[MongoDB] Error de conexion:', err.message);
  });

  await mongoose.connect(uri);
}

module.exports = connectDB;
