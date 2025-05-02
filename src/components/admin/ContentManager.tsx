
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Save } from "lucide-react";
import { supabase } from '@/integrations/supabase/client';

interface ContentItem {
  id: string;
  page: string;
  section: string;
  content: string;
  title?: string;
}

const ContentManager: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [contentItems, setContentItems] = useState<ContentItem[]>([]);
  const [activeTab, setActiveTab] = useState("home");
  const { toast } = useToast();
  
  // Fetch all content items
  const fetchContentItems = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('page_content')
      .select('*')
      .order('page')
      .order('section');
      
    if (error) {
      console.error('Error fetching content items:', error);
      toast({
        title: "Error loading content",
        description: "There was a problem loading the page content.",
        variant: "destructive"
      });
    } else {
      console.log('Loaded content items:', data);
      setContentItems(data || []);
    }
    setIsLoading(false);
  };
  
  // Save updated content
  const saveContent = async (updatedItem: ContentItem) => {
    setIsSaving(true);
    
    const { data, error } = await supabase
      .from('page_content')
      .update({ 
        content: updatedItem.content,
        title: updatedItem.title 
      })
      .eq('id', updatedItem.id);
      
    if (error) {
      console.error('Error saving content:', error);
      toast({
        title: "Error saving content",
        description: "There was a problem updating the content.",
        variant: "destructive"
      });
    } else {
      toast({
        title: "Content updated",
        description: "Page content has been updated successfully."
      });
      
      // Update the local state
      setContentItems(prevItems => 
        prevItems.map(item => 
          item.id === updatedItem.id ? updatedItem : item
        )
      );
    }
    setIsSaving(false);
  };

  // Load content on component mount
  useEffect(() => {
    fetchContentItems();
  }, []);
  
  // Group content items by page
  const pageGroups = contentItems.reduce<Record<string, ContentItem[]>>((acc, item) => {
    if (!acc[item.page]) acc[item.page] = [];
    acc[item.page].push(item);
    return acc;
  }, {});
  
  const handleContentChange = (id: string, field: 'content' | 'title', value: string) => {
    setContentItems(prevItems => 
      prevItems.map(item => 
        item.id === id 
          ? { ...item, [field]: value } 
          : item
      )
    );
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 text-vsrk-gold animate-spin" />
        <span className="ml-2 text-lg text-gray-600">Loading content...</span>
      </div>
    );
  }

  const pageNames: Record<string, string> = {
    'home': 'Home Page',
    'about': 'About Page',
    'gallery': 'Gallery Page',
    'contact': 'Contact Page',
    'footer': 'Footer'
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="font-serif text-2xl font-semibold mb-6">Page Content Management</h2>
      
      {contentItems.length === 0 ? (
        <div className="text-center py-8 border border-dashed rounded-md">
          <p className="text-gray-500">No content entries found</p>
          <p className="text-sm text-gray-400 mt-2">
            Content entries need to be created first. Check the database setup.
          </p>
        </div>
      ) : (
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            {Object.keys(pageGroups).map(page => (
              <TabsTrigger key={page} value={page}>{pageNames[page] || page}</TabsTrigger>
            ))}
          </TabsList>
          
          {Object.entries(pageGroups).map(([page, items]) => (
            <TabsContent key={page} value={page} className="space-y-6">
              <div className="space-y-8">
                {items.map(item => (
                  <div key={item.id} className="border rounded-md p-4">
                    <div className="mb-4">
                      <h3 className="font-medium text-lg capitalize">{item.section.replace(/_/g, ' ')}</h3>
                    </div>

                    {item.title !== undefined && (
                      <div className="mb-4">
                        <Label htmlFor={`title-${item.id}`} className="mb-2 block">Title</Label>
                        <Input
                          id={`title-${item.id}`}
                          value={item.title || ''}
                          onChange={e => handleContentChange(item.id, 'title', e.target.value)}
                        />
                      </div>
                    )}

                    <div className="mb-4">
                      <Label htmlFor={`content-${item.id}`} className="mb-2 block">Content</Label>
                      <Textarea
                        id={`content-${item.id}`}
                        value={item.content}
                        onChange={e => handleContentChange(item.id, 'content', e.target.value)}
                        className="min-h-[120px]"
                      />
                    </div>

                    <div className="flex justify-end">
                      <Button 
                        onClick={() => saveContent(item)} 
                        disabled={isSaving}
                        className="flex items-center"
                      >
                        {isSaving ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <Save className="mr-2 h-4 w-4" />
                        )}
                        Save Changes
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      )}
    </div>
  );
};

export default ContentManager;
