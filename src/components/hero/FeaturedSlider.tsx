
import React, { useState, useEffect, useCallback } from 'react';
import { useMedia } from '@/contexts/MediaContext';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight, MessageCircle } from 'lucide-react';
import { useWhatsAppNumber } from '@/hooks/useWhatsAppNumber';

const FeaturedSlider: React.FC = () => {
  const { featuredItems, refreshMedia, isLoading } = useMedia();
  const [currentIndex, setCurrentIndex] = useState(0);
  const whatsappNumber = useWhatsAppNumber();

  const goToNext = useCallback(() => {
    if (featuredItems.length > 0) {
      setCurrentIndex((prev) => (prev + 1) % featuredItems.length);
    }
  }, [featuredItems.length]);

  useEffect(() => { refreshMedia(); }, [refreshMedia]);

  useEffect(() => {
    if (featuredItems.length > 0 && currentIndex >= featuredItems.length) setCurrentIndex(0);
  }, [featuredItems.length, currentIndex]);

  useEffect(() => {
    if (featuredItems.length <= 1) return;
    const interval = setInterval(goToNext, 5000);
    return () => clearInterval(interval);
  }, [featuredItems.length, goToNext]);

  if (isLoading || featuredItems.length === 0) {
    return <div className="w-full h-[480px] bg-vsrk-dark" />;
  }

  return (
    <div className="relative w-full h-[480px] overflow-hidden">
      {/* Images */}
      {featuredItems.map((item, index) => (
        <div
          key={item.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentIndex ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {item.type === 'image' ? (
            <img
              src={item.media_url}
              alt={item.title}
              className="w-full h-full object-cover object-center"
              loading={index === currentIndex ? 'eager' : 'lazy'}
            />
          ) : (
            <video
              src={item.media_url}
              className="w-full h-full object-cover object-center"
              autoPlay muted loop playsInline
            />
          )}
        </div>
      ))}

      {/* Dark gradient overlay — bottom heavy so text is readable */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />

      {/* Centered text content */}
      <div className="absolute inset-0 flex flex-col items-center justify-end pb-16 px-6 text-center">
        <p className="text-vsrk-gold text-xs font-semibold tracking-[0.25em] uppercase mb-3">
          South Indian Jewelry
        </p>
        <h1 className="font-serif text-4xl md:text-5xl font-medium text-white mb-4 drop-shadow-lg">
          VSRK Collections
        </h1>
        <p className="text-white/80 text-base md:text-lg mb-8 max-w-lg">
          Curated from trusted vendors across South India. Every piece personally handpicked.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Button asChild className="bg-vsrk-gold text-black hover:bg-white hover:text-black font-medium">
            <Link to="/gallery">
              Browse Collection <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="border-white text-white hover:bg-white hover:text-black font-medium"
          >
            <a
              href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent("Hi! I'm interested in your jewelry collection.")}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageCircle className="mr-2 h-4 w-4" /> WhatsApp Us
            </a>
          </Button>
        </div>
      </div>

      {/* Dot navigation */}
      {featuredItems.length > 1 && (
        <div className="absolute bottom-5 left-0 right-0 flex justify-center gap-2">
          {featuredItems.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === currentIndex ? 'w-6 bg-vsrk-gold' : 'w-1.5 bg-white/50'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default FeaturedSlider;
