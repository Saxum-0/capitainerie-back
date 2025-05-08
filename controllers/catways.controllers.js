// === controllers/catways.controllers.js ===
const Catway = require('../models/catway');

exports.getAllCatways = async (req, res) => {
  try {
    const catways = await Catway.find();
    res.status(200).json(catways);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getCatwayById = async (req, res) => {
  try {
    const catway = await Catway.findById(req.params.id);
    if (!catway) return res.status(404).json({ error: 'Catway not found' });
    res.status(200).json(catway);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createCatway = async (req, res) => {
  try {
    const catway = await Catway.create(req.body);
    res.status(201).json(catway);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Remplace complètement un catway (PUT)
exports.replaceCatway = async (req, res) => {
  try {
    const replaced = await Catway.findOneAndReplace(
      { _id: req.params.id },
      req.body,
      { new: true, overwrite: true }
    );
    if (!replaced) return res.status(404).json({ error: 'Catway not found' });
    res.status(200).json(replaced);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Met à jour partiellement un catway (PATCH)
exports.updateCatway = async (req, res) => {
  try {
    const updated = await Catway.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: 'Catway not found' });
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteCatway = async (req, res) => {
  try {
    const deleted = await Catway.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Catway not found' });
    res.status(200).json({ message: 'Catway deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
