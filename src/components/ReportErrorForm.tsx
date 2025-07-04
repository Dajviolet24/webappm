
import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { AlertTriangle } from 'lucide-react';

interface ReportErrorFormProps {
  movieId?: string;
  episodeId?: string;
  contentTitle: string;
}

const reportSchema = z.object({
  description: z.string().min(10, { message: 'Description must be at least 10 characters' })
});

const ReportErrorForm: React.FC<ReportErrorFormProps> = ({ movieId, episodeId, contentTitle }) => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = React.useState(false);
  
  const form = useForm<z.infer<typeof reportSchema>>({
    resolver: zodResolver(reportSchema),
    defaultValues: {
      description: ''
    }
  });
  
  const onSubmit = async (values: z.infer<typeof reportSchema>) => {
    if (!user) {
      toast.error('You must be logged in to report an error');
      setIsOpen(false);
      return;
    }
    
    try {
      const { error } = await supabase
        .from('error_reports')
        .insert({
          movie_id: movieId,
          episode_id: episodeId,
          user_id: user.id,
          description: values.description,
          status: 'new'
        });
        
      if (error) throw error;
      
      toast.success('Error report submitted successfully');
      form.reset();
      setIsOpen(false);
    } catch (error: any) {
      toast.error(`Error: ${error.message}`);
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <AlertTriangle className="mr-2 h-4 w-4" />
          Report Error
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Report Playback Error</DialogTitle>
          <DialogDescription>
            Report an issue with playback or content for "{contentTitle}".
          </DialogDescription>
        </DialogHeader>
        
        {user ? (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Describe the issue</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Please describe the problem you're experiencing..." 
                        className="min-h-[150px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsOpen(false)} type="button">
                  Cancel
                </Button>
                <Button type="submit">
                  Submit Report
                </Button>
              </DialogFooter>
            </form>
          </Form>
        ) : (
          <div className="space-y-4 py-4">
            <p className="text-center">You need to be logged in to report an error.</p>
            <div className="flex justify-center">
              <Button onClick={() => window.location.href = '/auth'}>
                Sign In
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ReportErrorForm;
