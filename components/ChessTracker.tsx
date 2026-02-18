
import React, { useState } from 'react';
import { ChessMatch, MatchResult } from '../types';

interface ChessTrackerProps {
  matches: ChessMatch[];
  onAdd: (match: Omit<ChessMatch, 'id'>) => void;
}

const ChessTracker: React.FC<ChessTrackerProps> = ({ matches, onAdd }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    opponent: '',
    result: 'win' as MatchResult,
    eloChange: 0,
    opening: '',
    notes: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({
      ...formData,
      date: new Date().toISOString(),
    });
    setIsModalOpen(false);
    setFormData({ opponent: '', result: 'win', eloChange: 0, opening: '', notes: '' });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-white">Chess Tracker</h2>
          <p className="text-slate-400">Master the 64 squares.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-500 px-6 py-2 rounded-lg font-semibold transition-all"
        >
          Add Match
        </button>
      </div>

      <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden shadow-2xl">
        <table className="w-full text-left">
          <thead className="bg-slate-700/50 text-slate-400 text-xs uppercase tracking-wider">
            <tr>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4">Opponent</th>
              <th className="px-6 py-4">Opening</th>
              <th className="px-6 py-4">Result</th>
              <th className="px-6 py-4">Rating Δ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700 text-slate-200">
            {matches.map((match) => (
              <tr key={match.id} className="hover:bg-slate-700/30 transition-colors">
                <td className="px-6 py-4 text-sm">{new Date(match.date).toLocaleDateString()}</td>
                <td className="px-6 py-4 font-medium">{match.opponent}</td>
                <td className="px-6 py-4 text-slate-400">{match.opening}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                    match.result === 'win' ? 'bg-emerald-500/20 text-emerald-400' :
                    match.result === 'loss' ? 'bg-rose-500/20 text-rose-400' : 'bg-slate-500/20 text-slate-400'
                  }`}>
                    {match.result}
                  </span>
                </td>
                <td className={`px-6 py-4 font-mono ${match.eloChange >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {match.eloChange >= 0 ? '+' : ''}{match.eloChange}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {matches.length === 0 && (
          <div className="p-12 text-center text-slate-500">
            No matches recorded yet. Time for some blitz!
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-800 border border-slate-700 p-8 rounded-2xl w-full max-w-md shadow-2xl">
            <h3 className="text-2xl font-bold text-white mb-6">New Match</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Opponent</label>
                <input
                  required
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white outline-none focus:border-blue-500"
                  value={formData.opponent}
                  onChange={e => setFormData({ ...formData, opponent: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Result</label>
                  <select
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white outline-none focus:border-blue-500"
                    value={formData.result}
                    onChange={e => setFormData({ ...formData, result: e.target.value as MatchResult })}
                  >
                    <option value="win">Win</option>
                    <option value="loss">Loss</option>
                    <option value="draw">Draw</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">ELO Δ</label>
                  <input
                    type="number"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white outline-none focus:border-blue-500"
                    value={formData.eloChange}
                    onChange={e => setFormData({ ...formData, eloChange: parseInt(e.target.value) || 0 })}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Opening</label>
                <input
                  placeholder="e.g. Sicilian Defense"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white outline-none focus:border-blue-500"
                  value={formData.opening}
                  onChange={e => setFormData({ ...formData, opening: e.target.value })}
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
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors font-bold"
                >
                  Save Match
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChessTracker;
