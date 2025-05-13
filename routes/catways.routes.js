// === routes/catways.routes.js ===
const express = require('express');
const router = express.Router();
const catwaysCtrl = require('../controllers/catways.controllers');
const reservationsRoutes = require('./reservations.routes');

// ✅ Routes REST pour les catways
router.get('/', catwaysCtrl.getAllCatways);             // GET /catways
router.get('/:id', catwaysCtrl.getCatwayById);          // GET /catways/:id
router.post('/', catwaysCtrl.createCatway);             // POST /catways
router.put('/:id', catwaysCtrl.replaceCatway);          // PUT /catways/:id
router.patch('/:id', catwaysCtrl.updateCatway);         // PATCH /catways/:id
router.delete('/:id', catwaysCtrl.deleteCatway);        // DELETE /catways/:id

// GET /catways/:id/reservations → renvoie les réservations associées à un catway donné
router.get('/:id/reservations', async (req, res) => {
  try {
    const Reservation = require('../models/reservation');
    const reservations = await Reservation.find({ catwayNumber: req.params.id });
    res.json(reservations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// ✅ Sous-routes RESTful pour les réservations liées à un catway
// ⚠️ Ne pas préfixer par /catways ici, car déjà monté dans server.js
router.use('/:id/reservations', reservationsRoutes);    // Ex: /catways/12/reservations

module.exports = router;
