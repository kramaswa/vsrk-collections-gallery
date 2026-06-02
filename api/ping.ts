import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://ahyxslcntwjkmifzhwng.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFoeXhzbGNudHdqa21pZnpod25nIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAzMjg1ODksImV4cCI6MjA5NTkwNDU4OX0.qXORrgCngDYliWbBT6llbBChsTHQq9dBnNhl5925j8I'
);

export default async function handler(req: Request): Promise<Response> {
  const { error } = await supabase.from('categories').select('id').limit(1);

  if (error) {
    return new Response(JSON.stringify({ status: 'error', message: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return new Response(JSON.stringify({ status: 'ok' }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}
