
import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import MediaGrid from '@/components/media/MediaGrid';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, GridIcon, LayoutList } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { JEWELRY_CATEGORIES } from '@/lib/constants';

const Gallery: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center mb-8">
          <h1 className="font-serif text-4xl font-medium mb-4">Our Collection</h1>
          <p className="text-gray-700">
            Discover our complete collection of handcrafted jewelry pieces, each one created with precision and care.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 mb-8 max-w-3xl mx-auto">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Search our collection..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="w-full sm:w-[200px]">
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Categories</SelectItem>
                {JEWELRY_CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex">
            <Button 
              variant={viewMode === 'grid' ? 'default' : 'outline'} 
              size="icon"
              onClick={() => setViewMode('grid')}
              className={viewMode === 'grid' ? 'bg-vsrk-gold text-black hover:bg-vsrk-gold/90' : ''}
            >
              <GridIcon className="h-4 w-4" />
            </Button>
            <Button 
              variant={viewMode === 'list' ? 'default' : 'outline'} 
              size="icon"
              onClick={() => setViewMode('list')}
              className={viewMode === 'list' ? 'bg-vsrk-gold text-black hover:bg-vsrk-gold/90' : ''}
            >
              <LayoutList className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <MediaGrid 
          searchQuery={searchQuery} 
          viewMode={viewMode} 
          categoryFilter={categoryFilter} 
        />
      </div>
    </Layout>
  );
};

export default Gallery;
