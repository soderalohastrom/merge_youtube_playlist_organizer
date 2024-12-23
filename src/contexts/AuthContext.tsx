import React, { createContext, useContext, useState, useEffect } from 'react';
import { SupabaseClient, User, Session } from '@supabase/supabase-js';
import YouTubeService from '../services/youtube';
import { supabase } from '../utils/supabase';

export type Json = null | string | number | boolean | Json[] | { [key: string]: Json };

export interface Database {
  public: {
    Tables: {
      user_sessions: {
        Row: {
          id: string;
          user_id: string;
          email: string;
          access_token: string;
          refresh_token: string;
          provider: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          email: string;
          access_token: string;
          refresh_token: string;
          provider: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          email?: string;
          access_token?: string;
          refresh_token?: string;
          provider?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  youtubeService: YouTubeService | null;
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

  const checkUser = async (client: SupabaseClient) => {
    try {
      const { data: { session }, error } = await client.auth.getSession();
      if (error) throw error;

      if (session) {
        console.log('Supabase auth session:', session);
        const { provider_token, user, access_token, refresh_token } = session;
        console.log('provider_token:', provider_token);
        console.log('user:', user);
        console.log('access_token:', access_token);
        console.log('refresh_token:', refresh_token);
        if (provider_token && user && access_token && refresh_token) {
          const { data, error } = await supabase
            .from<'user_sessions', Database['public']['Tables']['user_sessions']['Row']>('user_sessions')
            .select('*', { head: true })
            .eq('user_id', user.id)
            .single()
            .then(({ data, error }) => ({ data, error }));

          if (error) {
            console.error('Error retrieving user session:', error);
          } else if (data) {
            setYoutubeService(new YouTubeService(data.access_token));
            setUser(user);
            setIsAuthenticated(true);
          } else {
            const { data: { session }, error: sessionError } = await supabase.auth.getSession();
            if (sessionError) {
              console.error('Error getting session:', sessionError);
            } else if (session) {
              const access_token = session.access_token;
              const refresh_token = session.refresh_token;
              if (access_token && refresh_token) {
                const insertData: Required<Omit<Database['public']['Tables']['user_sessions']['Insert'], 'id'>> = {
                  user_id: user.id,
                  email: user.email || '',
                  access_token,
                  refresh_token,
                  provider: 'google',
                  created_at: new Date().toISOString(),
                  updated_at: new Date().toISOString(),
                };
                const { error } = await supabase
                  .from<'user_sessions', Database['public']['Tables']['user_sessions']['Insert']>('user_sessions')
                  .insert(insertData)
                  .then(({ error }) => error);

                if (error) {
                  console.error('Error saving user session:', error);
                } else {
                  setYoutubeService(new YouTubeService(access_token));
                  setUser(user);
                  setIsAuthenticated(true);
                }

                if (error) {
                  console.error('Error saving user session:', error);
                } else {
                  setYoutubeService(new YouTubeService(access_token));
                  setUser(user);
                  setIsAuthenticated(true);
                }

                if (error) {
                  console.error('Error saving user session:', error);
                } else {
                  setYoutubeService(new YouTubeService(access_token));
                  setUser(user);
                  setIsAuthenticated(true);
                }
              }
            }
          }
        }
      }
    } catch (error) {
      console.error('Error checking user session:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkUser(supabase);
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session) {
        const { provider_token, user } = session;
        if (provider_token && user) {
          const { data, error } = await supabase
            .from<'user_sessions', Database['public']['Tables']['user_sessions']['Row']>('user_sessions')
            .select('*')
            .eq('user_id', user.id)
            .single()
            .then(({ data, error }) => ({ data, error }));

          if (error) {
            console.error('Error retrieving user session:', error);
          } else if (data) {
            setYoutubeService(new YouTubeService(data.access_token));
            setUser(user);
            setIsAuthenticated(true);
          } else {
            const { data: { session }, error: sessionError } = await supabase.auth.getSession();
            if (sessionError) {
              console.error('Error getting session:', sessionError);
            } else if (session) {
              const access_token = session.access_token;
              const refresh_token = session.refresh_token;
              if (access_token && refresh_token) {
                const insertData: Required<Omit<Database['public']['Tables']['user_sessions']['Insert'], 'id'>> = {
                  user_id: user.id,
                  email: user.email,
                  access_token,
                  refresh_token,
                  provider: 'google',
                  created_at: new Date().toISOString(),
                  updated_at: new Date().toISOString(),
                };
                const { error } = await supabase
                  .from<'user_sessions', Database['public']['Tables']['user_sessions']['Insert']>('user_sessions')
                  .insert(insertData)
                  .then(({ error }) => error);

                if (error) {
                  console.error('Error saving user session:', error);
                } else {
                  setYoutubeService(new YouTubeService(access_token));
                  setUser(user);
                  setIsAuthenticated(true);
                }

                if (error) {
                  console.error('Error saving user session:', error);
                } else {
                  setYoutubeService(new YouTubeService(access_token));
                  setUser(user);
                  setIsAuthenticated(true);
                }

                if (error) {
                  console.error('Error saving user session:', error);
                } else {
                  setYoutubeService(new YouTubeService(access_token));
                  setUser(user);
                  setIsAuthenticated(true);
                }
              }
            }
          }
        }
      } else {
        setYoutubeService(null);
        setUser(null);
        setIsAuthenticated(false);
        await deleteUserSession(user?.id);
      }
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase]);

  const signIn = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          scopes: 'https://www.googleapis.com/auth/youtube'
        }
      });
      if (error) throw error;
    } catch (error) {
      console.error('Error signing in:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setYoutubeService(null);
      setUser(null);
      setIsAuthenticated(false);
      await deleteUserSession(user?.id);
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  const deleteUserSession = async (userId?: string) => {
    if (userId) {
      try {
        const { error } = await supabase
          .from<'user_sessions', Database['public']['Tables']['user_sessions']['Row']>('user_sessions')
          .delete()
          .eq('user_id', userId)
          .then(({ error }) => error);

        if (error) {
          console.error('Error deleting user session:', error);
        }
      } catch (error) {
        console.error('Error deleting user session:', error);
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        user,
        youtubeService,
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

export default AuthProvider;
