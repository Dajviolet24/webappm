
-- First, remove subcategory references from movies to avoid foreign key constraint issues
UPDATE movies SET subcategory_id = NULL WHERE subcategory_id IS NOT NULL;

-- Now clear existing subcategories
DELETE FROM subcategories;

-- Add all categories as subcategories for each main category
-- For "New" category
INSERT INTO subcategories (name, category_id)
SELECT 'Películas', id FROM categories WHERE name = 'New'
UNION ALL
SELECT 'Series', id FROM categories WHERE name = 'New'
UNION ALL
SELECT 'Comedia', id FROM categories WHERE name = 'New'
UNION ALL
SELECT 'Emisiones', id FROM categories WHERE name = 'New'
UNION ALL
SELECT 'Animación', id FROM categories WHERE name = 'New'
UNION ALL
SELECT 'Ciencia Ficción', id FROM categories WHERE name = 'New'
UNION ALL
SELECT 'Anime', id FROM categories WHERE name = 'New'
UNION ALL
SELECT 'TV en Vivo', id FROM categories WHERE name = 'New'
UNION ALL
SELECT 'Acción', id FROM categories WHERE name = 'New'
UNION ALL
SELECT 'Contenido Nuevo', id FROM categories WHERE name = 'New';

-- For "Movies" category
INSERT INTO subcategories (name, category_id)
SELECT 'Nuevo', id FROM categories WHERE name = 'Movies'
UNION ALL
SELECT 'Series', id FROM categories WHERE name = 'Movies'
UNION ALL
SELECT 'Comedia', id FROM categories WHERE name = 'Movies'
UNION ALL
SELECT 'Emisiones', id FROM categories WHERE name = 'Movies'
UNION ALL
SELECT 'Animación', id FROM categories WHERE name = 'Movies'
UNION ALL
SELECT 'Ciencia Ficción', id FROM categories WHERE name = 'Movies'
UNION ALL
SELECT 'Anime', id FROM categories WHERE name = 'Movies'
UNION ALL
SELECT 'TV en Vivo', id FROM categories WHERE name = 'Movies'
UNION ALL
SELECT 'Acción', id FROM categories WHERE name = 'Movies'
UNION ALL
SELECT 'Contenido Nuevo', id FROM categories WHERE name = 'Movies';

-- For "Series" category
INSERT INTO subcategories (name, category_id)
SELECT 'Nuevo', id FROM categories WHERE name = 'Series'
UNION ALL
SELECT 'Películas', id FROM categories WHERE name = 'Series'
UNION ALL
SELECT 'Comedia', id FROM categories WHERE name = 'Series'
UNION ALL
SELECT 'Emisiones', id FROM categories WHERE name = 'Series'
UNION ALL
SELECT 'Animación', id FROM categories WHERE name = 'Series'
UNION ALL
SELECT 'Ciencia Ficción', id FROM categories WHERE name = 'Series'
UNION ALL
SELECT 'Anime', id FROM categories WHERE name = 'Series'
UNION ALL
SELECT 'TV en Vivo', id FROM categories WHERE name = 'Series'
UNION ALL
SELECT 'Acción', id FROM categories WHERE name = 'Series'
UNION ALL
SELECT 'Contenido Nuevo', id FROM categories WHERE name = 'Series';

-- For "Comedy" category
INSERT INTO subcategories (name, category_id)
SELECT 'Nuevo', id FROM categories WHERE name = 'Comedy'
UNION ALL
SELECT 'Películas', id FROM categories WHERE name = 'Comedy'
UNION ALL
SELECT 'Series', id FROM categories WHERE name = 'Comedy'
UNION ALL
SELECT 'Emisiones', id FROM categories WHERE name = 'Comedy'
UNION ALL
SELECT 'Animación', id FROM categories WHERE name = 'Comedy'
UNION ALL
SELECT 'Ciencia Ficción', id FROM categories WHERE name = 'Comedy'
UNION ALL
SELECT 'Anime', id FROM categories WHERE name = 'Comedy'
UNION ALL
SELECT 'TV en Vivo', id FROM categories WHERE name = 'Comedy'
UNION ALL
SELECT 'Acción', id FROM categories WHERE name = 'Comedy'
UNION ALL
SELECT 'Contenido Nuevo', id FROM categories WHERE name = 'Comedy';

-- For "Emissions" category
INSERT INTO subcategories (name, category_id)
SELECT 'Nuevo', id FROM categories WHERE name = 'Emissions'
UNION ALL
SELECT 'Películas', id FROM categories WHERE name = 'Emissions'
UNION ALL
SELECT 'Series', id FROM categories WHERE name = 'Emissions'
UNION ALL
SELECT 'Comedia', id FROM categories WHERE name = 'Emissions'
UNION ALL
SELECT 'Animación', id FROM categories WHERE name = 'Emissions'
UNION ALL
SELECT 'Ciencia Ficción', id FROM categories WHERE name = 'Emissions'
UNION ALL
SELECT 'Anime', id FROM categories WHERE name = 'Emissions'
UNION ALL
SELECT 'TV en Vivo', id FROM categories WHERE name = 'Emissions'
UNION ALL
SELECT 'Acción', id FROM categories WHERE name = 'Emissions'
UNION ALL
SELECT 'Contenido Nuevo', id FROM categories WHERE name = 'Emissions';

-- For "Animation" category
INSERT INTO subcategories (name, category_id)
SELECT 'Nuevo', id FROM categories WHERE name = 'Animation'
UNION ALL
SELECT 'Películas', id FROM categories WHERE name = 'Animation'
UNION ALL
SELECT 'Series', id FROM categories WHERE name = 'Animation'
UNION ALL
SELECT 'Comedia', id FROM categories WHERE name = 'Animation'
UNION ALL
SELECT 'Emisiones', id FROM categories WHERE name = 'Animation'
UNION ALL
SELECT 'Ciencia Ficción', id FROM categories WHERE name = 'Animation'
UNION ALL
SELECT 'Anime', id FROM categories WHERE name = 'Animation'
UNION ALL
SELECT 'TV en Vivo', id FROM categories WHERE name = 'Animation'
UNION ALL
SELECT 'Acción', id FROM categories WHERE name = 'Animation'
UNION ALL
SELECT 'Contenido Nuevo', id FROM categories WHERE name = 'Animation';

-- For "Science Fiction" category
INSERT INTO subcategories (name, category_id)
SELECT 'Nuevo', id FROM categories WHERE name = 'Science Fiction'
UNION ALL
SELECT 'Películas', id FROM categories WHERE name = 'Science Fiction'
UNION ALL
SELECT 'Series', id FROM categories WHERE name = 'Science Fiction'
UNION ALL
SELECT 'Comedia', id FROM categories WHERE name = 'Science Fiction'
UNION ALL
SELECT 'Emisiones', id FROM categories WHERE name = 'Science Fiction'
UNION ALL
SELECT 'Animación', id FROM categories WHERE name = 'Science Fiction'
UNION ALL
SELECT 'Anime', id FROM categories WHERE name = 'Science Fiction'
UNION ALL
SELECT 'TV en Vivo', id FROM categories WHERE name = 'Science Fiction'
UNION ALL
SELECT 'Acción', id FROM categories WHERE name = 'Science Fiction'
UNION ALL
SELECT 'Contenido Nuevo', id FROM categories WHERE name = 'Science Fiction';

-- For "Anime" category
INSERT INTO subcategories (name, category_id)
SELECT 'Nuevo', id FROM categories WHERE name = 'Anime'
UNION ALL
SELECT 'Películas', id FROM categories WHERE name = 'Anime'
UNION ALL
SELECT 'Series', id FROM categories WHERE name = 'Anime'
UNION ALL
SELECT 'Comedia', id FROM categories WHERE name = 'Anime'
UNION ALL
SELECT 'Emisiones', id FROM categories WHERE name = 'Anime'
UNION ALL
SELECT 'Animación', id FROM categories WHERE name = 'Anime'
UNION ALL
SELECT 'Ciencia Ficción', id FROM categories WHERE name = 'Anime'
UNION ALL
SELECT 'TV en Vivo', id FROM categories WHERE name = 'Anime'
UNION ALL
SELECT 'Acción', id FROM categories WHERE name = 'Anime'
UNION ALL
SELECT 'Contenido Nuevo', id FROM categories WHERE name = 'Anime';

-- For "Live TV" category
INSERT INTO subcategories (name, category_id)
SELECT 'Nuevo', id FROM categories WHERE name = 'Live TV'
UNION ALL
SELECT 'Películas', id FROM categories WHERE name = 'Live TV'
UNION ALL
SELECT 'Series', id FROM categories WHERE name = 'Live TV'
UNION ALL
SELECT 'Comedia', id FROM categories WHERE name = 'Live TV'
UNION ALL
SELECT 'Emisiones', id FROM categories WHERE name = 'Live TV'
UNION ALL
SELECT 'Animación', id FROM categories WHERE name = 'Live TV'
UNION ALL
SELECT 'Ciencia Ficción', id FROM categories WHERE name = 'Live TV'
UNION ALL
SELECT 'Anime', id FROM categories WHERE name = 'Live TV'
UNION ALL
SELECT 'Acción', id FROM categories WHERE name = 'Live TV'
UNION ALL
SELECT 'Contenido Nuevo', id FROM categories WHERE name = 'Live TV';

-- For "Action" category
INSERT INTO subcategories (name, category_id)
SELECT 'Nuevo', id FROM categories WHERE name = 'Action'
UNION ALL
SELECT 'Películas', id FROM categories WHERE name = 'Action'
UNION ALL
SELECT 'Series', id FROM categories WHERE name = 'Action'
UNION ALL
SELECT 'Comedia', id FROM categories WHERE name = 'Action'
UNION ALL
SELECT 'Emisiones', id FROM categories WHERE name = 'Action'
UNION ALL
SELECT 'Animación', id FROM categories WHERE name = 'Action'
UNION ALL
SELECT 'Ciencia Ficción', id FROM categories WHERE name = 'Action'
UNION ALL
SELECT 'Anime', id FROM categories WHERE name = 'Action'
UNION ALL
SELECT 'TV en Vivo', id FROM categories WHERE name = 'Action'
UNION ALL
SELECT 'Contenido Nuevo', id FROM categories WHERE name = 'Action';

-- For "New Content" category
INSERT INTO subcategories (name, category_id)
SELECT 'Nuevo', id FROM categories WHERE name = 'New Content'
UNION ALL
SELECT 'Películas', id FROM categories WHERE name = 'New Content'
UNION ALL
SELECT 'Series', id FROM categories WHERE name = 'New Content'
UNION ALL
SELECT 'Comedia', id FROM categories WHERE name = 'New Content'
UNION ALL
SELECT 'Emisiones', id FROM categories WHERE name = 'New Content'
UNION ALL
SELECT 'Animación', id FROM categories WHERE name = 'New Content'
UNION ALL
SELECT 'Ciencia Ficción', id FROM categories WHERE name = 'New Content'
UNION ALL
SELECT 'Anime', id FROM categories WHERE name = 'New Content'
UNION ALL
SELECT 'TV en Vivo', id FROM categories WHERE name = 'New Content'
UNION ALL
SELECT 'Acción', id FROM categories WHERE name = 'New Content';
