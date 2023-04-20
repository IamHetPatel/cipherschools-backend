const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

// Function to generate JWT token
const generateJwtToken = (user) => {
  // Define the JWT payload
  const payload = {
    id: user.id,
    email: user.email,
    // Add other relevant user data as needed
  };

  // Sign the JWT token with a secret key
  const token = jwt.sign(payload, 'yourSecretKey', {
    expiresIn: '1h', // Set the expiration time for the token
  });

  return token;
};

// Register user
const registerUser = async (req, res) => {
  try {
    // Extract user data from request body
    const { firstName, lastName, email, phone, password } = req.body;

    // Check if user already exists with the same email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(409)
        .json({ error: "User with this email already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    // Create a new user object
    const newUser = new User({ firstName, lastName, email, phone, password: hashedPassword });
    // Save the user object to the database
    await newUser.save();
    // Generate JWT token for the registered user
    const token = generateJwtToken(newUser._id);

    // Set the JWT token as a cookie in the response
    res.cookie("token", token, { maxAge: 7200, httpOnly: true });

    // Return success response
    res
      .status(201)
      .json({ message: "User registered successfully", user: newUser });
  } catch (error) {
    // Handle error
    res.status(500).json({ error: "Failed to register user" });
  }
};

// Login user
// Log in an existing user
const loginUser = async (req, res) => {
  try {
    // Extract user data from request body
    const { email, password } = req.body;

    // Check if user exists with the provided email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

     // Compare the provided password with the stored hashed password
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Generate JWT token for the logged-in user
    const token = generateJwtToken(user._id);

    // Set the JWT token as a cookie in the response
    res.cookie("token", token, { maxAge: 7200, httpOnly: true });
    // Return success response
    res.status(200).json({ message: "User logged in successfully", user });
  } catch (error) {
    // Handle error
    res.status(500).json({ error: "Failed to log in user" });
  }
};

// Update user profile details
const updateProfile = async (req, res) => {
  try {
    // Extract updated user data from request body
    const { firstName, lastName, phone, interests } = req.body;

    // Update the user data in the database
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { firstName, lastName, phone, interests },
      { new: true }
    );

    // Return success response
    res
      .status(200)
      .json({ message: "User profile updated successfully", user });
  } catch (error) {
    // Handle error
    res.status(500).json({ error: "Failed to update user profile" });
  }
};

// Update user password
const updatePassword = async (req, res) => {
  try {
    // Extract current and new password from request body
    const { currentPassword, newPassword } = req.body;

    // Find the user in the database
    const user = await User.findById(req.user._id);

    // Compare current password with stored password
    const isMatch = await bcrypt.compare(currentPassword, user.password);

    // If current password does not match, return error response
    if (!isMatch) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }

    // Update password and hash the new password
    user.password = await bcrypt.hash(newPassword, saltRounds);

    // Save the updated user object in the database
    await user.save();

    // Return success response
    res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    // Handle error
    res.status(500).json({ error: 'Failed to update password' });
  }
};


// Update user interests
const updateInterests = async (req, res) => {
  try {
    // Extract updated interests from request body
    const { interests } = req.body;

    // Update the interests in the database
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { interests },
      { new: true }
    );
    // Return success response
    res
      .status(200)
      .json({ message: "User interests updated successfully", user });
  } catch (error) {
    // Handle error
    res.status(500).json({ error: "Failed to update user interests" });
  }
};

// Delete user account
const deleteAccount = async (req, res) => {
  try {
    // Delete the user from the database
    await User.findByIdAndDelete(req.user._id);

    // Clear the JWT token cookie
    res.clearCookie('token');

    // Return success response
    res.status(200).json({ message: 'User account deleted successfully' });
  } catch (error) {
    // Handle error
    res.status(500).json({ error: 'Failed to delete user account' });
  }
};

module.exports = {
  registerUser,
  loginUser,
  updateProfile,
  updatePassword,
  updateInterests,
  deleteAccount,
};
