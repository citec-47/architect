const pool = require('../config/database');

// Initialize database with schema
const initializeDatabase = async () => {
  try {
    console.log('Initializing database...');

    // Create projects table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS projects (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        image_url VARCHAR(500),
        category VARCHAR(100),
        featured BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create gallery images table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS gallery_images (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        image_url VARCHAR(500) NOT NULL,
        display_order INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create contact messages table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS contact_messages (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        read BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log('Database initialized successfully');

    // Insert sample gallery images
    await pool.query(`
      INSERT INTO gallery_images (title, image_url, display_order)
      SELECT $1, $2, $3
      WHERE NOT EXISTS (SELECT 1 FROM gallery_images LIMIT 1)
    `, ['Modern Villa 1', 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&h=600&fit=crop', 1]);

    await pool.query(`
      INSERT INTO gallery_images (title, image_url, display_order)
      SELECT $1, $2, $3
      WHERE NOT EXISTS (SELECT 1 FROM gallery_images WHERE display_order = 2)
    `, ['Contemporary Home', 'https://images.unsplash.com/photo-1572120471610-3d951dc3084d?w=1200&h=600&fit=crop', 2]);

    await pool.query(`
      INSERT INTO gallery_images (title, image_url, display_order)
      SELECT $1, $2, $3
      WHERE NOT EXISTS (SELECT 1 FROM gallery_images WHERE display_order = 3)
    `, ['Luxury Residence', 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200&h=600&fit=crop', 3]);

    // Insert sample projects
    const projectsCheckResult = await pool.query('SELECT COUNT(*) FROM projects');
    if (projectsCheckResult.rows[0].count === '0') {
      await pool.query(`
        INSERT INTO projects (title, description, image_url, category, featured)
        VALUES 
          ($1, $2, $3, $4, $5),
          ($6, $7, $8, $9, $10),
          ($11, $12, $13, $14, $15),
          ($16, $17, $18, $19, $20)
      `, [
        'Modern Villa', 'A stunning modern villa with minimalist design and natural lighting', 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&h=400&fit=crop', 'Residential', true,
        'Urban Apartment Complex', 'Contemporary multi-family residential project in the heart of the city', 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=600&h=400&fit=crop', 'Residential', true,
        'Commercial Office', 'State-of-the-art commercial office space with sustainable design', 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&h=400&fit=crop', 'Commercial', false,
        'Boutique Hotel', 'Luxury boutique hotel combining elegance with modern amenities', 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&h=400&fit=crop', 'Hospitality', true
      ]);
    }

    console.log('Sample data inserted successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1);
  }
};

module.exports = initializeDatabase;
