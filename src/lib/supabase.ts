
import { createClient } from '@supabase/supabase-js';

// Use hardcoded values for Lovable environments
// These will be automatically replaced with the correct values 
// when deployed via the Lovable Supabase integration
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
