// === server.js (version corrigée pour Vue.js front-end) ===
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

// Middlewares globaux
const cors = require('cors');

app.use(cors({
  origin: 'https://aesthetic-lily-a6e69e.netlify.app',
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Middleware de log
app.use((req, res, next) => {
  console.log(`🧭 [${req.method}] ${req.originalUrl}`);
  next();
});

// === Routes publiques ===
app.post("/login", usersCtrl.login); // Seule route non protégée

// === Middleware d'authentification
app.use(checkJWT); // ⛔ Tout ce qui suit est sécurisé

// === Routes sécurisées
app.use('/users', usersRoutes);       // ✅ Accès réservé aux admins connectés
app.use('/catways', catwaysRoutes);   // ✅ idem
app.use('/catways', reservationsRoutes); // si séparé


// Lancement serveur
const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`🚀 Serveur en ligne sur http://localhost:${port}`);
});
