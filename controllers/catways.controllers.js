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
  const id = req.params.id;

  // 🔐 Sécurité : ID bien formé ?
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'ID invalide' });
  }

  try {
    const catway = await Catway.findById(id); // ✅ C'est ici qu'on interroge MongoDB

    if (!catway) {
      return res.status(404).json({ error: 'Catway non trouvé' });
    }

    res.status(200).json(catway); // ✅ On renvoie le catway trouvé
  } catch (err) {
    console.error('❌ Erreur getCatwayById:', err.message);
    res.status(500).json({ error: 'Erreur serveur' });
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
