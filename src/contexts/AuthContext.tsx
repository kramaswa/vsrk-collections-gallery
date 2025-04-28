
import React, { createContext, useContext, useState, useEffect } from 'react';

type AuthContextType = {
  isAuthenticated: boolean;
  login: (password: string) => boolean;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// This is a very simple authentication system
// In a real application, you would use a more secure method
// such as JWT tokens or an auth provider like Firebase Auth
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  
  // Check if user is already logged in from localStorage
  useEffect(() => {
    const token = localStorage.getItem('vsrk-admin-token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);
  
  // Simple password check - in a real app, you would verify with a backend
  // ADMIN_PASSWORD should be something secure and not hardcoded in the frontend
  const login = (password: string): boolean => {
    // This is a simple example - replace with a secure password
    if (password === 'VSRK-Collections-2024') {
      setIsAuthenticated(true);
      localStorage.setItem('vsrk-admin-token', 'authenticated');
      return true;
    }
    return false;
  };
  
  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('vsrk-admin-token');
  };
  
  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
