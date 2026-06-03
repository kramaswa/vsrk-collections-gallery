import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { WHATSAPP_NUMBER } from '@/lib/constants';

let cache: string | null = null;
let pending: Promise<string> | null = null;

function fetchNumber(): Promise<string> {
  if (pending) return pending;
  pending = supabase
    .from('page_content')
    .select('content')
    .eq('page', 'contact')
    .eq('section', 'whatsapp')
    .maybeSingle()
    .then(({ data }) => {
      cache = data?.content || WHATSAPP_NUMBER;
      return cache;
    });
  return pending;
}

export function useWhatsAppNumber(): string {
  const [number, setNumber] = useState<string>(cache || WHATSAPP_NUMBER);

  useEffect(() => {
    if (!cache) {
      fetchNumber().then(setNumber);
    }
  }, []);

  return number;
}
