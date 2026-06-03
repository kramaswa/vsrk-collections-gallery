
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Save, Plus, Trash2 } from "lucide-react";
import { supabase } from '@/integrations/supabase/client';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

interface ContentItem {
  id: string;
  page: string;
  section: string;
  content: string;
  title?: string;
}

interface NewSection {
  title: string;
  content: string;
}

const PAGES = ['home', 'about', 'gallery', 'contact', 'footer'];
const pageNames: Record<string, string> = {
  home: 'Home Page', about: 'About Page', gallery: 'Gallery Page', contact: 'Contact Page', footer: 'Footer'
};

const ContentManager: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [contentItems, setContentItems] = useState<ContentItem[]>([]);
  const [activeTab, setActiveTab] = useState("home");
  const [newSection, setNewSection] = useState<NewSection | null>(null);
  const { toast } = useToast();

  const fetchContentItems = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('page_content')
      .select('*')
      .order('page')
      .order('section');
    if (error) {
      toast({ title: "Error loading content", description: error.message, variant: "destructive" });
    } else {
      setContentItems(data || []);
    }
    setIsLoading(false);
  };

  const saveContent = async (updatedItem: ContentItem) => {
    setIsSaving(true);
    const { error } = await supabase
      .from('page_content')
      .update({ content: updatedItem.content, title: updatedItem.title })
      .eq('id', updatedItem.id);
    if (error) {
      toast({ title: "Error saving content", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Content updated", description: "Page content has been updated successfully." });
      setContentItems(prev => prev.map(item => item.id === updatedItem.id ? updatedItem : item));
    }
    setIsSaving(false);
  };

  const addSection = async () => {
    if (!newSection) return;
    const slug = newSection.title.trim().toLowerCase().replace(/\s+/g, '_') || `section_${Date.now()}`;
    const { data, error } = await supabase
      .from('page_content')
      .insert({ page: activeTab, section: slug, title: newSection.title.trim(), content: newSection.content.trim(), sort_order: (pageGroups[activeTab] || []).length + 1 })
      .select()
      .single();
    if (error) {
      toast({ title: "Error adding section", description: error.message, variant: "destructive" });
    } else {
      setContentItems(prev => [...prev, data]);
      setNewSection(null);
      toast({ title: "Section added" });
    }
  };

  const deleteSection = async (id: string) => {
    const { error } = await supabase.from('page_content').delete().eq('id', id);
    if (error) {
      toast({ title: "Error deleting section", description: error.message, variant: "destructive" });
    } else {
      setContentItems(prev => prev.filter(item => item.id !== id));
      toast({ title: "Section deleted" });
    }
  };

  useEffect(() => { fetchContentItems(); }, []);

  const pageGroups = contentItems.reduce<Record<string, ContentItem[]>>((acc, item) => {
    if (!acc[item.page]) acc[item.page] = [];
    acc[item.page].push(item);
    return acc;
  }, {});

  // Ensure all known pages appear as tabs even if empty
  PAGES.forEach(p => { if (!pageGroups[p]) pageGroups[p] = []; });

  const handleContentChange = (id: string, field: 'content' | 'title', value: string) => {
    setContentItems(prev => prev.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 text-vsrk-gold animate-spin" />
        <span className="ml-2 text-lg text-gray-600">Loading content...</span>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="font-serif text-2xl font-semibold mb-6">Page Content Management</h2>

      <Tabs value={activeTab} onValueChange={(v) => { setActiveTab(v); setNewSection(null); }}>
        <TabsList className="mb-6">
          {PAGES.map(page => (
            <TabsTrigger key={page} value={page}>{pageNames[page]}</TabsTrigger>
          ))}
        </TabsList>

        {PAGES.map(page => (
          <TabsContent key={page} value={page} className="space-y-6">
            <div className="space-y-6">
              {pageGroups[page].map(item => (
                <div key={item.id} className="border rounded-md p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-medium text-lg capitalize">{item.section.replace(/_/g, ' ')}</h3>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete this section?</AlertDialogTitle>
                          <AlertDialogDescription>This will permanently remove the "{item.section.replace(/_/g, ' ')}" section. This cannot be undone.</AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90" onClick={() => deleteSection(item.id)}>Delete</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
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
                    <Button onClick={() => saveContent(item)} disabled={isSaving} className="flex items-center">
                      {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                      Save Changes
                    </Button>
                  </div>
                </div>
              ))}

              {/* Add new section */}
              {newSection ? (
                <div className="border-2 border-dashed border-vsrk-gold rounded-md p-4 space-y-4">
                  <h3 className="font-medium">New Section</h3>
                  <div>
                    <Label className="mb-2 block">Section Title</Label>
                    <Input
                      placeholder="e.g. Our Story"
                      value={newSection.title}
                      onChange={e => setNewSection(s => s ? { ...s, title: e.target.value } : s)}
                    />
                  </div>
                  <div>
                    <Label className="mb-2 block">Content</Label>
                    <Textarea
                      placeholder="Section content..."
                      value={newSection.content}
                      onChange={e => setNewSection(s => s ? { ...s, content: e.target.value } : s)}
                      className="min-h-[120px]"
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setNewSection(null)}>Cancel</Button>
                    <Button onClick={addSection} disabled={!newSection.title.trim() || !newSection.content.trim()}>
                      <Save className="mr-2 h-4 w-4" /> Save Section
                    </Button>
                  </div>
                </div>
              ) : (
                <Button variant="outline" className="w-full border-dashed" onClick={() => setNewSection({ title: '', content: '' })}>
                  <Plus className="mr-2 h-4 w-4" /> Add Section
                </Button>
              )}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default ContentManager;
