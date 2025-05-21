
import React from 'react';
import MediaCard from './MediaCard';
import { useMedia } from '@/contexts/MediaContext';
import { MediaItem } from '@/lib/supabase';
import { Skeleton } from '@/components/ui/skeleton';

interface MediaGridProps {
  items?: MediaItem[];
  featuredOnly?: boolean;
  searchQuery?: string;
  viewMode?: 'grid' | 'list';
  categoryFilter?: string;
}

const MediaGrid: React.FC<MediaGridProps> = ({ 
  items, 
  featuredOnly = false, 
  searchQuery = '',
  viewMode = 'grid',
  categoryFilter = ''
}) => {
  const { mediaItems, featuredItems, isLoading } = useMedia();
  
  // Determine which items to display
  let displayItems = items || (featuredOnly ? featuredItems : mediaItems);
  
  // Apply search filter if provided
  if (searchQuery) {
    displayItems = displayItems.filter(item => 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.description?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false)
    );
  }
  
  // Apply category filter if provided
  if (categoryFilter) {
    displayItems = displayItems.filter(item => item.category === categoryFilter);
  }
  
  if (isLoading) {
    return (
      <div className={viewMode === 'grid' ? "gallery-grid" : "space-y-4"}>
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="space-y-3">
            <Skeleton className="w-full h-[300px] rounded-md" />
            <Skeleton className="w-3/4 h-5" />
            <Skeleton className="w-full h-4" />
          </div>
        ))}
      </div>
    );
  }
  
  if (displayItems.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="font-serif text-xl">
          {searchQuery || categoryFilter ? "No items match your criteria" : "No items to display"}
        </h3>
        <p className="text-gray-500 mt-2">
          {searchQuery || categoryFilter 
            ? "Try changing your search terms or category" 
            : "Check back soon for new additions to our collection."}
        </p>
      </div>
    );
  }

  return (
    <div className={viewMode === 'grid' ? "gallery-grid" : "space-y-6"}>
      {displayItems.map((item) => (
        <MediaCard key={item.id} item={item} />
      ))}
    </div>
  );
};

export default MediaGrid;
