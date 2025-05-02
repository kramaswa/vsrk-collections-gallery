
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Instagram } from 'lucide-react';
import { supabase } from '@/lib/supabase';

const Footer: React.FC = () => {
  const year = new Date().getFullYear();
  const [footerContent, setFooterContent] = useState({
    copyright_text: `© ${year} VSRK Collections. All rights reserved. Designed with passion.`,
    contact_text: 'If you have any questions or inquiries, feel free to reach out to us.'
  });
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchFooterContent = async () => {
      try {
        const { data, error } = await supabase
          .from('page_content')
          .select('section, content')
          .eq('page', 'footer');
        
        if (error) {
          console.error('Error fetching footer content:', error);
          return;
        }
        
        if (data && data.length > 0) {
          const contentMap = data.reduce((acc, item) => {
            acc[item.section] = item.content;
            return acc;
          }, {} as Record<string, string>);
          
          setFooterContent(prev => ({
            copyright_text: contentMap.copyright_text || prev.copyright_text,
            contact_text: contentMap.contact_text || prev.contact_text
          }));
        }
      } catch (error) {
        console.error('Failed to fetch footer content:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchFooterContent();
  }, []);
  
  // Replace {year} placeholder with the actual year
  const copyrightText = footerContent.copyright_text.replace('{year}', year.toString());
  
  return (
    <footer className="bg-vsrk-dark text-white py-12">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-serif text-2xl mb-4 text-vsrk-gold">VSRK Collections</h3>
            <p className="text-gray-300 mb-4">Exquisite handcrafted jewelry for every occasion.</p>
            <div className="flex items-center">
              <a 
                href="https://www.instagram.com/vsrk.collections/?igsh=cGNiZGVmb2R3MGgy" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-gray-300 hover:text-vsrk-gold transition-colors mr-4"
                aria-label="Instagram"
              >
                <Instagram size={24} />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-serif text-xl mb-4 text-vsrk-gold">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-vsrk-gold transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/gallery" className="text-gray-300 hover:text-vsrk-gold transition-colors">Gallery</Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-300 hover:text-vsrk-gold transition-colors">About</Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-vsrk-gold transition-colors">Contact</Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-serif text-xl mb-4 text-vsrk-gold">Contact</h3>
            <p className="text-gray-300">{footerContent.contact_text}</p>
            <Link to="/contact" className="text-vsrk-gold hover:underline mt-2 inline-block">
              Contact Us
            </Link>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>{copyrightText}</p>
          <p className="mt-2 text-sm">
            <Link to="/admin" className="text-gray-500 hover:text-vsrk-gold transition-colors">Admin</Link>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
