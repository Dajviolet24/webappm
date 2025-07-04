
import React, { useState, useEffect } from 'react';
import { Play, Calendar, Clock, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface HeroMovie {
  id: string;
  title: string;
  rating: number;
  duration: string;
  ageRating: string;
  image: string;
  synopsis?: string;
  year?: number;
}

interface HeroSectionProps {
  title: string;
  rating: number;
  duration: string;
  ageRating: string;
  image: string;
}

const HeroSection: React.FC<HeroSectionProps> = () => {
  const [currentMovieIndex, setCurrentMovieIndex] = useState(0);

  const { data: heroMovies = [], isLoading } = useQuery({
    queryKey: ['hero-movies'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('movies')
        .select('*')
        .eq('is_featured', true)
        .limit(4)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching hero movies:', error);
        throw error;
      }
      
      return (data || []).map((movie: any) => ({
        id: movie.id,
        title: movie.title,
        rating: movie.rating || 8.0,
        duration: movie.duration || '2h 30m',
        ageRating: '13+',
        image: movie.image_url || 'https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?auto=format&fit=crop&q=80&w=3270&ixlib=rb-4.0.3',
        synopsis: movie.synopsis || 'An exciting story that will keep you entertained from start to finish.',
        year: movie.year || 2024
      }));
    }
  });

  const currentMovie = heroMovies[currentMovieIndex] || {
    id: '1',
    title: 'Featured Content',
    rating: 8.0,
    duration: '2h 30m',
    ageRating: '13+',
    image: 'https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?auto=format&fit=crop&q=80&w=3270&ixlib=rb-4.0.3',
    synopsis: 'Discover amazing content in our featured collection.',
    year: 2024
  };

  useEffect(() => {
    if (heroMovies.length > 1) {
      const interval = setInterval(() => {
        setCurrentMovieIndex((prev) => (prev + 1) % heroMovies.length);
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [heroMovies.length]);

  if (isLoading) {
    return (
      <div className="relative w-full h-[40vh] md:h-[60vh] bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[40vh] sm:h-[50vh] md:h-[60vh] lg:h-[70vh] overflow-hidden">
      {heroMovies.map((movie, index) => (
        <div
          key={movie.id}
          className={`absolute inset-0 w-full h-full bg-cover bg-center transition-opacity duration-1000 ${
            index === currentMovieIndex ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ backgroundImage: `url(${movie.image})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/70 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 via-transparent to-transparent" />
        </div>
      ))}
      
      <div className="absolute bottom-0 left-0 w-full p-3 sm:p-4 md:p-6 lg:p-8 z-10">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-xl lg:max-w-2xl space-y-2 sm:space-y-3 md:space-y-4">
            <div className="flex items-center gap-2 text-xs sm:text-sm text-orange-400 font-medium">
              <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>ESTRENO</span>
              <span>•</span>
              <span>{currentMovie.year}</span>
            </div>
            
            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold leading-tight text-white drop-shadow-2xl">
              {currentMovie.title}
            </h1>
            
            <div className="flex items-center space-x-2 sm:space-x-3 md:space-x-4 text-xs sm:text-sm">
              <div className="flex items-center bg-black/50 backdrop-blur-sm rounded-full px-2 py-1 sm:px-3 sm:py-1">
                <Star className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400 mr-1 fill-current" />
                <span className="text-white font-medium">{currentMovie.rating}</span>
              </div>
              
              <div className="flex items-center bg-black/50 backdrop-blur-sm rounded-full px-2 py-1 sm:px-3 sm:py-1">
                <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-white/80 mr-1" />
                <span className="text-white">{currentMovie.duration}</span>
              </div>
              
              <div className="bg-gray-700/80 backdrop-blur-sm px-2 py-1 sm:px-3 sm:py-1 rounded-full">
                <span className="text-white text-xs sm:text-sm font-medium">{currentMovie.ageRating}</span>
              </div>
            </div>
            
            <p className="text-sm sm:text-base md:text-lg text-white/90 leading-relaxed line-clamp-2 sm:line-clamp-3 drop-shadow-lg">
              {currentMovie.synopsis}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2">
              <Link 
                to={`/movie/${currentMovie.id}`}
                className="group relative overflow-hidden bg-gradient-to-r from-movieBlue to-blue-600 hover:from-blue-600 hover:to-movieBlue text-white font-bold py-2.5 sm:py-3 md:py-4 px-4 sm:px-6 md:px-8 rounded-full transition-all duration-300 transform hover:scale-105 shadow-2xl flex items-center justify-center text-sm sm:text-base md:text-lg"
              >
                <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12"></div>
                <Play className="w-4 h-4 sm:w-5 sm:h-5 mr-2 fill-current" />
                <span className="relative z-10">Ver ahora</span>
              </Link>
            </div>
            
            {heroMovies.length > 1 && (
              <div className="flex space-x-2 sm:space-x-3 pt-2">
                {heroMovies.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentMovieIndex(index)}
                    className={`h-1 rounded-full transition-all duration-300 ${
                      index === currentMovieIndex 
                        ? 'bg-movieBlue w-6 sm:w-8' 
                        : 'bg-white/30 w-4 sm:w-6 hover:bg-white/50'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
