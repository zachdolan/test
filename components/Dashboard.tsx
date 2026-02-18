
import React, { useEffect, useState } from 'react';
import { AppState } from '../types';
import { generateInsights } from '../services/geminiService';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

interface DashboardProps {
  state: AppState;
  onSync: () => void;
  syncStatus: string;
}

const Dashboard: React.FC<DashboardProps> = ({ state, onSync, syncStatus }) => {
  const [insights, setInsights] = useState<string>('Loading AI insights...');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchInsights = async () => {
      setLoading(true);
      const res = await generateInsights(state.chessMatches, state.bjjMatches);
      setInsights(res);
      setLoading(false);
    };
    if (state.chessMatches.length > 0 || state.bjjMatches.length > 0) {
      fetchInsights();
    } else {
      setInsights("Log some matches to get AI performance analysis.");
    }
  }, [state.chessMatches, state.bjjMatches]);

  const winRate = (matches: any[]) => {
    if (matches.length === 0) return 0;
    const wins = matches.filter(m => m.result === 'win').length;
    return Math.round((wins / matches.length) * 100);
  };

  const chartData = state.chessMatches.slice().reverse().map((m, i) => ({
    name: i,
    elo: 1200 + state.chessMatches.slice(0, state.chessMatches.length - i).reduce((acc, curr) => acc + curr.eloChange, 0)
  }));

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-white">Dashboard</h2>
          <p className="text-slate-400">Welcome back, athlete.</p>
        </div>
        <button
          onClick={onSync}
          disabled={syncStatus === 'syncing'}
          className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${
            syncStatus === 'syncing' ? 'bg-slate-700' : 
            syncStatus === 'error' ? 'bg-red-600' : 
            syncStatus === 'success' ? 'bg-emerald-600' : 'bg-blue-600 hover:bg-blue-500'
          }`}
        >
          <span>{syncStatus === 'syncing' ? '⌛' : syncStatus === 'error' ? '❌' : syncStatus === 'success' ? '✅' : '☁️'}</span>
          {syncStatus === 'syncing' ? 'Syncing...' : syncStatus === 'error' ? 'Failed' : syncStatus === 'success' ? 'Synced' : 'Sync to GitHub'}
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Chess ELO" value={state.stats.chessElo} sub="Top Rating: 1450" color="blue" />
        <StatCard title="BJJ Rank" value={`${state.stats.bjjBelt} Belt`} sub={`${state.stats.bjjStripes} Stripes`} color="emerald" />
        <StatCard title="Chess Win Rate" value={`${winRate(state.chessMatches)}%`} sub={`${state.chessMatches.length} Games`} color="amber" />
        <StatCard title="BJJ Win Rate" value={`${winRate(state.bjjMatches)}%`} sub={`${state.bjjMatches.length} Rounds`} color="rose" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-xl">
          <h3 className="text-xl font-semibold mb-6 text-slate-200">Chess ELO Progression</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorElo" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="name" hide />
                <YAxis domain={['dataMin - 50', 'dataMax + 50']} stroke="#64748b" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f1f5f9' }}
                  itemStyle={{ color: '#3b82f6' }}
                />
                <Area type="monotone" dataKey="elo" stroke="#3b82f6" fillOpacity={1} fill="url(#colorElo)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-2 text-3xl opacity-10">✨</div>
          <h3 className="text-xl font-semibold mb-4 text-slate-200 flex items-center gap-2">
            <span>🧠</span> Gemini AI Insights
          </h3>
          <div className="space-y-4 text-slate-300">
            {loading ? (
              <div className="animate-pulse space-y-2">
                <div className="h-4 bg-slate-700 rounded w-full"></div>
                <div className="h-4 bg-slate-700 rounded w-3/4"></div>
                <div className="h-4 bg-slate-700 rounded w-5/6"></div>
              </div>
            ) : (
              <div className="prose prose-invert prose-sm whitespace-pre-wrap">
                {insights}
              </div>
            )}
          </div>
          <button className="mt-6 w-full py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm transition-colors">
            Ask for Specific Advice
          </button>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, sub, color }: any) => {
  const colors: any = {
    blue: 'border-blue-500/50 from-blue-500/10',
    emerald: 'border-emerald-500/50 from-emerald-500/10',
    amber: 'border-amber-500/50 from-amber-500/10',
    rose: 'border-rose-500/50 from-rose-500/10',
  };

  return (
    <div className={`bg-slate-800 border ${colors[color]} bg-gradient-to-br to-transparent p-5 rounded-xl shadow-lg`}>
      <p className="text-sm font-medium text-slate-400">{title}</p>
      <p className="text-2xl font-bold text-white mt-1">{value}</p>
      <p className="text-xs text-slate-500 mt-1">{sub}</p>
    </div>
  );
};

export default Dashboard;
