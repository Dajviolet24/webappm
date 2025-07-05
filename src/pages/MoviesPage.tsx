
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import MovieCard from '@/components/MovieCard';
import BottomNav from '@/components/BottomNav';
import SearchOverlay from '@/components/SearchOverlay';

const MoviesPage = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('movies');

  // Fetch movies category
  const { data: moviesCategory } = useQuery({
    queryKey: ['movies-category'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('name', 'Movies')
        .single();
      
      if (error) {
        console.error('Error fetching movies category:', error);
        return null;
      }
      
      return data;
    }
  });

  // Fetch movies
  const { data: movies = [], isLoading } = useQuery({
    queryKey: ['movies-page', moviesCategory?.id],
    queryFn: async () => {
      if (!moviesCategory?.id) return [];
      
      const { data, error } = await supabase
        .from('movies')
        .select('*')
        .eq('category_id', moviesCategory.id)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching movies:', error);
        throw error;
      }
      
      return data || [];
    },
    enabled: !!moviesCategory?.id
  });

  const handleOpenSearch = () => {
    setIsSearchOpen(true);
  };

  const handleCloseSearch = () => {
    setIsSearchOpen(false);
  };

  const handleChangeTab = (tab: string) => {
    setActiveTab(tab);
    if (tab === 'search') {
      setIsSearchOpen(true);
    }
  };

  const allMoviesForSearch = movies.map((movie: any) => ({
    id: movie.id,
    title: movie.title,
    image: movie.image_url,
    rating: movie.rating || 0,
    duration: movie.duration || 'N/A'
  }));

  return (
    <div className="min-h-screen bg-movieDark text-white">
      <Header 
        onOpenSearch={handleOpenSearch}
        onOpenMenu={() => {}}
      />
      
      <main className="pt-24 pb-24 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-center">Películas</h1>
          
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <p className="text-white/60 text-lg">Cargando películas...</p>
            </div>
          ) : movies.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {movies.map((movie: any) => (
                <MovieCard
                  key={movie.id}
                  movie={{
                    id: movie.id,
                    title: movie.title,
                    image: movie.image_url,
                    rating: movie.rating || 0,
                    duration: movie.duration || 'N/A'
                  }}
                />
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center py-20">
              <p className="text-white/60 text-lg">No hay películas disponibles</p>
            </div>
          )}
        </div>
      </main>
      
      <BottomNav 
        activeTab={activeTab}
        onChangeTab={handleChangeTab}
        onOpenSearch={handleOpenSearch}
      />

      <SearchOverlay 
        isOpen={isSearchOpen}
        onClose={handleCloseSearch}
        allMovies={allMoviesForSearch}
      />
    </div>
  );
};

export default MoviesPage;
