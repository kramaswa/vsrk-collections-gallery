import React, { useState, useEffect } from 'react';
import { useMedia, MediaItem } from '@/contexts/MediaContext';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/components/ui/use-toast';
import { 
  Trash2, 
  Search,
  Image as ImageIcon, 
  Video as VideoIcon,
  ArrowUp,
  ArrowDown,
  Loader2,
  RefreshCw,
  Pencil,
  Tag
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { format } from 'date-fns';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { JEWELRY_CATEGORIES } from '@/lib/constants';

type SortField = 'title' | 'type' | 'created_at' | 'category';
type SortOrder = 'asc' | 'desc';

const MediaManager: React.FC = () => {
  const { mediaItems, deleteMediaItem, toggleFeatured, isLoading, refreshMedia, updateMediaItem } = useMedia();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<SortField>('created_at');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [itemToEdit, setItemToEdit] = useState<MediaItem | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const { toast } = useToast();
  
  const handleDelete = async (id: string) => {
    setDeletingId(id);
    const success = await deleteMediaItem(id);
    if (success) {
      setItemToDelete(null);
    }
    setDeletingId(null);
  };
  
  const handleToggleFeatured = async (id: string, currentState: boolean) => {
    const success = await toggleFeatured(id);
    if (success) {
      toast({
        title: currentState ? "Removed from featured" : "Added to featured",
        description: `Item has been ${currentState ? "removed from" : "added to"} featured items`,
      });
    }
  };
  
  const handleEditOpen = (item: MediaItem) => {
    setItemToEdit(item);
    setEditTitle(item.title);
    setEditDescription(item.description || '');
    setEditCategory(item.category || 'uncategorized');
  };
  
  const handleEditClose = () => {
    setItemToEdit(null);
    setEditTitle('');
    setEditDescription('');
    setEditCategory('');
  };
  
  const handleEditSave = async () => {
    if (!itemToEdit) return;
    
    setIsEditing(true);
    const success = await updateMediaItem(itemToEdit.id, {
      title: editTitle,
      description: editDescription,
      category: editCategory
    });
    
    if (success) {
      toast({
        title: "Media updated",
        description: "The media item has been updated successfully",
      });
      handleEditClose();
    }
    setIsEditing(false);
  };
  
  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };
  
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshMedia();
    setIsRefreshing(false);
    toast({
      title: "Media refreshed",
      description: "The media list has been refreshed with the latest items",
    });
  };
  
  // Apply filters
  const filteredItems = mediaItems.filter(item => {
    const matchesSearch = 
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });
  
  // Sort filtered items
  const sortedItems = [...filteredItems].sort((a, b) => {
    if (sortField === 'title') {
      return sortOrder === 'asc' 
        ? a.title.localeCompare(b.title)
        : b.title.localeCompare(a.title);
    } else if (sortField === 'type') {
      return sortOrder === 'asc'
        ? a.type.localeCompare(b.type)
        : b.type.localeCompare(a.type);
    } else if (sortField === 'category') {
      return sortOrder === 'asc'
        ? (a.category || '').localeCompare(b.category || '')
        : (b.category || '').localeCompare(a.category || '');
    } else if (sortField === 'created_at') {
      return sortOrder === 'asc'
        ? new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        : new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    }
    return 0;
  });
  
  // Display a message if no items after upload
  useEffect(() => {
    if (!isLoading && mediaItems.length === 0) {
      console.log("No media items found in MediaManager");
    } else {
      console.log(`Found ${mediaItems.length} media items`);
    }
  }, [mediaItems, isLoading]);
  
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-serif text-2xl font-semibold">Manage Media</h2>
        
        <Button 
          variant="outline" 
          size="sm"
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="flex items-center gap-1"
        >
          {isRefreshing ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4" />
          )}
          Refresh
        </Button>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="text"
            placeholder="Search media..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="w-full sm:w-[200px]">
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger>
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {JEWELRY_CATEGORIES.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="flex gap-2 mb-4 flex-wrap">
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => toggleSort('title')}
          className="flex items-center"
        >
          Title
          {sortField === 'title' && (
            sortOrder === 'asc' ? <ArrowUp className="ml-1 h-3 w-3" /> : <ArrowDown className="ml-1 h-3 w-3" />
          )}
        </Button>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => toggleSort('type')}
          className="flex items-center"
        >
          Type
          {sortField === 'type' && (
            sortOrder === 'asc' ? <ArrowUp className="ml-1 h-3 w-3" /> : <ArrowDown className="ml-1 h-3 w-3" />
          )}
        </Button>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => toggleSort('category')}
          className="flex items-center"
        >
          Category
          {sortField === 'category' && (
            sortOrder === 'asc' ? <ArrowUp className="ml-1 h-3 w-3" /> : <ArrowDown className="ml-1 h-3 w-3" />
          )}
        </Button>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => toggleSort('created_at')}
          className="flex items-center"
        >
          Date
          {sortField === 'created_at' && (
            sortOrder === 'asc' ? <ArrowUp className="ml-1 h-3 w-3" /> : <ArrowDown className="ml-1 h-3 w-3" />
          )}
        </Button>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 text-vsrk-gold animate-spin" />
          <span className="ml-2 text-lg text-gray-600">Loading...</span>
        </div>
      ) : sortedItems.length === 0 ? (
        <div className="text-center py-8 border border-dashed rounded-md">
          <p className="text-gray-500">
            {searchTerm || categoryFilter !== 'all' ? "No media items match your search" : "No media items found"}
          </p>
          {!searchTerm && categoryFilter === 'all' && (
            <Button 
              variant="outline"
              onClick={handleRefresh}
              className="mt-4"
            >
              Refresh Media List
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {sortedItems.map(item => (
            <MediaListItem
              key={item.id}
              item={item}
              onDelete={() => setItemToDelete(item.id)}
              onToggleFeatured={() => handleToggleFeatured(item.id, item.featured)}
              onEdit={() => handleEditOpen(item)}
              isDeleting={deletingId === item.id}
            />
          ))}
        </div>
      )}
      
      <AlertDialog open={!!itemToDelete} onOpenChange={() => setItemToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this item?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the media item from your collection.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => itemToDelete && handleDelete(itemToDelete)}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      <Dialog open={!!itemToEdit} onOpenChange={(open) => !open && handleEditClose()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Media Item</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-title">Title</Label>
              <Input
                id="edit-title"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                placeholder="Media title"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-description">Description</Label>
              <Input
                id="edit-description"
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                placeholder="Media description"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-category">Category</Label>
              <Select value={editCategory} onValueChange={setEditCategory}>
                <SelectTrigger id="edit-category">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {JEWELRY_CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={handleEditClose}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleEditSave}
              disabled={!editTitle.trim() || isEditing}
              className="ml-2"
            >
              {isEditing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : 'Save Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

interface MediaListItemProps {
  item: MediaItem;
  onDelete: () => void;
  onToggleFeatured: () => void;
  onEdit: () => void;
  isDeleting: boolean;
}

const MediaListItem: React.FC<MediaListItemProps> = ({ 
  item, 
  onDelete,
  onToggleFeatured,
  onEdit,
  isDeleting 
}) => {
  const formattedDate = format(new Date(item.created_at), 'MMM d, yyyy');
  
  return (
    <div className="flex gap-4 p-3 border rounded-md hover:bg-gray-50">
      <div className="w-16 h-16 rounded overflow-hidden flex-shrink-0">
        {item.type === 'image' ? (
          <img 
            src={item.media_url} 
            alt={item.title} 
            className="w-full h-full object-cover"
          />
        ) : (
          <img 
            src={item.thumbnail_url || item.media_url} 
            alt={item.title} 
            className="w-full h-full object-cover"
          />
        )}
      </div>
      
      <div className="flex-grow min-w-0">
        <div className="flex items-center gap-2 mb-1">
          {item.type === 'image' ? (
            <ImageIcon className="h-4 w-4 text-gray-400" />
          ) : (
            <VideoIcon className="h-4 w-4 text-gray-400" />
          )}
          <h3 className="font-medium truncate">{item.title}</h3>
          <span className="text-xs text-gray-500">({formattedDate})</span>
        </div>
        <p className="text-sm text-gray-500 line-clamp-1">{item.description}</p>
        <div className="flex items-center mt-1">
          <Tag className="h-3 w-3 text-gray-400 mr-1" />
          <span className="text-xs text-gray-500 capitalize">{item.category || 'uncategorized'}</span>
        </div>
      </div>
      
      <div className="flex items-center space-x-2 flex-shrink-0">
        <div className="flex items-center space-x-1">
          <Checkbox
            id={`featured-${item.id}`}
            checked={item.featured}
            onCheckedChange={onToggleFeatured}
            className="text-vsrk-gold"
          />
          <label htmlFor={`featured-${item.id}`} className="text-xs">Featured</label>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onEdit}
          className="text-blue-600 h-8 w-8 p-0"
        >
          <Pencil className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={onDelete}
          className="text-red-600 h-8 w-8 p-0"
          disabled={isDeleting}
        >
          {isDeleting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Trash2 className="h-4 w-4" />
          )}
        </Button>
      </div>
    </div>
  );
};

export default MediaManager;
