// === routes/users.routes.js ===
const express = require('express');
const router = express.Router();
const usersCtrl = require('../controllers/users.controllers');

// ✅ Toutes ces routes sont protégées par checkJWT **dans server.js**
// donc pas besoin de le rappeler ici

// 🔐 Authentification (déjà route publique dans server.js)
// Ne PAS re-déclarer ici : cette ligne est à supprimer ou commenter si déjà faite dans server.js
// router.post('/login', usersCtrl.login);

// 🔹 POST /users - Créer un utilisateur
router.post('/', usersCtrl.createUser);

// 🔹 PUT /users/:id - Modifier un utilisateur
router.put('/:id', usersCtrl.updateUser);

// 🔹 DELETE /users/:id - Supprimer un utilisateur
router.delete('/:id', usersCtrl.deleteUser);

module.exports = router;

