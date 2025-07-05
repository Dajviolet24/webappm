
import { Film, Tv, Star, Radio, Rss } from 'lucide-react';
import { Movie, Category } from '../types/movie';
import React from 'react';

// Mock data for movies and categories
export const moviesData: Movie[] = [
  {
    id: '1',
    title: 'The Tomorrow War',
    image: 'https://images.unsplash.com/photo-1574267432553-4b4628081c31?auto=format&fit=crop&q=80&w=3431&ixlib=rb-4.0.3',
    rating: 6.6,
    duration: '138 min',
    category: ['action', 'sci-fi', 'movies'],
    year: 2021,
    synopsis: 'A family man is drafted to fight in a future war where the fate of humanity relies on his ability to confront the past.'
  },
  {
    id: '2',
    title: 'Kung Fu Panda 4',
    image: 'https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?auto=format&fit=crop&q=80&w=3270&ixlib=rb-4.0.3',
    rating: 9.5,
    duration: '123 min',
    category: ['animation', 'comedy', 'movies'],
    year: 2023,
    synopsis: 'Po is called upon to become the spiritual leader of the Valley of Peace, but needs to find and train a new Dragon Warrior before he can assume his new position.'
  },
  {
    id: '3',
    title: 'Stranger Things',
    image: 'https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?auto=format&fit=crop&q=80&w=3270&ixlib=rb-4.0.3',
    rating: 8.7,
    duration: '51 min',
    category: ['series', 'sci-fi'],
    year: 2016,
    synopsis: 'When a young boy disappears, his mother, a police chief, and his friends must confront terrifying supernatural forces in order to get him back.'
  },
  {
    id: '4',
    title: 'Tenet',
    image: 'https://images.unsplash.com/photo-1645861325371-1158e67e0a93?auto=format&fit=crop&q=80&w=3546&ixlib=rb-4.0.3',
    rating: 7.8,
    duration: '150 min',
    category: ['action', 'sci-fi', 'movies'],
    year: 2020,
    synopsis: 'Armed with only one word, Tenet, and fighting for the survival of the entire world, a Protagonist journeys through a twilight world of international espionage on a mission that will unfold in something beyond real time.'
  },
  {
    id: '5',
    title: 'Dune',
    image: 'https://images.unsplash.com/photo-1617774539145-03446dd5ce0b?auto=format&fit=crop&q=80&w=3270&ixlib=rb-4.0.3',
    rating: 8.0,
    duration: '155 min',
    category: ['sci-fi', 'adventure', 'movies'],
    year: 2021,
    synopsis: 'Feature adaptation of Frank Herbert\'s science fiction novel, about the son of a noble family entrusted with the protection of the most valuable asset and most vital element in the galaxy.'
  },
  {
    id: '6',
    title: 'Avatar: The Way of Water',
    image: 'https://images.unsplash.com/photo-1655311909271-6c8d52e92a8d?auto=format&fit=crop&q=80&w=3270&ixlib=rb-4.0.3',
    rating: 8.5,
    duration: '192 min',
    category: ['sci-fi', 'adventure', 'movies'],
    year: 2022,
    synopsis: 'Jake Sully lives with his newfound family formed on the extrasolar moon Pandora. Once a familiar threat returns to finish what was previously started, Jake must work with Neytiri and the army of the Na\'vi race to protect their home.'
  },
  {
    id: '7',
    title: 'The Office',
    image: 'https://images.unsplash.com/photo-1593784991095-a205069470b6?auto=format&fit=crop&q=80&w=3270&ixlib=rb-4.0.3',
    rating: 9.2,
    duration: '22 min',
    category: ['series', 'comedy'],
    year: 2005,
    synopsis: 'A mockumentary on a group of typical office workers, where the workday consists of ego clashes, inappropriate behavior, and tedium.'
  },
  {
    id: '8',
    title: 'Joker',
    image: 'https://images.unsplash.com/photo-1559578633-2c70043af231?auto=format&fit=crop&q=80&w=3270&ixlib=rb-4.0.3',
    rating: 8.4,
    duration: '122 min',
    category: ['drama', 'thriller', 'movies'],
    year: 2019,
    synopsis: 'In Gotham City, mentally troubled comedian Arthur Fleck is disregarded and mistreated by society. He then embarks on a downward spiral of revolution and bloody crime. This path brings him face-to-face with his alter-ego: the Joker.'
  },
  {
    id: '9',
    title: 'Your Name',
    image: 'https://images.unsplash.com/photo-1553095066-5014bc7b7f2d?auto=format&fit=crop&q=80&w=3271&ixlib=rb-4.0.3',
    rating: 8.9,
    duration: '106 min',
    category: ['anime', 'romance', 'movies'],
    year: 2016,
    synopsis: 'Two strangers find themselves linked in a bizarre way. When a connection forms, will distance be the only thing to keep them apart?'
  },
  {
    id: '10',
    title: 'Attack on Titan',
    image: 'https://images.unsplash.com/photo-1578632292335-df3abbb0d586?auto=format&fit=crop&q=80&w=3270&ixlib=rb-4.0.3',
    rating: 9.0,
    duration: '24 min',
    category: ['anime', 'action', 'series'],
    year: 2013,
    synopsis: 'After his hometown is destroyed and his mother is killed, young Eren Yeager vows to cleanse the earth of the giant humanoid Titans that have brought humanity to the brink of extinction.'
  },
  {
    id: '11',
    title: 'Breaking Bad',
    image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&q=80&w=3270&ixlib=rb-4.0.3',
    rating: 9.5,
    duration: '49 min',
    category: ['drama', 'crime', 'series'],
    year: 2008,
    synopsis: 'A high school chemistry teacher diagnosed with inoperable lung cancer turns to manufacturing and selling methamphetamine in order to secure his family\'s future.'
  },
  {
    id: '12',
    title: 'Inception',
    image: 'https://images.unsplash.com/photo-1533342867-28e979780e04?auto=format&fit=crop&q=80&w=3270&ixlib=rb-4.0.3',
    rating: 8.8,
    duration: '148 min',
    category: ['sci-fi', 'action', 'movies'],
    year: 2010,
    synopsis: 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.'
  }
];

// Create icon getter functions instead of using JSX directly
export const getIconComponent = (iconName: string) => {
  switch (iconName) {
    case 'Star':
      return Star;
    case 'Film':
      return Film;
    case 'Tv':
      return Tv;
    case 'Radio':
      return Radio;
    case 'Rss':
      return Rss;
    default:
      return Star;
  }
};

export const categoriesData: Category[] = [
  { id: 'all', name: 'Todo', icon: 'Star' },
  { id: 'movies', name: 'Películas', icon: 'Film' },
  { id: 'series', name: 'Series', icon: 'Tv' },
  { id: 'anime', name: 'Anime', icon: 'Star' },
  { id: 'broadcasts', name: 'Emisiones', icon: 'Radio' },
  { id: 'live', name: 'TV en vivo', icon: 'Rss' },
];

export const featuredContent = {
  id: 'stranger-things',
  title: 'Stranger Things',
  image: '/lovable-uploads/53290d9c-1830-46cb-9d8f-1f791bf18636.png',
  rating: 8.7,
  duration: '51 mins',
  ageRating: 'TV-14',
};

// Helper function to get movies by category
export const getMoviesByCategory = (category: string) => {
  if (category === 'all') return moviesData;
  return moviesData.filter(movie => movie.category?.includes(category));
};

// Helper to get new releases (movies from the current or last year)
export const getNewReleases = () => {
  const currentYear = new Date().getFullYear();
  return moviesData.filter(movie => 
    movie.year === currentYear || movie.year === (currentYear - 1)
  ).slice(0, 10);
};

// Helper to get movies by type with limit
export const getMoviesByType = (type: string, limit: number = 10) => {
  return moviesData
    .filter(movie => movie.category?.includes(type))
    .slice(0, limit);
};

export const getPopularMovies = () => {
  return moviesData
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 10);
};

export const getRecommendedMovies = () => {
  return moviesData
    .sort(() => Math.random() - 0.5)
    .slice(0, 10);
};

// New helper functions
export const getMovieById = (id: string) => {
  return moviesData.find(movie => movie.id === id);
};

export const getSimilarMovies = (category: string) => {
  const similar = moviesData.filter(movie => 
    movie.category?.includes(category)
  );
  return similar.slice(0, 6);
};

export const getContentForTab = (tab: string) => {
  switch (tab) {
    case 'home':
      return moviesData;
    case 'movies':
      return getMoviesByType('movies');
    case 'series':
      return getMoviesByType('series');
    case 'my-list':
      // Mock data for "My List" - in a real app, this would be user-specific
      return moviesData.filter((_, index) => index % 3 === 0).slice(0, 6);
    default:
      return [];
  }
};
