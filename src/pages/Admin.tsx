
import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { useAuth } from '@/contexts/AuthContext';
import LoginForm from '@/components/admin/LoginForm';
import UploadForm from '@/components/admin/UploadForm';
import MediaManager from '@/components/admin/MediaManager';
import ContentManager from '@/components/admin/ContentManager';
import MessageManager from '@/components/admin/MessageManager';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from '@/components/ui/use-toast';
import { LogOut, Loader2, ImageIcon, TextIcon, MessageSquare } from 'lucide-react';

const Admin: React.FC = () => {
  const { isAuthenticated, logout, loading, user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("media");
  const [userName, setUserName] = useState<string | null>(null);
  
  // Ensure user name is properly stored and doesn't disappear
  useEffect(() => {
    if (user) {
      console.log("Admin component - user data:", user);
      const displayName = user.user_metadata?.name || user.email;
      console.log("Setting display name:", displayName);
      setUserName(displayName);
    } else {
      setUserName(null);
    }
  }, [user]);
  
  const handleLogout = async () => {
    await logout();
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
    });
  };
  
  if (loading) {
    return (
      <Layout hideFooter={true}>
        <div className="container mx-auto px-4 py-16 flex justify-center items-center h-[60vh]">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin mx-auto text-vsrk-gold" />
            <p className="mt-4 text-lg text-gray-600">Loading...</p>
          </div>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout hideFooter={!isAuthenticated}>
      <div className="container mx-auto px-4 py-16">
        {isAuthenticated ? (
          <>
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="font-serif text-4xl font-medium">Admin Dashboard</h1>
                <p className="text-gray-600 mt-2">
                  Welcome, {userName || (user?.user_metadata?.name || user?.email)}
                </p>
              </div>
              <Button 
                variant="outline"
                onClick={handleLogout}
                className="flex items-center"
              >
                <LogOut className="mr-2 h-4 w-4" /> Logout
              </Button>
            </div>
            
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="media" className="flex items-center">
                  <ImageIcon className="mr-2 h-4 w-4" /> Media
                </TabsTrigger>
                <TabsTrigger value="content" className="flex items-center">
                  <TextIcon className="mr-2 h-4 w-4" /> Page Content
                </TabsTrigger>
                <TabsTrigger value="messages" className="flex items-center">
                  <MessageSquare className="mr-2 h-4 w-4" /> Messages
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="media">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-6">
                  <div className="lg:col-span-1">
                    <UploadForm />
                  </div>
                  <div className="lg:col-span-2">
                    <MediaManager />
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="content">
                <div className="mt-6">
                  <ContentManager />
                </div>
              </TabsContent>
              
              <TabsContent value="messages">
                <div className="mt-6">
                  <MessageManager />
                </div>
              </TabsContent>
            </Tabs>
          </>
        ) : (
          <div className="max-w-md mx-auto">
            <LoginForm />
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Admin;
