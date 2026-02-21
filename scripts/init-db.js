require('dotenv').config();
const mysql = require('mysql2/promise');

async function main() {
  console.log('init-db: starting');
  const url = process.env.DATABASE_URL;
  console.log('init-db: read URL', url);
  if (!url) throw new Error('DATABASE_URL missing');
  const u = new URL(url);
  console.log('init-db: parsed URL host=', u.hostname);
  const pool = mysql.createPool({
    host: u.hostname,
    port: parseInt(u.port || '3306'),
    user: u.username,
    password: u.password,
    database: u.pathname.replace(/^\//, ''),
    ssl: { rejectUnauthorized: false },
    waitForConnections: true,
    connectionLimit: 10,
  });

  await pool.execute(`
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

  await pool.execute(`
    CREATE TABLE IF NOT EXISTS UserToken (
      id INT AUTO_INCREMENT PRIMARY KEY,
      token VARCHAR(768) UNIQUE NOT NULL,
      userId INT NOT NULL,
      createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (userId) REFERENCES User(id) ON DELETE CASCADE
    )
  `);

  console.log('Tables ensured');
  process.exit(0);
}

main().catch(err=>{console.error(err);process.exit(1);});
