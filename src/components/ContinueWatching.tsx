
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Play, Clock } from 'lucide-react';

interface ContinueWatchingProps {
  userId: string;
}

const ContinueWatching = ({ userId }: ContinueWatchingProps) => {
  const { data: watchProgress = [], isLoading } = useQuery({
    queryKey: ['watch-progress', userId],
    queryFn: async () => {
      console.log('Fetching watch progress for user:', userId);
      
      const { data, error } = await supabase
        .from('watch_progress')
        .select(`
          *,
          movies:movie_id(id, title, image_url, type, duration),
          episodes:episode_id(id, title, season_number, episode_number, duration)
        `)
        .eq('user_id', userId)
        .eq('completed', false)
        .gt('progress_seconds', 30) // Only show if watched more than 30 seconds
        .order('last_watched_at', { ascending: false })
        .limit(10);
      
      if (error) {
        console.error('Error fetching watch progress:', error);
        return [];
      }
      
      console.log('Watch progress data:', data);
      return data || [];
    },
    enabled: !!userId
  });

  const formatProgress = (progressSeconds: number, totalSeconds: number | null) => {
    if (!totalSeconds || totalSeconds === 0) return '0%';
    const percentage = Math.min(Math.round((progressSeconds / totalSeconds) * 100), 100);
    return `${percentage}%`;
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const getRemainingTime = (progressSeconds: number, totalSeconds: number | null) => {
    if (!totalSeconds) return '0m';
    const remaining = Math.max(totalSeconds - progressSeconds, 0);
    return formatTime(remaining);
  };

  const handleContinueWatching = (item: any) => {
    console.log('Continue watching clicked for:', item);
    
    const movieId = item.movies?.id;
    const episodeId = item.episodes?.id;
    
    if (episodeId) {
      // For series episodes
      window.location.href = `/movie/${movieId}?episode=${episodeId}&t=${item.progress_seconds}`;
    } else if (movieId) {
      // For movies
      window.location.href = `/movie/${movieId}?t=${item.progress_seconds}`;
    }
  };

  if (!userId || isLoading) {
    return (
      <div className="mb-8 px-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Continuar Viendo
          </h2>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex-shrink-0 w-32 sm:w-40 md:w-48 lg:w-56">
              <div className="bg-gray-800/50 animate-pulse rounded-lg aspect-[2/3] mb-2"></div>
              <div className="bg-gray-800/50 animate-pulse h-4 rounded mb-1"></div>
              <div className="bg-gray-800/50 animate-pulse h-3 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (watchProgress.length === 0) {
    return null;
  }

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4 px-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Clock className="w-5 h-5 text-movieBlue" />
          Continuar Viendo
        </h2>
      </div>
      
      <div className="flex gap-3 overflow-x-auto px-4 pb-4 snap-x hide-scrollbar">
        {watchProgress.map((item: any) => {
          const movie = item.movies;
          const episode = item.episodes;
          
          if (!movie) return null;
          
          return (
            <div key={item.id} className="flex-shrink-0 w-32 sm:w-40 md:w-48 lg:w-56 snap-start">
              <div 
                className="relative cursor-pointer group"
                onClick={() => handleContinueWatching(item)}
              >
                <div className="relative overflow-hidden rounded-lg aspect-[2/3] shadow-lg">
                  <img
                    src={movie.image_url || '/placeholder.svg'}
                    alt={movie.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/placeholder.svg';
                    }}
                  />
                  
                  {/* Progress Bar */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                    <div className="bg-gray-600 rounded-full h-1 mb-1">
                      <div 
                        className="bg-gradient-to-r from-movieBlue to-blue-500 rounded-full h-1 transition-all duration-300"
                        style={{ 
                          width: formatProgress(item.progress_seconds, item.total_duration_seconds)
                        }}
                      />
                    </div>
                    <div className="text-xs text-white/90 font-medium">
                      {getRemainingTime(item.progress_seconds, item.total_duration_seconds)} restante
                    </div>
                  </div>
                  
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="bg-gradient-to-r from-movieBlue to-blue-600 rounded-full p-3 shadow-xl transform group-hover:scale-110 transition-transform duration-300">
                      <Play className="w-6 h-6 text-white fill-current" />
                    </div>
                  </div>
                </div>
                
                <div className="mt-2 space-y-1">
                  <h3 className="text-sm font-medium text-white line-clamp-2 leading-tight">
                    {movie.title}
                  </h3>
                  
                  {episode && (
                    <p className="text-xs text-white/60">
                      T{episode.season_number}:E{episode.episode_number} - {episode.title}
                    </p>
                  )}
                  
                  <div className="flex items-center gap-1 text-xs text-movieBlue">
                    <Clock className="w-3 h-3" />
                    <span>{formatProgress(item.progress_seconds, item.total_duration_seconds)} visto</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ContinueWatching;
