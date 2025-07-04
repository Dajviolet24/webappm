
import React from 'react';
import { ChevronRight } from 'lucide-react';
import MovieCard from './MovieCard';
import { useNavigate } from 'react-router-dom';

export interface Movie {
  id: string;
  title: string;
  image: string;
  rating: number;
  duration: string;
}

interface ContentSectionProps {
  title: string;
  movies: Movie[];
  showViewMore?: boolean;
  onViewMoreClick?: () => void;
  category?: string;
}

const ContentSection: React.FC<ContentSectionProps> = ({
  title,
  movies,
  showViewMore = true,
  onViewMoreClick,
  category
}) => {
  const navigate = useNavigate();

  const handleViewMore = () => {
    if (category) {
      navigate(`/category/${category}`, { state: { movies, title } });
    }
    if (onViewMoreClick) {
      onViewMoreClick();
    }
  };

  return (
    <section className="px-4 my-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">{title}</h2>
        {showViewMore && (
          <button 
            className="text-movieBlue flex items-center text-sm"
            onClick={handleViewMore}
          >
            Ver más <ChevronRight className="w-4 h-4 ml-1" />
          </button>
        )}
      </div>
      
      {/* Grid adjusted for mobile to show exactly 3 columns */}
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-2 sm:gap-3">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </section>
  );
};

export default ContentSection;
