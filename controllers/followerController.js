const Follower = require('../models/followerModel');
const User = require("../models/userModel");
// Get all followers
const getAllFollowers = async (req, res) => {
  try {
    // Find the user in the database
    const user = await User.findById(req.user._id);

    // Populate the followers array with user objects
    await user.populate('followers', 'photo name profession followersCount').execPopulate();

    // Return success response with followers data
    res.status(200).json({ followers: user.followers });
  } catch (error) {
    // Handle error
    res.status(500).json({ error: 'Failed to get followers' });
  }
};


module.exports = {
  getAllFollowers
};
