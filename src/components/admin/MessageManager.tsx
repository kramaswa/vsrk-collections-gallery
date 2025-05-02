
import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Check, Search, X, ArrowUp, ArrowDown } from 'lucide-react';

// Define the contact message type
type ContactMessage = {
  id: string;
  name: string;
  email: string;
  message: string;
  read: boolean;
  created_at: string;
};

const MessageManager: React.FC = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<'created_at' | 'name' | 'email'>('created_at');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const messagesPerPage = 10;
  
  // Fetch contact messages
  const { data: messages, isLoading, isError } = useQuery({
    queryKey: ['contact-messages', currentPage, searchTerm, sortField, sortDirection],
    queryFn: async () => {
      let query = supabase
        .from('contact_messages')
        .select('*')
        .order(sortField, { ascending: sortDirection === 'asc' });
        
      if (searchTerm) {
        query = query.or(`name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%,message.ilike.%${searchTerm}%`);
      }
      
      // Calculate pagination range
      const from = (currentPage - 1) * messagesPerPage;
      const to = from + messagesPerPage - 1;
      query = query.range(from, to);
      
      const { data, error } = await query;
      
      if (error) {
        throw new Error(error.message);
      }
      
      return data as ContactMessage[];
    }
  });
  
  // Get total count for pagination
  const { data: totalCount = 0 } = useQuery({
    queryKey: ['contact-messages-count', searchTerm],
    queryFn: async () => {
      let query = supabase
        .from('contact_messages')
        .select('id', { count: 'exact' });
        
      if (searchTerm) {
        query = query.or(`name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%,message.ilike.%${searchTerm}%`);
      }
      
      const { count, error } = await query;
      
      if (error) {
        throw new Error(error.message);
      }
      
      return count || 0;
    }
  });
  
  // Mark message as read/unread
  const toggleReadStatus = useMutation({
    mutationFn: async (message: ContactMessage) => {
      const { error } = await supabase
        .from('contact_messages')
        .update({ read: !message.read })
        .eq('id', message.id);
        
      if (error) {
        throw new Error(error.message);
      }
      
      return { ...message, read: !message.read };
    },
    onSuccess: (updatedMessage) => {
      queryClient.invalidateQueries({ queryKey: ['contact-messages'] });
      toast({
        title: updatedMessage.read ? 'Message marked as read' : 'Message marked as unread',
        description: `Message from ${updatedMessage.name} has been updated.`,
      });
      
      // Update selected message if it's the one being toggled
      if (selectedMessage && selectedMessage.id === updatedMessage.id) {
        setSelectedMessage(updatedMessage);
      }
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to update message: ${error.message}`,
        variant: 'destructive',
      });
    }
  });
  
  const totalPages = Math.ceil(totalCount / messagesPerPage);
  
  // Reset to first page when search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);
  
  const handleSort = (field: 'created_at' | 'name' | 'email') => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };
  
  const renderSortIcon = (field: 'created_at' | 'name' | 'email') => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? <ArrowUp className="h-4 w-4 ml-1" /> : <ArrowDown className="h-4 w-4 ml-1" />;
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };
  
  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h2 className="text-2xl font-serif">Contact Messages</h2>
        <div className="relative w-full md:w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input 
            placeholder="Search messages..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">All Messages ({totalCount})</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {isLoading ? (
                <div className="p-6 text-center">Loading messages...</div>
              ) : isError ? (
                <div className="p-6 text-center text-red-500">Error loading messages</div>
              ) : messages && messages.length > 0 ? (
                <div className="overflow-auto max-h-[600px]">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead 
                          className="cursor-pointer w-full"
                          onClick={() => handleSort('name')}
                        >
                          <div className="flex items-center">
                            Sender {renderSortIcon('name')}
                          </div>
                        </TableHead>
                        <TableHead 
                          className="text-right cursor-pointer"
                          onClick={() => handleSort('created_at')}
                        >
                          <div className="flex items-center justify-end">
                            Date {renderSortIcon('created_at')}
                          </div>
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {messages.map((message) => (
                        <TableRow 
                          key={message.id} 
                          className={`cursor-pointer ${selectedMessage?.id === message.id ? 'bg-muted' : ''}`}
                          onClick={() => setSelectedMessage(message)}
                        >
                          <TableCell className="font-medium flex items-center gap-2">
                            {!message.read && (
                              <Badge variant="default" className="h-2 w-2 p-0 rounded-full bg-vsrk-gold" />
                            )}
                            {message.name}
                          </TableCell>
                          <TableCell className="text-right text-sm text-muted-foreground">
                            {new Date(message.created_at).toLocaleDateString()}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="p-6 text-center text-gray-500">No messages found</div>
              )}
            </CardContent>
          </Card>
          
          {totalPages > 1 && (
            <Pagination className="mt-4">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} 
                    className={`cursor-pointer ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                  />
                </PaginationItem>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(page => {
                    // Show first page, last page, current page, and pages around current
                    return page === 1 || 
                           page === totalPages || 
                           (page >= currentPage - 1 && page <= currentPage + 1);
                  })
                  .map((page, i, array) => {
                    // Add ellipsis
                    if (i > 0 && page > array[i-1] + 1) {
                      return (
                        <React.Fragment key={`ellipsis-${page}`}>
                          <PaginationItem>
                            <span className="px-2">...</span>
                          </PaginationItem>
                          <PaginationItem key={page}>
                            <PaginationLink 
                              onClick={() => setCurrentPage(page)}
                              isActive={page === currentPage}
                            >
                              {page}
                            </PaginationLink>
                          </PaginationItem>
                        </React.Fragment>
                      );
                    }
                    return (
                      <PaginationItem key={page}>
                        <PaginationLink 
                          onClick={() => setCurrentPage(page)}
                          isActive={page === currentPage}
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  })
                }
                
                <PaginationItem>
                  <PaginationNext 
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))} 
                    className={`cursor-pointer ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''}`}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </div>
        
        <div className="md:col-span-2">
          {selectedMessage ? (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-lg">{selectedMessage.name}</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">{selectedMessage.email}</p>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => toggleReadStatus.mutate(selectedMessage)}
                    className="flex items-center gap-1"
                  >
                    {selectedMessage.read ? (
                      <>
                        <X className="h-4 w-4" /> Mark as unread
                      </>
                    ) : (
                      <>
                        <Check className="h-4 w-4" /> Mark as read
                      </>
                    )}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground mb-4">
                  Received: {formatDate(selectedMessage.created_at)}
                </div>
                <div className="whitespace-pre-wrap bg-muted p-4 rounded-md">
                  {selectedMessage.message}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="flex items-center justify-center h-[400px] text-center text-muted-foreground">
                <p>Select a message to view its contents</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageManager;
