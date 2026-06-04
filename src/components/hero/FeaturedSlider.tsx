
import React, { useState, useEffect, useCallback } from 'react';
import { useMedia } from '@/contexts/MediaContext';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, Loader2, RefreshCw } from 'lucide-react';

const FeaturedSlider: React.FC = () => {
  const { featuredItems, refreshMedia, isLoading } = useMedia();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  
  const goToNext = useCallback(() => {
    if (featuredItems.length > 0) {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % featuredItems.length);
      setIsImageLoaded(false); // Reset image loaded state for new slide
    }
  }, [featuredItems.length]);
  
  const goToPrev = useCallback(() => {
    if (featuredItems.length > 0) {
      setCurrentIndex((prevIndex) => (prevIndex - 1 + featuredItems.length) % featuredItems.length);
      setIsImageLoaded(false); // Reset image loaded state for new slide
    }
  }, [featuredItems.length]);
  
  // Force refresh the media items when component mounts and whenever retry counter changes
  useEffect(() => {
    console.log('FeaturedSlider mounted or retry requested, refreshing media items');
    refreshMedia();
  }, [refreshMedia, retryCount]);
  
  // Reset current index when featured items change
  useEffect(() => {
    if (featuredItems.length > 0 && currentIndex >= featuredItems.length) {
      setCurrentIndex(0);
    }
    
    console.log('Featured items updated in slider:', featuredItems.length);
  }, [featuredItems, currentIndex]);
  
  // Auto-advance the slider every 5 seconds
  useEffect(() => {
    if (featuredItems.length <= 1) return;
    
    const interval = setInterval(goToNext, 5000);
    return () => clearInterval(interval);
  }, [featuredItems.length, goToNext]);
  
  const handleManualRefresh = () => {
    setRetryCount(prev => prev + 1);
  };
  
  // If loading, show loader
  if (isLoading) {
    return (
      <div className="relative w-full h-[600px] overflow-hidden bg-black flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto text-white mb-4" />
          <p className="text-white text-lg">Loading featured items...</p>
        </div>
      </div>
    );
  }
  
  // If no featured items, show message with refresh button
  if (featuredItems.length === 0) {
    return (
      <div className="relative w-full h-[600px] overflow-hidden bg-black flex items-center justify-center">
        <div className="text-center">
          <p className="text-white text-xl mb-4">No featured items to display</p>
          <Button 
            variant="outline" 
            onClick={handleManualRefresh}
            className="text-white border-white hover:bg-white/20 flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
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
            <div className="w-full h-full">
              {!isImageLoaded && index === currentIndex && (
                <Loader2 className="h-8 w-8 animate-spin text-white absolute z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
              )}
              <img
                src={item.media_url}
                alt={item.title}
                className="w-full h-full object-cover object-top"
                loading={index === currentIndex ? "eager" : "lazy"}
                onLoad={() => setIsImageLoaded(true)}
                onError={(e) => {
                  console.error(`Error loading image: ${item.media_url}`, e);
                  setIsImageLoaded(true);
                }}
              />
            </div>
          ) : (
            <video
              src={item.media_url}
              className="w-full h-full object-contain"
              autoPlay
              muted
              loop
              playsInline
              onError={(e) => console.error(`Error loading video: ${item.media_url}`, e)}
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
            <h2 className="font-serif text-3xl sm:text-4xl mb-2">{item.title}</h2>
            <p className="text-lg mb-6 max-w-md">{item.description}</p>
          </div>
        </div>
      ))}
      
      {featuredItems.length > 1 && (
        <div className="absolute bottom-8 right-8 flex space-x-2">
          <Button
            variant="outline"
            size="icon"
            className="rounded-full bg-white/20 border-white/40 hover:bg-white/40"
            onClick={goToPrev}
          >
            <ArrowLeft className="h-5 w-5 text-white" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="rounded-full bg-white/20 border-white/40 hover:bg-white/40"
            onClick={goToNext}
          >
            <ArrowRight className="h-5 w-5 text-white" />
          </Button>
        </div>
      )}
      
      {featuredItems.length > 1 && (
        <div className="absolute bottom-8 left-0 right-0">
          <div className="flex justify-center space-x-2">
            {featuredItems.map((_, index) => (
              <button
                key={index}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentIndex ? 'bg-white w-4' : 'bg-white/50'
                }`}
                onClick={() => setCurrentIndex(index)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FeaturedSlider;
