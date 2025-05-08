const bcrypt = require('bcrypt');
const jwtUtils = require('../config/jwt.utils');
const User = require('../models/user');

const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const PASSWORD_REGEX = /^(?=.*\d).{4,12}$/;

// Créer un utilisateur
const createUser = async (req, res) => {
  const { email, name, password } = req.body;

  if (!email || !name || !password) {
    return res.status(400).json({ error: 'Champs manquants' });
  }

  if (name.length >= 13 || name.length <= 4) {
    return res.status(400).json({ error: 'Nom trop court ou trop long' });
  }

  if (!EMAIL_REGEX.test(email)) {
    return res.status(400).json({ error: 'Email invalide' });
  }

  if (!PASSWORD_REGEX.test(password)) {
    return res.status(400).json({ error: 'Mot de passe invalide (4-12 caractères, 1 chiffre mini)' });
  }

  try {
    const userFound = await User.findOne({ email });

    if (userFound) {
      return res.status(409).json({ error: 'Utilisateur déjà existant' });
    }

    const hashedPassword = await bcrypt.hash(password, 5);
    const newUser = new User({ email, name, password: hashedPassword });

    await newUser.save();

    return res.status(201).json({ message: 'Utilisateur créé', userId: newUser._id });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erreur serveur' });
  }
};

// Connexion
const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Champs manquants' });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(403).json({ error: 'Mot de passe incorrect' });
    }

    const token = jwtUtils.generateTokenForUser(user);
    return res.status(200).json({
      message: 'Connexion réussie',
      token,
      user: { id: user._id, name: user.name, email: user.email }
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erreur serveur' });
  }
};

// Modifier un utilisateur
const updateUser = async (req, res) => {
  const { name, email } = req.body;
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: 'ID utilisateur manquant' });
  }

  try {
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ error: 'Utilisateur introuvable' });

    if (name) user.name = name;
    if (email) user.email = email;

    await user.save();
    return res.status(200).json({ message: 'Utilisateur modifié', user });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erreur lors de la modification' });
  }
};

// Supprimer un utilisateur
const deleteUser = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: 'ID utilisateur manquant' });
  }

  try {
    const deleted = await User.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ error: 'Utilisateur introuvable' });

    return res.status(200).json({ message: 'Utilisateur supprimé' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erreur lors de la suppression' });
  }
};

module.exports = {
  createUser,
  login,
  updateUser,
  deleteUser
};
