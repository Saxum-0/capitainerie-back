// === routes/reservations.routes.js ===
const express = require('express');
const router = express.Router({ mergeParams: true }); // Important pour accéder à :id depuis parent
const reservationsCtrl = require('../controllers/reservations.controllers');

// GET /catways/:id/reservations - Lister les réservations d'un catway
router.get('/', reservationsCtrl.listReservations);

// GET /catways/:id/reservations/:idReservation - Détail d'une réservation
router.get('/:idReservation', reservationsCtrl.getReservation);

// POST /catways/:id/reservations - Créer une réservation pour un catway
router.post('/', reservationsCtrl.createReservation);

// DELETE /catways/:id/reservations/:idReservation - Supprimer une réservation
router.delete('/:idReservation', reservationsCtrl.deleteReservation);

module.exports = router;
