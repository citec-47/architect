const express = require('express');
const projectController = require('../controllers/projectController');
const { body } = require('express-validator');

const router = express.Router();

// Validation middleware
const validateProject = [
  body('title').notEmpty().withMessage('Title is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('category').optional().isString(),
  body('featured').optional().isBoolean(),
];

// Routes
router.get('/', projectController.getAllProjects);
router.get('/featured', projectController.getFeaturedProjects);
router.get('/:id', projectController.getProjectById);
router.post('/', validateProject, projectController.createProject);
router.put('/:id', validateProject, projectController.updateProject);
router.delete('/:id', projectController.deleteProject);

module.exports = router;
