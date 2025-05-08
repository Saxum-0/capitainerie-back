const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    mongoose.set('strictQuery', false);
    await mongoose.connect(process.env.MONGO_URI, {
    });
    console.log("DB CONNECTED ✅ ");
  } catch (err) {
    console.error("❌ DB CONNECTION ERROR:", err.message);
    process.exit(1); // Quitte proprement l'app si la DB échoue à se connecter
  }
};

module.exports = connectDB;
