import mysql from 'mysql2/promise';
import { parse } from 'url';

let pool: mysql.Pool | null = null;

let initialized = false;

async function ensureTables() {
  if (initialized) return;
  const p = pool || getPool();
  // NOTE: pool may not be ready until after getPool assigns it
  await p.execute(`
    CREATE TABLE IF NOT EXISTS User (
      id INT AUTO_INCREMENT PRIMARY KEY,
      uid VARCHAR(255) UNIQUE NOT NULL,
      uname VARCHAR(255) UNIQUE NOT NULL,
      password TEXT NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      phone VARCHAR(255) NOT NULL,
      role VARCHAR(50) NOT NULL DEFAULT 'customer',
      balance DOUBLE NOT NULL DEFAULT 100000
    )
  `);

  await p.execute(`
    CREATE TABLE IF NOT EXISTS UserToken (
      id INT AUTO_INCREMENT PRIMARY KEY,
      token VARCHAR(768) UNIQUE NOT NULL,
      userId INT NOT NULL,
      createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (userId) REFERENCES User(id) ON DELETE CASCADE
    )
  `);

  initialized = true;
}

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

  // ensure tables right away
  ensureTables().catch(err => {
    console.error('Error ensuring DB tables:', err);
  });

  return pool;
}

export { getPool, ensureTables };
