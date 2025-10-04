// Backend Express pour authentification avec rôles (admin/utilisateur)
require('dotenv').config();
const express = require('express');
const session = require('express-session');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3001;

// Connexion à Neon (PostgreSQL)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// Autorise le domaine Netlify en production, et localhost en dev
const allowedOrigins = [
  'http://127.0.0.1:5500', 
  'https://noadoisy.fr' 
];
app.use(cors({
  origin: function(origin, callback) {
    // Autorise les requêtes sans origin (ex: curl, tests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json());
app.use(session({
  secret: process.env.SESSION_SECRET || 'secret',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false, httpOnly: true }
}));

// Middleware pour vérifier l'authentification
function requireAuth(req, res, next) {
  if (!req.session.user) return res.status(401).json({ error: 'Non authentifié' });
  next();
}

// Middleware pour vérifier le rôle admin
function requireAdmin(req, res, next) {
  if (!req.session.user || req.session.user.role !== 'admin') {
    return res.status(403).json({ error: 'Accès refusé' });
  }
  next();
}

// Route de connexion
app.post('/api/login', async (req, res) => {
  const { identifiant, mdp } = req.body;
  const result = await pool.query('SELECT * FROM users WHERE username = $1', [identifiant]);
  const user = result.rows[0];
  if (!user) return res.status(401).json({ error: 'Identifiant ou mot de passe incorrect' });
  const valid = await bcrypt.compare(mdp, user.password_hash);
  if (!valid) return res.status(401).json({ error: 'Identifiant ou mot de passe incorrect' });
  req.session.user = { id: user.id, username: user.username, role: user.role };
  res.json({ success: true, role: user.role });
});

// Route pour vérifier la session
app.get('/api/session', (req, res) => {
  if (req.session.user) {
    res.json({ loggedIn: true, user: req.session.user });
  } else {
    res.json({ loggedIn: false });
  }
});

// Exemple de route protégée admin
app.get('/api/admin', requireAdmin, (req, res) => {
  res.json({ message: 'Bienvenue admin !' });
});

// Exemple de route protégée utilisateur
app.get('/api/user', requireAuth, (req, res) => {
  res.json({ message: 'Bienvenue utilisateur !' });
});

// Déconnexion
app.post('/api/logout', (req, res) => {
  req.session.destroy(() => {
    res.json({ success: true });
  });
});

app.listen(port, () => {
  console.log('Serveur backend démarré sur le port', port);
});
