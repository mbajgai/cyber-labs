# MiniShop — Vulnerable Lab

**Warning:** Intentionally vulnerable. Use only in an isolated VM / host-only network.

## What it is
- Node/Express + SQLite mini shop
- Vulnerable routes:
  - `/product?id=` — SQL Injection (string concatenation)
  - `/login` — plaintext passwords; SQL concatenation
  - `/admin` — no access control (dumps users)

## How to run
```bash
sudo docker-compose up -d --build
sudo docker-compose exec web node /usr/src/app/seed.js

