const express = require('express');
const contactController = require('../controllers/contactController');
const { body } = require('express-validator');

const router = express.Router();

// Validation middleware
const validateMessage = [
  body('name').notEmpty().trim().withMessage('Name is required'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('message').notEmpty().trim().withMessage('Message is required'),
];

// Routes
router.get('/', contactController.getMessages);
router.post('/', validateMessage, contactController.createMessage);
router.put('/:id/read', contactController.markAsRead);
router.delete('/:id', contactController.deleteMessage);

module.exports = router;
