import React from 'react';
import { useAuth } from './contexts/AuthContext';
import MainLayout from './components/layout/MainLayout';
import { DragDropProvider } from './contexts/DragDropContext';
import { YouTubeProvider, useYouTube } from './contexts/YouTubeContext';

const MockToggle = () => {
  const { isUsingMock, setUseMock } = useYouTube();
  
  return (
    <div className="fixed top-4 right-4 flex items-center gap-2">
      <span className="text-sm text-gray-600">
        {isUsingMock ? 'Using Mock Data' : 'Using Real Data'}
      </span>
      <button
        onClick={() => setUseMock(!isUsingMock)}
        className="px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 rounded-md transition-colors"
      >
        Toggle Mock Mode
      </button>
    </div>
  );
};

const AppContent = () => {
  const { isAuthenticated, isLoading, user, signIn } = useAuth();

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="h-screen flex flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold">YouTube Playlist Organizer</h1>
        <button
          onClick={signIn}
          className="px-4 py-2 bg-youtube-red text-white rounded-md hover:bg-red-600 transition-colors"
        >
          Sign in with Google
        </button>
      </div>
    );
  }

  return (
    <DragDropProvider>
      <MockToggle />
      <MainLayout />
    </DragDropProvider>
  );
};

const App = () => {
  const { user, accessToken } = useAuth();

  return (
    <YouTubeProvider user={user} accessToken={accessToken}>
      <AppContent />
    </YouTubeProvider>
  );
};

export default App;
