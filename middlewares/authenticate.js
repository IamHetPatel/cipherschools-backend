const jwt = require('jsonwebtoken');

// Middleware for authenticating JWT token
// Authenticate JWT token
const authenticate = (req, res, next) => {
    try {
      // Extract JWT token from request cookies
      const token = req.cookies.token;
  
      // Check if JWT token exists
      if (!token) {
        return res.status(401).send(res);
      }
  
      // Verify the JWT token
      jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
          return res.status(401).json({ error: 'Unauthorized' });
        }
        // Set the user object in the request for further use
        req.user = user;
        next();
      });
    } catch (error) {
      // Handle error
      res.status(500).json({ error: 'Failed to authenticate token' });
    }
  };
  

module.exports = authenticate;
