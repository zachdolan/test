
import React, { useState, useEffect, useCallback } from 'react';
import { AppState, View, ChessMatch, BJJMatch, MatchResult } from './types';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import ChessTracker from './components/ChessTracker';
import BJJTracker from './components/BJJTracker';
import Settings from './components/Settings';
import { saveToGitHub, loadFromGitHub } from './services/githubService';

const STORAGE_KEY = 'zenith_app_data';

const initialData: AppState = {
  chessMatches: [],
  bjjMatches: [],
  stats: {
    chessElo: 1200,
    bjjBelt: 'White',
    bjjStripes: 0,
  },
};

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<View>('dashboard');
  const [state, setState] = useState<AppState>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : initialData;
  });
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'error' | 'success'>('idle');

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const handleSync = useCallback(async () => {
    if (!state.githubToken) {
      alert('Please set a GitHub Personal Access Token in Settings first.');
      setActiveView('settings');
      return;
    }

    setSyncStatus('syncing');
    try {
      const newGistId = await saveToGitHub(state.githubToken, state.gistId, state);
      setState(prev => ({ ...prev, gistId: newGistId }));
      setSyncStatus('success');
      setTimeout(() => setSyncStatus('idle'), 3000);
    } catch (err) {
      console.error(err);
      setSyncStatus('error');
      setTimeout(() => setSyncStatus('idle'), 5000);
    }
  }, [state]);

  const addChessMatch = (match: Omit<ChessMatch, 'id'>) => {
    const newMatch = { ...match, id: crypto.randomUUID() };
    setState(prev => ({
      ...prev,
      chessMatches: [newMatch, ...prev.chessMatches],
      stats: {
        ...prev.stats,
        chessElo: prev.stats.chessElo + match.eloChange,
      }
    }));
  };

  const addBJJMatch = (match: Omit<BJJMatch, 'id'>) => {
    const newMatch = { ...match, id: crypto.randomUUID() };
    setState(prev => ({
      ...prev,
      bjjMatches: [newMatch, ...prev.bjjMatches],
    }));
  };

  const updateSettings = (token: string, gistId: string) => {
    setState(prev => ({ ...prev, githubToken: token, gistId }));
  };

  const renderView = () => {
    switch (activeView) {
      case 'dashboard':
        return <Dashboard state={state} onSync={handleSync} syncStatus={syncStatus} />;
      case 'chess':
        return <ChessTracker matches={state.chessMatches} onAdd={addChessMatch} />;
      case 'bjj':
        return <BJJTracker matches={state.bjjMatches} onAdd={addBJJMatch} />;
      case 'settings':
        return <Settings token={state.githubToken} gistId={state.gistId} onSave={updateSettings} />;
      default:
        return <Dashboard state={state} onSync={handleSync} syncStatus={syncStatus} />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-900 overflow-hidden">
      <Sidebar activeView={activeView} setActiveView={setActiveView} />
      <main className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
        {renderView()}
      </main>
    </div>
  );
};

export default App;
