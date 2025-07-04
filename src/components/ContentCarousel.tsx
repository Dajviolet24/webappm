
import React from 'react';
import { ChevronRight } from 'lucide-react';
import { Movie } from '../types/movie';
import MovieCard from './MovieCard';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface ContentCarouselProps {
  title: string;
  movies: Movie[];
  showViewMore?: boolean;
  onViewMoreClick?: () => void;
  category?: string;
}

const ContentCarousel: React.FC<ContentCarouselProps> = ({
  title,
  movies,
  showViewMore = true,
  onViewMoreClick,
  category,
}) => {
  return (
    <section className="px-2 sm:px-4 my-4 sm:my-6">
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <h2 className="text-base sm:text-lg lg:text-xl font-bold text-white">{title}</h2>
        {showViewMore && (
          <button 
            className="text-movieBlue flex items-center text-xs sm:text-sm font-medium hover:text-blue-400 transition-colors"
            onClick={onViewMoreClick}
          >
            Ver más <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 ml-0.5" />
          </button>
        )}
      </div>
      
      <Carousel 
        className="w-full"
        opts={{
          align: "start",
          dragFree: true,
        }}
      >
        <CarouselContent className="-ml-1 sm:-ml-2 md:-ml-4">
          {movies.map((movie) => (
            <CarouselItem 
              key={movie.id} 
              className="pl-1 sm:pl-2 md:pl-4 basis-1/3 sm:basis-1/4 md:basis-1/5 lg:basis-1/6 xl:basis-1/7"
            >
              <MovieCard movie={movie} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="hidden lg:block">
          <CarouselPrevious className="left-2 h-8 w-8 bg-black/50 border-white/20 hover:bg-black/70" />
          <CarouselNext className="right-2 h-8 w-8 bg-black/50 border-white/20 hover:bg-black/70" />
        </div>
      </Carousel>
    </section>
  );
};

export default ContentCarousel;
