
import { createClient } from '@supabase/supabase-js';
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
  // Backward compatibility for components that might still use url
  url?: string;
};
