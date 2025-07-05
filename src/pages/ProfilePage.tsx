"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { User, Settings, Heart, Clock, LogOut, Edit, Camera, Star, Film } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import BottomNav from "../components/BottomNav"
import SearchOverlay from "../components/SearchOverlay"
import ResponsiveNav from "../components/ResponsiveNav"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState("profile")
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [userData, setUserData] = useState<any>(null)
  const navigate = useNavigate()

  useEffect(() => {
    const storedUserData = localStorage.getItem("userData")
    if (storedUserData) {
      setUserData(JSON.parse(storedUserData))
    }
  }, [])

  // Fetch user's watch progress
  const { data: watchProgress = [] } = useQuery({
    queryKey: ["user-watch-progress", userData?.id],
    queryFn: async () => {
      if (!userData?.id) return []

      const { data, error } = await supabase
        .from("watch_progress")
        .select(`
          *,
          movies:movie_id(
            id,
            title,
            image_url,
            type,
            duration
          ),
          episodes:episode_id(
            id,
            title,
            episode_number,
            season_number
          )
        `)
        .eq("user_id", userData.id)
        .order("last_watched_at", { ascending: false })
        .limit(10)

      if (error) {
        console.error("Error fetching watch progress:", error)
        return []
      }

      return data || []
    },
    enabled: !!userData?.id,
  })

  // Fetch user statistics
  const { data: userStats } = useQuery({
    queryKey: ["user-stats", userData?.id],
    queryFn: async () => {
      if (!userData?.id) return null

      const { data: totalWatched, error: watchedError } = await supabase
        .from("watch_progress")
        .select("id")
        .eq("user_id", userData.id)

      const { data: completedContent, error: completedError } = await supabase
        .from("watch_progress")
        .select("id")
        .eq("user_id", userData.id)
        .eq("completed", true)

      if (watchedError || completedError) {
        console.error("Error fetching user stats:", watchedError || completedError)
        return null
      }

      return {
        totalWatched: totalWatched?.length || 0,
        completedContent: completedContent?.length || 0,
        hoursWatched: Math.floor((totalWatched?.length || 0) * 1.5), // Estimación
      }
    },
    enabled: !!userData?.id,
  })

  const handleLogout = () => {
    localStorage.removeItem("userData")
    localStorage.removeItem("accessKey")
    navigate("/auth")
  }

  const handleOpenSearch = () => {
    setIsSearchOpen(true)
  }

  const handleCloseSearch = () => {
    setIsSearchOpen(false)
  }

  if (!userData) {
    return (
      <div className="unified-bg flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="responsive-subtitle text-white mb-4">Cargando perfil...</h2>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-movieBlue mx-auto"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="unified-bg">
      {/* Desktop Navigation */}
      <div className="hidden lg:block">
        <ResponsiveNav activeTab={activeTab} onChangeTab={setActiveTab} onOpenSearch={handleOpenSearch} />
      </div>

      {/* Main Content */}
      <div className="lg:ml-64">
        <div className="responsive-container responsive-spacing">
          {/* Profile Header */}
          <div className="glass-card p-6 sm:p-8 mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
              <div className="relative">
                <Avatar className="w-20 h-20 sm:w-24 sm:h-24 border-4 border-movieBlue/30">
                  <AvatarImage src={userData.avatar_url || "/placeholder.svg"} alt={userData.username} />
                  <AvatarFallback className="bg-movieBlue text-white text-xl sm:text-2xl font-bold">
                    {userData.username?.charAt(0).toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                <button className="absolute -bottom-2 -right-2 bg-movieBlue hover:bg-movieBlue/80 text-white p-2 rounded-full transition-colors">
                  <Camera className="w-4 h-4" />
                </button>
              </div>

              <div className="flex-1 text-center sm:text-left">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
                  <h1 className="responsive-subtitle text-white">{userData.username}</h1>
                  <Badge
                    variant="secondary"
                    className="bg-movieBlue/20 text-movieBlue border-movieBlue/30 w-fit mx-auto sm:mx-0"
                  >
                    Usuario Premium
                  </Badge>
                </div>
                <p className="responsive-text text-white/70 mb-4">
                  Miembro desde{" "}
                  {new Date(userData.created_at).toLocaleDateString("es-ES", {
                    year: "numeric",
                    month: "long",
                  })}
                </p>
                <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 bg-transparent">
                  <Edit className="w-4 h-4 mr-2" />
                  Editar Perfil
                </Button>
              </div>
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
            <Card className="glass-card border-white/10">
              <CardHeader className="pb-3">
                <CardTitle className="text-white flex items-center gap-2 text-sm sm:text-base">
                  <Film className="w-5 h-5 text-movieBlue" />
                  Contenido Visto
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl sm:text-3xl font-bold text-white mb-1">{userStats?.totalWatched || 0}</p>
                <p className="text-xs sm:text-sm text-white/60">títulos en total</p>
              </CardContent>
            </Card>

            <Card className="glass-card border-white/10">
              <CardHeader className="pb-3">
                <CardTitle className="text-white flex items-center gap-2 text-sm sm:text-base">
                  <Clock className="w-5 h-5 text-movieBlue" />
                  Horas Vistas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl sm:text-3xl font-bold text-white mb-1">{userStats?.hoursWatched || 0}</p>
                <p className="text-xs sm:text-sm text-white/60">horas de entretenimiento</p>
              </CardContent>
            </Card>

            <Card className="glass-card border-white/10 sm:col-span-2 lg:col-span-1">
              <CardHeader className="pb-3">
                <CardTitle className="text-white flex items-center gap-2 text-sm sm:text-base">
                  <Star className="w-5 h-5 text-movieBlue" />
                  Completados
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl sm:text-3xl font-bold text-white mb-1">{userStats?.completedContent || 0}</p>
                <p className="text-xs sm:text-sm text-white/60">títulos terminados</p>
              </CardContent>
            </Card>
          </div>

          {/* Continue Watching */}
          {watchProgress.length > 0 && (
            <Card className="glass-card border-white/10 mb-6 sm:mb-8">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Clock className="w-5 h-5 text-movieBlue" />
                  Continuar Viendo
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {watchProgress.slice(0, 6).map((progress: any) => (
                    <div
                      key={progress.id}
                      className="bg-white/5 rounded-lg p-4 hover:bg-white/10 transition-colors cursor-pointer"
                      onClick={() =>
                        navigate(
                          `/movie/${progress.movie_id}${progress.episode_id ? `?episode=${progress.episode_id}` : ""}`,
                        )
                      }
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={progress.movies?.image_url || "/placeholder.svg?height=60&width=40"}
                          alt={progress.movies?.title}
                          className="w-10 h-15 object-cover rounded"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-white font-medium text-sm truncate">{progress.movies?.title}</h4>
                          {progress.episodes && (
                            <p className="text-white/60 text-xs">
                              T{progress.episodes.season_number}E{progress.episodes.episode_number}:{" "}
                              {progress.episodes.title}
                            </p>
                          )}
                          <div className="w-full bg-white/20 rounded-full h-1.5 mt-2">
                            <div
                              className="bg-movieBlue h-1.5 rounded-full"
                              style={{
                                width: `${Math.min((progress.progress_seconds / progress.total_duration_seconds) * 100, 100)}%`,
                              }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Settings and Actions */}
          <Card className="glass-card border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Settings className="w-5 h-5 text-movieBlue" />
                Configuración
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button variant="ghost" className="w-full justify-start text-white hover:bg-white/10 p-3 h-auto">
                <User className="w-5 h-5 mr-3 text-movieBlue" />
                <div className="text-left">
                  <p className="font-medium">Información Personal</p>
                  <p className="text-sm text-white/60">Actualiza tu información de perfil</p>
                </div>
              </Button>

              <Button variant="ghost" className="w-full justify-start text-white hover:bg-white/10 p-3 h-auto">
                <Heart className="w-5 h-5 mr-3 text-movieBlue" />
                <div className="text-left">
                  <p className="font-medium">Lista de Favoritos</p>
                  <p className="text-sm text-white/60">Gestiona tu contenido favorito</p>
                </div>
              </Button>

              <Button variant="ghost" className="w-full justify-start text-white hover:bg-white/10 p-3 h-auto">
                <Settings className="w-5 h-5 mr-3 text-movieBlue" />
                <div className="text-left">
                  <p className="font-medium">Preferencias</p>
                  <p className="text-sm text-white/60">Configura la aplicación a tu gusto</p>
                </div>
              </Button>

              <hr className="border-white/10" />

              <Button
                variant="ghost"
                className="w-full justify-start text-red-400 hover:bg-red-500/10 p-3 h-auto"
                onClick={handleLogout}
              >
                <LogOut className="w-5 h-5 mr-3" />
                <div className="text-left">
                  <p className="font-medium">Cerrar Sesión</p>
                  <p className="text-sm text-red-400/60">Salir de tu cuenta</p>
                </div>
              </Button>
            </CardContent>
          </Card>
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

export default ProfilePage
