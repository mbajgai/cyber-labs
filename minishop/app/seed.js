const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');

const dbDir = path.join(__dirname, 'db');
const dbFile = path.join(dbDir, 'minishop.db');
if (!fs.existsSync(dbDir)) fs.mkdirSync(dbDir, { recursive: true });

const db = new sqlite3.Database(dbFile);

(async () => {
  const adminHash = await bcrypt.hash('admin123', 10);
  const userHash  = await bcrypt.hash('password', 10);

  db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE,
      password TEXT,
      role TEXT DEFAULT 'user'
    )`);
    db.run(`CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      description TEXT,
      price REAL
    )`);

    // idempotent inserts
    db.run("INSERT OR IGNORE INTO users (username, password, role) VALUES (?, ?, ?)", ['admin', adminHash, 'admin']);
    db.run("INSERT OR IGNORE INTO users (username, password, role) VALUES (?, ?, ?)", ['user1', userHash, 'user']);
    db.run("INSERT OR IGNORE INTO products (name, description, price) VALUES (?, ?, ?)", ['Widget', 'A basic widget', 9.99]);
    db.run("INSERT OR IGNORE INTO products (name, description, price) VALUES (?, ?, ?)", ['Gadget', 'A fancy gadget', 19.99]);
  });

  db.close(() => console.log('DB seeded with hashed passwords and roles'));
})();
