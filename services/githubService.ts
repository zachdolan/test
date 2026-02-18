
import { AppState } from '../types';

const GIST_FILENAME = 'zenith_tracker_data.json';

export async function saveToGitHub(token: string, gistId: string | undefined, data: AppState): Promise<string> {
  const payload = {
    description: 'Zenith Tracker Data Sync',
    public: false,
    files: {
      [GIST_FILENAME]: {
        content: JSON.stringify(data, null, 2),
      },
    },
  };

  const method = gistId ? 'PATCH' : 'POST';
  const url = gistId ? `https://api.github.com/gists/${gistId}` : 'https://api.github.com/gists';

  const response = await fetch(url, {
    method,
    headers: {
      Authorization: `token ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to sync with GitHub');
  }

  const result = await response.json();
  return result.id;
}

export async function loadFromGitHub(token: string, gistId: string): Promise<AppState> {
  const response = await fetch(`https://api.github.com/gists/${gistId}`, {
    headers: {
      Authorization: `token ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to load data from GitHub');
  }

  const result = await response.json();
  const file = result.files[GIST_FILENAME];
  if (!file || !file.content) {
    throw new Error('Data file not found in Gist');
  }

  return JSON.parse(file.content);
}
