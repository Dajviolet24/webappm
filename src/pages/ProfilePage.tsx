
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import BottomNav from '@/components/BottomNav';
import SearchOverlay from '@/components/SearchOverlay';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, Settings, LogOut, Crown, Shield } from 'lucide-react';

interface UserData {
  id: string;
  username: string;
  avatar: string;
  privacyAccepted: boolean;
}

const ProfilePage = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    const savedUserData = localStorage.getItem('userData');
    if (savedUserData) {
      setUserData(JSON.parse(savedUserData));
    }
  }, []);

  // Fetch user statistics
  const { data: userStats = { moviesWatched: 0, seriesFollowed: 0, totalHours: 0 } } = useQuery({
    queryKey: ['user-stats', userData?.id],
    queryFn: async () => {
      if (!userData?.id) return { moviesWatched: 0, seriesFollowed: 0, totalHours: 0 };

      console.log('Fetching user stats for:', userData.id);

      // Get total watch progress entries (completed movies/episodes)
      const { data: watchProgress, error: watchError } = await supabase
        .from('watch_progress')
        .select(`
          *,
          movies:movie_id(type),
          episodes:episode_id(id)
        `)
        .eq('user_id', userData.id);

      if (watchError) {
        console.error('Error fetching watch progress:', watchError);
        return { moviesWatched: 0, seriesFollowed: 0, totalHours: 0 };
      }

      console.log('Watch progress data:', watchProgress);

      // Calculate statistics
      const moviesWatched = watchProgress?.filter(item => 
        item.movies?.type === 'movie' && item.progress_seconds > 300 // Watched more than 5 minutes
      ).length || 0;

      // Count unique series (by movie_id where episodes exist)
      const seriesIds = new Set();
      watchProgress?.forEach(item => {
        if (item.episodes && item.movie_id) {
          seriesIds.add(item.movie_id);
        }
      });
      const seriesFollowed = seriesIds.size;

      // Calculate total watch time in hours
      const totalSeconds = watchProgress?.reduce((total, item) => {
        return total + (item.progress_seconds || 0);
      }, 0) || 0;
      const totalHours = Math.round(totalSeconds / 3600);

      return {
        moviesWatched,
        seriesFollowed,
        totalHours
      };
    },
    enabled: !!userData?.id
  });

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
    if (tab === 'search') {
      setIsSearchOpen(true);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('accessAuth');
    localStorage.removeItem('userData');
    localStorage.removeItem('onboardingComplete');
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Header 
        onOpenSearch={handleOpenSearch}
        onOpenMenu={handleOpenMenu}
      />
      
      <main className="pt-20 sm:pt-24 pb-20 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold mb-2 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Mi Perfil
            </h1>
            <p className="text-white/60 text-sm sm:text-base">Gestiona tu cuenta de Astronauta TV</p>
          </div>
          
          {userData ? (
            <div className="space-y-4 sm:space-y-6">
              {/* User Profile Card */}
              <Card className="bg-gray-800/80 backdrop-blur-lg border border-white/20 shadow-2xl">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
                    <div className="relative flex-shrink-0">
                      <img
                        src={userData.avatar}
                        alt="Profile Avatar"
                        className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full object-cover border-4 border-movieBlue/30 shadow-xl"
                      />
                      <div className="absolute -bottom-1 -right-1 bg-gradient-to-r from-movieBlue to-blue-600 p-1.5 sm:p-2 rounded-full shadow-lg">
                        <Crown className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                      </div>
                    </div>
                    <div className="flex-1 text-center sm:text-left">
                      <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-1">{userData.username}</h2>
                      <div className="flex items-center justify-center sm:justify-start gap-2 mb-2">
                        <Shield className="w-4 h-4 text-green-400" />
                        <span className="text-green-400 font-medium text-sm">Miembro Premium</span>
                      </div>
                      <p className="text-white/60 text-sm">Astronauta TV Member</p>
                      <div className="flex items-center justify-center sm:justify-start gap-4 mt-3 text-xs text-white/50">
                        <span>Cuenta verificada</span>
                        <span>•</span>
                        <span>Activo desde 2024</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Account Statistics */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                <Card className="bg-blue-600/20 backdrop-blur-lg border border-blue-500/20 shadow-xl">
                  <CardContent className="p-3 sm:p-4 text-center">
                    <div className="text-xl sm:text-2xl font-bold text-blue-400 mb-1">{userStats.moviesWatched}</div>
                    <div className="text-xs text-white/60">Películas vistas</div>
                  </CardContent>
                </Card>
                <Card className="bg-purple-600/20 backdrop-blur-lg border border-purple-500/20 shadow-xl">
                  <CardContent className="p-3 sm:p-4 text-center">
                    <div className="text-xl sm:text-2xl font-bold text-purple-400 mb-1">{userStats.seriesFollowed}</div>
                    <div className="text-xs text-white/60">Series seguidas</div>
                  </CardContent>
                </Card>
                <Card className="bg-green-600/20 backdrop-blur-lg border border-green-500/20 shadow-xl">
                  <CardContent className="p-3 sm:p-4 text-center">
                    <div className="text-xl sm:text-2xl font-bold text-green-400 mb-1">{userStats.totalHours}h</div>
                    <div className="text-xs text-white/60">Tiempo total</div>
                  </CardContent>
                </Card>
              </div>

              {/* Account Settings */}
              <Card className="bg-gray-800/80 backdrop-blur-lg border border-white/20 shadow-2xl">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-white text-lg">
                    <Settings className="h-5 w-5 text-movieBlue" />
                    Configuración de Cuenta
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
                      <span className="text-white/80 text-sm">Nombre de Usuario</span>
                      <span className="text-white font-medium text-sm">{userData.username}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
                      <span className="text-white/80 text-sm">Política de Privacidad</span>
                      <span className="text-green-400 font-medium flex items-center gap-1 text-sm">
                        <Shield className="w-4 h-4" />
                        Aceptada
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
                      <span className="text-white/80 text-sm">Estado de la Cuenta</span>
                      <span className="text-green-400 font-medium flex items-center gap-1 text-sm">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                        Activa
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
                      <span className="text-white/80 text-sm">Plan de Suscripción</span>
                      <span className="text-movieBlue font-medium flex items-center gap-1 text-sm">
                        <Crown className="w-4 h-4" />
                        Premium
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Actions */}
              <Card className="bg-gray-800/80 backdrop-blur-lg border border-white/20 shadow-2xl">
                <CardHeader className="pb-3">
                  <CardTitle className="text-white text-lg">Acciones de Cuenta</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button 
                    variant="outline" 
                    className="w-full bg-white/5 border-white/20 text-white hover:bg-white/10 transition-all duration-300"
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Configuraciones Avanzadas
                  </Button>
                  <Button 
                    onClick={handleLogout}
                    variant="destructive" 
                    className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 border-0 shadow-lg transition-all duration-300"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Cerrar Sesión
                  </Button>
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-movieBlue mx-auto mb-4"></div>
                <p className="text-white/60 text-lg">Cargando perfil...</p>
              </div>
            </div>
          )}
        </div>
      </main>
      
      <BottomNav 
        activeTab="profile"
        onChangeTab={handleChangeTab}
        onOpenSearch={handleOpenSearch}
      />

      <SearchOverlay 
        isOpen={isSearchOpen}
        onClose={handleCloseSearch}
        allMovies={[]}
      />
    </div>
  );
};

export default ProfilePage;
