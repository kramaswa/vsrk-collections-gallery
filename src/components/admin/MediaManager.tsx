
import React, { useState } from 'react';
import { useMedia, MediaItem } from '@/contexts/MediaContext';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/components/ui/use-toast';
import { 
  Trash2, 
  Star, 
  Search,
  Image as ImageIcon, 
  Video as VideoIcon,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import { Input } from '@/components/ui/input';

type SortField = 'title' | 'type';
type SortOrder = 'asc' | 'desc';

const MediaManager: React.FC = () => {
  const { mediaItems, deleteMediaItem, toggleFeatured } = useMedia();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<SortField>('title');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const { toast } = useToast();
  
  const handleDelete = (id: string) => {
    deleteMediaItem(id);
    toast({
      title: "Deleted",
      description: "Media item has been deleted",
    });
  };
  
  const handleToggleFeatured = (id: string, currentState: boolean) => {
    toggleFeatured(id);
    toast({
      title: currentState ? "Removed from featured" : "Added to featured",
      description: `Item has been ${currentState ? "removed from" : "added to"} featured items`,
    });
  };
  
  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };
  
  const filteredItems = mediaItems.filter(item => 
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const sortedItems = [...filteredItems].sort((a, b) => {
    if (sortField === 'title') {
      return sortOrder === 'asc' 
        ? a.title.localeCompare(b.title)
        : b.title.localeCompare(a.title);
    } else if (sortField === 'type') {
      return sortOrder === 'asc'
        ? a.type.localeCompare(b.type)
        : b.type.localeCompare(a.type);
    }
    return 0;
  });
  
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="font-serif text-2xl font-semibold mb-6">Manage Media</h2>
      
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
        
        <div className="flex gap-2">
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
        </div>
      </div>
      
      {sortedItems.length === 0 ? (
        <div className="text-center py-8 border border-dashed rounded-md">
          <p className="text-gray-500">No media items found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {sortedItems.map(item => (
            <MediaListItem
              key={item.id}
              item={item}
              onDelete={handleDelete}
              onToggleFeatured={handleToggleFeatured}
            />
          ))}
        </div>
      )}
    </div>
  );
};

interface MediaListItemProps {
  item: MediaItem;
  onDelete: (id: string) => void;
  onToggleFeatured: (id: string, currentState: boolean) => void;
}

const MediaListItem: React.FC<MediaListItemProps> = ({ item, onDelete, onToggleFeatured }) => {
  return (
    <div className="flex gap-4 p-3 border rounded-md hover:bg-gray-50">
      <div className="w-16 h-16 rounded overflow-hidden flex-shrink-0">
        {item.type === 'image' ? (
          <img 
            src={item.url} 
            alt={item.title} 
            className="w-full h-full object-cover"
          />
        ) : (
          <img 
            src={item.thumbnail || item.url} 
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
        </div>
        <p className="text-sm text-gray-500 line-clamp-1">{item.description}</p>
      </div>
      
      <div className="flex items-center space-x-2 flex-shrink-0">
        <div className="flex items-center space-x-1">
          <Checkbox
            id={`featured-${item.id}`}
            checked={item.featured}
            onCheckedChange={() => onToggleFeatured(item.id, item.featured)}
            className="text-vsrk-gold"
          />
          <label htmlFor={`featured-${item.id}`} className="text-xs">Featured</label>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDelete(item.id)}
          className="text-red-600 h-8 w-8 p-0"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default MediaManager;
