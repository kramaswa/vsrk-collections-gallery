
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { MediaItem } from '@/lib/supabase';

interface MediaCardProps {
  item: MediaItem;
}

const MediaCard: React.FC<MediaCardProps> = ({ item }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const handleOpenDialog = () => setIsOpen(true);
  const handleCloseDialog = () => setIsOpen(false);

  return (
    <>
      <Card className="overflow-hidden group cursor-pointer hover:shadow-md transition-shadow duration-300" onClick={handleOpenDialog}>
        <CardContent className="p-0">
          <div className="video-container">
            {item.type === 'image' ? (
              <img 
                src={item.media_url} 
                alt={item.title}
                className="w-full h-[300px] object-cover transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
              />
            ) : (
              <div className="relative">
                <img 
                  src={item.thumbnail_url || item.media_url} 
                  alt={item.title}
                  className="w-full h-[300px] object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-white/80 flex items-center justify-center">
                    <div className="w-0 h-0 border-t-8 border-t-transparent border-l-12 border-l-vsrk-dark border-b-8 border-b-transparent ml-1"></div>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="p-4">
            <h3 className="font-serif text-lg font-medium truncate">{item.title}</h3>
            <p className="text-sm text-gray-600 line-clamp-2">{item.description}</p>
          </div>
        </CardContent>
      </Card>
      
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-2xl">
          <div className="p-2">
            {item.type === 'image' ? (
              <img 
                src={item.media_url} 
                alt={item.title} 
                className="w-full h-auto rounded-md"
              />
            ) : (
              <video 
                src={item.media_url} 
                controls
                className="w-full h-auto rounded-md"
                autoPlay
                playsInline
              >
                Your browser does not support the video tag.
              </video>
            )}
            <div className="mt-4">
              <h3 className="font-serif text-xl font-medium">{item.title}</h3>
              <p className="text-gray-600 mt-2">{item.description}</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MediaCard;
