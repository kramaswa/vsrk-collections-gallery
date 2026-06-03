
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { MediaItem } from '@/lib/supabase';
import { Badge } from '@/components/ui/badge';
import { Tag } from 'lucide-react';

interface MediaCardProps {
  item: MediaItem;
  onClick: () => void;
}

const MediaCard: React.FC<MediaCardProps> = ({ item, onClick }) => {
  return (
    <Card className="overflow-hidden group cursor-pointer hover:shadow-md transition-shadow duration-300" onClick={onClick}>
      <CardContent className="p-0">
        <div className="video-container">
          {item.type === 'image' ? (
            <img
              src={item.media_url}
              alt={item.title}
              className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="relative">
              <img
                src={item.thumbnail_url || item.media_url}
                alt={item.title}
                className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
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
          <div className="flex items-center mt-2">
            <Badge variant="outline" className="text-xs flex items-center gap-1 capitalize">
              <Tag className="h-3 w-3" />
              {item.category || 'uncategorized'}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MediaCard;
