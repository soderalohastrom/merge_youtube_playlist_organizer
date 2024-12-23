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

  const handleAuthChange = async (event: string, session: Session | null) => {
    console.log('Auth event:', event, 'Session:', session ? 'exists' : 'null');
    
    if (event === 'SIGNED_IN' || event === 'INITIAL_SESSION') {
      if (session?.provider_token) {
        try {
          const service = new YouTubeService(session.provider_token);
          setYoutubeService(service);
          setUser(session.user);
          setIsAuthenticated(true);
          setAccessToken(session.provider_token);
          console.log('Successfully set up YouTube service');
        } catch (error) {
          console.error('Error setting up YouTube service:', error);
          setIsAuthenticated(false);
        }
      } else {
        console.log('No provider token in session');
        setIsAuthenticated(false);
      }
    } else if (event === 'SIGNED_OUT') {
      console.log('User signed out');
      setYoutubeService(null);
      setUser(null);
      setIsAuthenticated(false);
      setAccessToken(null);
    }
    
    setIsLoading(false);
  };

  useEffect(() => {
    // Initial session check
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        console.error('Error getting initial session:', error);
        setIsLoading(false);
        return;
      }
      handleAuthChange('INITIAL_SESSION', session);
    });

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      handleAuthChange(event, session);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async () => {
    try {
      console.log('Starting Google OAuth sign in');
      const { error } = await supabase.auth.signInWithOAuth({
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
        console.error('OAuth sign in error:', error);
        throw error;
      }
    } catch (error) {
      console.error('Sign in process error:', error);
      setIsAuthenticated(false);
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Sign out error:', error);
        throw error;
      }
      setYoutubeService(null);
      setUser(null);
      setIsAuthenticated(false);
      setAccessToken(null);
    } catch (error) {
      console.error('Sign out process error:', error);
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
