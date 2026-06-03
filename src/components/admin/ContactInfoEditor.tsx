
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, Save } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const CONTACT_FIELDS = [
  { section: 'whatsapp', label: 'WhatsApp Number (international format, no + or spaces, e.g. 15551234567)', type: 'input', default: '15551234567' },
  { section: 'email', label: 'Email Address', type: 'input', default: 'info@vsrkcollections.com' },
  { section: 'phone', label: 'Phone Number', type: 'input', default: '(555) 123-4567' },
  { section: 'instagram', label: 'Instagram Handle', type: 'input', default: '@vsrk.collections' },
  { section: 'instagram_url', label: 'Instagram URL', type: 'input', default: 'https://www.instagram.com/vsrk.collections/' },
  { section: 'intro_text', label: 'Intro Text', type: 'textarea', default: 'Have questions about our jewelry or interested in a custom piece? Get in touch with us.' },
  { section: 'connect_title', label: 'Connect Section Title', type: 'input', default: 'Connect With Us' },
  { section: 'form_title', label: 'Form Title', type: 'input', default: 'Send a Message' },
];

const ContactInfoEditor: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState<string | null>(null);
  const [values, setValues] = useState<Record<string, string>>({});
  const { toast } = useToast();

  useEffect(() => {
    const fetchContactContent = async () => {
      setIsLoading(true);
      const { data } = await supabase
        .from('page_content')
        .select('section, content')
        .eq('page', 'contact');

      const defaults: Record<string, string> = {};
      CONTACT_FIELDS.forEach(f => { defaults[f.section] = f.default; });

      if (data) {
        data.forEach(row => { defaults[row.section] = row.content; });
      }

      setValues(defaults);
      setIsLoading(false);
    };

    fetchContactContent();
  }, []);

  const saveField = async (section: string) => {
    setIsSaving(section);

    const { data: existing } = await supabase
      .from('page_content')
      .select('id')
      .eq('page', 'contact')
      .eq('section', section)
      .maybeSingle();

    const content = values[section];
    let error;

    if (existing) {
      ({ error } = await supabase.from('page_content').update({ content }).eq('id', existing.id));
    } else {
      ({ error } = await supabase.from('page_content').insert({ page: 'contact', section, content }));
    }

    if (error) {
      toast({ title: 'Error saving', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Saved', description: `${section.replace(/_/g, ' ')} updated successfully.` });
    }

    setIsSaving(null);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 text-vsrk-gold animate-spin" />
        <span className="ml-2 text-lg text-gray-600">Loading contact info...</span>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="font-serif text-2xl font-semibold mb-6">Contact Information</h2>
      <div className="space-y-6">
        {CONTACT_FIELDS.map(field => (
          <div key={field.section} className="border rounded-md p-4">
            <Label htmlFor={field.section} className="mb-2 block font-medium">{field.label}</Label>
            {field.type === 'textarea' ? (
              <Textarea
                id={field.section}
                value={values[field.section] || ''}
                onChange={e => setValues(prev => ({ ...prev, [field.section]: e.target.value }))}
                className="min-h-[80px] mb-3"
              />
            ) : (
              <Input
                id={field.section}
                value={values[field.section] || ''}
                onChange={e => setValues(prev => ({ ...prev, [field.section]: e.target.value }))}
                className="mb-3"
              />
            )}
            <div className="flex justify-end">
              <Button
                onClick={() => saveField(field.section)}
                disabled={isSaving === field.section}
                size="sm"
              >
                {isSaving === field.section ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Save className="mr-2 h-4 w-4" />
                )}
                Save
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContactInfoEditor;
