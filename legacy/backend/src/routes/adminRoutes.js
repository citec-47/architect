const express = require('express');
const adminController = require('../controllers/adminController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.post('/login', adminController.login);

// Protected routes (require authentication)
router.get('/verify', authenticateToken, adminController.verify);

module.exports = router;
