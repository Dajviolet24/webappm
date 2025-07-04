
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface SeasonSelectorProps {
  totalSeasons: number;
  selectedSeason: number;
  onSeasonChange: (season: number) => void;
}

const SeasonSelector: React.FC<SeasonSelectorProps> = ({
  totalSeasons,
  selectedSeason,
  onSeasonChange,
}) => {
  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-3 text-white">Episodes</h3>
      <Select value={selectedSeason.toString()} onValueChange={(value) => onSeasonChange(parseInt(value))}>
        <SelectTrigger className="w-full max-w-xs bg-movieDark border-white/20 text-white">
          <SelectValue placeholder="Select Season" />
        </SelectTrigger>
        <SelectContent className="bg-movieDark border-white/20">
          {Array.from({ length: totalSeasons }, (_, i) => i + 1).map((season) => (
            <SelectItem 
              key={season} 
              value={season.toString()}
              className="text-white hover:bg-white/10 focus:bg-white/10"
            >
              Season {season}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default SeasonSelector;
