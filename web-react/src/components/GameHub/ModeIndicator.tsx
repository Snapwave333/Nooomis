interface ModeIndicatorProps {
  mode: string;
  isActive: boolean;
}

export function ModeIndicator({ mode, isActive }: ModeIndicatorProps) {
  return (
    <div className={`mode-indicator ${isActive ? 'active' : 'inactive'}`}>
      <div className="mode-name">{mode}</div>
      <div className="mode-label">Mode</div>
    </div>
  );
}
