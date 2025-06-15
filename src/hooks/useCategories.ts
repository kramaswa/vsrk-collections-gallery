
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export type Category = {
  id: string;
  name: string;
  display_name: string;
  created_at: string;
  updated_at: string;
};

export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('display_name');
      
      if (error) throw error;
      setCategories(data || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching categories:', err);
      setError('Failed to fetch categories');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return {
    categories,
    isLoading,
    error,
    refetch: fetchCategories
  };
};
