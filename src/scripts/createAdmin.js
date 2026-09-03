require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const User = require('../models/User');

async function run() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    console.error('Define ADMIN_EMAIL y ADMIN_PASSWORD en el archivo .env antes de ejecutar este script.');
    process.exit(1);
  }

  await connectDB();

  const existing = await User.findOne({ email: email.toLowerCase().trim() });
  if (existing) {
    console.log(`El usuario administrador ${email} ya existe. No se realizaron cambios.`);
    await mongoose.disconnect();
    return;
  }

  const admin = await User.create({
    email,
    password,
    name: 'Administrador',
    role: 'admin',
  });

  console.log(`Usuario administrador creado: ${admin.email}`);
  await mongoose.disconnect();
}

run().catch((err) => {
  console.error('Error creando el usuario administrador:', err.message);
  process.exit(1);
});
