const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  // Retrieve the token from the 'Authorization' header, and remove 'Bearer ' prefix
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    // Verify the token and use the secret key for decoding
    const decoded = jwt.verify(token, 'yourSecretKey'); // Ensure 'yourSecretKey' matches your server's key
    console.log('Decoded Token:', decoded);  // Log the decoded token

    req.user = { _id: decoded.id };  // Attach the decoded user information (usually the user ID) to the request object
    next();
  } catch (err) {
    console.error('Token verification error:', err);  // Log any errors during verification
    res.status(401).json({ msg: 'Token is not valid or has expired' });
  }
};

module.exports = auth;
