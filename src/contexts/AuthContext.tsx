import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import YouTubeService from '../services/youtube';
import MockYouTubeService from '../services/mockYoutube';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  youtubeService: YouTubeService | MockYouTubeService | null;
  accessToken: string | null;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
}

// Mock user for development
const MOCK_USER = {
  id: 'mock-user-id',
  email: 'mock@example.com',
  app_metadata: {},
  user_metadata: {
    full_name: 'Mock User'
  },
  aud: 'authenticated',
  created_at: new Date().toISOString(),
  role: 'authenticated',
  updated_at: new Date().toISOString()
} as unknown as User;

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isAuthenticated] = useState(true); // Always authenticated
  const [isLoading] = useState(false); // No loading needed
  const [user] = useState<User | null>(MOCK_USER); // Use mock user
  const [youtubeService] = useState<MockYouTubeService>(new MockYouTubeService()); // Use mock service
  const [accessToken] = useState<string | null>('mock-token'); // Mock token

  // Mock sign in - just logs the attempt
  const signIn = async () => {
    console.log('Mock sign in - already authenticated');
  };

  // Mock sign out - just logs the attempt
  const signOut = async () => {
    console.log('Mock sign out - staying authenticated for development');
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        user,
        youtubeService,
        accessToken,
        signIn,
        signOut
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
