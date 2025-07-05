
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { RefreshCw, Send, Clipboard } from 'lucide-react';

const inviteSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' })
});

const AdminInvite = () => {
  const { user } = useAuth();
  const [invitations, setInvitations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [resetKey, setResetKey] = useState(0);
  
  const form = useForm<z.infer<typeof inviteSchema>>({
    resolver: zodResolver(inviteSchema),
    defaultValues: {
      email: ''
    }
  });
  
  // Fetch invitations
  useEffect(() => {
    const fetchInvitations = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('admin_invitations')
          .select('*')
          .order('created_at', { ascending: false });
          
        if (error) throw error;
        setInvitations(data || []);
      } catch (error) {
        console.error('Error fetching invitations:', error);
        toast.error('Failed to load invitations');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchInvitations();
  }, [resetKey]);
  
  // Generate random code
  const generateCode = () => {
    return Math.random().toString(36).substring(2, 10).toUpperCase();
  };
  
  // Handle invitation submission
  const onSubmit = async (values: z.infer<typeof inviteSchema>) => {
    try {
      // Check if email already invited
      const { data: existingInvite } = await supabase
        .from('admin_invitations')
        .select('*')
        .eq('email', values.email)
        .single();
        
      if (existingInvite) {
        toast.error('This email has already been invited');
        return;
      }
      
      const code = generateCode();
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + 7); // Expire in 7 days
      
      const { error } = await supabase
        .from('admin_invitations')
        .insert({
          email: values.email,
          code: code,
          created_by: user?.id,
          expires_at: expiryDate.toISOString(),
          used: false
        });
        
      if (error) throw error;
      
      toast.success(`Invitation sent to ${values.email}`);
      form.reset();
      setResetKey(prev => prev + 1); // Force refetch
    } catch (error: any) {
      toast.error(`Error: ${error.message}`);
    }
  };
  
  // Copy invitation link
  const copyInvitationLink = (invitation: any) => {
    const baseUrl = window.location.origin;
    const invitationLink = `${baseUrl}/auth?code=${invitation.code}&email=${invitation.email}`;
    
    navigator.clipboard.writeText(invitationLink);
    toast.success('Invitation link copied to clipboard');
  };
  
  // Format date
  const formatDate = (dateString: string | null) => {
    if (!dateString) return '—';
    return new Date(dateString).toLocaleString();
  };
  
  // Check if invitation is expired
  const isExpired = (expiresAt: string) => {
    return new Date(expiresAt) < new Date();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Admin Invitations</h1>
        <Button variant="outline" onClick={() => setResetKey(prev => prev + 1)}>
          <RefreshCw className="mr-2 h-4 w-4" /> Refresh
        </Button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="p-0">
              {isLoading ? (
                <div className="flex justify-center p-10">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Email</TableHead>
                        <TableHead>Invitation Code</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Expires</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {invitations.length > 0 ? (
                        invitations.map((invitation) => (
                          <TableRow key={invitation.id}>
                            <TableCell className="font-medium">{invitation.email}</TableCell>
                            <TableCell>{invitation.code}</TableCell>
                            <TableCell>
                              {invitation.used ? (
                                <Badge className="bg-green-500">Used</Badge>
                              ) : isExpired(invitation.expires_at) ? (
                                <Badge className="bg-red-500">Expired</Badge>
                              ) : (
                                <Badge className="bg-amber-500">Pending</Badge>
                              )}
                            </TableCell>
                            <TableCell>{formatDate(invitation.expires_at)}</TableCell>
                            <TableCell className="text-right">
                              {!invitation.used && !isExpired(invitation.expires_at) && (
                                <Button 
                                  variant="outline" 
                                  size="icon" 
                                  onClick={() => copyInvitationLink(invitation)}
                                >
                                  <Clipboard className="h-4 w-4" />
                                </Button>
                              )}
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-10">
                            No invitations found
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
        
        <div>
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-xl font-semibold mb-4">Invite New Admin</h2>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter email address" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button type="submit" className="w-full">
                    <Send className="mr-2 h-4 w-4" /> Send Invitation
                  </Button>
                </form>
              </Form>
              
              <div className="mt-6 text-sm text-muted-foreground">
                <p>This will generate a unique invitation code that can be used only once to create an admin account.</p>
                <p className="mt-2">Invitations expire after 7 days.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminInvite;
