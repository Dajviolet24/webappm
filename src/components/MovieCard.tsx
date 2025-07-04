
import React from 'react';
import { Play, Info } from 'lucide-react';
import { Movie } from '../types/movie';
import { Link } from 'react-router-dom';

interface MovieCardProps {
  movie: Movie;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie }) => {
  return (
    <div className="relative group cursor-pointer">
      <Link to={`/movie/${movie.id}`} className="block">
        <div className="aspect-[2/3] rounded-md sm:rounded-lg overflow-hidden bg-accent/50 shadow-lg transition-transform group-hover:scale-105 duration-300">
          <img 
            src={movie.image} 
            alt={movie.title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-1 sm:p-2 md:p-3">
            <div className="flex gap-1 sm:gap-1.5 md:gap-2">
              <button className="p-0.5 sm:p-1 md:p-1.5 bg-movieBlue rounded-full hover:bg-blue-600 transition-colors">
                <Play className="w-2 h-2 sm:w-2.5 sm:h-2.5 md:w-3 md:h-3 text-white" />
              </button>
              <button className="p-0.5 sm:p-1 md:p-1.5 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors">
                <Info className="w-2 h-2 sm:w-2.5 sm:h-2.5 md:w-3 md:h-3 text-white" />
              </button>
            </div>
          </div>
        </div>
        
        <div className="mt-1 sm:mt-2">
          <h3 className="font-medium text-[10px] sm:text-xs md:text-sm text-white truncate leading-tight">{movie.title}</h3>
          <div className="flex items-center mt-0.5 sm:mt-1 text-[8px] sm:text-[10px] md:text-xs text-gray-400">
            <span className="text-yellow-400 mr-0.5">★</span>
            <span className="mr-1">{movie.rating}</span>
            <span className="truncate text-[8px] sm:text-[10px]">{movie.duration}</span>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default MovieCard;
