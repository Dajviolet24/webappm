
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import MovieCard from '@/components/MovieCard';
import BottomNav from '@/components/BottomNav';
import SearchOverlay from '@/components/SearchOverlay';

const SeriesPage = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('series');

  // Fetch series category
  const { data: seriesCategory } = useQuery({
    queryKey: ['series-category'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('name', 'Series')
        .single();
      
      if (error) {
        console.error('Error fetching series category:', error);
        return null;
      }
      
      return data;
    }
  });

  // Fetch series
  const { data: series = [], isLoading } = useQuery({
    queryKey: ['series-page', seriesCategory?.id],
    queryFn: async () => {
      if (!seriesCategory?.id) return [];
      
      const { data, error } = await supabase
        .from('movies')
        .select('*')
        .eq('category_id', seriesCategory.id)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching series:', error);
        throw error;
      }
      
      return data || [];
    },
    enabled: !!seriesCategory?.id
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

  const allSeriesForSearch = series.map((serie: any) => ({
    id: serie.id,
    title: serie.title,
    image: serie.image_url,
    rating: serie.rating || 0,
    duration: serie.duration || 'N/A'
  }));

  return (
    <div className="min-h-screen bg-movieDark text-white">
      <Header 
        onOpenSearch={handleOpenSearch}
        onOpenMenu={() => {}}
      />
      
      <main className="pt-24 pb-24 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-center">Series</h1>
          
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <p className="text-white/60 text-lg">Cargando series...</p>
            </div>
          ) : series.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {series.map((serie: any) => (
                <MovieCard
                  key={serie.id}
                  movie={{
                    id: serie.id,
                    title: serie.title,
                    image: serie.image_url,
                    rating: serie.rating || 0,
                    duration: serie.duration || 'N/A'
                  }}
                />
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center py-20">
              <p className="text-white/60 text-lg">No hay series disponibles</p>
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
        allMovies={allSeriesForSearch}
      />
    </div>
  );
};

export default SeriesPage;
