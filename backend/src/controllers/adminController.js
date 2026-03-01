const bcrypt = require('bcryptjs');
const { generateToken } = require('../middleware/auth');

// In-memory admin user (in production, this would be in database)
const ADMIN_EMAIL = 'admin@architectsilas.com';
const ADMIN_PASSWORD_HASH = bcrypt.hashSync('Admin@123456', 10);

const adminController = {
  // Admin Login
  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      // Validate input
      if (!email || !password) {
        return res.status(400).json({ message: 'Email and password required' });
      }

      // Check credentials
      if (email !== ADMIN_EMAIL) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }

      const passwordMatch = await bcrypt.compare(password, ADMIN_PASSWORD_HASH);
      if (!passwordMatch) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }

      // Generate token
      const token = generateToken(email);
      res.json({
        message: 'Login successful',
        token,
        admin: { email },
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  // Verify token
  verify: (req, res) => {
    res.json({
      message: 'Token is valid',
      admin: req.admin,
    });
  },
};

module.exports = adminController;
