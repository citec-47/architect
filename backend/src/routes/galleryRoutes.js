const express = require('express');
const galleryController = require('../controllers/galleryController');
const { body } = require('express-validator');

const router = express.Router();

// Routes
router.get('/', galleryController.getGalleryImages);
router.post('/', 
  body('title').notEmpty().withMessage('Title is required'),
  body('image_url').notEmpty().withMessage('Image URL is required'),
  galleryController.addGalleryImage
);
router.put('/:id',
  body('title').optional().isString(),
  body('image_url').optional().isString(),
  galleryController.updateGalleryImage
);

module.exports = router;
