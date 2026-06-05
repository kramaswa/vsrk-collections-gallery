
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight, MessageCircle } from 'lucide-react';
import { useWhatsAppNumber } from '@/hooks/useWhatsAppNumber';

const Hero: React.FC = () => {
  const whatsappNumber = useWhatsAppNumber();

  return (
    <div className="w-full bg-vsrk-light py-24 md:py-32 px-6 text-center">
      <p className="text-vsrk-gold text-xs font-semibold tracking-[0.25em] uppercase mb-5">
        South Indian Jewelry
      </p>
      <h1 className="font-serif text-5xl md:text-6xl font-medium text-vsrk-dark mb-6 leading-tight">
        VSRK Collections
      </h1>
      <p className="text-gray-600 text-lg md:text-xl max-w-xl mx-auto mb-10 leading-relaxed">
        Curated from trusted vendors and artisans across South India. Every piece personally handpicked.
      </p>
      <div className="flex flex-wrap justify-center gap-4">
        <Button asChild className="bg-vsrk-gold text-black hover:bg-vsrk-dark hover:text-white font-medium px-8 py-6 text-base">
          <Link to="/gallery">
            Browse Collection <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
        <Button
          asChild
          variant="outline"
          className="border-vsrk-dark text-vsrk-dark hover:bg-vsrk-dark hover:text-white font-medium px-8 py-6 text-base"
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
  );
};

export default Hero;
