
import React, { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import MovieCard from './MovieCard';
import { Movie } from '../types/movie';

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  allMovies: Movie[];
}

const SearchOverlay: React.FC<SearchOverlayProps> = ({ isOpen, onClose, allMovies }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Movie[]>([]);
  
  useEffect(() => {
    if (query.length > 1) {
      const filtered = allMovies.filter(movie => 
        movie.title.toLowerCase().includes(query.toLowerCase())
      );
      setResults(filtered);
    } else {
      setResults([]);
    }
  }, [query, allMovies]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-movieDark/95 backdrop-blur-md z-50 overflow-y-auto">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <div className="relative flex-1 max-w-xl mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar películas, series..."
              className="w-full bg-accent/40 pl-10 pr-4 py-3 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-movieBlue"
              autoFocus
            />
          </div>
          <button 
            onClick={onClose}
            className="ml-4 p-2 rounded-full hover:bg-accent/40 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        {query.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-4">
              {results.length > 0 
                ? `Resultados para "${query}"`
                : `No se encontraron resultados para "${query}"`
              }
            </h3>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {results.map(movie => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>
          </div>
        )}
        
        {query.length === 0 && (
          <div className="mt-8 text-center">
            <p className="text-gray-400 mb-4">Escribe para buscar películas y series</p>
            <h3 className="text-lg font-semibold mb-4">Categorías populares</h3>
            <div className="flex flex-wrap justify-center gap-2">
              {['Acción', 'Comedia', 'Drama', 'Ciencia Ficción', 'Animación'].map(tag => (
                <button 
                  key={tag} 
                  className="bg-accent/40 px-4 py-2 rounded-full text-sm hover:bg-accent/60 transition-colors"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchOverlay;
