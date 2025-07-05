"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import Header from "../components/Header"
import HeroSection from "../components/HeroSection"
import ContentCarousel from "../components/ContentCarousel"
import ContinueWatching from "../components/ContinueWatching"
import BottomNav from "../components/BottomNav"
import SearchOverlay from "../components/SearchOverlay"
import ResponsiveNav from "../components/ResponsiveNav"

const Index = () => {
  const [activeTab, setActiveTab] = useState("home")
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  // Fetch featured content for hero section
  const { data: featuredContent } = useQuery({
    queryKey: ["featured-content"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("movies")
        .select(`
          *,
          categories:category_id(id, name),
          subcategories:subcategory_id(id, name)
        `)
        .eq("featured", true)
        .limit(5)

      if (error) {
        console.error("Error fetching featured content:", error)
        return []
      }

      return data || []
    },
  })

  // Fetch movies by category
  const { data: actionMovies = [] } = useQuery({
    queryKey: ["action-movies"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("movies")
        .select(`
          *,
          categories:category_id(id, name),
          subcategories:subcategory_id(id, name)
        `)
        .eq("categories.name", "Acción")
        .limit(12)

      if (error) {
        console.error("Error fetching action movies:", error)
        return []
      }

      return (
        data?.map((movie) => ({
          id: movie.id,
          title: movie.title,
          image: movie.image_url,
          rating: movie.rating || 0,
          duration: movie.duration || "N/A",
          subcategory: movie.subcategories?.name || null,
          category: movie.categories?.name || null,
        })) || []
      )
    },
  })

  const { data: comedyMovies = [] } = useQuery({
    queryKey: ["comedy-movies"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("movies")
        .select(`
          *,
          categories:category_id(id, name),
          subcategories:subcategory_id(id, name)
        `)
        .eq("categories.name", "Comedia")
        .limit(12)

      if (error) {
        console.error("Error fetching comedy movies:", error)
        return []
      }

      return (
        data?.map((movie) => ({
          id: movie.id,
          title: movie.title,
          image: movie.image_url,
          rating: movie.rating || 0,
          duration: movie.duration || "N/A",
          subcategory: movie.subcategories?.name || null,
          category: movie.categories?.name || null,
        })) || []
      )
    },
  })

  const { data: dramaMovies = [] } = useQuery({
    queryKey: ["drama-movies"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("movies")
        .select(`
          *,
          categories:category_id(id, name),
          subcategories:subcategory_id(id, name)
        `)
        .eq("categories.name", "Drama")
        .limit(12)

      if (error) {
        console.error("Error fetching drama movies:", error)
        return []
      }

      return (
        data?.map((movie) => ({
          id: movie.id,
          title: movie.title,
          image: movie.image_url,
          rating: movie.rating || 0,
          duration: movie.duration || "N/A",
          subcategory: movie.subcategories?.name || null,
          category: movie.categories?.name || null,
        })) || []
      )
    },
  })

  const { data: seriesContent = [] } = useQuery({
    queryKey: ["series-content"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("movies")
        .select(`
          *,
          categories:category_id(id, name),
          subcategories:subcategory_id(id, name)
        `)
        .eq("type", "series")
        .limit(12)

      if (error) {
        console.error("Error fetching series:", error)
        return []
      }

      return (
        data?.map((movie) => ({
          id: movie.id,
          title: movie.title,
          image: movie.image_url,
          rating: movie.rating || 0,
          duration: movie.duration || "N/A",
          subcategory: movie.subcategories?.name || null,
          category: movie.categories?.name || null,
        })) || []
      )
    },
  })

  const { data: recentMovies = [] } = useQuery({
    queryKey: ["recent-movies"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("movies")
        .select(`
          *,
          categories:category_id(id, name),
          subcategories:subcategory_id(id, name)
        `)
        .order("created_at", { ascending: false })
        .limit(12)

      if (error) {
        console.error("Error fetching recent movies:", error)
        return []
      }

      return (
        data?.map((movie) => ({
          id: movie.id,
          title: movie.title,
          image: movie.image_url,
          rating: movie.rating || 0,
          duration: movie.duration || "N/A",
          subcategory: movie.subcategories?.name || null,
          category: movie.categories?.name || null,
        })) || []
      )
    },
  })

  const handleOpenSearch = () => {
    setIsSearchOpen(true)
  }

  const handleCloseSearch = () => {
    setIsSearchOpen(false)
  }

  return (
    <div className="unified-bg">
      {/* Desktop Navigation */}
      <div className="hidden lg:block">
        <ResponsiveNav activeTab={activeTab} onChangeTab={setActiveTab} onOpenSearch={handleOpenSearch} />
      </div>

      {/* Main Content */}
      <div className="lg:ml-64">
        {/* Header */}
        <div className="responsive-container">
          <Header />
        </div>

        {/* Hero Section */}
        <div className="responsive-container responsive-spacing">
          <HeroSection featuredContent={featuredContent || []} />
        </div>

        {/* Continue Watching Section */}
        <div className="responsive-container">
          <ContinueWatching />
        </div>

        {/* Content Sections */}
        <div className="responsive-container space-y-6 sm:space-y-8 lg:space-y-10">
          {recentMovies.length > 0 && (
            <ContentCarousel title="Agregado Recientemente" movies={recentMovies} showViewMore={true} />
          )}

          {actionMovies.length > 0 && (
            <ContentCarousel title="Películas de Acción" movies={actionMovies} showViewMore={true} />
          )}

          {seriesContent.length > 0 && (
            <ContentCarousel title="Series Populares" movies={seriesContent} showViewMore={true} />
          )}

          {comedyMovies.length > 0 && <ContentCarousel title="Comedias" movies={comedyMovies} showViewMore={true} />}

          {dramaMovies.length > 0 && <ContentCarousel title="Dramas" movies={dramaMovies} showViewMore={true} />}
        </div>

        {/* Bottom spacing for mobile navigation */}
        <div className="h-20 sm:h-24 lg:hidden"></div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden">
        <BottomNav activeTab={activeTab} onChangeTab={setActiveTab} onOpenSearch={handleOpenSearch} />
      </div>

      {/* Search Overlay */}
      <SearchOverlay isOpen={isSearchOpen} onClose={handleCloseSearch} />
    </div>
  )
}

export default Index
