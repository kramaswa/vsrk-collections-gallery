
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

  const currentItem = featuredItems[currentIndex] ?? null;

  if (isLoading) {
    return <div className="w-full min-h-[560px] bg-vsrk-light" />;
  }

  if (featuredItems.length === 0 || !currentItem) {
    return <div className="w-full min-h-[560px] bg-vsrk-light" />;
  }

  return (
    <div className="w-full flex flex-col md:flex-row h-[85vh] max-h-[680px] min-h-[500px]">
      {/* Left — brand text */}
      <div className="flex flex-col justify-center px-10 md:px-16 py-12 bg-vsrk-light w-full md:w-1/2 order-2 md:order-1">
        <p className="text-vsrk-gold text-xs font-semibold tracking-[0.2em] uppercase mb-5">
          South Indian Jewelry
        </p>
        <h1 className="font-serif text-4xl md:text-5xl font-medium text-vsrk-dark leading-tight mb-5">
          VSRK Collections
        </h1>
        <p className="text-gray-600 text-base md:text-lg mb-8 max-w-sm leading-relaxed">
          Curated from trusted vendors and artisans across South India. Every piece personally handpicked.
        </p>
        <div className="flex flex-wrap gap-3 mb-10">
          <Button asChild className="bg-vsrk-gold text-black hover:bg-vsrk-dark hover:text-white">
            <Link to="/gallery">
              Browse Collection <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="outline" className="border-vsrk-dark text-vsrk-dark hover:bg-vsrk-dark hover:text-white">
            <a
              href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent('Hi! I\'m interested in your jewelry collection.')}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageCircle className="mr-2 h-4 w-4" /> WhatsApp Us
            </a>
          </Button>
        </div>
        {featuredItems.length > 1 && (
          <div className="flex gap-2">
            {featuredItems.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === currentIndex ? 'w-6 bg-vsrk-gold' : 'w-1.5 bg-vsrk-dark/30'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Right — jewelry image, fills full height */}
      <div className="relative bg-vsrk-light w-full md:w-1/2 order-1 md:order-2 h-64 md:h-full overflow-hidden">
        {featuredItems.map((item, index) => (
          <div
            key={item.id}
            className={`absolute inset-0 transition-opacity duration-700 ${
              index === currentIndex ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
          >
            {item.type === 'image' ? (
              <img
                src={item.media_url}
                alt={item.title}
                className="w-full h-full object-contain p-4"
                loading={index === currentIndex ? 'eager' : 'lazy'}
              />
            ) : (
              <video
                src={item.media_url}
                className="w-full h-full object-contain p-4"
                autoPlay muted loop playsInline
              />
            )}
          </div>
        ))}
        <div className="absolute bottom-3 left-0 right-0 text-center">
          <p className="font-serif text-vsrk-dark/60 text-xs">{currentItem.title}</p>
        </div>
      </div>
    </div>
  );
};

export default FeaturedSlider;
