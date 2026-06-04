
import React, { useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import FeaturedSlider from '@/components/hero/FeaturedSlider';
import MediaGrid from '@/components/media/MediaGrid';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight, Instagram } from 'lucide-react';
import { useMedia } from '@/contexts/MediaContext';

const Index: React.FC = () => {
  const { refreshMedia } = useMedia();
  
  // Force refresh media when the index page loads
  useEffect(() => {
    console.log('Index page mounted, refreshing media');
    refreshMedia();
    
    // This will ensure we refresh media items whenever the user navigates back to this page
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        console.log('Page became visible, refreshing media');
        refreshMedia();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [refreshMedia]);

  return (
    <Layout>
      <div className="w-full overflow-hidden">
        <FeaturedSlider />
      </div>
      
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <h1 className="font-serif text-4xl md:text-5xl font-medium mb-6">VSRK Collections</h1>
          <p className="text-gray-700 max-w-2xl mx-auto text-lg mb-8">
            Curated South Indian jewelry from trusted artisans and vendors across South India. Browse our collection and reach out on WhatsApp to inquire about any piece.
          </p>
          
          <div className="flex justify-center gap-4 flex-wrap">
            <Button 
              asChild
              className="bg-vsrk-gold text-black hover:bg-vsrk-dark hover:text-white"
            >
              <Link to="/gallery">
                Explore Collection <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            
            <Button 
              variant="outline" 
              asChild
              className="border-vsrk-gold text-vsrk-dark hover:bg-vsrk-gold/10"
            >
              <a 
                href="https://www.instagram.com/vsrk.collections/?igsh=cGNiZGVmb2R3MGgy" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <Instagram className="mr-2 h-4 w-4" /> Instagram
              </a>
            </Button>
          </div>
        </div>
      </section>
      
      <section className="py-16 px-4 bg-vsrk-cream/50">
        <div className="container mx-auto">
          <h2 className="font-serif text-3xl text-center mb-12">Featured Pieces</h2>
          
          <MediaGrid featuredOnly={true} />
          
          <div className="text-center mt-12">
            <Button 
              asChild
              variant="outline" 
              className="border-vsrk-gold text-vsrk-dark hover:bg-vsrk-gold/10"
            >
              <Link to="/gallery">
                View All <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
      
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-serif text-3xl mb-6">Personally Curated, Just for You</h2>
            <p className="text-gray-700 mb-8">
              We have close relationships with vendors and artisans across South India, so you get access to quality pieces that are hard to find abroad. Every item in our gallery has been personally handpicked. If it's here, it's because we love it.
            </p>
            <Link to="/about" className="text-vsrk-gold hover:text-vsrk-dark font-medium inline-flex items-center">
              Learn more about us <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
