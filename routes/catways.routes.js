const express = require('express');
const router = express.Router();
const catwaysCtrl = require('../controllers/catways.controllers');
const reservationsRoutes = require('./reservations.routes');

// Routes REST  catways
router.get('/', catwaysCtrl.getAllCatways);              // GET /catways
router.get('/:id', catwaysCtrl.getCatwayById);           // GET /catways/:id
router.post('/', catwaysCtrl.createCatway);              // POST /catways
router.put('/:id', catwaysCtrl.replaceCatway);           // PUT /catways/:id
router.patch('/:id', catwaysCtrl.updateCatway);          // PATCH /catways/:id
router.delete('/:id', catwaysCtrl.deleteCatway);         // DELETE /catways/:id


router.use('/:catwayId/reservations', reservationsRoutes);


module.exports = router;

