const bcrypt = require('bcryptjs');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
const { seedProperties } = require('./propertySeeder');
const pool = require('../config/db');

async function seedAdmin() {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query('SELECT COUNT(*) as count FROM admins');
    if (rows[0].count > 0) {
      console.log('Admin user already exists. Skipping seeding.');
      return;
    }

    console.log('Seeding admin user...');
    const username = 'admin';
    const password = 'admin_password123'; 
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    await connection.query(
      'INSERT INTO admins (username, password_hash) VALUES (?, ?)',
      [username, password_hash]
    );
    console.log('=======================================');
    console.log('Admin user created successfully!');
    console.log(`Username: ${username}`);
    console.log(`Password: ${password}`);
    console.log('=======================================');

  } catch (error) {
    console.error('Error seeding admin user:', error.message);
    console.error('Please ensure you have run migrations (`npm run migrate:latest`) before running the seeder.');
  }
  finally {
    connection.release();
  }
}

async function runSeeders() {
  try {
    await seedAdmin();
    await seedProperties();
    console.log('Seeding complete.');
  } catch (error) {
    console.error('Error during seeding:', error);
  } finally {
    await pool.end();
  }
}

runSeeders();