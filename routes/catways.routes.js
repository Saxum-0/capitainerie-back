const express = require('express');
const router = express.Router();
const catwaysCtrl = require('../controllers/catways.controllers');
const reservationsRoutes = require('./reservations.routes');

// ✅ Routes REST pour les catways
router.get('/', catwaysCtrl.getAllCatways);
router.get('/:id', catwaysCtrl.getCatwayById);
router.post('/', catwaysCtrl.createCatway);
router.put('/:id', catwaysCtrl.replaceCatway);
router.patch('/:id', catwaysCtrl.updateCatway);
router.delete('/:id', catwaysCtrl.deleteCatway);

// ✅ Sous-routes pour les réservations liées à un catway
router.use('/:id/reservations', reservationsRoutes);

module.exports = router;
