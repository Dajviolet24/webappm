
import { LucideIcon } from 'lucide-react';

export interface Movie {
  id: string;
  title: string;
  image: string;
  rating: number;
  duration: string;
  category?: string[];
  year?: number;
  synopsis?: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
}

export interface Episode {
  id: string;
  title: string;
  image: string;
  duration: string;
  synopsis?: string;
  seasonNumber: number;
  episodeNumber: number;
}
