// app.js
const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");

app.get("/", (req, res) => {
  res.send("🚤 API Capitainerie de Russell en ligne !");
});


// Load .env
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
connectDB();

// Define allowed origins for CORS
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

// Middleware setup
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// === PUBLIC ROUTES ===
const usersCtrl = require('./controllers/users.controllers');
app.post("/login", usersCtrl.login);

// Allow user creation during tests
if (process.env.NODE_ENV === "test") {
  app.post("/users", usersCtrl.createUser);
}

// === PROTECTED ROUTES ===
const checkJWT = require('./middlewares/checkJWT');
app.use('/users', checkJWT, require('./routes/users.routes'));
app.use('/catways', checkJWT, require('./routes/catways.routes'));
app.use('/reservations', checkJWT, require('./routes/reservations.routes'));

module.exports = app;
