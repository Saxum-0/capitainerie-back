// app.js
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");

const app = express();

// Charger .env uniquement en local
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

// Connexion à MongoDB
connectDB();

// === CORS ===
const allowedOrigins = [
  "https://aesthetic-lily-a6e69e.netlify.app",
  "http://localhost:5173"
];

const corsOptions = {
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Logger
app.use((req, res, next) => {
  console.log(`🧭 [${req.method}] ${req.originalUrl}`);
  console.log("🌐 Origin autorisée :", req.headers.origin);
  next();
});

// Routes
const usersCtrl = require("./controllers/users.controllers");
app.post("/login", usersCtrl.login);

const checkJWT = require("./middlewares/checkJWT");
app.use(checkJWT);

const usersRoutes = require("./routes/users.routes");
const catwaysRoutes = require("./routes/catways.routes");
const reservationsRoutes = require("./routes/reservations.routes");
app.use("/users", usersRoutes);
app.use("/catways", catwaysRoutes);
app.use("/reservations", reservationsRoutes);

// ✅ Exporter l'app sans écouter le port (utile pour les tests)
module.exports = app;
