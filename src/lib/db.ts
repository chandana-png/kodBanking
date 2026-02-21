import mysql from 'mysql2/promise';
import { parse } from 'url';

let pool: mysql.Pool | null = null;

function getPool() {
  if (pool) return pool;
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error('DATABASE_URL not set');
  }
  // parse connection string
  const u = new URL(url);
  pool = mysql.createPool({
    host: u.hostname,
    port: parseInt(u.port || '3306'),
    user: u.username,
    password: u.password,
    database: u.pathname.replace(/^\//, ''),
    ssl: {
      rejectUnauthorized: false,
    },
    waitForConnections: true,
    connectionLimit: 10,
  });
  return pool;
}

export { getPool };
