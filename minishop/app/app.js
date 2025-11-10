const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const session = require('express-session');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcrypt');

const app = express();
const dbDir = path.join(__dirname, 'db');
const dbFile = path.join(dbDir, 'minishop.db');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  secret: 'minishopsecret-CHANGE-ME-STRONG',
  resave: false,
  saveUninitialized: false,
  cookie: { httpOnly: true }
}));
app.use(express.static(path.join(__dirname, 'public')));

// ensure db folder and open DB
if (!fs.existsSync(dbDir)) fs.mkdirSync(dbDir, { recursive: true });
const db = new sqlite3.Database(dbFile);

// create tables if missing
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
});

function requireAdmin(req, res, next) {
  if (!req.session.user || req.session.user.role !== 'admin') {
    return res.status(403).send('Forbidden');
  }
  next();
}

app.get('/', (req, res) => {
  db.all("SELECT id, name, price FROM products", (err, rows) => {
    res.render('index', { products: rows || [], user: req.session.user });
  });
});

// FIXED: parameterized query
app.get('/product', (req, res) => {
  const id = Number(req.query.id);
  if (!Number.isInteger(id)) return res.status(400).send('Bad request');
  db.get("SELECT id, name, description, price FROM products WHERE id = ?", [id], (err, row) => {
    res.render('product', { product: row || {}, user: req.session.user });
  });
});

app.get('/login', (req, res) => res.render('login', { error: null }));

// FIXED: safe lookup + bcrypt compare
app.post('/login', (req, res) => {
  const { username, password } = req.body || {};
  db.get("SELECT id, username, password, role FROM users WHERE username = ?", [username], async (err, row) => {
    if (row) {
      try {
        const ok = await bcrypt.compare(password, row.password);
        if (ok) {
          req.session.user = { id: row.id, username: row.username, role: row.role || 'user' };
          return res.redirect('/');
        }
      } catch (_) {}
    }
    res.render('login', { error: 'Invalid credentials' });
  });
});

app.get('/logout', (req, res) => {
  req.session.destroy(() => res.redirect('/'));
});

// FIXED: protect admin
app.get('/admin', requireAdmin, (req, res) => {
  db.all("SELECT id, username, role FROM users", (err, rows) => {
    res.type('json').send(JSON.stringify(rows || [], null, 2));
  });
});

const PORT = 3000;
app.listen(PORT, () => console.log(`MiniShop (fixed) running on http://localhost:${PORT}`));
