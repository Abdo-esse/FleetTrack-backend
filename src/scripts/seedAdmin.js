import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

import User from '../models/user.js';
import connectDB from '../config/db.js';

dotenv.config();
const { ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_NAME } = process.env;

const seedAdmin = async () => {
  try {
    /* Connexion DB */
    await connectDB();

    const adminEmail = ADMIN_EMAIL || 'admin@fleettrack.com';

    /* Vérifier si admin existe déjà */
    const existingAdmin = await User.findOne({ email: adminEmail });

    if (existingAdmin) {
      console.log('Admin already exists');
      process.exit(0);
    }

    /* Hash password */
    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD || 'Admin@123', 10);

    /* Création admin */
    const admin = await User.create({
      name: ADMIN_NAME || 'Admin User',
      email: adminEmail,
      passwordHash: hashedPassword,
      role: 'Admin',
    });

    console.log('Admin created successfully');
    console.log({
      email: admin.email,
      role: admin.role,
    });

    process.exit(0);
  } catch (error) {
    console.error('Seed admin failed:', error);
    process.exit(1);
  }
};

seedAdmin();
