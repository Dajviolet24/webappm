"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import Header from "../components/Header"
import CategoryNav from "../components/CategoryNav"
import ContentSection from "../components/ContentSection"
import BottomNav from "../components/BottomNav"
import SearchOverlay from "../components/SearchOverlay"
import ResponsiveNav from "../components/ResponsiveNav"

const MoviesPage = () => {
  const [activeTab, setActiveTab] = useState("movies")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  // Fetch categories
  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data, error } = await supabase.from("categories").select("*").order("name")

      if (error) {
        console.error("Error fetching categories:", error)
        return []
      }

      return data || []
    },
  })

  // Fetch movies based on selected category
  const { data: movies = [], isLoading } = useQuery({
    queryKey: ["movies", selectedCategory],
    queryFn: async () => {
      let query = supabase
        .from("movies")
        .select(`
          *,
          categories:category_id(id, name),
          subcategories:subcategory_id(id, name)
        `)
        .eq("type", "movie")
        .order("created_at", { ascending: false })

      if (selectedCategory !== "all") {
        query = query.eq("category_id", selectedCategory)
      }

      const { data, error } = await query

      if (error) {
        console.error("Error fetching movies:", error)
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

        {/* Page Title */}
        <div className="responsive-container responsive-spacing">
          <h1 className="responsive-title text-white mb-4 sm:mb-6">Películas</h1>
          <p className="responsive-text text-white/70 mb-6 sm:mb-8">Descubre nuestra colección completa de películas</p>
        </div>

        {/* Category Navigation */}
        <div className="responsive-container mb-6 sm:mb-8">
          <CategoryNav
            categories={[{ id: "all", name: "Todas" }, ...categories.map((cat) => ({ id: cat.id, name: cat.name }))]}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />
        </div>

        {/* Movies Grid */}
        <div className="responsive-container">
          <ContentSection
            movies={movies}
            isLoading={isLoading}
            emptyMessage="No se encontraron películas en esta categoría"
          />
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

export default MoviesPage
