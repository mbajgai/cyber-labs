const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const session = require('express-session');
const path = require('path');
const fs = require('fs');

const app = express();
const dbDir = path.join(__dirname, 'db');
const dbFile = path.join(dbDir, 'minishop.db');

// basic config
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({ secret: 'minishopsecret', resave: false, saveUninitialized: true }));
app.use(express.static(path.join(__dirname, 'public')));

// ensure db folder
if (!fs.existsSync(dbDir)) fs.mkdirSync(dbDir, { recursive: true });

// open DB (create if not exists)
const db = new sqlite3.Database(dbFile);

// Initialize DB tables if missing
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT,
    password TEXT
  )`);
  db.run(`CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    description TEXT,
    price REAL
  )`);
});

app.get('/', (req, res) => {
  db.all("SELECT id, name, price FROM products", (err, rows) => {
    res.render('index', { products: rows || [], user: req.session.user });
  });
});

// INTENTIONALLY VULNERABLE: SQL concatenation
app.get('/product', (req, res) => {
  const id = req.query.id || '';
  db.get("SELECT id, name, description, price FROM products WHERE id = " + id, (err, row) => {
    res.render('product', { product: row || {}, user: req.session.user });
  });
});

app.get('/login', (req, res) => res.render('login', { error: null }));

// INTENTIONALLY VULNERABLE: no hashing, concatenated SQL
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  db.get("SELECT id, username FROM users WHERE username = '" + username + "' AND password = '" + password + "'", (err, row) => {
    if (row) {
      req.session.user = { id: row.id, username: row.username };
      res.redirect('/');
    } else {
      res.render('login', { error: 'Invalid credentials' });
    }
  });
});

app.get('/logout', (req, res) => {
  req.session.destroy(() => res.redirect('/'));
});

// INTENTIONALLY VULNERABLE: no access control
app.get('/admin', (req, res) => {
  db.all("SELECT * FROM users", (err, rows) => {
    res.send(`<pre>${JSON.stringify(rows || [], null, 2)}</pre>`);
  });
});

const PORT = 3000;
app.listen(PORT, () => console.log(`MiniShop running on http://localhost:${PORT}`));
