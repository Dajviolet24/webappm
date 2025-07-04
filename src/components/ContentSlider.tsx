
import React from 'react';
import MovieCard from './MovieCard';

interface Movie {
  id: string;
  title: string;
  image: string;
  rating: number;
  duration: string;
}

interface ContentSliderProps {
  title: string;
  movies: Movie[];
  category: string;
}

const ContentSlider = ({ title, movies, category }: ContentSliderProps) => {
  const scrollRef = React.useRef<HTMLDivElement>(null);

  if (!movies || movies.length === 0) {
    return null;
  }

  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-3 px-4">
        <h2 className="text-xl font-bold text-white">{title}</h2>
      </div>
      
      <div
        ref={scrollRef}
        className="flex gap-3 overflow-x-auto px-4 pb-3 snap-x hide-scrollbar"
      >
        {movies.map((movie) => (
          <div key={movie.id} className="flex-shrink-0 w-28 sm:w-32 md:w-40 lg:w-48 snap-start">
            <MovieCard
              movie={{
                id: movie.id,
                title: movie.title,
                image: movie.image,
                rating: movie.rating,
                duration: movie.duration
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContentSlider;
