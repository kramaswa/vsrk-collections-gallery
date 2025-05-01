
import { createClient } from '@supabase/supabase-js';

// These placeholder values need to be replaced with your actual Supabase credentials
// You can get these by connecting your project to Supabase using the green Supabase
// button in the top right corner of the Lovable interface
const supabaseUrl = 'https://your-project-id.supabase.co';
const supabaseAnonKey = 'your-anon-key';

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
