"use client"

import { useState, useEffect, useRef } from "react"
import { useNavigate, useParams, useSearchParams } from "react-router-dom"
import { ChevronLeft, Star, Calendar, Clock, Info } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import ContentCarousel from "../components/ContentCarousel"
import BottomNav from "../components/BottomNav"
import SeasonSelector from "../components/SeasonSelector"
import EpisodeList from "../components/EpisodeList"

interface Episode {
  id: string
  title: string
  image: string
  duration: string
  episodeNumber: number
  synopsis?: string
  video_url: string
  season_number: number
  episode_number: number
}

const MovieDetail = () => {
  const { id } = useParams<{ id: string }>()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState("home")
  const [selectedSeason, setSelectedSeason] = useState(1)
  const [selectedEpisode, setSelectedEpisode] = useState<Episode | null>(null)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  // Get episode and time from URL params
  const episodeIdFromUrl = searchParams.get("episode")
  const timeFromUrl = searchParams.get("t")

  const {
    data: movie,
    isLoading: movieLoading,
    error: movieError,
  } = useQuery({
    queryKey: ["movie", id],
    queryFn: async () => {
      if (!id) throw new Error("No movie ID provided")

      const { data, error } = await supabase
        .from("movies")
        .select(`
          *,
          categories:category_id(id, name),
          subcategories:subcategory_id(id, name)
        `)
        .eq("id", id)
        .maybeSingle()

      if (error) {
        console.error("Error fetching movie:", error)
        throw error
      }

      return data
    },
    enabled: !!id,
  })

  const { data: episodes = [] } = useQuery({
    queryKey: ["episodes", id, selectedSeason],
    queryFn: async () => {
      if (!id || !movie || movie.type !== "series") return []

      const { data, error } = await supabase
        .from("episodes")
        .select("*")
        .eq("movie_id", id)
        .eq("season_number", selectedSeason)
        .order("episode_number")

      if (error) {
        console.error("Error fetching episodes:", error)
        throw error
      }

      return data || []
    },
    enabled: !!id && !!movie && movie.type === "series",
  })

  const { data: similarMovies = [] } = useQuery({
    queryKey: ["similar-movies", movie?.subcategory_id, movie?.category_id],
    queryFn: async () => {
      if (!movie) return []

      let similarData = []

      if (movie.subcategory_id) {
        const { data: subcategoryData, error: subcategoryError } = await supabase
          .from("movies")
          .select(`
            *,
            categories:category_id(id, name),
            subcategories:subcategory_id(id, name)
          `)
          .eq("subcategory_id", movie.subcategory_id)
          .neq("id", id)
          .limit(12)

        if (!subcategoryError && subcategoryData) {
          similarData = subcategoryData
        }
      }

      if (similarData.length < 8 && movie.category_id) {
        const { data: categoryData, error: categoryError } = await supabase
          .from("movies")
          .select(`
            *,
            categories:category_id(id, name),
            subcategories:subcategory_id(id, name)
          `)
          .eq("category_id", movie.category_id)
          .neq("id", id)
          .limit(12 - similarData.length)

        if (!categoryError && categoryData) {
          const existingIds = new Set(similarData.map((item) => item.id))
          const additionalContent = categoryData.filter((item) => !existingIds.has(item.id))
          similarData = [...similarData, ...additionalContent]
        }
      }

      return similarData.map((movie: any) => ({
        id: movie.id,
        title: movie.title,
        image: movie.image_url,
        rating: movie.rating || 0,
        duration: movie.duration || "N/A",
        subcategory: movie.subcategories?.name || null,
        category: movie.categories?.name || null,
      }))
    },
    enabled: !!movie,
  })

  const isSeriesContent = movie?.type === "series"

  const formattedEpisodes: Episode[] = episodes.map((ep: any) => ({
    id: ep.id,
    title: ep.title,
    image: ep.image || movie?.image_url || "",
    duration: ep.duration || "45 min",
    episodeNumber: ep.episode_number,
    synopsis: ep.synopsis,
    video_url: ep.video_url,
    season_number: ep.season_number,
    episode_number: ep.episode_number,
  }))

  // Handle episode selection from URL or default
  useEffect(() => {
    if (isSeriesContent && formattedEpisodes.length > 0) {
      if (episodeIdFromUrl) {
        const episodeFromUrl = formattedEpisodes.find((ep) => ep.id === episodeIdFromUrl)
        if (episodeFromUrl) {
          setSelectedEpisode(episodeFromUrl)
          setSelectedSeason(episodeFromUrl.season_number)
        } else {
          setSelectedEpisode(formattedEpisodes[0])
        }
      } else {
        setSelectedEpisode(formattedEpisodes[0])
      }
    }
  }, [selectedSeason, isSeriesContent, episodeIdFromUrl]) // Removed formattedEpisodes.length from dependencies

  // Create video URL with timestamp
  const createVideoUrl = (baseUrl: string, timestamp?: string) => {
    if (!timestamp) return baseUrl

    // Add timestamp parameter to the URL
    const separator = baseUrl.includes("?") ? "&" : "?"
    return `${baseUrl}${separator}t=${timestamp}`
  }

  const currentVideoUrl =
    isSeriesContent && selectedEpisode
      ? createVideoUrl(selectedEpisode.video_url, timeFromUrl || undefined)
      : createVideoUrl(movie?.video_url || "https://www.youtube.com/embed/dQw4w9WgXcQ", timeFromUrl || undefined)

  const currentTitle =
    isSeriesContent && selectedEpisode
      ? `${movie?.title} - T${selectedSeason}E${selectedEpisode.episodeNumber}: ${selectedEpisode.title}`
      : movie?.title || ""

  // Track watch progress when user watches content
  const trackWatchProgress = async (progressSeconds: number) => {
    const userData = localStorage.getItem("userData")
    if (!userData || !movie) return

    try {
      const user = JSON.parse(userData)

      const watchData = {
        user_id: user.id,
        movie_id: movie.id,
        episode_id: selectedEpisode?.id || null,
        progress_seconds: progressSeconds,
        total_duration_seconds: isSeriesContent ? 2700 : 7200, // 45min for episodes, 2h for movies
        last_watched_at: new Date().toISOString(),
        completed: false,
      }

      // Upsert watch progress
      const { error } = await supabase.from("watch_progress").upsert(watchData, {
        onConflict: "user_id,movie_id,episode_id",
      })

      if (error) {
        console.error("Error tracking watch progress:", error)
      }
    } catch (error) {
      console.error("Error parsing user data:", error)
    }
  }

  // Enhanced ad blocking and redirect prevention
  useEffect(() => {
    const blockAdsAndRedirects = () => {
      if (iframeRef.current) {
        try {
          const iframe = iframeRef.current

          const originalOpen = window.open
          const originalLocation = window.location

          window.open = (url, name, specs) => {
            console.log("Blocked popup attempt:", url)
            return null
          }

          Object.defineProperty(window, "location", {
            value: {
              ...originalLocation,
              href: originalLocation.href,
              replace: (url) => {
                console.log("Blocked redirect attempt via location.replace:", url)
              },
              assign: (url) => {
                console.log("Blocked redirect attempt via location.assign:", url)
              },
            },
            writable: false,
          })

          iframe.onload = () => {
            try {
              const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document
              if (iframeDoc) {
                const adSelectors = [
                  '[id*="ad"]',
                  '[class*="ad"]',
                  '[id*="banner"]',
                  '[class*="banner"]',
                  '[id*="popup"]',
                  '[class*="popup"]',
                  '[id*="overlay"]',
                  '[class*="overlay"]',
                  'iframe[src*="doubleclick"]',
                  'iframe[src*="googlesyndication"]',
                  'iframe[src*="ads"]',
                  'iframe[src*="adsystem"]',
                  '[id*="adsense"]',
                  ".advertisement",
                  ".ads",
                  ".ad-container",
                  ".popup-ad",
                  '[class*="modal"]',
                  '[id*="modal"]',
                  ".interstitial",
                ]

                const removeAds = () => {
                  adSelectors.forEach((selector) => {
                    const elements = iframeDoc.querySelectorAll(selector)
                    elements.forEach((el) => {
                      if (el instanceof HTMLElement) {
                        el.style.display = "none !important"
                        el.style.visibility = "hidden !important"
                        el.remove()
                      }
                    })
                  })
                }

                removeAds()

                const observer = new MutationObserver(() => {
                  removeAds()
                })

                observer.observe(iframeDoc.body, {
                  childList: true,
                  subtree: true,
                })

                const scripts = iframeDoc.querySelectorAll("script")
                scripts.forEach((script) => {
                  const content = script.innerHTML.toLowerCase()
                  if (
                    content.includes("window.open") ||
                    content.includes("location.href") ||
                    content.includes("location.replace") ||
                    content.includes("redirect") ||
                    content.includes("popup") ||
                    content.includes("adsense") ||
                    content.includes("doubleclick")
                  ) {
                    script.remove()
                  }
                })

                iframeDoc.addEventListener(
                  "click",
                  (e) => {
                    const target = e.target as HTMLElement
                    if (
                      target &&
                      (target.className.includes("ad") ||
                        target.id.includes("ad") ||
                        target.className.includes("popup") ||
                        (target.tagName === "A" && target.getAttribute("target") === "_blank"))
                    ) {
                      e.preventDefault()
                      e.stopPropagation()
                      console.log("Blocked ad click")
                    }
                  },
                  true,
                )
              }
            } catch (e) {
              console.log("Cross-origin iframe, using CSP blocking instead")
            }
          }

          iframe.contentWindow?.addEventListener("beforeunload", (e) => {
            e.preventDefault()
            e.returnValue = ""
          })

          return () => {
            window.open = originalOpen
            Object.defineProperty(window, "location", {
              value: originalLocation,
              writable: true,
            })
          }
        } catch (e) {
          console.log("Error setting up ad blocking:", e)
        }
      }
    }

    const cleanup = blockAdsAndRedirects()
    return cleanup
  }, [currentVideoUrl])

  const handleTabChange = (tab: string) => {
    if (tab === "home") {
      navigate("/")
    } else {
      setActiveTab(tab)
    }
  }

  const handleSeasonChange = (season: number) => {
    setSelectedSeason(season)
  }

  const handleEpisodeSelect = (episode: Episode) => {
    setSelectedEpisode(episode)
    // Track that user started watching this episode
    trackWatchProgress(0)
  }

  if (movieLoading) {
    return (
      <div className="unified-bg flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-movieBlue"></div>
      </div>
    )
  }

  if (movieError || !movie) {
    return (
      <div className="unified-bg flex flex-col items-center justify-center min-h-screen p-4 sm:p-6">
        <h2 className="responsive-subtitle text-white mb-4">Película no encontrada</h2>
        <p className="responsive-text text-white/60 mb-4 text-center">
          El contenido que buscas no existe o ha sido eliminado.
        </p>
        <button onClick={() => navigate("/")} className="btn-primary">
          Volver al Inicio
        </button>
      </div>
    )
  }

  return (
    <div className="unified-bg flex flex-col min-h-screen pb-16 sm:pb-20">
      {/* Header */}
      <div className="relative">
        {/* Back Button */}
        <button
          className="absolute top-2 sm:top-4 left-2 sm:left-4 z-20 p-2 bg-black/50 backdrop-blur-md rounded-full hover:bg-black/70 transition-all duration-300 shadow-lg"
          onClick={() => navigate(-1)}
        >
          <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
        </button>

        {/* Video Player Section */}
        <div className="relative w-full bg-black shadow-2xl">
          <div className="w-full aspect-video">
            <iframe
              ref={iframeRef}
              src={currentVideoUrl}
              className="absolute top-0 left-0 w-full h-full rounded-lg"
              style={{
                border: "none",
              }}
              title="Reproductor de Video"
              allowFullScreen
              sandbox="allow-scripts allow-same-origin allow-presentation"
            />
          </div>
        </div>

        {/* Movie/Series Info - Enhanced Design */}
        <div className="responsive-container responsive-spacing">
          {/* Categories and Rating */}
          <div className="flex flex-wrap items-center justify-between mb-4 gap-3">
            <div className="flex flex-wrap items-center gap-2">
              {movie.categories && (
                <span className="bg-gradient-to-r from-movieBlue/40 to-blue-600/40 backdrop-blur-sm text-xs sm:text-sm px-3 py-1.5 rounded-full text-white font-medium border border-movieBlue/30 shadow-lg">
                  {movie.categories.name}
                </span>
              )}
              {movie.subcategories && (
                <span className="bg-gradient-to-r from-purple-500/40 to-pink-500/40 backdrop-blur-sm text-xs sm:text-sm px-3 py-1.5 rounded-full text-white font-medium border border-purple-500/30 shadow-lg">
                  {movie.subcategories.name}
                </span>
              )}
              <span className="bg-gradient-to-r from-orange-500/40 to-red-500/40 backdrop-blur-sm text-xs sm:text-sm px-3 py-1.5 rounded-full text-orange-300 font-medium border border-orange-500/30 shadow-lg">
                {movie.type === "series" ? "Serie" : "Película"}
              </span>
            </div>
            <div className="flex items-center bg-gradient-to-r from-yellow-500/20 to-amber-500/20 backdrop-blur-sm px-3 py-1.5 rounded-full border border-yellow-500/30 shadow-lg">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1.5" />
              <span className="text-yellow-400 font-semibold text-sm">{movie.rating || 0}</span>
            </div>
          </div>

          {/* Title */}
          <h1 className="responsive-title text-white mb-4 leading-tight bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent drop-shadow-lg">
            {currentTitle}
          </h1>

          {/* Movie Details */}
          <div className="flex flex-wrap items-center text-sm text-white/80 mb-6 gap-3">
            <span className="flex items-center bg-white/10 backdrop-blur-sm px-3 py-2 rounded-full border border-white/20 shadow-lg">
              <Calendar className="w-4 h-4 mr-2 text-movieBlue" /> {movie.year || 2023}
            </span>
            <span className="flex items-center bg-white/10 backdrop-blur-sm px-3 py-2 rounded-full border border-white/20 shadow-lg">
              <Clock className="w-4 h-4 mr-2 text-movieBlue" /> {selectedEpisode?.duration || movie.duration || "N/A"}
            </span>
          </div>

          {/* Synopsis */}
          <div className="mb-6">
            <h3 className="responsive-subtitle text-white mb-3 flex items-center">
              <Info className="w-5 h-5 mr-2 text-movieBlue" />
              Sinopsis
            </h3>
            <div className="glass-card p-4 sm:p-6">
              <p className="responsive-text text-white/90 leading-relaxed">
                {selectedEpisode?.synopsis ||
                  movie.synopsis ||
                  "Una historia emocionante que te mantendrá entretenido de principio a fin."}
              </p>
            </div>
          </div>

          {/* Series Details */}
          {isSeriesContent && (
            <div className="mb-6 glass-card p-4 sm:p-6">
              <h3 className="responsive-subtitle text-white mb-4 flex items-center">
                <Info className="w-5 h-5 mr-2 text-movieBlue" />
                Información de la Serie
              </h3>
              <div className="responsive-grid gap-3 text-sm">
                <div className="flex justify-between p-2 bg-white/5 rounded-lg">
                  <span className="text-white/60">Tipo:</span>
                  <span className="text-white font-medium">Serie</span>
                </div>
                <div className="flex justify-between p-2 bg-white/5 rounded-lg">
                  <span className="text-white/60">Categoría:</span>
                  <span className="text-white font-medium">{movie.categories?.name || "N/A"}</span>
                </div>
                {movie.subcategories && (
                  <div className="flex justify-between p-2 bg-white/5 rounded-lg">
                    <span className="text-white/60">Género:</span>
                    <span className="text-white font-medium">{movie.subcategories.name}</span>
                  </div>
                )}
                <div className="flex justify-between p-2 bg-white/5 rounded-lg">
                  <span className="text-white/60">Calificación:</span>
                  <span className="text-white font-medium">{movie.rating || 0}/10</span>
                </div>
              </div>
            </div>
          )}

          {/* Season Selector and Episode List for Series */}
          {isSeriesContent && formattedEpisodes.length > 0 && (
            <div className="mb-6">
              <SeasonSelector totalSeasons={3} selectedSeason={selectedSeason} onSeasonChange={handleSeasonChange} />
              <EpisodeList
                episodes={formattedEpisodes}
                selectedEpisode={selectedEpisode}
                onEpisodeSelect={handleEpisodeSelect}
              />
            </div>
          )}
        </div>
      </div>

      {/* Similar Content */}
      {similarMovies.length > 0 && (
        <div className="responsive-container">
          <ContentCarousel
            title={
              movie.subcategories?.name
                ? `Más contenido de ${movie.subcategories.name}`
                : movie.categories?.name
                  ? `Más contenido de ${movie.categories.name}`
                  : "Contenido Similar"
            }
            movies={similarMovies}
            showViewMore={false}
          />
        </div>
      )}

      {/* Bottom Navigation */}
      <BottomNav
        activeTab={activeTab}
        onChangeTab={handleTabChange}
        onOpenSearch={() => console.log("Search opened")}
      />
    </div>
  )
}

export default MovieDetail
