import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const { Pool } = pg;

// Si DATABASE_URL est défini (Render l'injecte parfois), on la nettoie et on ajoute sslmode
let connectionString = process.env.DATABASE_URL || 
  `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}/${process.env.DB_NAME}`;

// Ajouter sslmode=require si pas déjà présent
if (!connectionString.includes('sslmode')) {
  connectionString += connectionString.includes('?') ? '&sslmode=require' : '?sslmode=require';
}

const pool = new Pool({
  connectionString,
  ssl: { rejectUnauthorized: false }, // double sécurité
  max: 50,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

export default pool;