// === server.js (version corrigée pour Vue.js front-end) ===
const express = require("express");
const app = express();
require("dotenv").config();
console.log("🔍 MONGO_URI =", process.env.MONGO_URI);
const connectDB = require("./config/db");
const cookieParser = require("cookie-parser");
const cors = require("cors");

// Import middlewares et routes
const usersCtrl = require('./controllers/users.controllers');
const checkJWT = require('./middlewares/checkJWT');
const usersRoutes = require('./routes/users.routes');
const catwaysRoutes = require('./routes/catways.routes');

// Connexion à MongoDB
connectDB();

// Middlewares globaux
app.use(cors()); // Autoriser les requêtes cross-origin depuis le front Vue.js
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Middleware de log
app.use((req, res, next) => {
  console.log(`🧭 [${req.method}] ${req.originalUrl}`);
  next();
});

// === Routes publiques ===
app.get("/", (req, res) => {
  res.status(200).json({
    message: "Bienvenue sur l’API du Port de Plaisance de Russell",
    routes: [
      "POST /login",
      "POST /users",
      "GET /catways",
      "..."
    ]
  });
});

app.post("/login", usersCtrl.login);

// === Routes protégées ===
app.use("/users", checkJWT, usersRoutes);
app.use("/catways", catwaysRoutes); // contient aussi les routes /catways/:id/reservations

// Lancement serveur
const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`🚀 Serveur en ligne sur http://localhost:${port}`);
});
