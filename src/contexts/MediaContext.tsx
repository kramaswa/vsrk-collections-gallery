
import React, { createContext, useContext, useState, useEffect } from 'react';

export type MediaItem = {
  id: string;
  type: 'image' | 'video';
  url: string;
  thumbnail?: string; // For videos
  title: string;
  description: string;
  featured: boolean;
};

type MediaContextType = {
  mediaItems: MediaItem[];
  featuredItems: MediaItem[];
  addMediaItem: (item: Omit<MediaItem, 'id'>) => void;
  deleteMediaItem: (id: string) => void;
  toggleFeatured: (id: string) => void;
  isLoading: boolean;
};

// Sample initial data
const initialMediaItems: MediaItem[] = [
  {
    id: '1',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?q=80&w=1000',
    title: 'Gold Necklace',
    description: 'Elegant handcrafted gold necklace',
    featured: true,
  },
  {
    id: '2',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1602173574767-37ac01994b2a?q=80&w=1000',
    title: 'Pearl Earrings',
    description: 'Beautiful pearl earrings',
    featured: true,
  },
  {
    id: '3',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1635767798638-3665e0989a0f?q=80&w=1000',
    title: 'Diamond Ring',
    description: 'Exquisite diamond ring',
    featured: false,
  },
  {
    id: '4',
    type: 'video',
    url: 'https://player.vimeo.com/external/494168034.sd.mp4?s=1cccd806d26c248cf8195371fbd7595d236e818e&profile_id=164&oauth2_token_id=57447761',
    thumbnail: 'https://images.unsplash.com/photo-1596944924616-7b38e7cfac36?q=80&w=1000',
    title: 'Bracelet Collection',
    description: 'Our new bracelet collection',
    featured: true,
  },
];

const MediaContext = createContext<MediaContextType | undefined>(undefined);

export const MediaProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // In a real app, you would fetch this data from a backend/database
    const storedItems = localStorage.getItem('vsrk-media-items');
    if (storedItems) {
      setMediaItems(JSON.parse(storedItems));
    } else {
      // Use initial data if nothing is stored
      setMediaItems(initialMediaItems);
      localStorage.setItem('vsrk-media-items', JSON.stringify(initialMediaItems));
    }
    setIsLoading(false);
  }, []);
  
  const addMediaItem = (item: Omit<MediaItem, 'id'>) => {
    const newItem = {
      ...item,
      id: Date.now().toString(),
    };
    
    const updatedItems = [...mediaItems, newItem];
    setMediaItems(updatedItems);
    localStorage.setItem('vsrk-media-items', JSON.stringify(updatedItems));
  };
  
  const deleteMediaItem = (id: string) => {
    const updatedItems = mediaItems.filter(item => item.id !== id);
    setMediaItems(updatedItems);
    localStorage.setItem('vsrk-media-items', JSON.stringify(updatedItems));
  };
  
  const toggleFeatured = (id: string) => {
    const updatedItems = mediaItems.map(item => 
      item.id === id ? { ...item, featured: !item.featured } : item
    );
    setMediaItems(updatedItems);
    localStorage.setItem('vsrk-media-items', JSON.stringify(updatedItems));
  };
  
  const featuredItems = mediaItems.filter(item => item.featured);
  
  return (
    <MediaContext.Provider 
      value={{ 
        mediaItems, 
        featuredItems, 
        addMediaItem, 
        deleteMediaItem, 
        toggleFeatured,
        isLoading
      }}
    >
      {children}
    </MediaContext.Provider>
  );
};

export const useMedia = (): MediaContextType => {
  const context = useContext(MediaContext);
  if (context === undefined) {
    throw new Error('useMedia must be used within a MediaProvider');
  }
  return context;
};
