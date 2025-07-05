import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Edit, Trash2, Film, Plus, Search, Star } from 'lucide-react';

const movieSchema = z.object({
  title: z.string().min(1, { message: 'El título es requerido' }),
  image_url: z.string().url({ message: 'Se requiere una URL de imagen válida' }),
  video_url: z.string().url({ message: 'Se requiere una URL de video válida' }),
  type: z.string().min(1, { message: 'El tipo es requerido' }),
  category_id: z.string().optional(),
  subcategory_id: z.string().optional(),
  duration: z.string().optional(),
  year: z.number().int().positive().optional(),
  rating: z.number().min(0).max(10).optional(),
  synopsis: z.string().optional(),
  is_featured: z.boolean().default(false)
});

const seriesSchema = z.object({
  title: z.string().min(1, { message: 'El título es requerido' }),
  image_url: z.string().url({ message: 'Se requiere una URL de imagen válida' }),
  category_id: z.string().optional(),
  subcategory_id: z.string().optional(),
  year: z.number().int().positive().optional(),
  synopsis: z.string().optional(),
  is_featured: z.boolean().default(false),
  seasons: z.number().min(1).max(20, { message: 'Máximo 20 temporadas permitidas' }),
  episodes_per_season: z.array(z.number().min(1).max(50))
});

const ContentManagement = () => {
  const [activeTab, setActiveTab] = useState('list');
  const [movies, setMovies] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [subcategories, setSubcategories] = useState<any[]>([]);
  const [isMovieDialogOpen, setIsMovieDialogOpen] = useState(false);
  const [isSeriesDialogOpen, setIsSeriesDialogOpen] = useState(false);
  const [isEpisodeDialogOpen, setIsEpisodeDialogOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [currentSeries, setCurrentSeries] = useState<any>(null);
  const [currentSeasonData, setCurrentSeasonData] = useState<any[]>([]);
  const [currentSeasonIndex, setCurrentSeasonIndex] = useState(0);
  
  const movieForm = useForm<z.infer<typeof movieSchema>>({
    resolver: zodResolver(movieSchema),
    defaultValues: {
      title: '',
      image_url: '',
      video_url: '',
      type: 'movie',
      duration: '',
      rating: 0,
      is_featured: false
    }
  });
  
  const seriesForm = useForm<z.infer<typeof seriesSchema>>({
    resolver: zodResolver(seriesSchema),
    defaultValues: {
      title: '',
      image_url: '',
      seasons: 1,
      episodes_per_season: [1],
      is_featured: false
    }
  });
  
  const [episodeData, setEpisodeData] = useState<any[]>([]);
  
  useEffect(() => {
    fetchData();
  }, [searchQuery]);
  
  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Fetch movies with category and subcategory names
      const { data: moviesData, error: moviesError } = await supabase
        .from('movies')
        .select(`
          *,
          categories:category_id(id, name),
          subcategories:subcategory_id(id, name)
        `)
        .ilike('title', `%${searchQuery}%`)
        .order('created_at', { ascending: false });
      
      if (moviesError) {
        console.error('Movies error:', moviesError);
        throw moviesError;
      }
      setMovies(moviesData || []);
      
      // Fetch categories with proper ordering
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('categories')
        .select('*');
        
      if (categoriesError) {
        console.error('Categories error:', categoriesError);
        throw categoriesError;
      }
      
      // Define the exact order based on user requirements
      const categoryOrder = [
        'New', 'Movies', 'Series', 'Comedy', 'Emissions', 
        'Animation', 'Science Fiction', 'Anime', 'Live TV', 'Action', 'New Content'
      ];
      
      // Sort categories according to the specified order
      const sortedCategories = categoryOrder
        .map(name => (categoriesData || []).find(cat => cat.name === name))
        .filter(Boolean);
      
      setCategories(sortedCategories);
      
      // Fetch ALL subcategories
      const { data: subcategoriesData, error: subcategoriesError } = await supabase
        .from('subcategories')
        .select('*')
        .order('name');
        
      if (subcategoriesError) {
        console.error('Subcategories error:', subcategoriesError);
        throw subcategoriesError;
      }
      setSubcategories(subcategoriesData || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Error al cargar los datos del contenido');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Filter subcategories based on selected category
  const filteredSubcategories = selectedCategoryId
    ? subcategories.filter(sub => sub.category_id === selectedCategoryId)
    : [];

  const handleMovieSubmit = async (values: z.infer<typeof movieSchema>) => {
    try {
      console.log('Submitting movie:', values);
      
      const movieData = {
        title: values.title,
        image_url: values.image_url,
        video_url: values.video_url,
        type: values.type,
        category_id: values.category_id || null,
        subcategory_id: values.subcategory_id || null,
        duration: values.duration || null,
        year: values.year || null,
        rating: values.rating || null,
        synopsis: values.synopsis || null,
        is_featured: values.is_featured || false
      };

      if (editId) {
        const { error } = await supabase
          .from('movies')
          .update(movieData)
          .eq('id', editId);
          
        if (error) {
          console.error('Update error:', error);
          throw error;
        }
        toast.success('Película actualizada correctamente');
      } else {
        const { error } = await supabase
          .from('movies')
          .insert(movieData);
          
        if (error) {
          console.error('Insert error:', error);
          throw error;
        }
        toast.success('Película agregada correctamente');
      }
      
      closeMovieDialog();
      fetchData();
    } catch (error: any) {
      console.error('Movie submit error:', error);
      toast.error(`Error: ${error.message}`);
    }
  };
  
  const handleSeriesSubmit = async (values: z.infer<typeof seriesSchema>) => {
    try {
      console.log('Submitting series:', values);
      
      const seriesData = {
        title: values.title,
        image_url: values.image_url,
        type: 'series',
        category_id: values.category_id || null,
        subcategory_id: values.subcategory_id || null,
        year: values.year || null,
        synopsis: values.synopsis || null,
        is_featured: values.is_featured || false,
        video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ' // Placeholder
      };

      if (editId) {
        const { error } = await supabase
          .from('movies')
          .update(seriesData)
          .eq('id', editId);
          
        if (error) throw error;
        
        toast.success('Serie actualizada correctamente');
        closeSeriesDialog();
        fetchData();
      } else {
        const { data: newSeries, error: seriesError } = await supabase
          .from('movies')
          .insert(seriesData)
          .select()
          .single();
          
        if (seriesError) {
          console.error('Series insert error:', seriesError);
          throw seriesError;
        }
        
        setCurrentSeries(newSeries);
        setCurrentSeasonData(values.episodes_per_season.map((episodes, index) => ({
          season: index + 1,
          episodes: Array.from({ length: episodes }, (_, i) => ({
            title: '',
            video_url: '',
            duration: '',
            synopsis: ''
          }))
        })));
        setCurrentSeasonIndex(0);
        
        setIsSeriesDialogOpen(false);
        setIsEpisodeDialogOpen(true);
      }
    } catch (error: any) {
      console.error('Series submit error:', error);
      toast.error(`Error: ${error.message}`);
    }
  };
  
  const handleEpisodeSubmit = async () => {
    try {
      if (!currentSeries) return;
      
      const allEpisodes = [];
      
      for (const seasonData of currentSeasonData) {
        for (let i = 0; i < seasonData.episodes.length; i++) {
          const episode = seasonData.episodes[i];
          if (episode.title && episode.video_url) {
            allEpisodes.push({
              movie_id: currentSeries.id,
              season_number: seasonData.season,
              episode_number: i + 1,
              title: episode.title,
              video_url: episode.video_url,
              duration: episode.duration || null,
              synopsis: episode.synopsis || null,
              image: currentSeries.image_url
            });
          }
        }
      }
      
      if (allEpisodes.length > 0) {
        const { error } = await supabase
          .from('episodes')
          .insert(allEpisodes);
          
        if (error) {
          console.error('Episodes insert error:', error);
          throw error;
        }
      }
      
      toast.success('Serie y episodios agregados correctamente');
      closeEpisodeDialog();
      fetchData();
    } catch (error: any) {
      console.error('Episode submit error:', error);
      toast.error(`Error: ${error.message}`);
    }
  };
  
  const closeMovieDialog = () => {
    setIsMovieDialogOpen(false);
    movieForm.reset();
    setEditId(null);
    setSelectedCategoryId(null);
  };
  
  const closeSeriesDialog = () => {
    setIsSeriesDialogOpen(false);
    seriesForm.reset();
    setEditId(null);
    setSelectedCategoryId(null);
  };
  
  const closeEpisodeDialog = () => {
    setIsEpisodeDialogOpen(false);
    setCurrentSeries(null);
    setCurrentSeasonData([]);
    setCurrentSeasonIndex(0);
  };
  
  const editMovie = (movie: any) => {
    console.log('Editing movie:', movie);
    setEditId(movie.id);
    
    movieForm.reset({
      title: movie.title || '',
      image_url: movie.image_url || '',
      video_url: movie.video_url || '',
      type: movie.type || 'movie',
      category_id: movie.category_id || undefined,
      subcategory_id: movie.subcategory_id || undefined,
      duration: movie.duration || '',
      year: movie.year || undefined,
      rating: movie.rating || 0,
      synopsis: movie.synopsis || '',
      is_featured: movie.is_featured || false
    });
    
    if (movie.category_id) {
      setSelectedCategoryId(movie.category_id);
    }
    
    if (movie.type === 'series') {
      seriesForm.reset({
        title: movie.title || '',
        image_url: movie.image_url || '',
        category_id: movie.category_id || undefined,
        subcategory_id: movie.subcategory_id || undefined,
        year: movie.year || undefined,
        synopsis: movie.synopsis || '',
        is_featured: movie.is_featured || false,
        seasons: 1,
        episodes_per_season: [1]
      });
      setIsSeriesDialogOpen(true);
    } else {
      setIsMovieDialogOpen(true);
    }
  };
  
  const deleteMovie = async (id: string) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este contenido? Esta acción no se puede deshacer.')) {
      try {
        // First delete associated episodes if it's a series
        await supabase
          .from('episodes')
          .delete()
          .eq('movie_id', id);
          
        // Then delete the movie/series
        const { error } = await supabase
          .from('movies')
          .delete()
          .eq('id', id);
          
        if (error) {
          console.error('Delete error:', error);
          throw error;
        }
        
        toast.success('Contenido eliminado correctamente');
        fetchData();
      } catch (error: any) {
        console.error('Delete error:', error);
        toast.error(`Error: ${error.message}`);
      }
    }
  };
  
  const updateEpisodeData = (seasonIndex: number, episodeIndex: number, field: string, value: string) => {
    const newData = [...currentSeasonData];
    newData[seasonIndex].episodes[episodeIndex][field] = value;
    setCurrentSeasonData(newData);
  };

  const openAddMovieDialog = () => {
    setEditId(null);
    setSelectedCategoryId(null);
    movieForm.reset({
      title: '',
      image_url: '',
      video_url: '',
      type: 'movie',
      duration: '',
      rating: 0,
      is_featured: false
    });
    setIsMovieDialogOpen(true);
  };

  const openAddSeriesDialog = () => {
    setEditId(null);
    setSelectedCategoryId(null);
    seriesForm.reset({
      title: '',
      image_url: '',
      seasons: 1,
      episodes_per_season: [1],
      is_featured: false
    });
    setIsSeriesDialogOpen(true);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">Gestión de Contenido</h1>
        <div className="flex gap-2">
          <Button onClick={openAddMovieDialog} className="bg-movieBlue hover:bg-movieBlue/80">
            <Plus className="h-4 w-4 mr-2" />
            Agregar Película
          </Button>
          <Button onClick={openAddSeriesDialog} className="bg-green-600 hover:bg-green-700">
            <Plus className="h-4 w-4 mr-2" />
            Agregar Serie
          </Button>
        </div>
      </div>
      
      <Card className="bg-movieDark border-white/20">
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <CardTitle className="text-white">Todo el Contenido</CardTitle>
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/60" />
              <Input
                placeholder="Buscar contenido..."
                className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/50"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center p-10">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-white/20">
                    <TableHead className="text-white">Título</TableHead>
                    <TableHead className="text-white">Tipo</TableHead>
                    <TableHead className="text-white">Categoría</TableHead>
                    <TableHead className="text-white">Año</TableHead>
                    <TableHead className="text-white">Calificación</TableHead>
                    <TableHead className="text-white">Destacado</TableHead>
                    <TableHead className="text-white text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {movies.length > 0 ? (
                    movies.map((movie) => (
                      <TableRow key={movie.id} className="border-white/20">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="h-12 w-12 rounded bg-white/10 flex items-center justify-center overflow-hidden">
                              {movie.image_url ? (
                                <img 
                                  src={movie.image_url} 
                                  alt={movie.title} 
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <Film className="h-6 w-6 text-white/60" />
                              )}
                            </div>
                            <span className="font-medium text-white">{movie.title}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-white capitalize">{movie.type}</TableCell>
                        <TableCell className="text-white">
                          {movie.categories?.name || 'Sin categoría'}
                          {movie.subcategories?.name && ` / ${movie.subcategories.name}`}
                        </TableCell>
                        <TableCell className="text-white">{movie.year || '—'}</TableCell>
                        <TableCell className="text-white">
                          {movie.rating ? (
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                              {movie.rating}
                            </div>
                          ) : '—'}
                        </TableCell>
                        <TableCell className="text-white">{movie.is_featured ? 'Sí' : 'No'}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button 
                              variant="outline" 
                              size="icon" 
                              className="border-white/20 text-white hover:bg-white/10"
                              onClick={() => editMovie(movie)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="icon" 
                              className="border-white/20 text-white hover:bg-red-500/20"
                              onClick={() => deleteMovie(movie.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-10 text-white/60">
                        No se encontró contenido
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Movie Dialog */}
      <Dialog open={isMovieDialogOpen} onOpenChange={setIsMovieDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-movieDark border-white/20">
          <DialogHeader>
            <DialogTitle className="text-white">
              {editId ? 'Editar Película' : 'Agregar Nueva Película'}
            </DialogTitle>
          </DialogHeader>
          <Form {...movieForm}>
            <form onSubmit={movieForm.handleSubmit(handleMovieSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <FormField
                    control={movieForm.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Título</FormLabel>
                        <FormControl>
                          <Input placeholder="Ingresa el título" {...field} className="bg-white/10 border-white/20 text-white placeholder:text-white/50" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={movieForm.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Tipo</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="bg-white/10 border-white/20 text-white">
                              <SelectValue placeholder="Selecciona el tipo" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-movieDark border-white/20">
                            <SelectItem value="movie" className="text-white hover:bg-white/10 focus:bg-white/10">Película</SelectItem>
                            <SelectItem value="anime" className="text-white hover:bg-white/10 focus:bg-white/10">Anime</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={movieForm.control}
                    name="image_url"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">URL de Imagen</FormLabel>
                        <FormControl>
                          <Input placeholder="Ingresa la URL de la imagen" {...field} className="bg-white/10 border-white/20 text-white placeholder:text-white/50" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={movieForm.control}
                    name="video_url"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">URL de Video</FormLabel>
                        <FormControl>
                          <Input placeholder="Ingresa la URL del video" {...field} className="bg-white/10 border-white/20 text-white placeholder:text-white/50" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="space-y-4">
                  <FormField
                    control={movieForm.control}
                    name="category_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Categoría</FormLabel>
                        <Select 
                          onValueChange={(value) => {
                            field.onChange(value);
                            setSelectedCategoryId(value);
                            // Reset subcategory when category changes
                            movieForm.setValue('subcategory_id', '');
                          }} 
                          value={field.value || ''}
                        >
                          <FormControl>
                            <SelectTrigger className="bg-white/10 border-white/20 text-white">
                              <SelectValue placeholder="Selecciona la categoría" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-movieDark border-white/20">
                            {categories.map((category) => (
                              <SelectItem key={category.id} value={category.id} className="text-white hover:bg-white/10 focus:bg-white/10">
                                {category.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={movieForm.control}
                    name="subcategory_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Subcategoría</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          value={field.value || ''}
                          disabled={!selectedCategoryId}
                        >
                          <FormControl>
                            <SelectTrigger className="bg-white/10 border-white/20 text-white">
                              <SelectValue placeholder={
                                !selectedCategoryId 
                                  ? "Primero selecciona una categoría" 
                                  : filteredSubcategories.length === 0 
                                    ? "No hay subcategorías disponibles"
                                    : "Selecciona la subcategoría"
                              } />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-movieDark border-white/20">
                            {filteredSubcategories.length > 0 ? (
                              filteredSubcategories.map((subcategory) => (
                                <SelectItem key={subcategory.id} value={subcategory.id} className="text-white hover:bg-white/10 focus:bg-white/10">
                                  {subcategory.name}
                                </SelectItem>
                              ))
                            ) : (
                              <SelectItem value="none" disabled className="text-white/50">
                                {!selectedCategoryId ? "Selecciona una categoría primero" : "No hay subcategorías"}
                              </SelectItem>
                            )}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={movieForm.control}
                      name="duration"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white">Duración</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. 2h 30m" {...field} className="bg-white/10 border-white/20 text-white placeholder:text-white/50" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={movieForm.control}
                      name="year"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white">Año</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              placeholder="Año de lanzamiento"
                              {...field}
                              onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                              className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={movieForm.control}
                      name="rating"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white">Calificación (0-10)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              step="0.1"
                              min="0"
                              max="10"
                              placeholder="e.g. 8.5"
                              {...field}
                              onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : 0)}
                              className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={movieForm.control}
                      name="is_featured"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border border-white/20 p-3 shadow-sm mt-8">
                          <div className="space-y-0.5">
                            <FormLabel className="text-white">Destacado</FormLabel>
                          </div>
                          <FormControl>
                            <input
                              type="checkbox"
                              checked={field.value}
                              onChange={field.onChange}
                              className="h-4 w-4"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>
              
              <FormField
                control={movieForm.control}
                name="synopsis"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Sinopsis</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Ingresa la descripción de la película" 
                        className="min-h-[120px] bg-white/10 border-white/20 text-white placeholder:text-white/50"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={closeMovieDialog}
                  type="button"
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  Cancelar
                </Button>
                <Button type="submit" className="bg-movieBlue hover:bg-movieBlue/80">
                  {editId ? 'Actualizar Película' : 'Agregar Película'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Series Dialog */}
      <Dialog open={isSeriesDialogOpen} onOpenChange={setIsSeriesDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-movieDark border-white/20">
          <DialogHeader>
            <DialogTitle className="text-white">
              {editId ? 'Editar Serie' : 'Agregar Nueva Serie'}
            </DialogTitle>
          </DialogHeader>
          <Form {...seriesForm}>
            <form onSubmit={seriesForm.handleSubmit(handleSeriesSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <FormField
                    control={seriesForm.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Título</FormLabel>
                        <FormControl>
                          <Input placeholder="Ingresa el título" {...field} className="bg-white/10 border-white/20 text-white placeholder:text-white/50" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={seriesForm.control}
                    name="image_url"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">URL de Imagen</FormLabel>
                        <FormControl>
                          <Input placeholder="Ingresa la URL de la imagen" {...field} className="bg-white/10 border-white/20 text-white placeholder:text-white/50" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={seriesForm.control}
                    name="category_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Categoría</FormLabel>
                        <Select 
                          onValueChange={(value) => {
                            field.onChange(value);
                            setSelectedCategoryId(value);
                            // Reset subcategory when category changes
                            seriesForm.setValue('subcategory_id', '');
                          }} 
                          value={field.value || ''}
                        >
                          <FormControl>
                            <SelectTrigger className="bg-white/10 border-white/20 text-white">
                              <SelectValue placeholder="Selecciona la categoría" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-movieDark border-white/20">
                            {categories.map((category) => (
                              <SelectItem key={category.id} value={category.id} className="text-white hover:bg-white/10 focus:bg-white/10">
                                {category.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={seriesForm.control}
                    name="subcategory_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Subcategoría</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          value={field.value || ''}
                          disabled={!selectedCategoryId}
                        >
                          <FormControl>
                            <SelectTrigger className="bg-white/10 border-white/20 text-white">
                              <SelectValue placeholder={
                                !selectedCategoryId 
                                  ? "Primero selecciona una categoría" 
                                  : filteredSubcategories.length === 0 
                                    ? "No hay subcategorías disponibles"
                                    : "Selecciona la subcategoría"
                              } />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-movieDark border-white/20">
                            {filteredSubcategories.length > 0 ? (
                              filteredSubcategories.map((subcategory) => (
                                <SelectItem key={subcategory.id} value={subcategory.id} className="text-white hover:bg-white/10 focus:bg-white/10">
                                  {subcategory.name}
                                </SelectItem>
                              ))
                            ) : (
                              <SelectItem value="none" disabled className="text-white/50">
                                {!selectedCategoryId ? "Selecciona una categoría primero" : "No hay subcategorías"}
                              </SelectItem>
                            )}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={seriesForm.control}
                      name="year"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white">Año</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              placeholder="Año de lanzamiento"
                              {...field}
                              onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                              className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={seriesForm.control}
                      name="is_featured"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border border-white/20 p-3 shadow-sm mt-8">
                          <div className="space-y-0.5">
                            <FormLabel className="text-white">Destacado</FormLabel>
                          </div>
                          <FormControl>
                            <input
                              type="checkbox"
                              checked={field.value}
                              onChange={field.onChange}
                              className="h-4 w-4"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={seriesForm.control}
                    name="seasons"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Número de Temporadas</FormLabel>
                        <Select 
                          onValueChange={(value) => {
                            const seasons = Number(value);
                            field.onChange(seasons);
                            // Adjust episodes_per_season array length accordingly
                            const currentEpisodes = seriesForm.getValues('episodes_per_season') || [];
                            const newEpisodes = [...currentEpisodes];
                            if (seasons > newEpisodes.length) {
                              for (let i = newEpisodes.length; i < seasons; i++) {
                                newEpisodes.push(1);
                              }
                            } else if (seasons < newEpisodes.length) {
                              newEpisodes.splice(seasons);
                            }
                            seriesForm.setValue('episodes_per_season', newEpisodes);
                          }} 
                          value={field.value?.toString()}
                        >
                          <FormControl>
                            <SelectTrigger className="bg-white/10 border-white/20 text-white">
                              <SelectValue placeholder="Selecciona temporadas" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-movieDark border-white/20">
                            {Array.from({ length: 20 }, (_, i) => i + 1).map((num) => (
                              <SelectItem key={num} value={num.toString()} className="text-white hover:bg-white/10 focus:bg-white/10">
                                {num} Temporada{num > 1 ? 's' : ''}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {seriesForm.watch('seasons') > 0 && (
                    <div>
                      <FormLabel className="text-white mb-2">Episodios por Temporada</FormLabel>
                      {Array.from({ length: seriesForm.watch('seasons') }).map((_, index) => (
                        <FormField
                          key={index}
                          control={seriesForm.control}
                          name={`episodes_per_season.${index}`}
                          render={({ field }) => (
                            <FormItem className="mb-2">
                              <FormLabel className="text-white">Temporada {index + 1}</FormLabel>
                              <Select 
                                onValueChange={(value) => field.onChange(Number(value))} 
                                value={field.value?.toString()}
                              >
                                <FormControl>
                                  <SelectTrigger className="bg-white/10 border-white/20 text-white">
                                    <SelectValue placeholder="Episodios" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent className="bg-movieDark border-white/20">
                                  {Array.from({ length: 50 }, (_, i) => i + 1).map((num) => (
                                    <SelectItem key={num} value={num.toString()} className="text-white hover:bg-white/10 focus:bg-white/10">
                                      {num} Episodio{num > 1 ? 's' : ''}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      ))}
                    </div>
                  )}
                  
                  <FormField
                    control={seriesForm.control}
                    name="synopsis"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Sinopsis</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Ingresa la descripción de la serie" 
                            className="min-h-[120px] bg-white/10 border-white/20 text-white placeholder:text-white/50"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={closeSeriesDialog}
                  type="button"
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  Cancelar
                </Button>
                <Button type="submit" className="bg-movieBlue hover:bg-movieBlue/80">
                  {editId ? 'Actualizar Serie' : 'Continuar con los Episodios'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      {/* Episode Dialog for Series */}
      <Dialog open={isEpisodeDialogOpen} onOpenChange={setIsEpisodeDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-movieDark border-white/20">
          <DialogHeader>
            <DialogTitle className="text-white">Agregar Episodios para {currentSeries?.title}</DialogTitle>
            <DialogDescription className="text-white/60">
              Temporada {currentSeasonIndex + 1} de {currentSeasonData.length}
            </DialogDescription>
          </DialogHeader>
          
          {currentSeasonData.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">
                Temporada {currentSeasonData[currentSeasonIndex]?.season} Episodios
              </h3>
              
              {currentSeasonData[currentSeasonIndex]?.episodes.map((episode: any, episodeIndex: number) => (
                <div key={episodeIndex} className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border border-white/20 rounded-lg">
                  <div className="space-y-2">
                    <label className="text-white text-sm font-medium">
                      Episodio {episodeIndex + 1} Título
                    </label>
                    <Input
                      placeholder="Ingresa el título del episodio"
                      value={episode.title}
                      onChange={(e) => updateEpisodeData(currentSeasonIndex, episodeIndex, 'title', e.target.value)}
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-white text-sm font-medium">URL de Video</label>
                    <Input
                      placeholder="Ingresa la URL del iframe del video"
                      value={episode.video_url}
                      onChange={(e) => updateEpisodeData(currentSeasonIndex, episodeIndex, 'video_url', e.target.value)}
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-white text-sm font-medium">Duración</label>
                    <Input
                      placeholder="e.g. 45m"
                      value={episode.duration}
                      onChange={(e) => updateEpisodeData(currentSeasonIndex, episodeIndex, 'duration', e.target.value)}
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-white text-sm font-medium">Sinopsis</label>
                    <Textarea
                      placeholder="Descripción del episodio"
                      value={episode.synopsis}
                      onChange={(e) => updateEpisodeData(currentSeasonIndex, episodeIndex, 'synopsis', e.target.value)}
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
          
          <DialogFooter>
            <div className="flex justify-between w-full">
              <div className="flex gap-2">
                {currentSeasonIndex > 0 && (
                  <Button
                    variant="outline"
                    onClick={() => setCurrentSeasonIndex(currentSeasonIndex - 1)}
                    className="border-white/20 text-white hover:bg-white/10"
                  >
                    Temporada Anterior
                  </Button>
                )}
              </div>
              
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={closeEpisodeDialog}
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  Cancelar
                </Button>
                
                {currentSeasonIndex < currentSeasonData.length - 1 ? (
                  <Button
                    onClick={() => setCurrentSeasonIndex(currentSeasonIndex + 1)}
                    className="bg-movieBlue hover:bg-movieBlue/80"
                  >
                    Temporada Siguiente
                  </Button>
                ) : (
                  <Button
                    onClick={handleEpisodeSubmit}
                    className="bg-movieBlue hover:bg-movieBlue/80"
                  >
                    Guardar Serie
                  </Button>
                )}
              </div>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ContentManagement;
