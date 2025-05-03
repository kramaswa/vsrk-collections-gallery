
import React, { useState, useEffect, useCallback } from 'react';
import { useMedia } from '@/contexts/MediaContext';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { AspectRatio } from '@/components/ui/aspect-ratio';

const FeaturedSlider: React.FC = () => {
  const { featuredItems } = useMedia();
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const goToNext = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % featuredItems.length);
  }, [featuredItems.length]);
  
  const goToPrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + featuredItems.length) % featuredItems.length);
  };
  
  // Auto-advance the slider every 5 seconds
  useEffect(() => {
    if (featuredItems.length <= 1) return;
    
    const interval = setInterval(goToNext, 5000);
    return () => clearInterval(interval);
  }, [featuredItems.length, goToNext]);
  
  if (featuredItems.length === 0) {
    return null;
  }
  
  return (
    <div className="relative w-full h-[600px] overflow-hidden bg-gray-100">
      {featuredItems.map((item, index) => (
        <div
          key={item.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentIndex ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        >
          {item.type === 'image' ? (
            <div className="w-full h-full relative">
              <img
                src={item.media_url}
                alt={item.title}
                className="w-full h-full object-contain md:object-cover"
                loading={index === currentIndex ? "eager" : "lazy"}
              />
            </div>
          ) : (
            <video
              src={item.media_url}
              className="w-full h-full object-cover"
              autoPlay
              muted
              loop
              playsInline
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
