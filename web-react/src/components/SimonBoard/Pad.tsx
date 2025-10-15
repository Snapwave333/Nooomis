interface PadProps {
  index: 0 | 1 | 2 | 3;
  color: string;
  isActive: boolean;
  isDisabled: boolean;
  glyph: string;
  onPress: (index: number) => void;
}

export function Pad({ index, color, isActive, isDisabled, glyph, onPress }: PadProps) {
  const colorNames = ['Green', 'Red', 'Blue', 'Yellow'];
  
  return (
    <button
      className={`pad pad-${index} ${isActive ? 'active' : ''}`}
      style={{ backgroundColor: color }}
      disabled={isDisabled}
      onClick={() => onPress(index)}
      aria-label={`${colorNames[index]} pad, button ${index + 1}`}
      aria-pressed={isActive}
    >
      <span className="pad-glyph" aria-hidden="true">{glyph}</span>
    </button>
  );
}
