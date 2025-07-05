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

const SeriesPage = () => {
  const [activeTab, setActiveTab] = useState("series")
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

  // Fetch series based on selected category
  const { data: series = [], isLoading } = useQuery({
    queryKey: ["series", selectedCategory],
    queryFn: async () => {
      let query = supabase
        .from("movies")
        .select(`
          *,
          categories:category_id(id, name),
          subcategories:subcategory_id(id, name)
        `)
        .eq("type", "series")
        .order("created_at", { ascending: false })

      if (selectedCategory !== "all") {
        query = query.eq("category_id", selectedCategory)
      }

      const { data, error } = await query

      if (error) {
        console.error("Error fetching series:", error)
        return []
      }

      return (
        data?.map((serie) => ({
          id: serie.id,
          title: serie.title,
          image: serie.image_url,
          rating: serie.rating || 0,
          duration: serie.duration || "N/A",
          subcategory: serie.subcategories?.name || null,
          category: serie.categories?.name || null,
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
          <h1 className="responsive-title text-white mb-4 sm:mb-6">Series</h1>
          <p className="responsive-text text-white/70 mb-6 sm:mb-8">
            Explora nuestra colecci?n de series y temporadas completas
          </p>
        </div>

        {/* Category Navigation */}
        <div className="responsive-container mb-6 sm:mb-8">
          <CategoryNav
            categories={[{ id: "all", name: "Todas" }, ...categories.map((cat) => ({ id: cat.id, name: cat.name }))]}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />
        </div>

        {/* Series Grid */}
        <div className="responsive-container">
          <ContentSection
            movies={series}
            isLoading={isLoading}
            emptyMessage="No se encontraron series en esta categor?a"
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

export default SeriesPage
