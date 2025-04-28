
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { Menu, X, Instagram } from 'lucide-react';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useIsMobile();

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  return (
    <header className="border-b border-vsrk-gold/20 bg-vsrk-beige/80 backdrop-blur-sm fixed w-full top-0 z-50">
      <div className="container mx-auto py-4 px-4 sm:px-6 flex items-center justify-between">
        <Link to="/" className="text-2xl sm:text-3xl font-serif font-medium text-vsrk-dark hover:text-vsrk-gold transition duration-200" onClick={closeMenu}>
          VSRK Collections
        </Link>

        {/* Mobile Menu Button */}
        {isMobile && (
          <Button 
            variant="ghost" 
            size="icon"
            onClick={toggleMenu}
            aria-label="Toggle menu"
            className="md:hidden"
          >
            {isOpen ? <X /> : <Menu />}
          </Button>
        )}

        {/* Desktop Navigation */}
        <nav className={cn(
          "md:flex items-center space-x-8",
          isMobile ? "hidden" : "flex"
        )}>
          <Link to="/" className="font-medium text-vsrk-dark hover:text-vsrk-gold transition duration-200">Home</Link>
          <Link to="/gallery" className="font-medium text-vsrk-dark hover:text-vsrk-gold transition duration-200">Gallery</Link>
          <Link to="/about" className="font-medium text-vsrk-dark hover:text-vsrk-gold transition duration-200">About</Link>
          <Link to="/contact" className="font-medium text-vsrk-dark hover:text-vsrk-gold transition duration-200">Contact</Link>
          <a 
            href="https://www.instagram.com/vsrk.collections/?igsh=cGNiZGVmb2R3MGgy" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-vsrk-dark hover:text-vsrk-gold transition-colors"
            aria-label="Instagram"
          >
            <Instagram size={24} />
          </a>
        </nav>

        {/* Mobile Menu */}
        {isMobile && (
          <div className={cn(
            "fixed inset-0 bg-white bg-opacity-95 z-50 transition-transform transform",
            isOpen ? "translate-x-0" : "translate-x-full"
          )}>
            <div className="container mx-auto px-4 pt-20 pb-8 h-full">
              <nav className="flex flex-col space-y-8 items-center text-xl">
                <Link to="/" className="font-medium text-vsrk-dark hover:text-vsrk-gold transition duration-200" onClick={closeMenu}>Home</Link>
                <Link to="/gallery" className="font-medium text-vsrk-dark hover:text-vsrk-gold transition duration-200" onClick={closeMenu}>Gallery</Link>
                <Link to="/about" className="font-medium text-vsrk-dark hover:text-vsrk-gold transition duration-200" onClick={closeMenu}>About</Link>
                <Link to="/contact" className="font-medium text-vsrk-dark hover:text-vsrk-gold transition duration-200" onClick={closeMenu}>Contact</Link>
                <a 
                  href="https://www.instagram.com/vsrk.collections/?igsh=cGNiZGVmb2R3MGgy" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center space-x-2 text-vsrk-dark hover:text-vsrk-gold transition-colors"
                  onClick={closeMenu}
                >
                  <Instagram size={24} />
                  <span>Instagram</span>
                </a>
              </nav>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
