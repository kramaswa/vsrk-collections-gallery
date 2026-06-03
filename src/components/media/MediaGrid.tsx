
import React, { useState, useEffect, useCallback } from 'react';
import MediaCard from './MediaCard';
import { useMedia } from '@/contexts/MediaContext';
import { MediaItem } from '@/lib/supabase';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, MessageCircle } from 'lucide-react';
import { useWhatsAppNumber } from '@/hooks/useWhatsAppNumber';

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
  const whatsappNumber = useWhatsAppNumber();
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  let displayItems = items || (featuredOnly ? featuredItems : mediaItems);

  if (searchQuery) {
    displayItems = displayItems.filter(item =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.description?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false)
    );
  }

  if (categoryFilter) {
    displayItems = displayItems.filter(item => item.category === categoryFilter);
  }

  const selectedItem = selectedIndex !== null ? displayItems[selectedIndex] : null;

  const goNext = useCallback(() => {
    setSelectedIndex(i => (i !== null ? (i + 1) % displayItems.length : null));
  }, [displayItems.length]);

  const goPrev = useCallback(() => {
    setSelectedIndex(i => (i !== null ? (i - 1 + displayItems.length) % displayItems.length : null));
  }, [displayItems.length]);

  useEffect(() => {
    if (selectedIndex === null) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') goNext();
      if (e.key === 'ArrowLeft') goPrev();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [selectedIndex, goNext, goPrev]);

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
    <>
      <div className={viewMode === 'grid' ? "gallery-grid" : "space-y-6"}>
        {displayItems.map((item, index) => (
          <MediaCard key={item.id} item={item} onClick={() => setSelectedIndex(index)} />
        ))}
      </div>

      <Dialog open={selectedIndex !== null} onOpenChange={(open) => { if (!open) setSelectedIndex(null); }}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedItem && (
            <div className="p-2">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 min-w-0">
                  <h3 className="font-serif text-xl font-medium truncate">{selectedItem.title}</h3>
                  <Badge variant="outline" className="capitalize shrink-0">{selectedItem.category || 'uncategorized'}</Badge>
                </div>
                <a
                  href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(`Hi! I'm interested in: ${selectedItem.title} from VSRK Collections`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-3 py-2 rounded-md bg-green-500 hover:bg-green-600 text-white font-medium text-sm transition-colors shrink-0 ml-2"
                >
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Inquire on WhatsApp
                </a>
              </div>

              <div className="relative">
                {selectedItem.type === 'image' ? (
                  <img src={selectedItem.media_url} alt={selectedItem.title} className="w-full h-auto rounded-md" />
                ) : (
                  <video src={selectedItem.media_url} controls className="w-full h-auto rounded-md" autoPlay playsInline>
                    Your browser does not support the video tag.
                  </video>
                )}

                {displayItems.length > 1 && (
                  <>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={(e) => { e.stopPropagation(); goPrev(); }}
                      className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white shadow"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={(e) => { e.stopPropagation(); goNext(); }}
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white shadow"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </Button>
                  </>
                )}
              </div>

              {selectedItem.description && (
                <p className="text-gray-600 mt-3">{selectedItem.description}</p>
              )}
              {displayItems.length > 1 && (
                <p className="text-center text-xs text-gray-400 mt-2">
                  {(selectedIndex ?? 0) + 1} / {displayItems.length}
                </p>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MediaGrid;
