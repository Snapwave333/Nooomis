interface SaveData {
  bestScores: Record<string, number>;
  settings: {
    volume: number;
    theme: string;
    audioPack: string;
    highContrast: boolean;
    reducedMotion: boolean;
  };
}

function getDefaultSave(): SaveData {
  return {
    bestScores: {},
    settings: {
      volume: 0.7,
      theme: 'default',
      audioPack: 'classic',
      highContrast: false,
      reducedMotion: false,
    },
  };
}

export function loadGame(): SaveData {
  const data = localStorage.getItem('nooomis:v2');
  return data ? JSON.parse(data) : getDefaultSave();
}

export function saveGame(data: SaveData): void {
  localStorage.setItem('nooomis:v2', JSON.stringify(data));
}
