
import React from 'react';
import { Home, Film, Tv, Search, User, Menu } from 'lucide-react';

interface ResponsiveNavProps {
  activeTab: string;
  onChangeTab: (tab: string) => void;
  onOpenSearch: () => void;
  className?: string;
}

const ResponsiveNav = ({ activeTab, onChangeTab, onOpenSearch, className = '' }: ResponsiveNavProps) => {
  const navItems = [
    { id: 'home', label: 'Inicio', icon: Home },
    { id: 'movies', label: 'Películas', icon: Film },
    { id: 'series', label: 'Series', icon: Tv },
    { id: 'search', label: 'Buscar', icon: Search },
    { id: 'profile', label: 'Perfil', icon: User },
  ];

  const handleTabClick = (tabId: string) => {
    if (tabId === 'search') {
      onOpenSearch();
    } else {
      onChangeTab(tabId);
    }
  };

  return (
    <nav className={`hidden lg:flex flex-col fixed left-0 top-0 h-full w-64 bg-gradient-to-b from-black/90 to-gray-900/90 backdrop-blur-xl border-r border-white/10 p-6 z-50 ${className}`}>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-2">Astronauta TV</h1>
        <p className="text-white/60 text-sm">Tu entretenimiento favorito</p>
      </div>
      
      <div className="flex-1 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => handleTabClick(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 text-left ${
                isActive
                  ? 'bg-gradient-to-r from-movieBlue to-blue-600 text-white shadow-lg'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-white/70'}`} />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
      
      <div className="pt-6 border-t border-white/10">
        <div className="text-xs text-white/50 text-center">
          © 2024 Astronauta TV
        </div>
      </div>
    </nav>
  );
};

export default ResponsiveNav;
