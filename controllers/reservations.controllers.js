const Reservation = require('../models/reservation');

/**
 * Create a reservation for a specific catway.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
const createReservation = async (req, res) => {
  try {
    const { clientName, boatName, checkIn, checkOut } = req.body;
    const catwayNumber = req.params.id; // Retrieved from /catways/:id/reservations

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

/**
 * Delete a reservation by its ID.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
const deleteReservation = async (req, res) => {
  try {
    const { idReservation } = req.params;
    const deleted = await Reservation.findByIdAndDelete(idReservation);
    if (!deleted) return res.status(404).json({ error: 'Reservation not found' });

    res.status(200).json({ message: 'Reservation deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * List all reservations for a specific catway.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
const listReservations = async (req, res) => {
  try {
    const { id } = req.params; // Catway ID
    const reservations = await Reservation.find({ catwayNumber: id });

    res.status(200).json(reservations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Get details of a single reservation by its ID.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
const getReservation = async (req, res) => {
  try {
    const { idReservation } = req.params;
    const reservation = await Reservation.findById(idReservation);
    if (!reservation) return res.status(404).json({ error: 'Reservation not found' });

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
