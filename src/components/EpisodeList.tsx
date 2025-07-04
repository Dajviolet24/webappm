
import React from 'react';
import { Play, Clock } from 'lucide-react';

interface Episode {
  id: string;
  title: string;
  image: string;
  duration: string;
  episodeNumber: number;
  synopsis?: string;
}

interface EpisodeListProps {
  episodes: Episode[];
  selectedEpisode: Episode | null;
  onEpisodeSelect: (episode: Episode) => void;
}

const EpisodeList: React.FC<EpisodeListProps> = ({
  episodes,
  selectedEpisode,
  onEpisodeSelect,
}) => {
  return (
    <div className="space-y-3">
      {episodes.map((episode) => (
        <div
          key={episode.id}
          className={`flex gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
            selectedEpisode?.id === episode.id
              ? 'bg-movieBlue/20 border border-movieBlue/50'
              : 'bg-white/5 hover:bg-white/10'
          }`}
          onClick={() => onEpisodeSelect(episode)}
        >
          <div className="relative flex-shrink-0">
            <img
              src={episode.image}
              alt={episode.title}
              className="w-24 h-16 object-cover rounded"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded">
              <Play className="w-6 h-6 text-white" />
            </div>
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-1">
              <h4 className="font-medium text-white text-sm truncate">
                {episode.episodeNumber}. {episode.title}
              </h4>
              <div className="flex items-center text-xs text-white/60 ml-2">
                <Clock className="w-3 h-3 mr-1" />
                {episode.duration}
              </div>
            </div>
            {episode.synopsis && (
              <p className="text-xs text-white/70 line-clamp-2">
                {episode.synopsis}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default EpisodeList;
