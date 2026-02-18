
import React, { useState } from 'react';
import { BJJMatch, MatchResult } from '../types';

interface BJJTrackerProps {
  matches: BJJMatch[];
  onAdd: (match: Omit<BJJMatch, 'id'>) => void;
}

const BJJTracker: React.FC<BJJTrackerProps> = ({ matches, onAdd }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    opponent: '',
    result: 'win' as MatchResult,
    method: 'submission' as any,
    subType: '',
    weightClass: '',
    notes: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({
      ...formData,
      date: new Date().toISOString(),
    });
    setIsModalOpen(false);
    setFormData({ opponent: '', result: 'win', method: 'submission', subType: '', weightClass: '', notes: '' });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-white">BJJ Tracker</h2>
          <p className="text-slate-400">Precision and Pressure.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-emerald-600 hover:bg-emerald-500 px-6 py-2 rounded-lg font-semibold transition-all"
        >
          Add Roll
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {matches.map((match) => (
          <div key={match.id} className="bg-slate-800 border border-slate-700 p-5 rounded-xl hover:border-emerald-500/50 transition-all group shadow-xl">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-xs text-slate-500">{new Date(match.date).toLocaleDateString()}</p>
                <h4 className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors">{match.opponent}</h4>
              </div>
              <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${
                match.result === 'win' ? 'bg-emerald-500/20 text-emerald-400' :
                match.result === 'loss' ? 'bg-rose-500/20 text-rose-400' : 'bg-slate-500/20 text-slate-400'
              }`}>
                {match.result}
              </span>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">Method:</span>
                <span className="text-slate-200 capitalize">{match.method}</span>
              </div>
              {match.subType && (
                <div className="flex justify-between">
                  <span className="text-slate-500">Technique:</span>
                  <span className="text-emerald-400 font-medium">{match.subType}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-slate-500">Weight:</span>
                <span className="text-slate-200">{match.weightClass || 'Any'}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {matches.length === 0 && (
        <div className="p-20 text-center border-2 border-dashed border-slate-700 rounded-2xl text-slate-500">
          No training logs yet. Get on the mats! OSS!
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-800 border border-slate-700 p-8 rounded-2xl w-full max-w-md shadow-2xl">
            <h3 className="text-2xl font-bold text-white mb-6">Log Training Session</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Opponent/Partner</label>
                <input
                  required
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white outline-none focus:border-emerald-500"
                  value={formData.opponent}
                  onChange={e => setFormData({ ...formData, opponent: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Outcome</label>
                  <select
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white outline-none focus:border-emerald-500"
                    value={formData.result}
                    onChange={e => setFormData({ ...formData, result: e.target.value as MatchResult })}
                  >
                    <option value="win">Win</option>
                    <option value="loss">Loss</option>
                    <option value="draw">Draw</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Method</label>
                  <select
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white outline-none focus:border-emerald-500"
                    value={formData.method}
                    onChange={e => setFormData({ ...formData, method: e.target.value as any })}
                  >
                    <option value="submission">Submission</option>
                    <option value="points">Points</option>
                    <option value="decision">Decision</option>
                  </select>
                </div>
              </div>
              {formData.method === 'submission' && (
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Technique Used</label>
                  <input
                    placeholder="e.g. Armbar, RNC"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white outline-none focus:border-emerald-500"
                    value={formData.subType}
                    onChange={e => setFormData({ ...formData, subType: e.target.value })}
                  />
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Weight Class / Weight</label>
                <input
                  placeholder="e.g. 77kg"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white outline-none focus:border-emerald-500"
                  value={formData.weightClass}
                  onChange={e => setFormData({ ...formData, weightClass: e.target.value })}
                />
              </div>
              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-lg transition-colors font-bold"
                >
                  Log Roll
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BJJTracker;
