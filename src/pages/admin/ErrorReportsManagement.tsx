
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
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
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Search, FileText, CheckCircle, RefreshCw } from 'lucide-react';

const statusColors: Record<string, string> = {
  new: 'bg-red-500',
  investigating: 'bg-amber-500',
  fixed: 'bg-green-500',
  closed: 'bg-gray-500'
};

const ErrorReportsManagement = () => {
  const [reports, setReports] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedReport, setSelectedReport] = useState<any>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [resetKey, setResetKey] = useState(0);

  // Fetch error reports
  useEffect(() => {
    const fetchReports = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('error_reports')
          .select(`
            *,
            profiles:user_id(username),
            movies:movie_id(title, image_url),
            episodes:episode_id(title)
          `)
          .ilike('description', `%${searchQuery}%`);
          
        if (error) throw error;
        setReports(data || []);
      } catch (error) {
        console.error('Error fetching reports:', error);
        toast.error('Failed to load error reports');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchReports();
  }, [searchQuery, resetKey]);
  
  // Update report status
  const updateReportStatus = async () => {
    if (!selectedReport || !newStatus) return;
    
    try {
      const { error } = await supabase
        .from('error_reports')
        .update({ 
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', selectedReport.id);
        
      if (error) throw error;
      
      toast.success(`Report status updated to ${newStatus}`);
      setIsStatusDialogOpen(false);
      setSelectedReport(null);
      setNewStatus('');
      setResetKey(prev => prev + 1); // Force refetch
    } catch (error: any) {
      toast.error(`Error: ${error.message}`);
    }
  };
  
  // Format date
  const formatDate = (dateString: string | null) => {
    if (!dateString) return '—';
    return new Date(dateString).toLocaleString();
  };
  
  const getContentTitle = (report: any) => {
    if (report.movie_id && report.movies) {
      return report.movies.title;
    }
    if (report.episode_id && report.episodes) {
      return report.episodes.title;
    }
    return '—';
  };
  
  const getContentType = (report: any) => {
    if (report.movie_id && !report.episode_id) {
      return 'Movie/Series';
    }
    if (report.episode_id) {
      return 'Episode';
    }
    return '—';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Error Reports</h1>
      </div>
      
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search reports..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <Button variant="outline" onClick={() => setResetKey(prev => prev + 1)}>
          <RefreshCw className="mr-2 h-4 w-4" /> Refresh
        </Button>
      </div>
      
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
                    <TableHead>Content</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Reported By</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created At</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reports.length > 0 ? (
                    reports.map((report) => (
                      <TableRow key={report.id}>
                        <TableCell className="font-medium">
                          {getContentTitle(report)}
                        </TableCell>
                        <TableCell>{getContentType(report)}</TableCell>
                        <TableCell>{report.profiles?.username || '—'}</TableCell>
                        <TableCell>
                          <Badge className={statusColors[report.status] || 'bg-gray-500'}>
                            {report.status?.charAt(0).toUpperCase() + report.status?.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell>{formatDate(report.created_at)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button 
                              variant="outline" 
                              size="icon" 
                              onClick={() => {
                                setSelectedReport(report);
                                setIsDetailDialogOpen(true);
                              }}
                            >
                              <FileText className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="icon" 
                              onClick={() => {
                                setSelectedReport(report);
                                setNewStatus(report.status);
                                setIsStatusDialogOpen(true);
                              }}
                            >
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-10">
                        No error reports found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Report Detail Dialog */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Error Report Details</DialogTitle>
          </DialogHeader>
          
          {selectedReport && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Content</h3>
                  <p>{getContentTitle(selectedReport)}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Type</h3>
                  <p>{getContentType(selectedReport)}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Reported By</h3>
                  <p>{selectedReport.profiles?.username || '—'}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Status</h3>
                  <Badge className={statusColors[selectedReport.status] || 'bg-gray-500'}>
                    {selectedReport.status?.charAt(0).toUpperCase() + selectedReport.status?.slice(1)}
                  </Badge>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Created At</h3>
                  <p>{formatDate(selectedReport.created_at)}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Updated At</h3>
                  <p>{formatDate(selectedReport.updated_at)}</p>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Description</h3>
                <div className="p-4 rounded-md bg-secondary/50 whitespace-pre-wrap">
                  {selectedReport.description}
                </div>
              </div>
              
              {selectedReport.movie_id && selectedReport.movies?.image_url && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">Content Image</h3>
                  <img 
                    src={selectedReport.movies.image_url} 
                    alt="Content" 
                    className="w-full max-h-48 object-cover rounded-md"
                  />
                </div>
              )}
            </div>
          )}
          
          <DialogFooter>
            <Button onClick={() => setIsDetailDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Update Status Dialog */}
      <Dialog open={isStatusDialogOpen} onOpenChange={setIsStatusDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Report Status</DialogTitle>
            <DialogDescription>
              Change the status of this report.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Content</h3>
              <p>{selectedReport && getContentTitle(selectedReport)}</p>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="status">Status</label>
              <Select value={newStatus} onValueChange={setNewStatus}>
                <SelectTrigger id="status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="investigating">Investigating</SelectItem>
                  <SelectItem value="fixed">Fixed</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsStatusDialogOpen(false)}>Cancel</Button>
            <Button onClick={updateReportStatus}>Update Status</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ErrorReportsManagement;
