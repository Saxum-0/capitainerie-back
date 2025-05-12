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

// ✅ Sous-routes RESTful pour les réservations liées à un catway
// ⚠️ Ne pas préfixer par /catways ici, car déjà monté dans server.js
router.use('/:id/reservations', reservationsRoutes);    // Ex: /catways/12/reservations

module.exports = router;
