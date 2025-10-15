import { useState, useCallback, useRef } from 'react';
import { GameState, type GameStateType } from '../lib/stateMachine';
import { SequenceGenerator } from '../lib/sequence';
import { calculateScore, CLASSIC_CONFIG } from '../lib/modes/classic';
import { useAudio } from './useAudio';

export function useGame() {
  const [state, setState] = useState<GameStateType>(GameState.IDLE);
  const [sequence, setSequence] = useState<number[]>([]);
  const [playerInput, setPlayerInput] = useState<number[]>([]);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(CLASSIC_CONFIG.startingLives);
  const [round, setRound] = useState(0);
  const [streak, setStreak] = useState(0);
  const [activePad, setActivePad] = useState<number | undefined>();
  const [ariaMessage, setAriaMessage] = useState('');
  
  const sequenceGeneratorRef = useRef<SequenceGenerator | null>(null);
  const { playPad } = useAudio();
  
  const getSequenceGenerator = useCallback(() => {
    if (!sequenceGeneratorRef.current) {
      sequenceGeneratorRef.current = new SequenceGenerator();
    }
    return sequenceGeneratorRef.current;
  }, []);
  
  const playSequence = useCallback(async (seq: number[]) => {
    setState(GameState.PLAYBACK);
    setAriaMessage(`Playing sequence of ${seq.length} notes`);
    
    for (let i = 0; i < seq.length; i++) {
      setActivePad(seq[i]);
      await playPad(seq[i], CLASSIC_CONFIG.toneDuration);
      setActivePad(undefined);
      
      if (i < seq.length - 1) {
        await new Promise(resolve => setTimeout(resolve, CLASSIC_CONFIG.gapDuration));
      }
    }
    
    setState(GameState.PLAYER_INPUT);
    setAriaMessage('Your turn! Repeat the sequence');
  }, [playPad]);
  
  const startGame = useCallback((_mode: string) => {
    const generator = getSequenceGenerator();
    const newSequence = generator.startNewGame();
    setSequence(newSequence);
    setPlayerInput([]);
    setScore(0);
    setLives(CLASSIC_CONFIG.startingLives);
    setRound(1);
    setStreak(0);
    setAriaMessage('Starting new game');
    
    playSequence(newSequence);
  }, [getSequenceGenerator, playSequence]);
  
  const handlePlayerPress = useCallback((padIndex: number) => {
    if (state !== GameState.PLAYER_INPUT) return;
    
    const newInput = [...playerInput, padIndex];
    setPlayerInput(newInput);
    
    // Play the pad sound
    playPad(padIndex, CLASSIC_CONFIG.toneDuration);
    
    // Check correctness
    const isCorrect = sequence[newInput.length - 1] === padIndex;
    
    if (!isCorrect) {
      setState(GameState.ROUND_FAIL);
      setAriaMessage('Wrong! Try again');
      const newLives = lives - 1;
      setLives(newLives);
      
      if (newLives <= 0) {
        setState(GameState.GAME_OVER);
        setAriaMessage('Game over! Final score: ' + score);
      } else {
        // Reset for next attempt
        setTimeout(() => {
          setPlayerInput([]);
          setState(GameState.PLAYER_INPUT);
          setAriaMessage('Try again');
        }, 1000);
      }
    } else if (newInput.length === sequence.length) {
      // Round complete
      setState(GameState.ROUND_SUCCESS);
      const newScore = score + calculateScore(round, streak);
      const newStreak = streak + 1;
      setScore(newScore);
      setStreak(newStreak);
      setAriaMessage(`Correct! Round ${round} complete. Score: ${newScore}`);
      
      // Next round
      setTimeout(() => {
        const generator = getSequenceGenerator();
        const nextSequence = generator.nextRound();
        setSequence(nextSequence);
        setPlayerInput([]);
        setRound(round + 1);
        playSequence(nextSequence);
      }, 1500);
    }
  }, [state, playerInput, sequence, lives, score, round, streak, playPad, getSequenceGenerator, playSequence]);
  
  return {
    state,
    sequence,
    score,
    lives,
    round,
    streak,
    activePad,
    ariaMessage,
    startGame,
    handlePlayerPress,
  };
}
