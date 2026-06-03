
import React, { useEffect, useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';

interface ContentItem {
  id: string;
  section: string;
  title?: string;
  content: string;
}

const About: React.FC = () => {
  const [sections, setSections] = useState<ContentItem[]>([]);

  useEffect(() => {
    supabase
      .from('page_content')
      .select('id, section, title, content')
      .eq('page', 'about')
      .order('section')
      .then(({ data }) => { if (data && data.length > 0) setSections(data); });
  }, []);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto">
          <h1 className="font-serif text-4xl text-center font-medium mb-10">About VSRK Collections</h1>

          <div className="prose prose-lg max-w-none">
            {sections.map((item) => (
              <div key={item.id}>
                {item.title && (
                  <h2 className="font-serif text-2xl mt-10 mb-4">{item.title}</h2>
                )}
                {item.content.split('\n').filter(Boolean).map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Button asChild className="bg-vsrk-gold text-black hover:bg-vsrk-dark hover:text-white">
              <Link to="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default About;
