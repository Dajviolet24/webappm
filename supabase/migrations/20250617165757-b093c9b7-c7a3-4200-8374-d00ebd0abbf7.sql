
-- Clear all existing categories first by updating movies to have null category_id temporarily
UPDATE movies SET category_id = NULL, subcategory_id = NULL;

-- Now we can safely delete existing categories
DELETE FROM categories;
DELETE FROM subcategories;

-- Insert the new categories in the specified order with proper UUIDs
INSERT INTO categories (name, icon) VALUES
('New', 'Sparkles'),
('Movies', 'Film'),
('Series', 'Tv'),
('Comedy', 'Smile'),
('Emissions', 'Radio'),
('Animation', 'Palette'),
('Science Fiction', 'Rocket'),
('Anime', 'Star'),
('Live TV', 'Tv'),
('Action', 'Zap'),
('New Content', 'Plus');
