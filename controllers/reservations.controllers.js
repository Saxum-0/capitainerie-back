const Reservation = require('../models/reservation');

// Créer une réservation pour un catway spécifique
const createReservation = async (req, res) => {
  try {
    const { clientName, boatName, checkIn, checkOut } = req.body;
    const catwayNumber = req.params.id; // récupéré depuis /catways/:id/reservations

    const newReservation = await Reservation.create({
      catwayNumber,
      clientName,
      boatName,
      checkIn,
      checkOut
    });

    res.status(201).json(newReservation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Supprimer une réservation
const deleteReservation = async (req, res) => {
  try {
    const { idReservation } = req.params;
    const deleted = await Reservation.findByIdAndDelete(idReservation);
    if (!deleted) return res.status(404).json({ error: 'Réservation introuvable' });

    res.status(200).json({ message: 'Réservation supprimée' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Lister les réservations d’un catway spécifique
const listReservations = async (req, res) => {
  try {
    const { id } = req.params; // id du catway
    const reservations = await Reservation.find({ catwayNumber: id });

    res.status(200).json(reservations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Détail d'une réservation
const getReservation = async (req, res) => {
  try {
    const { idReservation } = req.params;
    const reservation = await Reservation.findById(idReservation);
    if (!reservation) return res.status(404).json({ error: 'Réservation non trouvée' });

    res.status(200).json(reservation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createReservation,
  deleteReservation,
  listReservations,
  getReservation
};
