import React from 'react';
import { Terminal, Cpu, Layers } from 'lucide-react';

export const FooterStatusBar: React.FC = () => {
  return (
    <footer className="footer-status-bar">
      <div className="footer-left">
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
          <Terminal style={{ width: 12, height: 12, color: '#94A3B8' }} />
          <span>RENDERER: HTML5_CANVAS_2D</span>
        </span>
        <span>·</span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
          <Cpu style={{ width: 12, height: 12, color: '#94A3B8' }} />
          <span>PHYSICS: VECTOR_RICHOCHET_V2</span>
        </span>
        <span>·</span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
          <Layers style={{ width: 12, height: 12, color: '#94A3B8' }} />
          <span>GLYPH_MATRIX: 5x5_RASTER</span>
        </span>
      </div>

      <div className="footer-right">
        <span>ARCHETYPE: RETRO_CYBERPUNK</span>
        <span>SPEC: DESIGN.MD</span>
      </div>
    </footer>
  );
};
