const bcrypt = require('bcrypt');
const jwtUtils = require('../config/jwt.utils');
const User = require('../models/user');

const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const PASSWORD_REGEX = /^(?=.*\d).{4,12}$/;

/**
 * Create a new user account after validating input data.
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const createUser = async (req, res) => {
  const { email, name, password } = req.body;

  if (!email || !name || !password) {
    return res.status(400).json({ error: 'Missing fields' });
  }

  if (name.length >= 13 || name.length <= 4) {
    return res.status(400).json({ error: 'Name too short or too long' });
  }

  if (!EMAIL_REGEX.test(email)) {
    return res.status(400).json({ error: 'Invalid email' });
  }

  if (!PASSWORD_REGEX.test(password)) {
    return res.status(400).json({ error: 'Invalid password (4-12 characters, at least 1 digit)' });
  }

  try {
    const userFound = await User.findOne({ email });

    if (userFound) {
      return res.status(409).json({ error: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 5);
    const newUser = new User({ email, name, password: hashedPassword });

    await newUser.save();

    return res.status(201).json({ message: 'User created', userId: newUser._id });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
};

/**
 * Authenticate a user and return a JWT token.
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Missing fields' });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(403).json({ error: 'Incorrect password' });
    }

    const token = jwtUtils.generateTokenForUser(user);
    return res.status(200).json({
      message: 'Login successful',
      token,
      user: { id: user._id, name: user.name, email: user.email }
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
};

/**
 * Update an existing user's name and/or email.
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const updateUser = async (req, res) => {
  const { name, email } = req.body;
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: 'Missing user ID' });
  }

  try {
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    if (name) user.name = name;
    if (email) user.email = email;

    await user.save();
    return res.status(200).json({ message: 'User updated', user });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Update failed' });
  }
};

/**
 * Delete a user by their ID.
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const deleteUser = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: 'Missing user ID' });
  }

  try {
    const deleted = await User.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ error: 'User not found' });

    return res.status(200).json({ message: 'User deleted' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Delete failed' });
  }
};

module.exports = {
  createUser,
  login,
  updateUser,
  deleteUser
};
