// === routes/users.routes.js ===
const express = require('express');
const router = express.Router();
const usersCtrl = require('../controllers/users.controllers');


// 🔹 POST /users 
router.post('/', usersCtrl.createUser);

// 🔹 PUT /users/:id 
router.put('/:id', usersCtrl.updateUser);

// 🔹 DELETE /users/:id 
router.delete('/:id', usersCtrl.deleteUser);

module.exports = router;

