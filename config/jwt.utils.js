const jwt = require('jsonwebtoken');
require('dotenv').config(); // au cas où ce fichier est utilisé seul

module.exports = {
  generateTokenForUser: function (userData) {
    return jwt.sign(
      {
        userId: userData.id,
      },
      process.env.JWT_SECRET, // ✅ utilise la même clé que checkJWT
      {
        expiresIn: '1h',
      }
    );
  },
};
