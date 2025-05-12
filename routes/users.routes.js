// === routes/users.routes.js ===
const express = require('express');
const router = express.Router();
const usersCtrl = require('../controllers/users.controllers');
const checkJWT = require('../middlewares/checkJWT');

// 🔹 Authentification
router.post('/login', usersCtrl.login);

// 🔹 API REST - Utilisateurs
router.post('/', usersCtrl.createUser);      // POST /users
router.put('/:id', usersCtrl.updateUser);    // PUT /users/:id
router.delete('/:id', usersCtrl.deleteUser); // DELETE /users/:id


module.exports = router;

