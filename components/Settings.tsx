
import React, { useState } from 'react';

interface SettingsProps {
  token?: string;
  gistId?: string;
  onSave: (token: string, gistId: string) => void;
}

const Settings: React.FC<SettingsProps> = ({ token = '', gistId = '', onSave }) => {
  const [localToken, setLocalToken] = useState(token);
  const [localGistId, setLocalGistId] = useState(gistId);
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    onSave(localToken, localGistId);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-white">Settings</h2>
        <p className="text-slate-400">Configure your cloud sync and profile.</p>
      </div>

      <section className="bg-slate-800 border border-slate-700 p-8 rounded-2xl shadow-xl space-y-6">
        <h3 className="text-xl font-semibold text-white flex items-center gap-2">
          <span>📦</span> GitHub Integration
        </h3>
        <p className="text-sm text-slate-400">
          We use GitHub Gists as your personal database. All data is stored in your own account.
        </p>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">
              GitHub Personal Access Token (PAT)
            </label>
            <input
              type="password"
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white outline-none focus:border-blue-500 font-mono"
              placeholder="ghp_xxxxxxxxxxxx"
              value={localToken}
              onChange={e => setLocalToken(e.target.value)}
            />
            <p className="text-xs text-slate-500 mt-2">
              Needs 'gist' permissions. Get one at <a href="https://github.com/settings/tokens" target="_blank" className="text-blue-400 underline">github.com/settings/tokens</a>.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">
              Gist ID (Optional)
            </label>
            <input
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white outline-none focus:border-blue-500 font-mono"
              placeholder="Leaving blank will create a new gist on sync"
              value={localGistId}
              onChange={e => setLocalGistId(e.target.value)}
            />
          </div>
        </div>

        <button
          onClick={handleSave}
          className={`w-full py-3 rounded-xl font-bold transition-all ${
            isSaved ? 'bg-emerald-600' : 'bg-blue-600 hover:bg-blue-500'
          }`}
        >
          {isSaved ? 'Saved Successfully!' : 'Update Configuration'}
        </button>
      </section>

      <div className="bg-slate-800/50 border border-slate-700/50 p-6 rounded-xl text-center">
        <p className="text-slate-500 text-sm">
          Your data is stored locally in your browser and synced only to the GitHub Gist you provide.
        </p>
      </div>
    </div>
  );
};

export default Settings;
