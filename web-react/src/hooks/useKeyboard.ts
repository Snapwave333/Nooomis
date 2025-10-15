import { useEffect } from 'react';

export function useKeyboard(onPadPress: (index: number) => void) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const keyMap: Record<string, number> = {
        '1': 0, 'q': 0, 'ArrowLeft': 0,
        '2': 1, 'w': 1, 'ArrowUp': 1,
        '3': 2, 'e': 2, 'ArrowDown': 2,
        '4': 3, 'r': 3, 'ArrowRight': 3,
      };
      
      const padIndex = keyMap[e.key];
      if (padIndex !== undefined) {
        e.preventDefault();
        onPadPress(padIndex);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onPadPress]);
}
