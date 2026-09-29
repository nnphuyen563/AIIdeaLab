import React from 'react';

interface TelemetryBadgeProps {
  label?: string;
  fps?: number;
}

export const TelemetryBadge: React.FC<TelemetryBadgeProps> = ({
  label = 'Live Canvas Simulation',
  fps
}) => {
  return (
    <div className="telemetry-badge">
      <span className="pulse-dot" />
      <span>{label}</span>
      {fps !== undefined && <span>· {fps} FPS</span>}
    </div>
  );
};
