const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'architect-secret-key-2024';

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, admin) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    req.admin = admin;
    next();
  });
};

// Generate JWT token
const generateToken = (email) => {
  return jwt.sign({ email }, JWT_SECRET, { expiresIn: '24h' });
};

module.exports = { authenticateToken, generateToken, JWT_SECRET };
