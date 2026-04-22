import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const { Pool } = pg;

// Parser DATABASE_URL si disponible, sinon construire la chaîne
let connectionConfig = {};

if (process.env.DATABASE_URL) {
  // Ajouter sslmode=require si absent de DATABASE_URL
  let dbUrl = process.env.DATABASE_URL;
  if (!dbUrl.includes('sslmode')) {
    dbUrl += dbUrl.includes('?') ? '&sslmode=require' : '?sslmode=require';
  }
  connectionConfig = {
    connectionString: dbUrl,
    ssl: { rejectUnauthorized: false }
  };
} else {
  // Mode de connexion classique
  connectionConfig = {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    ssl: { rejectUnauthorized: false }
  };
}

const pool = new Pool({
  ...connectionConfig,
  max: 50,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

export default pool;