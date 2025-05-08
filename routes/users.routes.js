// === routes/users.routes.js ===
const express = require('express');
const router = express.Router();
const usersCtrl = require('../controllers/users.controllers');
const checkJWT = require('../middlewares/checkJWT');

// 🔹 Authentification
router.post('/login', usersCtrl.login);

// 🔹 API REST - Utilisateurs
router.post('/users', usersCtrl.createUser);                 // Créer un utilisateur
router.put('/users/:id', checkJWT, usersCtrl.updateUser);    // Modifier un utilisateur
router.delete('/users/:id', checkJWT, usersCtrl.deleteUser); // Supprimer un utilisateur

module.exports = router;

