
import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

console.log('Database URL:', process.env.DATABASE_URL);

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: false // Disable SSL for local development
});

// Test database connection
pool.on('connect', () => {
  console.log('Successfully connected to PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('Database connection error:', err);
});
