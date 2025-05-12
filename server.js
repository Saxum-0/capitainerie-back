const express = require("express");
const app = express();
require("dotenv").config();
const connectDB = require("./config/db");
const cookieParser = require("cookie-parser");

// Import middlewares et routes
const usersCtrl = require('./controllers/users.controllers');
const checkJWT = require('./middlewares/checkJWT');
const usersRoutes = require('./routes/users.routes');
const catwaysRoutes = require('./routes/catways.routes');
const reservationsRoutes = require('./routes/reservations.routes');

// Connexion à MongoDB
connectDB();

// Middleware CORS
const cors = require('cors');

const corsOptions = {
  origin: 'https://aesthetic-lily-a6e69e.netlify.app',
  credentials: true,
};
app.use(cors(corsOptions));

// Gérer les requêtes preflight OPTIONS
app.options('*', cors(corsOptions));

// ✅ Ajouter les bons headers
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "https://aesthetic-lily-a6e69e.netlify.app");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  next();
});

// Autres middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Log des requêtes
app.use((req, res, next) => {
  console.log(`🧭 [${req.method}] ${req.originalUrl}`);
  next();
});

// === Routes publiques ===
app.post("/login", usersCtrl.login);

// === Middleware d'authentification ===
app.use(checkJWT);

// === Routes protégées ===
app.use('/users', usersRoutes);
app.use('/catways', catwaysRoutes);

// Lancer le serveur
const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`🚀 Serveur en ligne sur http://localhost:${port}`);
});

