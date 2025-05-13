const express = require("express");
const app = express();
require("dotenv").config();
const connectDB = require("./config/db");
const cookieParser = require("cookie-parser");

// Connexion à MongoDB
console.log("👉 MONGO_URI =", process.env.MONGO_URI); // DEBUG
connectDB();


// Middlewares
const cors = require('cors');

const corsOptions = {
  origin: 'capitainerie-back.railway.internal',
  credentials: true,
};
app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Pré-vol OPTIONS

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "https://aesthetic-lily-a6e69e.netlify.app");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Logger
app.use((req, res, next) => {
  console.log(`🧭 [${req.method}] ${req.originalUrl}`);
  next();
});

// === ROUTES ===

// Contrôleur login directement ici (publique)
const usersCtrl = require('./controllers/users.controllers');
app.post("/login", usersCtrl.login);

// Middleware d'authentification pour toutes les routes suivantes
const checkJWT = require('./middlewares/checkJWT');
app.use(checkJWT);

// Routes protégées
const usersRoutes = require('./routes/users.routes');
const catwaysRoutes = require('./routes/catways.routes');
app.use('/users', usersRoutes);
app.use('/catways', catwaysRoutes); // Contient aussi les sous-routes /catways/:id/reservations

// Lancer le serveur
const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`🚀 Serveur en ligne sur http://localhost:${port}`);
});

