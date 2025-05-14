// app.js
const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
connectDB();

const allowedOrigins = [
  "https://aesthetic-lily-a6e69e.netlify.app",
  "http://localhost:5173"
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
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// === ROUTES PUBLIQUES ===
const usersCtrl = require('./controllers/users.controllers');
app.post("/login", usersCtrl.login);

// ✅ Ajoute ceci pour permettre la création d'utilisateur pendant les tests
if (process.env.NODE_ENV === "test") {
  app.post("/users", usersCtrl.createUser);
}

// === ROUTES PROTÉGÉES ===
const checkJWT = require('./middlewares/checkJWT');
app.use('/users', checkJWT, require('./routes/users.routes'));
app.use('/catways', checkJWT, require('./routes/catways.routes'));
app.use('/reservations', checkJWT, require('./routes/reservations.routes'));


module.exports = app;
