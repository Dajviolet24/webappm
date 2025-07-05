
-- Add subcategories for each main category
INSERT INTO subcategories (category_id, name) 
SELECT c.id, 'Acción' FROM categories c WHERE c.name = 'New'
UNION ALL
SELECT c.id, 'Drama' FROM categories c WHERE c.name = 'New'
UNION ALL
SELECT c.id, 'Comedia' FROM categories c WHERE c.name = 'New'
UNION ALL
SELECT c.id, 'Terror' FROM categories c WHERE c.name = 'Movies'
UNION ALL
SELECT c.id, 'Romance' FROM categories c WHERE c.name = 'Movies'
UNION ALL
SELECT c.id, 'Aventura' FROM categories c WHERE c.name = 'Movies'
UNION ALL
SELECT c.id, 'Fantasía' FROM categories c WHERE c.name = 'Series'
UNION ALL
SELECT c.id, 'Misterio' FROM categories c WHERE c.name = 'Series'
UNION ALL
SELECT c.id, 'Documental' FROM categories c WHERE c.name = 'Series'
UNION ALL
SELECT c.id, 'Stand-up' FROM categories c WHERE c.name = 'Comedy'
UNION ALL
SELECT c.id, 'Sitcom' FROM categories c WHERE c.name = 'Comedy'
UNION ALL
SELECT c.id, 'Sketch' FROM categories c WHERE c.name = 'Comedy'
UNION ALL
SELECT c.id, 'Noticias' FROM categories c WHERE c.name = 'Emissions'
UNION ALL
SELECT c.id, 'Deportes' FROM categories c WHERE c.name = 'Emissions'
UNION ALL
SELECT c.id, 'Entretenimiento' FROM categories c WHERE c.name = 'Emissions'
UNION ALL
SELECT c.id, '2D' FROM categories c WHERE c.name = 'Animation'
UNION ALL
SELECT c.id, '3D' FROM categories c WHERE c.name = 'Animation'
UNION ALL
SELECT c.id, 'Stop Motion' FROM categories c WHERE c.name = 'Animation'
UNION ALL
SELECT c.id, 'Ciencia Ficción' FROM categories c WHERE c.name = 'Science Fiction'
UNION ALL
SELECT c.id, 'Fantasía Científica' FROM categories c WHERE c.name = 'Science Fiction'
UNION ALL
SELECT c.id, 'Distopía' FROM categories c WHERE c.name = 'Science Fiction'
UNION ALL
SELECT c.id, 'Shonen' FROM categories c WHERE c.name = 'Anime'
UNION ALL
SELECT c.id, 'Seinen' FROM categories c WHERE c.name = 'Anime'
UNION ALL
SELECT c.id, 'Shojo' FROM categories c WHERE c.name = 'Anime'
UNION ALL
SELECT c.id, 'Noticias En Vivo' FROM categories c WHERE c.name = 'Live TV'
UNION ALL
SELECT c.id, 'Deportes En Vivo' FROM categories c WHERE c.name = 'Live TV'
UNION ALL
SELECT c.id, 'Eventos' FROM categories c WHERE c.name = 'Live TV'
UNION ALL
SELECT c.id, 'Artes Marciales' FROM categories c WHERE c.name = 'Action'
UNION ALL
SELECT c.id, 'Espionaje' FROM categories c WHERE c.name = 'Action'
UNION ALL
SELECT c.id, 'Thriller' FROM categories c WHERE c.name = 'Action'
UNION ALL
SELECT c.id, 'Estrenos' FROM categories c WHERE c.name = 'New Content'
UNION ALL
SELECT c.id, 'Próximamente' FROM categories c WHERE c.name = 'New Content'
UNION ALL
SELECT c.id, 'Exclusivo' FROM categories c WHERE c.name = 'New Content';
