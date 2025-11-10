const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

const dbDir = path.join(__dirname, 'db');
const dbFile = path.join(dbDir, 'minishop.db');
if (!fs.existsSync(dbDir)) fs.mkdirSync(dbDir, { recursive: true });

const db = new sqlite3.Database(dbFile);

db.serialize(() => {
  db.run("INSERT INTO users (username, password) VALUES (?, ?)", ['admin', 'admin123']);
  db.run("INSERT INTO users (username, password) VALUES (?, ?)", ['user1', 'password']);
  db.run("INSERT INTO products (name, description, price) VALUES (?, ?, ?)", ['Widget', 'A basic widget', 9.99]);
  db.run("INSERT INTO products (name, description, price) VALUES (?, ?, ?)", ['Gadget', 'A fancy gadget', 19.99]);
});

db.close(() => console.log('DB seeded'));
