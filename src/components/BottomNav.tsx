
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Film, Tv, Search, User } from 'lucide-react';

interface BottomNavProps {
  activeTab: string;
  onChangeTab: (tab: string) => void;
  onOpenSearch: () => void;
}

const BottomNav = ({ activeTab, onChangeTab, onOpenSearch }: BottomNavProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleTabClick = (tab: string) => {
    onChangeTab(tab);
    
    switch (tab) {
      case 'home':
        navigate('/');
        break;
      case 'movies':
        navigate('/movies');
        break;
      case 'series':
        navigate('/series');
        break;
      case 'search':
        onOpenSearch();
        break;
      case 'profile':
        navigate('/profile');
        break;
    }
  };

  const getCurrentActiveTab = () => {
    if (location.pathname === '/') return 'home';
    if (location.pathname === '/movies') return 'movies';
    if (location.pathname === '/series') return 'series';
    if (location.pathname === '/profile') return 'profile';
    return activeTab;
  };

  const currentTab = getCurrentActiveTab();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-3">
      <div className="bg-black/20 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl mx-auto max-w-md">
        <div className="flex justify-around items-center py-2 px-1">
          <button
            onClick={() => handleTabClick('home')}
            className={`flex flex-col items-center py-3 px-3 rounded-2xl transition-all duration-300 ${
              currentTab === 'home' 
                ? 'text-movieBlue bg-white/15 shadow-lg' 
                : 'text-white/70 hover:text-white/90 hover:bg-white/5'
            }`}
          >
            <Home className="w-5 h-5 mb-1" />
            <span className="text-xs font-medium">Inicio</span>
          </button>
          
          <button
            onClick={() => handleTabClick('movies')}
            className={`flex flex-col items-center py-3 px-3 rounded-2xl transition-all duration-300 ${
              currentTab === 'movies' 
                ? 'text-movieBlue bg-white/15 shadow-lg' 
                : 'text-white/70 hover:text-white/90 hover:bg-white/5'
            }`}
          >
            <Film className="w-5 h-5 mb-1" />
            <span className="text-xs font-medium">Películas</span>
          </button>
          
          <button
            onClick={() => handleTabClick('series')}
            className={`flex flex-col items-center py-3 px-3 rounded-2xl transition-all duration-300 ${
              currentTab === 'series' 
                ? 'text-movieBlue bg-white/15 shadow-lg' 
                : 'text-white/70 hover:text-white/90 hover:bg-white/5'
            }`}
          >
            <Tv className="w-5 h-5 mb-1" />
            <span className="text-xs font-medium">Series</span>
          </button>
          
          <button
            onClick={() => handleTabClick('search')}
            className={`flex flex-col items-center py-3 px-3 rounded-2xl transition-all duration-300 ${
              currentTab === 'search' 
                ? 'text-movieBlue bg-white/15 shadow-lg' 
                : 'text-white/70 hover:text-white/90 hover:bg-white/5'
            }`}
          >
            <Search className="w-5 h-5 mb-1" />
            <span className="text-xs font-medium">Buscar</span>
          </button>
          
          <button
            onClick={() => handleTabClick('profile')}
            className={`flex flex-col items-center py-3 px-3 rounded-2xl transition-all duration-300 ${
              currentTab === 'profile' 
                ? 'text-movieBlue bg-white/15 shadow-lg' 
                : 'text-white/70 hover:text-white/90 hover:bg-white/5'
            }`}
          >
            <User className="w-5 h-5 mb-1" />
            <span className="text-xs font-medium">Cuenta</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default BottomNav;
