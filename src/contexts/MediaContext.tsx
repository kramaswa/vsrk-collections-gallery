
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, MediaItem, StorageBucket, ensureStorageBucketsExist } from '@/lib/supabase';
import { useToast } from '@/components/ui/use-toast';
import { v4 as uuidv4 } from 'uuid';

type UploadMediaItem = Omit<MediaItem, 'id' | 'created_at'>;

type MediaContextType = {
  mediaItems: MediaItem[];
  featuredItems: MediaItem[];
  addMediaItem: (item: UploadMediaItem, file: File, thumbnailFile?: File) => Promise<boolean>;
  deleteMediaItem: (id: string) => Promise<boolean>;
  toggleFeatured: (id: string) => Promise<boolean>;
  isLoading: boolean;
};

const MediaContext = createContext<MediaContextType | undefined>(undefined);

export const MediaProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  
  // Setup storage buckets and fetch media items on component mount
  useEffect(() => {
    const setupAndFetchData = async () => {
      try {
        setIsLoading(true);
        
        // First ensure the storage buckets exist
        await ensureStorageBucketsExist();
        
        // Check if the table exists first
        const { error: tableCheckError } = await supabase
          .from('media_items')
          .select('count')
          .limit(1)
          .single();
        
        if (tableCheckError) {
          console.error('Media items table may not exist:', tableCheckError);
          setMediaItems([]);
          setIsLoading(false);
          return;
        }
        
        const { data, error } = await supabase
          .from('media_items')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) {
          throw error;
        }
        
        setMediaItems(data as MediaItem[]);
      } catch (error) {
        console.error('Error fetching media items:', error);
        toast({
          title: 'Error',
          description: 'Failed to load media items. The database table might not be set up yet.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    setupAndFetchData();
    
    // Set up real-time subscription for media items
    const subscription = supabase
      .channel('media_items_changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'media_items' 
        }, 
        (payload) => {
          console.log('Change received!', payload);
          setupAndFetchData();
        }
      )
      .subscribe();
    
    return () => {
      supabase.removeChannel(subscription);
    };
  }, [toast]);
  
  // Upload file to Supabase storage
  const uploadFileToStorage = async (file: File, path: string): Promise<string> => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${uuidv4()}.${fileExt}`;
      const filePath = `${path}/${fileName}`;
      
      // Determine the correct bucket
      const bucketName: StorageBucket = file.type.startsWith('image/') ? 
        (path === 'thumbnails' ? 'thumbnails' : 'jewelry_images') : 
        'jewelry_videos';
      
      const { error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(filePath, file);
      
      if (uploadError) {
        throw uploadError;
      }
      
      // Get public URL
      const { data } = supabase.storage
        .from(bucketName)
        .getPublicUrl(filePath);
      
      return data.publicUrl;
    } catch (error) {
      console.error("Error in uploadFileToStorage:", error);
      throw error;
    }
  };
  
  // Add a new media item
  const addMediaItem = async (
    item: UploadMediaItem, 
    file: File, 
    thumbnailFile?: File
  ): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      // Upload main file
      const mediaUrl = await uploadFileToStorage(
        file, 
        item.type === 'image' ? 'images' : 'videos'
      );
      
      // Upload thumbnail if provided
      let thumbnailUrl = null;
      if (thumbnailFile) {
        thumbnailUrl = await uploadFileToStorage(thumbnailFile, 'thumbnails');
      }
      
      // Create database record
      const { error } = await supabase
        .from('media_items')
        .insert([
          {
            title: item.title,
            description: item.description,
            media_url: mediaUrl,
            thumbnail_url: thumbnailUrl,
            type: item.type,
            featured: item.featured,
          }
        ] as any); // Type assertion for TypeScript
      
      if (error) {
        throw error;
      }
      
      toast({
        title: 'Success',
        description: 'Media item added successfully',
      });
      
      return true;
    } catch (error: any) {
      console.error('Error adding media item:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to add media item',
        variant: 'destructive',
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Delete a media item
  const deleteMediaItem = async (id: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      // Get the media item first to know which storage bucket to delete from
      const { data: itemToDelete, error: fetchError } = await supabase
        .from('media_items')
        .select('*')
        .eq('id', id)
        .single();
      
      if (fetchError) {
        throw fetchError;
      }
      
      // Extract file paths from URLs
      const mediaUrl = itemToDelete?.media_url;
      const thumbnailUrl = itemToDelete?.thumbnail_url;
      
      // Extract file path for storage deletion
      const getPathFromUrl = (url: string) => {
        try {
          const urlObj = new URL(url);
          const pathSegments = urlObj.pathname.split('/');
          return pathSegments.slice(pathSegments.length - 2).join('/');
        } catch (error) {
          console.error("Error parsing URL:", error);
          return "";
        }
      };
      
      // Delete the main file from storage
      if (mediaUrl && itemToDelete) {
        const bucket = itemToDelete.type === 'image' ? 'jewelry_images' : 'jewelry_videos';
        try {
          const path = getPathFromUrl(mediaUrl);
          if (path) {
            await supabase.storage.from(bucket as StorageBucket).remove([path]);
          }
        } catch (storageError) {
          console.error('Error deleting file from storage:', storageError);
        }
      }
      
      // Delete thumbnail if exists
      if (thumbnailUrl) {
        try {
          const thumbnailPath = getPathFromUrl(thumbnailUrl);
          if (thumbnailPath) {
            await supabase.storage.from('thumbnails').remove([thumbnailPath]);
          }
        } catch (storageError) {
          console.error('Error deleting thumbnail from storage:', storageError);
        }
      }
      
      // Delete the database record
      const { error: deleteError } = await supabase
        .from('media_items')
        .delete()
        .eq('id', id);
      
      if (deleteError) {
        throw deleteError;
      }
      
      // Update local state
      setMediaItems(mediaItems.filter(item => item.id !== id));
      
      toast({
        title: 'Deleted',
        description: 'Media item has been deleted',
      });
      
      return true;
    } catch (error: any) {
      console.error('Error deleting media item:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete media item',
        variant: 'destructive',
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Toggle featured status
  const toggleFeatured = async (id: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      // Get current featured state
      const item = mediaItems.find(item => item.id === id);
      if (!item) {
        throw new Error('Media item not found');
      }
      
      const newFeaturedState = !item.featured;
      
      // Update in database
      const { error } = await supabase
        .from('media_items')
        .update({ featured: newFeaturedState } as any) // Type assertion for TypeScript
        .eq('id', id);
      
      if (error) {
        throw error;
      }
      
      // Update local state
      setMediaItems(mediaItems.map(item => 
        item.id === id ? { ...item, featured: newFeaturedState } : item
      ));
      
      toast({
        title: newFeaturedState ? 'Added to featured' : 'Removed from featured',
        description: `Item has been ${newFeaturedState ? 'added to' : 'removed from'} featured items`,
      });
      
      return true;
    } catch (error: any) {
      console.error('Error toggling featured status:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to update featured status',
        variant: 'destructive',
      });
      return false;
    } finally {
      setIsLoading(false);
    }
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

export type { MediaItem };
