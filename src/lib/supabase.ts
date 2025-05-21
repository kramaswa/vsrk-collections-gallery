
import { createClient } from '@supabase/supabase-js';
import { PostgrestSingleResponse } from '@supabase/supabase-js';
import { supabase as integratedSupabase } from '@/integrations/supabase/client';

// Use the integrated Supabase client that has the correct credentials
export const supabase = integratedSupabase;

// Helper function to get the current user
export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
};

// Database types
export type MediaItem = {
  id: string;
  created_at: string;
  title: string;
  description: string;
  media_url: string;
  thumbnail_url: string | null;
  type: 'image' | 'video';
  featured: boolean;
  category: string;
  // Backward compatibility for components that might still use url
  url?: string;
};

// Define contact message type
export type ContactMessage = {
  id: string;
  name: string;
  email: string;
  message: string;
  read: boolean;
  created_at: string;
};

// Define bucket types to prevent "bucket not found" errors
export type StorageBucket = 'jewelry_images' | 'jewelry_videos' | 'thumbnails';

// Custom type for database tables
export type Database = {
  public: {
    Tables: {
      media_items: {
        Row: MediaItem;
        Insert: Omit<MediaItem, 'id' | 'created_at'>;
        Update: Partial<Omit<MediaItem, 'id' | 'created_at'>>;
      };
      contact_messages: {
        Row: ContactMessage;
        Insert: Omit<ContactMessage, 'id' | 'created_at'>;
        Update: Partial<Omit<ContactMessage, 'id' | 'created_at'>>;
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

// Helper function to create storage buckets if they don't exist
export const ensureStorageBucketsExist = async (): Promise<void> => {
  try {
    // Check and create jewelry_images bucket
    try {
      const { data: imagesData, error: imagesError } = await supabase.storage.getBucket('jewelry_images');
      if (imagesError) {
        const { error } = await supabase.storage.createBucket('jewelry_images', {
          public: true,
          fileSizeLimit: 52428800, // 50MB
        });
        if (error) console.error('Error creating jewelry_images bucket:', error);
      }
    } catch (error) {
      console.error('Error creating jewelry_images bucket:', error);
    }
    
    // Check and create jewelry_videos bucket
    try {
      const { data: videosData, error: videosError } = await supabase.storage.getBucket('jewelry_videos');
      if (videosError) {
        const { error } = await supabase.storage.createBucket('jewelry_videos', {
          public: true,
          fileSizeLimit: 52428800, // 50MB
        });
        if (error) console.error('Error creating jewelry_videos bucket:', error);
      }
    } catch (error) {
      console.error('Error creating jewelry_videos bucket:', error);
    }
    
    // Check and create thumbnails bucket
    try {
      const { data: thumbnailsData, error: thumbnailsError } = await supabase.storage.getBucket('thumbnails');
      if (thumbnailsError) {
        const { error } = await supabase.storage.createBucket('thumbnails', {
          public: true,
          fileSizeLimit: 52428800, // 50MB
        });
        if (error) console.error('Error creating thumbnails bucket:', error);
      }
    } catch (error) {
      console.error('Error creating thumbnails bucket:', error);
    }
    
    console.log('Storage buckets setup complete');
  } catch (error) {
    console.error('Error in ensureStorageBucketsExist:', error);
    throw error;
  }
};
