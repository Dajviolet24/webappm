
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Edit, Trash2, Plus, Tag } from 'lucide-react';

const categorySchema = z.object({
  name: z.string().min(1, { message: 'Category name is required' }),
  icon: z.string().min(1, { message: 'Icon is required' })
});

const subcategorySchema = z.object({
  name: z.string().min(1, { message: 'Subcategory name is required' }),
  category_id: z.string().min(1, { message: 'Category is required' })
});

const CategoriesManagement = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [subcategories, setSubcategories] = useState<any[]>([]);
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [isSubcategoryDialogOpen, setIsSubcategoryDialogOpen] = useState(false);
  const [editCategoryId, setEditCategoryId] = useState<string | null>(null);
  const [editSubcategoryId, setEditSubcategoryId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const categoryForm = useForm<z.infer<typeof categorySchema>>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: '',
      icon: ''
    }
  });
  
  const subcategoryForm = useForm<z.infer<typeof subcategorySchema>>({
    resolver: zodResolver(subcategorySchema),
    defaultValues: {
      name: '',
      category_id: ''
    }
  });
  
  const iconOptions = [
    'Film', 'Tv', 'Star', 'Heart', 'Zap', 'Coffee', 'Music', 'Camera',
    'Gamepad2', 'Book', 'Headphones', 'Smartphone', 'Laptop', 'Globe'
  ];
  
  useEffect(() => {
    fetchData();
  }, []);
  
  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Fetch categories
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('categories')
        .select('*')
        .order('name');
        
      if (categoriesError) {
        console.error('Categories error:', categoriesError);
        throw categoriesError;
      }
      setCategories(categoriesData || []);
      
      // Fetch subcategories with category info
      const { data: subcategoriesData, error: subcategoriesError } = await supabase
        .from('subcategories')
        .select(`
          *,
          categories:category_id(id, name)
        `)
        .order('name');
        
      if (subcategoriesError) {
        console.error('Subcategories error:', subcategoriesError);
        throw subcategoriesError;
      }
      setSubcategories(subcategoriesData || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load categories data');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleCategorySubmit = async (values: z.infer<typeof categorySchema>) => {
    try {
      console.log('Submitting category:', values);
      
      if (editCategoryId) {
        const { error } = await supabase
          .from('categories')
          .update({
            name: values.name,
            icon: values.icon
          })
          .eq('id', editCategoryId);
          
        if (error) {
          console.error('Category update error:', error);
          throw error;
        }
        toast.success('Category updated successfully');
      } else {
        const { error } = await supabase
          .from('categories')
          .insert({
            name: values.name,
            icon: values.icon
          });
          
        if (error) {
          console.error('Category insert error:', error);
          throw error;
        }
        toast.success('Category added successfully');
      }
      
      closeCategoryDialog();
      fetchData();
    } catch (error: any) {
      console.error('Category submit error:', error);
      toast.error(`Error: ${error.message}`);
    }
  };
  
  const handleSubcategorySubmit = async (values: z.infer<typeof subcategorySchema>) => {
    try {
      console.log('Submitting subcategory:', values);
      
      if (editSubcategoryId) {
        const { error } = await supabase
          .from('subcategories')
          .update({
            name: values.name,
            category_id: values.category_id
          })
          .eq('id', editSubcategoryId);
          
        if (error) {
          console.error('Subcategory update error:', error);
          throw error;
        }
        toast.success('Subcategory updated successfully');
      } else {
        const { error } = await supabase
          .from('subcategories')
          .insert({
            name: values.name,
            category_id: values.category_id
          });
          
        if (error) {
          console.error('Subcategory insert error:', error);
          throw error;
        }
        toast.success('Subcategory added successfully');
      }
      
      closeSubcategoryDialog();
      fetchData();
    } catch (error: any) {
      console.error('Subcategory submit error:', error);
      toast.error(`Error: ${error.message}`);
    }
  };
  
  const closeCategoryDialog = () => {
    setIsCategoryDialogOpen(false);
    categoryForm.reset();
    setEditCategoryId(null);
  };
  
  const closeSubcategoryDialog = () => {
    setIsSubcategoryDialogOpen(false);
    subcategoryForm.reset();
    setEditSubcategoryId(null);
  };
  
  const editCategory = (category: any) => {
    setEditCategoryId(category.id);
    categoryForm.reset({
      name: category.name || '',
      icon: category.icon || ''
    });
    setIsCategoryDialogOpen(true);
  };
  
  const editSubcategory = (subcategory: any) => {
    setEditSubcategoryId(subcategory.id);
    subcategoryForm.reset({
      name: subcategory.name || '',
      category_id: subcategory.category_id || ''
    });
    setIsSubcategoryDialogOpen(true);
  };
  
  const deleteCategory = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this category? This will also delete all its subcategories and may affect movies in this category.')) {
      try {
        const { error } = await supabase
          .from('categories')
          .delete()
          .eq('id', id);
          
        if (error) {
          console.error('Delete category error:', error);
          throw error;
        }
        
        toast.success('Category deleted successfully');
        fetchData();
      } catch (error: any) {
        console.error('Delete category error:', error);
        toast.error(`Error: ${error.message}`);
      }
    }
  };
  
  const deleteSubcategory = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this subcategory? This may affect movies in this subcategory.')) {
      try {
        const { error } = await supabase
          .from('subcategories')
          .delete()
          .eq('id', id);
          
        if (error) {
          console.error('Delete subcategory error:', error);
          throw error;
        }
        
        toast.success('Subcategory deleted successfully');
        fetchData();
      } catch (error: any) {
        console.error('Delete subcategory error:', error);
        toast.error(`Error: ${error.message}`);
      }
    }
  };

  const openAddCategoryDialog = () => {
    setEditCategoryId(null);
    categoryForm.reset({
      name: '',
      icon: ''
    });
    setIsCategoryDialogOpen(true);
  };

  const openAddSubcategoryDialog = () => {
    setEditSubcategoryId(null);
    subcategoryForm.reset({
      name: '',
      category_id: ''
    });
    setIsSubcategoryDialogOpen(true);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">Categories Management</h1>
        <div className="flex gap-2">
          <Button onClick={openAddCategoryDialog} className="bg-movieBlue hover:bg-movieBlue/80">
            <Plus className="h-4 w-4 mr-2" />
            Add Category
          </Button>
          <Button onClick={openAddSubcategoryDialog} className="bg-green-600 hover:bg-green-700">
            <Plus className="h-4 w-4 mr-2" />
            Add Subcategory
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Categories */}
        <Card className="bg-movieDark border-white/20">
          <CardHeader>
            <CardTitle className="text-white">Categories</CardTitle>
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
                      <TableHead className="text-white">Name</TableHead>
                      <TableHead className="text-white">Icon</TableHead>
                      <TableHead className="text-white text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {categories.length > 0 ? (
                      categories.map((category) => (
                        <TableRow key={category.id} className="border-white/20">
                          <TableCell className="text-white font-medium">{category.name}</TableCell>
                          <TableCell className="text-white">{category.icon}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button 
                                variant="outline" 
                                size="icon" 
                                className="border-white/20 text-white hover:bg-white/10"
                                onClick={() => editCategory(category)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="outline" 
                                size="icon" 
                                className="border-white/20 text-white hover:bg-red-500/20"
                                onClick={() => deleteCategory(category.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={3} className="text-center py-10 text-white/60">
                          No categories found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Subcategories */}
        <Card className="bg-movieDark border-white/20">
          <CardHeader>
            <CardTitle className="text-white">Subcategories</CardTitle>
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
                      <TableHead className="text-white">Name</TableHead>
                      <TableHead className="text-white">Category</TableHead>
                      <TableHead className="text-white text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {subcategories.length > 0 ? (
                      subcategories.map((subcategory) => (
                        <TableRow key={subcategory.id} className="border-white/20">
                          <TableCell className="text-white font-medium">{subcategory.name}</TableCell>
                          <TableCell className="text-white">{subcategory.categories?.name || 'No Category'}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button 
                                variant="outline" 
                                size="icon" 
                                className="border-white/20 text-white hover:bg-white/10"
                                onClick={() => editSubcategory(subcategory)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="outline" 
                                size="icon" 
                                className="border-white/20 text-white hover:bg-red-500/20"
                                onClick={() => deleteSubcategory(subcategory.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={3} className="text-center py-10 text-white/60">
                          No subcategories found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Category Dialog */}
      <Dialog open={isCategoryDialogOpen} onOpenChange={setIsCategoryDialogOpen}>
        <DialogContent className="max-w-md bg-movieDark border-white/20">
          <DialogHeader>
            <DialogTitle className="text-white">
              {editCategoryId ? 'Edit Category' : 'Add New Category'}
            </DialogTitle>
          </DialogHeader>
          <Form {...categoryForm}>
            <form onSubmit={categoryForm.handleSubmit(handleCategorySubmit)} className="space-y-4">
              <FormField
                control={categoryForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Category Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter category name" {...field} className="bg-white/10 border-white/20 text-white placeholder:text-white/50" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={categoryForm.control}
                name="icon"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Icon</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-white/10 border-white/20 text-white">
                          <SelectValue placeholder="Select an icon" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-movieDark border-white/20">
                        {iconOptions.map((icon) => (
                          <SelectItem key={icon} value={icon} className="text-white hover:bg-white/10 focus:bg-white/10">
                            {icon}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={closeCategoryDialog}
                  type="button"
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  Cancel
                </Button>
                <Button type="submit" className="bg-movieBlue hover:bg-movieBlue/80">
                  {editCategoryId ? 'Update Category' : 'Add Category'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Subcategory Dialog */}
      <Dialog open={isSubcategoryDialogOpen} onOpenChange={setIsSubcategoryDialogOpen}>
        <DialogContent className="max-w-md bg-movieDark border-white/20">
          <DialogHeader>
            <DialogTitle className="text-white">
              {editSubcategoryId ? 'Edit Subcategory' : 'Add New Subcategory'}
            </DialogTitle>
          </DialogHeader>
          <Form {...subcategoryForm}>
            <form onSubmit={subcategoryForm.handleSubmit(handleSubcategorySubmit)} className="space-y-4">
              <FormField
                control={subcategoryForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Subcategory Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter subcategory name" {...field} className="bg-white/10 border-white/20 text-white placeholder:text-white/50" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={subcategoryForm.control}
                name="category_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Category</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-white/10 border-white/20 text-white">
                          <SelectValue placeholder="Select a category" />
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
              
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={closeSubcategoryDialog}
                  type="button"
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  Cancel
                </Button>
                <Button type="submit" className="bg-movieBlue hover:bg-movieBlue/80">
                  {editSubcategoryId ? 'Update Subcategory' : 'Add Subcategory'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CategoriesManagement;
