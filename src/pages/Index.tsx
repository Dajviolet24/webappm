import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import CategoryNav from '@/components/CategoryNav';
import ContentSlider from '@/components/ContentSlider';
import ContinueWatching from '@/components/ContinueWatching';
import BottomNav from '@/components/BottomNav';
import ResponsiveNav from '@/components/ResponsiveNav';
import SearchOverlay from '@/components/SearchOverlay';

const Index = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeTab, setActiveTab] = useState('home');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    const userData = localStorage.getItem('userData');
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        console.log('Current user loaded:', parsedUser);
        setCurrentUser(parsedUser);
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
  }, []);

  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*');
      
      if (error) {
        console.error('Error fetching categories:', error);
        throw error;
      }
      
      const categoryOrder = [
        'New', 'Movies', 'Series', 'Comedy', 'Emissions', 
        'Animation', 'Science Fiction', 'Anime', 'Live TV', 'Action', 'New Content'
      ];
      
      const sortedCategories = categoryOrder
        .map(name => (data || []).find(cat => cat.name === name))
        .filter(Boolean);
      
      return sortedCategories;
    }
  });

  const { data: subcategories = [] } = useQuery({
    queryKey: ['subcategories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('subcategories')
        .select('*');
      
      if (error) {
        console.error('Error fetching subcategories:', error);
        throw error;
      }
      
      return data || [];
    }
  });

  const { data: movies = [] } = useQuery({
    queryKey: ['movies', activeCategory],
    queryFn: async () => {
      let query = supabase
        .from('movies')
        .select(`
          *,
          categories:category_id(id, name),
          subcategories:subcategory_id(id, name)
        `);

      if (activeCategory !== 'all') {
        query = query.eq('category_id', activeCategory);
      }

      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching movies:', error);
        throw error;
      }
      
      return data || [];
    }
  });

  const { data: featuredMovie } = useQuery({
    queryKey: ['featured-movie'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('movies')
        .select('*')
        .eq('is_featured', true)
        .limit(1)
        .maybeSingle();
      
      if (error) {
        console.error('Error fetching featured movie:', error);
        throw error;
      }
      
      return data;
    }
  });

  const allCategories = [
    { id: 'all', name: 'Todo', icon: 'Grid3x3' },
    ...categories
  ];

  const moviesByCategory = React.useMemo(() => {
    if (activeCategory === 'all') {
      const grouped = movies.reduce((acc: any, movie: any) => {
        const categoryName = movie.categories?.name || 'Sin Categoría';
        const categoryId = movie.category_id || 'uncategorized';
        
        if (!acc[categoryId]) {
          acc[categoryId] = {
            name: categoryName,
            movies: []
          };
        }
        acc[categoryId].movies.push({
          id: movie.id,
          title: movie.title,
          image: movie.image_url,
          rating: movie.rating || 0,
          duration: movie.duration || 'N/A'
        });

        if (movie.subcategory_id && movie.subcategories?.name) {
          const subcategoryId = `sub_${movie.subcategory_id}`;
          const subcategoryName = movie.subcategories.name;
          
          if (!acc[subcategoryId]) {
            acc[subcategoryId] = {
              name: subcategoryName,
              movies: []
            };
          }
          acc[subcategoryId].movies.push({
            id: movie.id,
            title: movie.title,
            image: movie.image_url,
            rating: movie.rating || 0,
            duration: movie.duration || 'N/A'
          });
        }
        
        return acc;
      }, {});

      return Object.entries(grouped).map(([categoryId, data]: [string, any]) => ({
        categoryId,
        ...data
      }));
    } else {
      const filteredMovies = movies.map((movie: any) => ({
        id: movie.id,
        title: movie.title,
        image: movie.image_url,
        rating: movie.rating || 0,
        duration: movie.duration || 'N/A'
      }));

      const selectedCategory = allCategories.find(cat => cat.id === activeCategory);
      
      return filteredMovies.length > 0 ? [{
        categoryId: activeCategory,
        name: selectedCategory?.name || 'Categoría',
        movies: filteredMovies
      }] : [];
    }
  }, [movies, categories, activeCategory, subcategories]);

  const allMoviesForSearch = React.useMemo(() => {
    return movies.map((movie: any) => ({
      id: movie.id,
      title: movie.title,
      image: movie.image_url,
      rating: movie.rating || 0,
      duration: movie.duration || 'N/A'
    }));
  }, [movies]);

  const handleOpenSearch = () => {
    setIsSearchOpen(true);
  };

  const handleCloseSearch = () => {
    setIsSearchOpen(false);
  };

  const handleOpenMenu = () => {
    setIsMenuOpen(true);
  };

  const handleChangeTab = (tab: string) => {
    setActiveTab(tab);
    if (tab === 'search') {
      setIsSearchOpen(true);
    } else if (tab === 'movies') {
      const moviesCategory = categories.find(cat => cat.name === 'Movies');
      if (moviesCategory) {
        setActiveCategory(moviesCategory.id);
      }
    } else if (tab === 'series') {
      const seriesCategory = categories.find(cat => cat.name === 'Series');
      if (seriesCategory) {
        setActiveCategory(seriesCategory.id);
      }
    } else if (tab === 'home') {
      setActiveCategory('all');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Responsive Navigation for Large Screens */}
      <ResponsiveNav
        activeTab={activeTab}
        onChangeTab={handleChangeTab}
        onOpenSearch={handleOpenSearch}
      />
      
      {/* Main Content with responsive margin */}
      <div className="lg:ml-64">
        <Header 
          onOpenSearch={handleOpenSearch}
          onOpenMenu={handleOpenMenu}
        />
        
        {featuredMovie && (
          <HeroSection 
            title={featuredMovie.title}
            rating={featuredMovie.rating || 0}
            duration={featuredMovie.duration || 'N/A'}
            ageRating="13+"
            image={featuredMovie.image_url || ''}
          />
        )}
        
        <CategoryNav
          categories={allCategories}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />
        
        <main className="pb-32 space-y-6 bg-gray-900">
          {currentUser?.id && (
            <ContinueWatching userId={currentUser.id} />
          )}

          {moviesByCategory.length > 0 ? (
            moviesByCategory.map((section) => (
              <ContentSlider
                key={section.categoryId}
                title={section.name}
                movies={section.movies}
                category={section.categoryId}
              />
            ))
          ) : (
            <div className="flex items-center justify-center py-20">
              <p className="text-white/60 text-lg">No hay contenido disponible</p>
            </div>
          )}
        </main>
        
        <div className="bg-gray-900 border-t border-white/10 pb-24">
          <div className="max-w-6xl mx-auto px-4 py-8">
            <div className="bg-gray-800/60 rounded-2xl border border-white/10 p-6 shadow-2xl backdrop-blur-md">
              <div className="text-center space-y-4">
                <h3 className="text-xl font-bold text-movieBlue mb-4">
                  Acerca de Astronauta TV
                </h3>
                <div className="text-sm text-white/90 leading-relaxed space-y-3">
                  <p>
                    <span className="font-semibold text-movieBlue">Astronauta TV</span>, tu portal para ver películas y series en alta definición, totalmente gratis.
                  </p>
                  <p>
                    Encuentra lo que buscas fácilmente en nuestro extenso catálogo, disponible en español latino y subtitulado.
                  </p>
                  <p>
                    Usa nuestro buscador o navega por géneros y estrenos para descubrir nuevo contenido.
                  </p>
                  <p>
                    Disfruta de una experiencia de visualización sin interrupciones con nuestra interfaz moderna y fácil de usar.
                  </p>
                  <p>
                    Nuestro catálogo se actualiza constantemente con los últimos lanzamientos y clásicos imperdibles.
                  </p>
                  <div className="pt-4 border-t border-white/10">
                    <p className="text-xs text-white/70 italic leading-relaxed">
                      Astronauta TV opera como un servicio de indexación y búsqueda de contenido. 
                      Queremos aclarar que no almacenamos ningún tipo de archivo en nuestros servidores. 
                      Todo el contenido es proporcionado por enlaces externos y nosotros únicamente facilitamos el acceso organizado a dicho contenido.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom Navigation for Mobile */}
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

export default Index;
