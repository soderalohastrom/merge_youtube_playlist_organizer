import React from 'react';
import { useAuth } from './contexts/AuthContext';
import MainLayout from './components/layout/MainLayout';
import { DragDropProvider } from './contexts/DragDropContext';

const App = () => {
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
      <MainLayout />
    </DragDropProvider>
  );
};

export default App;
