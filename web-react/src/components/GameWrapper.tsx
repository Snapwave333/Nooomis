import { useEffect, useRef } from 'react';

export function GameWrapper() {
  const gameContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load the existing vanilla JS game
    const loadGame = async () => {
      if (gameContainerRef.current) {
        // Create an iframe to load the existing game
        const iframe = document.createElement('iframe');
        iframe.src = '/web/index.html';
        iframe.style.width = '100%';
        iframe.style.height = '100vh';
        iframe.style.border = 'none';
        iframe.style.background = 'transparent';
        
        gameContainerRef.current.appendChild(iframe);
      }
    };

    loadGame();
  }, []);

  return (
    <div 
      ref={gameContainerRef}
      style={{
        width: '100%',
        height: '100vh',
        position: 'relative',
        overflow: 'hidden'
      }}
    />
  );
}
