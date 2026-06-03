
import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { Instagram, MessageCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { WHATSAPP_NUMBER } from '@/lib/constants';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';

const Contact: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  
  const [pageContent, setPageContent] = useState({
    intro_text: 'Have questions about our jewelry or interested in a custom piece? Get in touch with us.',
    email: 'info@vsrkcollections.com',
    phone: '(555) 123-4567',
    instagram: '@vsrk.collections',
    instagram_url: 'https://www.instagram.com/vsrk.collections/?igsh=cGNiZGVmb2R3MGgy',
    form_title: 'Send a Message',
    connect_title: 'Connect With Us'
  });
  
  useEffect(() => {
    const fetchPageContent = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('page_content')
          .select('section, content')
          .eq('page', 'contact');
        
        if (error) {
          console.error('Error fetching contact page content:', error);
          return;
        }
        
        if (data && data.length > 0) {
          const contentMap = data.reduce((acc, item) => {
            acc[item.section] = item.content;
            return acc;
          }, {} as Record<string, string>);
          
          setPageContent(prev => ({
            intro_text: contentMap.intro_text || prev.intro_text,
            email: contentMap.email || prev.email,
            phone: contentMap.phone || prev.phone,
            instagram: contentMap.instagram || prev.instagram,
            instagram_url: contentMap.instagram_url || prev.instagram_url,
            form_title: contentMap.form_title || prev.form_title,
            connect_title: contentMap.connect_title || prev.connect_title
          }));
        }
      } catch (error) {
        console.error('Failed to fetch contact page content:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPageContent();
  }, []);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);
    
    try {
      console.log('Submitting contact form:', { name, email, message });
      
      // Insert the message into the contact_messages table
      const { error } = await supabase
        .from('contact_messages')
        .insert([
          { name, email, message, read: false }
        ]);
      
      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }
      
      console.log('Contact form submitted successfully');
      
      toast({
        title: "Message sent!",
        description: "Thank you for contacting us. We'll get back to you soon.",
      });
      
      setName('');
      setEmail('');
      setMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      setSubmitError("There was a problem sending your message. Please try again.");
      toast({
        title: "Error",
        description: "There was a problem sending your message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 flex justify-center items-center h-[60vh]">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin mx-auto text-vsrk-gold" />
            <p className="mt-4 text-lg text-gray-600">Loading contact information...</p>
          </div>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h1 className="font-serif text-4xl font-medium mb-4">Contact Us</h1>
          <p className="text-gray-700">
            {pageContent.intro_text}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="bg-white p-8 rounded-lg shadow-sm">
            <h2 className="font-serif text-2xl mb-6">{pageContent.form_title}</h2>
            
            {submitError && (
              <Alert variant="destructive" className="mb-6">
                <AlertDescription>{submitError}</AlertDescription>
              </Alert>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="Your name"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="Your email"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  placeholder="Your message"
                  rows={5}
                />
              </div>
              
              <Button 
                type="submit"
                className="w-full bg-vsrk-gold text-black hover:bg-vsrk-dark hover:text-white font-medium"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Sending..." : "Send Message"}
              </Button>
            </form>
          </div>
          
          <div>
            <div className="bg-white p-8 rounded-lg shadow-sm mb-6">
              <h2 className="font-serif text-2xl mb-6">{pageContent.connect_title}</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-1">Email</h3>
                  <p className="text-gray-700">{pageContent.email}</p>
                </div>
                
                <div>
                  <h3 className="font-medium mb-1">Phone</h3>
                  <p className="text-gray-700">{pageContent.phone}</p>
                </div>
                
                <div>
                  <h3 className="font-medium mb-1">Follow Us</h3>
                  <a
                    href={pageContent.instagram_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-vsrk-dark hover:text-vsrk-gold transition-colors"
                  >
                    <Instagram className="mr-2" size={20} />
                    {pageContent.instagram}
                  </a>
                </div>

                <div>
                  <h3 className="font-medium mb-1">WhatsApp</h3>
                  <a
                    href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hi! I'm interested in your jewelry collection.")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 rounded-md bg-green-500 hover:bg-green-600 text-white font-medium text-sm transition-colors"
                  >
                    <MessageCircle className="mr-2 h-4 w-4" />
                    Chat with us on WhatsApp
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Contact;
