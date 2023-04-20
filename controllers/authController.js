const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { validationResult } = require('express-validator'); // Require validationResult

// Register user
exports.registerUser = async (req, res) => {
  try {
    // Extract user data from request body
    const { username, email, password } = req.body;

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user in the database
    const newUser = new User({
      username,
      email,
      password: hashedPassword
    });
    await newUser.save();

    // Generate JWT token
    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

    // Send response
    res.status(201).json({ token });
  } catch (err) {
    // Handle error
    res.status(500).json({ error: err.message });
  }
};

// Login user
exports.loginUser = async (req, res) => {
  // ... (same as before)

  // Generate JWT token
  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

  // Store token in a cookie
  res.cookie('token', token, { maxAge: 86400000, httpOnly: true }); // Expires in 1 day

  // Send response
  res.status(200).json({ token });
};


// Login user
exports.loginUser = async (req, res) => {
  try {
    // Extract user data from request body
    const { email, password } = req.body;

    // Find user by email in the database
    const user = await User.findOne({ email });

    // If user not found
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);

    // If passwords don't match
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

    // Send response
    res.status(200).json({ token });
  } catch (err) {
    // Handle error
    res.status(500).json({ error: err.message });
  }
};

// Register user
exports.registerUser = async (req, res) => {
  // Validate input data
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array() });
  }

  // ... (same as before)

  // Generate JWT token
  const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, { expiresIn: '2h' });

  // Store token in a cookie
  res.cookie('token', token, { maxAge: 7200, httpOnly: true }); // Expires in 2 hours

  // Send response
  res.status(201).json({ token });
};

// Login user
exports.loginUser = async (req, res) => {
  // Validate input data
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array() });
  }

  // ... (same as before)

  // Generate JWT token
  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '2h' });

  // Store token in a cookie
  res.cookie('token', token, { maxAge: 7200, httpOnly: true }); // Expires in 1 day

  // Send response
  res.status(200).json({ token });
};
