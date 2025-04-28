
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { Lock } from 'lucide-react';

const LoginForm: React.FC = () => {
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const { toast } = useToast();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    setTimeout(() => {
      const isSuccessful = login(password);
      
      if (isSuccessful) {
        toast({
          title: "Login successful",
          description: "Welcome to the admin dashboard",
        });
      } else {
        toast({
          title: "Login failed",
          description: "The password is incorrect. Please try again.",
          variant: "destructive",
        });
        setPassword('');
      }
      
      setIsLoading(false);
    }, 1000); // Simulated delay
  };
  
  return (
    <div className="flex flex-col items-center justify-center p-6 bg-white rounded-lg shadow-lg max-w-md w-full">
      <div className="mb-6 text-center">
        <div className="h-16 w-16 rounded-full bg-vsrk-gold/10 flex items-center justify-center mx-auto mb-4">
          <Lock className="h-8 w-8 text-vsrk-gold" />
        </div>
        <h2 className="font-serif text-2xl font-semibold mb-2">Admin Login</h2>
        <p className="text-gray-600">Enter the admin password to continue</p>
      </div>
      
      <form onSubmit={handleSubmit} className="w-full">
        <div className="mb-4">
          <Input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="border-gray-300"
          />
        </div>
        
        <Button 
          type="submit" 
          className="w-full bg-vsrk-gold hover:bg-vsrk-dark text-black hover:text-white font-medium"
          disabled={isLoading}
        >
          {isLoading ? "Logging in..." : "Login"}
        </Button>
      </form>
    </div>
  );
};

export default LoginForm;
