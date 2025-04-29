
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase credentials. Check your environment variables.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

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
