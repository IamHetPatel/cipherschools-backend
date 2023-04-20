const express = require('express');
const followerController = require('../controllers/followerController');
const authenticate = require('../middlewares/authenticate');

const router = express.Router();

// Get all followers
router.get('/', authenticate, followerController.getAllFollowers);

module.exports = router;
