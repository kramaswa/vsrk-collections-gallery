
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { MediaItem } from '@/lib/supabase';
import { Badge } from '@/components/ui/badge';
import { Tag, MessageCircle } from 'lucide-react';
import { useWhatsAppNumber } from '@/hooks/useWhatsAppNumber';

interface MediaCardProps {
  item: MediaItem;
}

const MediaCard: React.FC<MediaCardProps> = ({ item }) => {
  const [isOpen, setIsOpen] = useState(false);
  const whatsappNumber = useWhatsAppNumber();
  
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
                className="w-full h-[300px] object-contain bg-gray-50 transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
              />
            ) : (
              <div className="relative">
                <img 
                  src={item.thumbnail_url || item.media_url} 
                  alt={item.title}
                  className="w-full h-[300px] object-contain bg-gray-50 transition-transform duration-300 group-hover:scale-105"
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
      
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <div className="p-2">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <h3 className="font-serif text-xl font-medium">{item.title}</h3>
                <Badge variant="outline" className="capitalize">
                  {item.category || 'uncategorized'}
                </Badge>
              </div>
              <a
                href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(`Hi! I'm interested in: ${item.title} from VSRK Collections`)}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center px-3 py-2 rounded-md bg-green-500 hover:bg-green-600 text-white font-medium text-sm transition-colors shrink-0"
              >
                <MessageCircle className="mr-2 h-4 w-4" />
                Inquire on WhatsApp
              </a>
            </div>
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
            {item.description && (
              <p className="text-gray-600 mt-3">{item.description}</p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MediaCard;
