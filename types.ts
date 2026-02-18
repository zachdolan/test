
export type MatchResult = 'win' | 'loss' | 'draw';

export interface ChessMatch {
  id: string;
  date: string;
  opponent: string;
  result: MatchResult;
  eloChange: number;
  opening: string;
  notes?: string;
}

export interface BJJMatch {
  id: string;
  date: string;
  opponent: string;
  result: MatchResult;
  method: 'submission' | 'points' | 'decision';
  subType?: string;
  weightClass: string;
  notes?: string;
}

export interface UserStats {
  chessElo: number;
  bjjBelt: string;
  bjjStripes: number;
}

export interface AppState {
  chessMatches: ChessMatch[];
  bjjMatches: BJJMatch[];
  stats: UserStats;
  githubToken?: string;
  gistId?: string;
}

export type View = 'dashboard' | 'chess' | 'bjj' | 'settings';
