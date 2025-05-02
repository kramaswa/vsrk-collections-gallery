
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { Lock, Mail } from 'lucide-react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const LoginForm: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const { login } = useAuth();
  const { toast } = useToast();
  
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });
  
  const handleSubmit = async (values: LoginFormValues) => {
    setIsLoading(true);
    setAuthError(null);
    
    try {
      const isSuccessful = await login(values.email, values.password);
      
      if (isSuccessful) {
        toast({
          title: "Login successful",
          description: "Welcome to the admin dashboard",
        });
      } else {
        setAuthError("Invalid email or password. Please try again.");
        form.reset({ email: values.email, password: '' });
      }
    } catch (error) {
      console.error("Login error:", error);
      setAuthError("An error occurred during login. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="flex flex-col items-center justify-center p-6 bg-white rounded-lg shadow-lg max-w-md w-full">
      <div className="mb-6 text-center">
        <div className="h-16 w-16 rounded-full bg-vsrk-gold/10 flex items-center justify-center mx-auto mb-4">
          <Lock className="h-8 w-8 text-vsrk-gold" />
        </div>
        <h2 className="font-serif text-2xl font-semibold mb-2">Admin Login</h2>
        <p className="text-gray-600">Enter your credentials to continue</p>
      </div>
      
      {authError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4 w-full text-center">
          {authError}
        </div>
      )}
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="w-full space-y-6">
          {/* Email Field */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel className="text-base font-medium">Email Address <span className="text-red-500">*</span></FormLabel>
                <FormControl>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <Input
                      placeholder="Enter your email address"
                      className="pl-10 h-12 text-base border-2"
                      {...field}
                      type="email"
                      autoComplete="email"
                      required
                      style={{ fontSize: '16px' }}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {/* Password Field */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel className="text-base font-medium">Password <span className="text-red-500">*</span></FormLabel>
                <FormControl>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <Input
                      type="password"
                      placeholder="Enter your password"
                      className="pl-10 h-12 text-base border-2"
                      {...field}
                      autoComplete="current-password"
                      required
                      style={{ fontSize: '16px' }}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="mt-2 text-sm text-center text-gray-600">
            <strong>Note:</strong> Use the email and password you created in Supabase.
          </div>
          
          <Button 
            type="submit" 
            className="w-full bg-vsrk-gold hover:bg-vsrk-dark text-black hover:text-white font-medium h-14 text-base"
            disabled={isLoading}
          >
            {isLoading ? "Logging in..." : "Login"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default LoginForm;
