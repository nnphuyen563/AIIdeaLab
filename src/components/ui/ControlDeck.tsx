import React, { useState } from 'react';
import { 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  Zap, 
  Gamepad2, 
  Bot,
  Activity
} from 'lucide-react';
import type { SimulationTelemetry } from '../canvas/PromptingIsAllYouNeed';
import { soundFx } from '../canvas/soundFx';

interface ControlDeckProps {
  telemetry: SimulationTelemetry;
  onReset: () => void;
  speed: number;
  onSpeedChange: (speed: number) => void;
  isInteractive: boolean;
  onToggleInteractive: () => void;
}

export const ControlDeck: React.FC<ControlDeckProps> = ({
  telemetry,
  onReset,
  speed,
  onSpeedChange,
  isInteractive,
  onToggleInteractive
}) => {
  const [soundEnabled, setSoundEnabled] = useState(soundFx.enabled);

  const toggleSound = () => {
    soundFx.enabled = !soundEnabled;
    setSoundEnabled(!soundEnabled);
  };

  const percentageLeft = telemetry.totalPixels > 0 
    ? Math.round((telemetry.remainingPixels / telemetry.totalPixels) * 100) 
    : 100;

  return (
    <div className="control-deck-wrapper">
      <div className="control-deck">
        <div className="deck-header">
          <div className="deck-title-area">
            <h2 className="deck-title">
              <Activity className="w-4 h-4 text-emerald-400" style={{ width: 18, height: 18, color: '#34D399' }} />
              Autonomous Pixel Pong Deck
            </h2>
            <p className="deck-desc">
              4-axis autonomous neural paddles keep the ricochet alive while dismantling the 5x5 bitmapped text matrix.
            </p>
          </div>

          <button
            type="button"
            className="btn-primary"
            onClick={onReset}
            title="Reset pixel matrix"
          >
            <RotateCcw style={{ width: 14, height: 14 }} />
            <span>Reset Pixels</span>
          </button>
        </div>

        {/* Telemetry Metrics Row */}
        <div className="telemetry-grid">
          <div className="telemetry-cell">
            <span className="telemetry-label">Engine FPS</span>
            <span className="telemetry-value accent-green">{telemetry.fps || 60}</span>
          </div>

          <div className="telemetry-cell">
            <span className="telemetry-label">Active Pixels</span>
            <span className="telemetry-value">
              {telemetry.remainingPixels} <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>({percentageLeft}%)</span>
            </span>
          </div>

          <div className="telemetry-cell">
            <span className="telemetry-label">Collisions</span>
            <span className="telemetry-value accent-amber">{telemetry.collisions}</span>
          </div>

          <div className="telemetry-cell">
            <span className="telemetry-label">Ball Speed</span>
            <span className="telemetry-value">{(telemetry.ballSpeed * speed).toFixed(1)} px/f</span>
          </div>
        </div>

        {/* Control Buttons & Toggles */}
        <div className="deck-controls">
          <div className="toggle-group">
            <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', marginRight: '0.25rem' }}>
              Speed:
            </span>
            {[1, 1.5, 2].map((s) => (
              <button
                key={s}
                type="button"
                className={`btn-secondary ${speed === s ? 'active' : ''}`}
                onClick={() => onSpeedChange(s)}
                style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem' }}
              >
                <Zap style={{ width: 11, height: 11 }} />
                <span>{s}x</span>
              </button>
            ))}
          </div>

          <div className="toggle-group">
            <button
              type="button"
              className={`btn-secondary ${isInteractive ? 'active' : ''}`}
              onClick={onToggleInteractive}
              title={isInteractive ? 'Switch to Autonomous AI' : 'Take Manual Control of Bottom Paddle'}
            >
              {isInteractive ? (
                <>
                  <Gamepad2 style={{ width: 14, height: 14, color: '#34D399' }} />
                  <span>Manual Mode</span>
                </>
              ) : (
                <>
                  <Bot style={{ width: 14, height: 14 }} />
                  <span>AI Auto-Pilot</span>
                </>
              )}
            </button>

            <button
              type="button"
              className={`btn-secondary ${soundEnabled ? 'active' : ''}`}
              onClick={toggleSound}
              title={soundEnabled ? 'Mute arcade sound FX' : 'Enable arcade sound FX'}
            >
              {soundEnabled ? (
                <>
                  <Volume2 style={{ width: 14, height: 14, color: '#34D399' }} />
                  <span>Sound ON</span>
                </>
              ) : (
                <>
                  <VolumeX style={{ width: 14, height: 14 }} />
                  <span>Muted</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
