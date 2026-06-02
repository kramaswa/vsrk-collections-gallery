import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://ahyxslcntwjkmifzhwng.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFoeXhzbGNudHdqa21pZnpod25nIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAzMjg1ODksImV4cCI6MjA5NTkwNDU4OX0.qXORrgCngDYliWbBT6llbBChsTHQq9dBnNhl5925j8I'
);

export default async function handler(req: any, res: any) {
  try {
    const { error } = await supabase.from('categories').select('id').limit(1);

    if (error) {
      return res.status(500).json({ status: 'error', message: error.message });
    }

    return res.status(200).json({ status: 'ok' });
  } catch (e: any) {
    return res.status(500).json({ status: 'error', message: e.message });
  }
}
