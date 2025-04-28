
import React from 'react';
import MediaCard from './MediaCard';
import { useMedia, MediaItem } from '@/contexts/MediaContext';
import { Skeleton } from '@/components/ui/skeleton';

interface MediaGridProps {
  items?: MediaItem[];
  featuredOnly?: boolean;
}

const MediaGrid: React.FC<MediaGridProps> = ({ items, featuredOnly = false }) => {
  const { mediaItems, featuredItems, isLoading } = useMedia();
  
  // Determine which items to display
  const displayItems = items || (featuredOnly ? featuredItems : mediaItems);
  
  if (isLoading) {
    return (
      <div className="gallery-grid">
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
        <h3 className="font-serif text-xl">No items to display</h3>
        <p className="text-gray-500 mt-2">Check back soon for new additions to our collection.</p>
      </div>
    );
  }

  return (
    <div className="gallery-grid">
      {displayItems.map((item) => (
        <MediaCard key={item.id} item={item} />
      ))}
    </div>
  );
};

export default MediaGrid;
