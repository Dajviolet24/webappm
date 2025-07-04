
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Search, User, LogOut, Settings } from 'lucide-react';

interface HeaderProps {
  onOpenSearch: () => void;
  onOpenMenu: () => void;
}

const Header: React.FC<HeaderProps> = ({ onOpenSearch, onOpenMenu }) => {
  const { user, signOut } = useAuth();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-black/80 to-transparent p-4">
      <div className="flex justify-between items-center max-w-7xl mx-auto">
        <div className="flex items-center">
          <Link to="/" className="flex items-center gap-3">
            <img 
              src="https://i.ibb.co/0pGnjZVz/20250701-143127.png" 
              alt="Astronauta TV Logo" 
              className="h-10 w-auto sm:h-12 md:h-14 object-contain"
            />
          </Link>
        </div>
        
        <div className="flex items-center gap-2">
          <button 
            onClick={onOpenSearch}
            className="p-2 rounded-full hover:bg-white/10 transition"
          >
            <Search className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
          </button>
          
          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 sm:h-10 sm:w-10 rounded-full">
                  <Avatar className="h-8 w-8 sm:h-10 sm:w-10">
                    <AvatarFallback className="bg-movieBlue text-xs sm:text-sm">
                      {user.email?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end">
                <DropdownMenuItem disabled>
                  <User className="mr-2 h-4 w-4" />
                  <span className="truncate text-sm">{user.email}</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/admin">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Panel de Administración</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => signOut()}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Cerrar Sesión</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
