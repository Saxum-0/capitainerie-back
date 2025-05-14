const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");

// Charger .env uniquement en local
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

// Connexion à MongoDB
connectDB();

// === CORS ===
const allowedOrigins = [
  "https://aesthetic-lily-a6e69e.netlify.app",
  "http://localhost:5173" // utile pour développement local
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Logger
app.use((req, res, next) => {
  console.log(`🧭 [${req.method}] ${req.originalUrl}`);
  console.log("🌐 Origin autorisée :", req.headers.origin);
  next();
});

// === ROUTES ===

// Route publique : login
const usersCtrl = require('./controllers/users.controllers');
app.post("/login", usersCtrl.login);

// Middleware d'authentification pour les routes protégées
const checkJWT = require('./middlewares/checkJWT');
app.use(checkJWT);

// Routes protégées
const usersRoutes = require('./routes/users.routes');
const catwaysRoutes = require('./routes/catways.routes');
const reservationsRoutes = require('./routes/reservations.routes');
app.use('/users', usersRoutes);
app.use('/catways', catwaysRoutes); 
app.use('/reservations', reservationsRoutes);
// Lancer le serveur
const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`✅ ONLINE http://localhost:${port}`);
});

// ... tout ton code Express

app.listen(port, () => {
  console.log(`✅ ONLINE http://localhost:${port}`);
});

// ✅ Ajoute cette ligne :

module.exports = app;
