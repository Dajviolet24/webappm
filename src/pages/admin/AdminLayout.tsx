
import React, { useEffect, useState } from 'react';
import { useNavigate, Outlet, Link } from 'react-router-dom';
import { 
  SidebarProvider, 
  Sidebar, 
  SidebarHeader, 
  SidebarContent, 
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem, 
  SidebarMenuButton,
  SidebarTrigger,
  SidebarRail,
  SidebarInset,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Film, Users, Flag, LogOut, Home, LayoutGrid, Tag, UserPlus } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

const AdminLayout = () => {
  const [adminUser, setAdminUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = () => {
      const isAuthenticated = localStorage.getItem('admin_authenticated');
      const userData = localStorage.getItem('admin_user');
      
      if (!isAuthenticated || !userData) {
        navigate('/admin');
        return;
      }
      
      try {
        setAdminUser(JSON.parse(userData));
      } catch (error) {
        navigate('/admin');
        return;
      }
      
      setIsLoading(false);
    };
    
    checkAuth();
  }, [navigate]);

  const handleSignOut = () => {
    localStorage.removeItem('admin_authenticated');
    localStorage.removeItem('admin_user');
    navigate('/admin');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-movieDark">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  if (!adminUser) {
    return null;
  }

  return (
    <div className="min-h-screen bg-movieDark">
      <SidebarProvider>
        <Sidebar variant="sidebar" collapsible="icon" className="bg-movieDark border-white/20">
          <SidebarHeader>
            <div className="flex items-center p-2">
              <Link to="/" className="flex items-center gap-2">
                <div className="text-xl font-bold text-white">Admin Panel</div>
              </Link>
              <div className="flex-1" />
              <SidebarTrigger className="text-white" />
            </div>
          </SidebarHeader>
          
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Dashboard">
                  <Link to="/adminserver48493989" className="text-white hover:bg-white/10">
                    <LayoutGrid />
                    <span>Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Movies & Series">
                  <Link to="/adminserver48493989/content" className="text-white hover:bg-white/10">
                    <Film />
                    <span>Content</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Categories">
                  <Link to="/adminserver48493989/categories" className="text-white hover:bg-white/10">
                    <Tag />
                    <span>Categories</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Users">
                  <Link to="/adminserver48493989/users" className="text-white hover:bg-white/10">
                    <Users />
                    <span>Users</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Reports">
                  <Link to="/adminserver48493989/reports" className="text-white hover:bg-white/10">
                    <Flag />
                    <span>Error Reports</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Invite Admin">
                  <Link to="/adminserver48493989/invite" className="text-white hover:bg-white/10">
                    <UserPlus />
                    <span>Invite Admin</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
          
          <SidebarFooter>
            <div className="px-3 py-2">
              <div className="flex items-center gap-3 mb-3">
                <Avatar>
                  <AvatarFallback className="bg-movieBlue text-white">
                    {adminUser?.username?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-white">{adminUser?.username}</span>
                  <span className="text-xs text-white/60">Admin</span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="w-full border-white/20 text-white hover:bg-white/10" asChild>
                  <Link to="/">
                    <Home className="mr-2 h-4 w-4" />
                    View Site
                  </Link>
                </Button>
                <Button variant="outline" size="sm" className="border-white/20 text-white hover:bg-white/10" onClick={handleSignOut}>
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </SidebarFooter>
          
          <SidebarRail />
        </Sidebar>
        
        <SidebarInset className="bg-movieDark">
          <div className="p-6">
            <Outlet />
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
};

export default AdminLayout;
