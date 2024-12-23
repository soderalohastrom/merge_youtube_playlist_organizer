import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const saveUserSession = async (user: any, accessToken: string, refreshToken: string) => {
  try {
    const { data, error } = await supabase
      .from('user_sessions')
      .insert([
        {
          user_id: user.id,
          email: user.email,
          access_token: accessToken,
          refresh_token: refreshToken,
          provider: 'google'
        }
      ]);
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error saving user session:', error);
    throw error;
  }
};

export const getUserSession = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('user_sessions')
      .select('*')
      .eq('user_id', userId)
      .single();
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error getting user session:', error);
    throw error;
  }
};

export const deleteUserSession = async (userId: string) => {
  try {
    const { error } = await supabase
      .from('user_sessions')
      .delete()
      .eq('user_id', userId);
    if (error) throw error;
  } catch (error) {
    console.error('Error deleting user session:', error);
    throw error;
  }
};
