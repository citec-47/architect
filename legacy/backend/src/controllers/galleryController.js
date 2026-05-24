const pool = require('../config/database');

// Get all gallery images
exports.getGalleryImages = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM gallery_images ORDER BY display_order ASC');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching gallery images:', error);
    res.status(500).json({ message: 'Error fetching gallery images', error: error.message });
  }
};

// Update gallery image
exports.updateGalleryImage = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, image_url, display_order } = req.body;
    const result = await pool.query(
      'UPDATE gallery_images SET title = $1, image_url = $2, display_order = $3 WHERE id = $4 RETURNING *',
      [title, image_url, display_order, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Gallery image not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating gallery image:', error);
    res.status(500).json({ message: 'Error updating gallery image', error: error.message });
  }
};

// Add new gallery image
exports.addGalleryImage = async (req, res) => {
  try {
    const { title, image_url } = req.body;
    const orderResult = await pool.query('SELECT MAX(display_order) FROM gallery_images');
    const nextOrder = (orderResult.rows[0].max || 0) + 1;

    const result = await pool.query(
      'INSERT INTO gallery_images (title, image_url, display_order) VALUES ($1, $2, $3) RETURNING *',
      [title, image_url, nextOrder]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error adding gallery image:', error);
    res.status(500).json({ message: 'Error adding gallery image', error: error.message });
  }
};
