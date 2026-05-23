const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Create/connect to SQLite database file
const db = new sqlite3.Database('./sportsconnect.db', (err) => {
  if (err) {
    console.error('Database connection failed:', err.message);
  } else {
    console.log('Connected to SQLite database.');
  }
});

// Create users table if it does not exist
db.run(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

app.get('/api/hello', (req, res) => {
  res.json({ message: 'Backend is working!' });
});

// Register route: saves email and hashed password
app.post('/api/register', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  try {
    const passwordHash = await bcrypt.hash(password, 10);

    db.run(
      'INSERT INTO users (email, password_hash) VALUES (?, ?)',
      [email, passwordHash],
      function (err) {
        if (err) {
          if (err.message.includes('UNIQUE')) {
            return res.status(409).json({ error: 'Email already registered.' });
          }

          return res.status(500).json({ error: 'Database error.' });
        }

        res.status(201).json({
          message: 'User registered successfully.',
          userId: this.lastID,
        });
      }
    );
  } catch (err) {
    res.status(500).json({ error: 'Server error.' });
  }
});

// Login route: checks email and compares hashed password
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  db.get(
    'SELECT * FROM users WHERE email = ?',
    [email],
    async (err, user) => {
      if (err) {
        return res.status(500).json({ error: 'Database error.' });
      }

      if (!user) {
        return res.status(401).json({ error: 'Invalid email or password.' });
      }

      const passwordMatches = await bcrypt.compare(
        password,
        user.password_hash
      );

      if (!passwordMatches) {
        return res.status(401).json({ error: 'Invalid email or password.' });
      }

      res.json({
        message: 'Login successful.',
        userId: user.id,
        email: user.email,
      });
    }
  );
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});