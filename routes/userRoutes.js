const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  const { firstName, lastName, email, password, role } = req.body;
  try {
    const hashedPassword = await User.hashPassword(password);
    const newUser = await User.create({ firstName, lastName, email, password: hashedPassword, role });
    res.status(201).send('User registered');
  } catch (error) {
    res.status(400).send('Error registering user');
  }
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).send('User not found');
    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).send('Invalid credentials');
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);
    res.send({ user, token });
  } catch (error) {
    res.status(400).send('Error logging in');
  }
});

module.exports = router;
