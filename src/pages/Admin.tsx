
import React from 'react';
import Layout from '@/components/layout/Layout';
import { useAuth } from '@/contexts/AuthContext';
import LoginForm from '@/components/admin/LoginForm';
import UploadForm from '@/components/admin/UploadForm';
import MediaManager from '@/components/admin/MediaManager';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { LogOut } from 'lucide-react';

const Admin: React.FC = () => {
  const { isAuthenticated, logout } = useAuth();
  const { toast } = useToast();
  
  const handleLogout = () => {
    logout();
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
    });
  };
  
  return (
    <Layout hideFooter={!isAuthenticated}>
      <div className="container mx-auto px-4 py-16">
        {isAuthenticated ? (
          <>
            <div className="flex justify-between items-center mb-8">
              <h1 className="font-serif text-4xl font-medium">Admin Dashboard</h1>
              <Button 
                variant="outline"
                onClick={handleLogout}
                className="flex items-center"
              >
                <LogOut className="mr-2 h-4 w-4" /> Logout
              </Button>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1">
                <UploadForm />
              </div>
              <div className="lg:col-span-2">
                <MediaManager />
              </div>
            </div>
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
