
import React, { useState, useEffect, useCallback } from 'react';
import { useMedia } from '@/contexts/MediaContext';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

const FeaturedSlider: React.FC = () => {
  const { featuredItems, refreshMedia, isLoading } = useMedia();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [retryCount, setRetryCount] = useState(0);

  const goToNext = useCallback(() => {
    if (featuredItems.length > 0) {
      setCurrentIndex((prev) => (prev + 1) % featuredItems.length);
    }
  }, [featuredItems.length]);

  useEffect(() => { refreshMedia(); }, [refreshMedia, retryCount]);

  useEffect(() => {
    if (featuredItems.length > 0 && currentIndex >= featuredItems.length) setCurrentIndex(0);
  }, [featuredItems.length, currentIndex]);

  useEffect(() => {
    if (featuredItems.length <= 1) return;
    const interval = setInterval(goToNext, 5000);
    return () => clearInterval(interval);
  }, [featuredItems.length, goToNext]);

  if (isLoading) {
    return (
      <div className="relative w-full h-[600px] bg-black flex items-center justify-center">
        <p className="text-white text-lg">Loading...</p>
      </div>
    );
  }

  if (featuredItems.length === 0) {
    return (
      <div className="relative w-full h-[600px] bg-black flex items-center justify-center">
        <div className="text-center">
          <p className="text-white text-xl mb-4">No featured items to display</p>
          <Button variant="outline" onClick={() => setRetryCount(c => c + 1)} className="text-white border-white hover:bg-white/20 flex items-center gap-2">
            <RefreshCw className="h-4 w-4" /> Refresh
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[600px] overflow-hidden bg-black">
      {featuredItems.map((item, index) => (
        <div
          key={item.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentIndex ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        >
          {item.type === 'image' ? (
            <img
              src={item.media_url}
              alt={item.title}
              className="w-full h-full object-contain"
              loading={index === currentIndex ? 'eager' : 'lazy'}
            />
          ) : (
            <video
              src={item.media_url}
              className="w-full h-full object-contain"
              autoPlay muted loop playsInline
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
            <h2 className="font-serif text-3xl sm:text-4xl mb-2">{item.title}</h2>
            <p className="text-lg max-w-md">{item.description}</p>
          </div>
        </div>
      ))}

      {featuredItems.length > 1 && (
        <div className="absolute bottom-8 left-0 right-0 flex justify-center space-x-2">
          {featuredItems.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`h-2 rounded-full transition-all ${
                i === currentIndex ? 'w-4 bg-white' : 'w-2 bg-white/50'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default FeaturedSlider;
