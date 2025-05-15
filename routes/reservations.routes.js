// routes/reservations.routes.js
const express = require('express');
const router = express.Router({ mergeParams: true });
const Reservation = require('../models/reservation');
const Catway = require('../models/catway');


function isObjectId(str) {
  return /^[0-9a-fA-F]{24}$/.test(str);
}

// POST /catways/:catwayId/reservations
router.post('/', async (req, res) => {
  try {
    const { clientName, boatName, checkIn, checkOut } = req.body;
    const { catwayId } = req.params;

    let catway;
    if (isObjectId(catwayId)) {
      catway = await Catway.findById(catwayId);
    } else {
      const num = Number(catwayId);
      if (isNaN(num)) {
        return res.status(400).json({ message: 'catwayId invalide' });
      }
      catway = await Catway.findOne({ catwayNumber: num });
    }

    if (!catway) return res.status(404).json({ message: 'Catway introuvable' });

    const newReservation = new Reservation({
      catwayNumber: catway.catwayNumber,
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

//  GET /catways/:catwayId/reservations
router.get('/', async (req, res) => {
  try {
    const { catwayId } = req.params;

    let catway;
    if (isObjectId(catwayId)) {
      catway = await Catway.findById(catwayId);
    } else {
      const num = Number(catwayId);
      if (isNaN(num)) {
        return res.status(400).json({ message: 'catwayId invalide' });
      }
      catway = await Catway.findOne({ catwayNumber: num });
    }

    if (!catway) return res.status(404).json({ message: 'Catway introuvable' });

    const reservations = await Reservation.find({ catwayNumber: catway.catwayNumber });
    res.status(200).json(reservations);
  } catch (err) {
    console.error('Erreur lecture réservation :', err);
    res.status(500).json({ message: err.message });
  }
});

// GET /catways/:catwayId/reservations/:idReservation 
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

// DELETE /catways/:catwayId/reservations/:idReservation 
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
