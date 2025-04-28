
import React from 'react';
import Layout from '@/components/layout/Layout';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const About: React.FC = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto">
          <h1 className="font-serif text-4xl text-center font-medium mb-10">About VSRK Collections</h1>
          
          <div className="prose prose-lg max-w-none">
            <p>
              At VSRK Collections, we believe that jewelry is more than an accessory—it's a reflection of your unique style and personality. Every piece in our collection is thoughtfully designed and meticulously crafted to enhance your natural beauty and become a cherished part of your most important moments.
            </p>
            
            <h2 className="font-serif text-2xl mt-10 mb-4">Our Story</h2>
            <p>
              VSRK Collections was founded with a passion for creating jewelry that combines traditional craftsmanship with contemporary design. Drawing inspiration from nature, architecture, and cultural elements, each piece tells a unique story and celebrates the artistry of handmade jewelry.
            </p>
            <p>
              What began as a small creative outlet has grown into a beloved brand known for its quality, attention to detail, and distinctive aesthetic. Every item in our collection is created with love and dedication, ensuring that each piece is as special as the person wearing it.
            </p>
            
            <h2 className="font-serif text-2xl mt-10 mb-4">Our Process</h2>
            <p>
              We take pride in our hands-on approach to jewelry making. From initial sketches to the final polish, each step is performed with precision and care. We use only high-quality materials, ensuring that our pieces not only look beautiful but are also made to last.
            </p>
            <p>
              Our commitment to quality means that every item undergoes rigorous inspection before it becomes part of our collection. This dedication to excellence is what sets VSRK Collections apart and has earned the trust of our valued customers.
            </p>
            
            <h2 className="font-serif text-2xl mt-10 mb-4">Connect With Us</h2>
            <p>
              We love hearing from our customers and invite you to follow us on Instagram for the latest updates, behind-the-scenes glimpses, and new additions to our collection. If you have any questions or would like to learn more about our pieces, don't hesitate to get in touch.
            </p>
          </div>
          
          <div className="mt-12 text-center">
            <Button asChild className="bg-vsrk-gold text-black hover:bg-vsrk-dark hover:text-white">
              <Link to="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default About;
