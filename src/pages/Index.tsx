
import React from 'react';
import Layout from '@/components/layout/Layout';
import FeaturedSlider from '@/components/hero/FeaturedSlider';
import MediaGrid from '@/components/media/MediaGrid';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight, Instagram } from 'lucide-react';

const Index: React.FC = () => {
  return (
    <Layout>
      <FeaturedSlider />
      
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <h1 className="font-serif text-4xl md:text-5xl font-medium mb-6">VSRK Collections</h1>
          <p className="text-gray-700 max-w-2xl mx-auto text-lg mb-8">
            Exquisite handcrafted jewelry for every occasion. Each piece is designed with passion and created with precision to enhance your natural beauty.
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
            <h2 className="font-serif text-3xl mb-6">Handcrafted With Love</h2>
            <p className="text-gray-700 mb-8">
              Each piece in our collection is meticulously handcrafted using traditional techniques and the finest materials. Our designs draw inspiration from both contemporary trends and timeless classics, resulting in jewelry that is both modern and enduring.
            </p>
            <Link to="/about" className="text-vsrk-gold hover:text-vsrk-dark font-medium inline-flex items-center">
              Learn more about our process <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
