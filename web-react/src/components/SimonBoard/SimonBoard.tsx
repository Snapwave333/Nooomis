import { Pad } from './Pad';

const PAD_COLORS = {
  0: '#3EE17A', // Green
  1: '#ff5c5c', // Red
  2: '#7c4dff', // Blue
  3: '#ffb74d', // Yellow
} as const;

const PAD_GLYPHS = {
  0: '●',
  1: '▲',
  2: '■',
  3: '◆',
} as const;

interface SimonBoardProps {
  onPadPress: (index: number) => void;
  activePad?: number;
  isDisabled: boolean;
}

export function SimonBoard({ onPadPress, activePad, isDisabled }: SimonBoardProps) {
  return (
    <div className="simon-board">
      {[0, 1, 2, 3].map((index) => (
        <Pad
          key={index}
          index={index as 0 | 1 | 2 | 3}
          color={PAD_COLORS[index as keyof typeof PAD_COLORS]}
          isActive={activePad === index}
          isDisabled={isDisabled}
          glyph={PAD_GLYPHS[index as keyof typeof PAD_GLYPHS]}
          onPress={onPadPress}
        />
      ))}
    </div>
  );
}
