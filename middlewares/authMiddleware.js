const jwt = require('jsonwebtoken');

// Middleware for verifying JWT token
exports.verifyToken = (req, res, next) => {
  // Get token from cookies or authorization header
  const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

// Middleware for storing token in cookies
exports.storeTokenInCookie = (req, res, next) => {
  // Get token from request header
  const token = req.headers.authorization?.split(' ')[1];

  if (token) {
    // Store token in a cookie
    res.cookie('token', token, { maxAge: 86400000, httpOnly: true }); // Expires in 1 day
  }

  next();
};
