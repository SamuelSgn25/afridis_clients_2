import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();
 
const { Pool } = pg;
 
const connectionString = `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}/${process.env.DB_NAME}?sslmode=require`;
 
const pool = new Pool({
  connectionString,
  max: 50,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});
 
export default pool;
