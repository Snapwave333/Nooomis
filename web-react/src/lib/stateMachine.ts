export const GameState = {
  IDLE: 'IDLE',
  MODE_SELECT: 'MODE_SELECT',
  PLAYBACK: 'PLAYBACK',
  PLAYER_INPUT: 'PLAYER_INPUT',
  ROUND_SUCCESS: 'ROUND_SUCCESS',
  ROUND_FAIL: 'ROUND_FAIL',
  GAME_OVER: 'GAME_OVER',
  PAUSED: 'PAUSED',
} as const;

export type GameStateType = typeof GameState[keyof typeof GameState];

export type GameEvent = 
  | { type: 'START'; mode: string }
  | { type: 'PLAYBACK_COMPLETE' }
  | { type: 'PLAYER_PRESS'; index: number }
  | { type: 'INPUT_CORRECT' }
  | { type: 'INPUT_WRONG' }
  | { type: 'PAUSE' }
  | { type: 'RESUME' }
  | { type: 'GAME_OVER' };
