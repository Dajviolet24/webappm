
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Film, User, AlertTriangle, Tag } from 'lucide-react';

const Dashboard = () => {
  const [stats, setStats] = useState({
    moviesCount: 0,
    seriesCount: 0,
    usersCount: 0,
    reportsCount: 0,
    categoriesCount: 0
  });
  
  const [contentByType, setContentByType] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        // Fetch movies count
        const { count: moviesCount } = await supabase
          .from('movies')
          .select('*', { count: 'exact', head: true })
          .eq('type', 'movie');
          
        // Fetch series count
        const { count: seriesCount } = await supabase
          .from('movies')
          .select('*', { count: 'exact', head: true })
          .eq('type', 'series');
          
        // Fetch users count
        const { count: usersCount } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true });
          
        // Fetch reports count
        const { count: reportsCount } = await supabase
          .from('error_reports')
          .select('*', { count: 'exact', head: true });
          
        // Fetch categories count
        const { count: categoriesCount } = await supabase
          .from('categories')
          .select('*', { count: 'exact', head: true });
          
        setStats({
          moviesCount: moviesCount || 0,
          seriesCount: seriesCount || 0,
          usersCount: usersCount || 0,
          reportsCount: reportsCount || 0,
          categoriesCount: categoriesCount || 0
        });
        
        // Fetch content by type for chart
        const { data: typeData } = await supabase
          .from('movies')
          .select('type, id')
          .in('type', ['movie', 'series', 'anime']);
        
        if (typeData) {
          const typeCounts = [
            { name: 'Movies', count: typeData.filter(item => item.type === 'movie').length },
            { name: 'Series', count: typeData.filter(item => item.type === 'series').length },
            { name: 'Anime', count: typeData.filter(item => item.type === 'anime').length },
          ];
          
          setContentByType(typeCounts);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);
  
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      
      {isLoading ? (
        <div className="flex justify-center p-10">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">Total Movies</CardTitle>
                <Film className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.moviesCount}</div>
                <p className="text-xs text-muted-foreground">Movies only</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">Total Series</CardTitle>
                <Film className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.seriesCount}</div>
                <p className="text-xs text-muted-foreground">Series and TV shows</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">Users</CardTitle>
                <User className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.usersCount}</div>
                <p className="text-xs text-muted-foreground">Total registered users</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">Error Reports</CardTitle>
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.reportsCount}</div>
                <p className="text-xs text-muted-foreground">Pending review</p>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Content by Type</CardTitle>
              </CardHeader>
              <CardContent className="pt-2">
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={contentByType}
                      margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" fill="#3b82f6" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center h-80">
                  <div className="text-center">
                    <Tag className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-2xl font-bold">{stats.categoriesCount}</h3>
                    <p className="text-muted-foreground">Total Categories</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
