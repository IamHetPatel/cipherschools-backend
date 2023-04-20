const express = require('express');
const userController = require('../controllers/userController');
const validateInput = require('../middlewares/validateInput');
const authenticate = require('../middlewares/authenticate');

const router = express.Router();

//I can even use get requests everywhere instead of post requests by using params, 
//as post takes more load, but for now for simplicity, only post requests
// Register user
router.post('/register', validateInput.register, userController.registerUser);

// Login user
router.post('/login', validateInput.login, userController.loginUser);

// Update user profile
router.patch('/profile', authenticate, validateInput.updateProfile, userController.updateProfile);

// Update user password
router.patch('/password', authenticate, validateInput.updatePassword, userController.updatePassword);

// Update user interests
router.patch('/interests', authenticate, validateInput.updateInterests, userController.updateInterests);

// Delete user account
router.delete('/delete', authenticate, userController.deleteAccount);

module.exports = router;
