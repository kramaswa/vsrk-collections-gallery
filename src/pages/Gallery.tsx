
import React from 'react';
import Layout from '@/components/layout/Layout';
import MediaGrid from '@/components/media/MediaGrid';

const Gallery: React.FC = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h1 className="font-serif text-4xl font-medium mb-4">Our Collection</h1>
          <p className="text-gray-700">
            Discover our complete collection of handcrafted jewelry pieces, each one created with precision and care.
          </p>
        </div>
        
        <MediaGrid />
      </div>
    </Layout>
  );
};

export default Gallery;
