
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import MovieCard from '../components/MovieCard';
import { Movie } from '../types/movie';

interface LocationState {
  movies: Movie[];
  title: string;
}

const CategoryPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { movies, title } = location.state as LocationState;

  return (
    <div className="min-h-screen pb-20">
      <div className="sticky top-0 z-10 bg-movieDark/95 backdrop-blur-sm px-4 py-4 flex items-center">
        <button 
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-white/10 rounded-full mr-4"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-bold">{title}</h1>
      </div>

      <div className="p-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </div>
  );
};

export default CategoryPage;
