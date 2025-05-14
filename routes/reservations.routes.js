// routes/reservations.routes.js
const express = require('express');
const router = express.Router({ mergeParams: true });
const Reservation = require('../models/reservation');

// ✅ POST /catways/:catwayId/reservations → créer une réservation
router.post('/', async (req, res) => {
  try {
    const { catwayNumber, clientName, boatName, checkIn, checkOut } = req.body;

    const newReservation = new Reservation({
      catwayNumber,
      clientName,
      boatName,
      checkIn,
      checkOut
    });

    const saved = await newReservation.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error('Erreur création réservation :', err);
    res.status(500).json({ message: err.message });
  }
});

// ✅ GET /catways/:catwayId/reservations → retourner les réservations du catway
router.get('/', async (req, res) => {
  try {
    const catwayId = req.params.catwayId;

    // On récupère le catway via son ID
    const Catway = require('../models/catway');
    const catway = await Catway.findById(catwayId);
    if (!catway) return res.status(404).json({ message: 'Catway introuvable' });

    // Puis on utilise le catwayNumber pour trouver les réservations
    const reservations = await Reservation.find({ catwayNumber: catway.catwayNumber });
    res.status(200).json(reservations);
  } catch (err) {
    console.error('Erreur lecture réservation :', err);
    res.status(500).json({ message: err.message });
  }
});


// ✅ GET /catways/:catwayId/reservations/:idReservation → obtenir une réservation
router.get('/:idReservation', async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.idReservation);
    if (!reservation) return res.status(404).json({ message: 'Réservation introuvable' });
    res.json(reservation);
  } catch (err) {
    console.error('Erreur lecture réservation :', err);
    res.status(500).json({ message: err.message });
  }
});

// ✅ DELETE /catways/:catwayId/reservations/:idReservation → supprimer une réservation
router.delete('/:idReservation', async (req, res) => {
  try {
    const deleted = await Reservation.findByIdAndDelete(req.params.idReservation);
    if (!deleted) return res.status(404).json({ message: 'Réservation introuvable' });
    res.status(200).json({ message: 'Réservation supprimée' });
  } catch (err) {
    console.error('Erreur suppression réservation :', err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
