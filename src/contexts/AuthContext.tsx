import React, { createContext, useContext, useState, useEffect } from 'react';
import { SupabaseClient, User, Session } from '@supabase/supabase-js';
import YouTubeService from '../services/youtube';
import { supabase } from '../utils/supabase';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  youtubeService: YouTubeService | null;
  accessToken: string | null;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [youtubeService, setYoutubeService] = useState<YouTubeService | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  const handleSession = (session: Session | null) => {
    if (session) {
      const { provider_token, user } = session;
      console.log('Processing session:', { provider_token: !!provider_token, user: !!user });
      
      if (provider_token && user) {
        setYoutubeService(new YouTubeService(provider_token));
        setUser(user);
        setIsAuthenticated(true);
        setAccessToken(provider_token);
      } else {
        console.log('Missing provider_token or user in session');
        setIsAuthenticated(false);
        setUser(null);
        setYoutubeService(null);
        setAccessToken(null);
      }
    } else {
      console.log('No session available');
      setIsAuthenticated(false);
      setUser(null);
      setYoutubeService(null);
      setAccessToken(null);
    }
    setIsLoading(false);
  };

  const checkUser = async (client: SupabaseClient) => {
    try {
      const { data: { session }, error } = await client.auth.getSession();
      if (error) {
        console.error('Error getting session:', error);
        throw error;
      }
      handleSession(session);
    } catch (error) {
      console.error('Error checking user session:', error);
      handleSession(null);
    }
  };

  useEffect(() => {
    checkUser(supabase);

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', { event, session });
      handleSession(session);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async () => {
    try {
      console.log('Starting sign in process');
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          scopes: 'https://www.googleapis.com/auth/youtube',
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent'
          }
        }
      });
      
      if (error) {
        console.error('Sign in error:', error);
        throw error;
      }
      
      console.log('Sign in initiated:', data);
    } catch (error) {
      console.error('Error signing in:', error);
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      handleSession(null);
    } catch (error) {
      console.error('Error signing out:', error);
    }
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
