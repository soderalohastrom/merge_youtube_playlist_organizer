import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import YouTubeService from '../services/youtube';
import MockYouTubeService from '../services/mockYoutube';

interface YouTubeContextType {
  youtubeService: YouTubeService | MockYouTubeService | null;
  isUsingMock: boolean;
  setUseMock: (useMock: boolean) => void;
  user: User | null;
}

const YouTubeContext = createContext<YouTubeContextType | undefined>(undefined);

interface YouTubeProviderProps {
  children: React.ReactNode;
  user: User | null;
  accessToken?: string | null;
}

export const YouTubeProvider = ({ children, user, accessToken }: YouTubeProviderProps) => {
  const [youtubeService, setYoutubeService] = useState<YouTubeService | MockYouTubeService | null>(null);
  const [isUsingMock, setIsUsingMock] = useState(true); // Default to mock mode

  const setUseMock = (useMock: boolean) => {
    setIsUsingMock(useMock);
    if (useMock) {
      setYoutubeService(new MockYouTubeService());
    } else if (accessToken) {
      setYoutubeService(new YouTubeService(accessToken));
    } else {
      setYoutubeService(null);
    }
  };

  useEffect(() => {
    // Initialize with mock service by default
    setUseMock(true);
  }, []);

  useEffect(() => {
    // If we have an access token and we're not using mock, initialize the real service
    if (accessToken && !isUsingMock) {
      setYoutubeService(new YouTubeService(accessToken));
    }
  }, [accessToken, isUsingMock]);

  return (
    <YouTubeContext.Provider value={{ youtubeService, isUsingMock, setUseMock, user }}>
      {children}
    </YouTubeContext.Provider>
  );
};

export const useYouTube = () => {
  const context = useContext(YouTubeContext);
  if (context === undefined) {
    throw new Error('useYouTube must be used within a YouTubeProvider');
  }
  return context;
}; 