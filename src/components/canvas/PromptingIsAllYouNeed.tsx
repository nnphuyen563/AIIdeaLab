import React, { useEffect, useRef, useCallback } from 'react';
import { rasterizeText, TextPixel } from './pixelFont';
import { soundFx } from './soundFx';

export interface SimulationTelemetry {
  fps: number;
  totalPixels: number;
  remainingPixels: number;
  collisions: number;
  ballSpeed: number;
  aiAccuracy: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  life: number;
  color: string;
}

interface Paddle {
  x: number;
  y: number;
  width: number;
  height: number;
  targetPos: number;
}

interface PromptingIsAllYouNeedProps {
  onTelemetryUpdate?: (telemetry: SimulationTelemetry) => void;
  resetSignal?: number;
  speedMultiplier?: number;
  isInteractive?: boolean;
  headline?: string;
  subheadline?: string;
}

export const PromptingIsAllYouNeed: React.FC<PromptingIsAllYouNeedProps> = ({
  onTelemetryUpdate,
  resetSignal = 0,
  speedMultiplier = 1,
  isInteractive = false,
  headline = 'IDEA',
  subheadline = 'IS ALL YOU NEED'
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Simulation persistent state in refs for 60fps lock without React render lag
  const stateRef = useRef({
    width: 0,
    height: 0,
    dpr: 1,
    pixels: [] as TextPixel[],
    particles: [] as Particle[],
    ball: {
      x: 0,
      y: 0,
      vx: 4.5,
      vy: 3.5,
      radius: 6,
      speed: 5.5
    },
    paddles: {
      top: { x: 0, y: 16, width: 80, height: 8, targetPos: 0 } as Paddle,
      bottom: { x: 0, y: 0, width: 80, height: 8, targetPos: 0 } as Paddle,
      left: { x: 16, y: 0, width: 8, height: 80, targetPos: 0 } as Paddle,
      right: { x: 0, y: 0, width: 8, height: 80, targetPos: 0 } as Paddle
    },
    userMouseX: 0,
    collisions: 0,
    frameCount: 0,
    lastTime: performance.now(),
    fps: 60
  });

  // Re-rasterize text pixels whenever canvas dimensions change or reset is triggered
  const buildPixels = useCallback((width: number, height: number, head: string = headline, sub: string = subheadline) => {
    // Dynamic responsive scaling based on DESIGN.md
    const baseCell = Math.max(4.5, Math.min(width / 1100, height / 900) * 8.5);
    const titlePixelSize = Math.max(4, Math.round(baseCell));
    const subtitlePixelSize = Math.max(3, Math.round(baseCell * 0.48));

    // Center text vertically in the active paddle arena (between header and chat bar)
    const arenaTop = 76;
    const arenaBottom = height - 190;
    const centerY = (arenaTop + arenaBottom) / 2;
    const titlePixels = rasterizeText(head, width / 2, centerY - titlePixelSize * 4, titlePixelSize, 1.5, 3);
    const subtitlePixels = sub ? rasterizeText(sub, width / 2, centerY + titlePixelSize * 5, subtitlePixelSize, 1.2, 2.5) : [];

    return [...titlePixels, ...subtitlePixels];
  }, [headline, subheadline]);

  // Reset simulation function
  const handleReset = useCallback(() => {
    const s = stateRef.current;
    if (s.width && s.height) {
      s.pixels = buildPixels(s.width, s.height, headline, subheadline);
      s.particles = [];
      s.ball.x = s.width / 2;
      s.ball.y = s.height * 0.25;
      const angle = (Math.random() * Math.PI) / 3 + Math.PI / 4;
      const speed = 5.5 * speedMultiplier;
      s.ball.vx = Math.cos(angle) * speed;
      s.ball.vy = Math.sin(angle) * speed;
      soundFx.playReset();
    }
  }, [buildPixels, speedMultiplier, headline, subheadline]);

  // Update pixels when headline or subheadline changes
  useEffect(() => {
    const s = stateRef.current;
    if (s.width && s.height) {
      s.pixels = buildPixels(s.width, s.height, headline, subheadline);
      soundFx.playReset();
    }
  }, [headline, subheadline, buildPixels]);

  // Handle external reset signal
  useEffect(() => {
    if (resetSignal > 0) {
      handleReset();
    }
  }, [resetSignal, handleReset]);

  // Resize listener
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const dpr = window.devicePixelRatio || 1;

      stateRef.current.width = width;
      stateRef.current.height = height;
      stateRef.current.dpr = dpr;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      // Set initial positions for ball and paddles within the open arena
      const s = stateRef.current;
      s.paddles.top.y = 72;
      s.paddles.bottom.y = height - 250;
      s.paddles.left.x = 24;
      s.paddles.right.x = width - 32;
      s.paddles.top.x = width / 2 - s.paddles.top.width / 2;
      s.paddles.bottom.x = width / 2 - s.paddles.bottom.width / 2;
      s.paddles.left.y = (72 + (height - 250)) / 2 - s.paddles.left.height / 2;
      s.paddles.right.y = (72 + (height - 250)) / 2 - s.paddles.right.height / 2;

      if (s.ball.x === 0 && s.ball.y === 0) {
        s.ball.x = width / 2;
        s.ball.y = (72 + (height - 250)) / 2 - 30;
      }

      s.pixels = buildPixels(width, height);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    const handleMouseMove = (e: MouseEvent) => {
      stateRef.current.userMouseX = e.clientX;
    };
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [buildPixels]);

  // Main animation frame loop
  useEffect(() => {
    let animId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let lastFpsUpdate = performance.now();

    const loop = (timestamp: number) => {
      const s = stateRef.current;
      const dpr = s.dpr;
      const width = s.width;
      const height = s.height;

      // Calculate FPS
      s.frameCount++;
      if (timestamp - lastFpsUpdate >= 300) {
        const delta = (timestamp - s.lastTime) / 1000;
        s.fps = Math.round(s.frameCount / delta) || 60;
        s.frameCount = 0;
        s.lastTime = timestamp;
        lastFpsUpdate = timestamp;

        if (onTelemetryUpdate) {
          const remaining = s.pixels.filter(p => !p.isHit).length;
          onTelemetryUpdate({
            fps: s.fps,
            totalPixels: s.pixels.length,
            remainingPixels: remaining,
            collisions: s.collisions,
            ballSpeed: Number((Math.sqrt(s.ball.vx * s.ball.vx + s.ball.vy * s.ball.vy)).toFixed(1)),
            aiAccuracy: 99.4
          });
        }
      }

      // Clear Canvas with OLED true black
      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, width, height);

      // Draw subtle retro grid backdrop
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.025)';
      ctx.lineWidth = 1;
      const gridSize = 40;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Update Paddle AI Tracking (4-axis autonomous mechanics per DESIGN.md §5)
      // Top & Bottom track ball.x; Left & Right track ball.y with interpolation
      const topTarget = s.ball.x - s.paddles.top.width / 2;
      s.paddles.top.x += (topTarget - s.paddles.top.x) * 0.12;

      let bottomTarget = s.ball.x - s.paddles.bottom.width / 2;
      if (isInteractive && s.userMouseX > 0) {
        bottomTarget = s.userMouseX - s.paddles.bottom.width / 2;
      }
      s.paddles.bottom.x += (bottomTarget - s.paddles.bottom.x) * (isInteractive ? 0.25 : 0.12);

      const leftTarget = s.ball.y - s.paddles.left.height / 2;
      s.paddles.left.y += (leftTarget - s.paddles.left.y) * 0.12;

      const rightTarget = s.ball.y - s.paddles.right.height / 2;
      s.paddles.right.y += (rightTarget - s.paddles.right.y) * 0.12;

      // Keep paddles inside canvas bounds
      s.paddles.top.x = Math.max(10, Math.min(width - s.paddles.top.width - 10, s.paddles.top.x));
      s.paddles.bottom.x = Math.max(10, Math.min(width - s.paddles.bottom.width - 10, s.paddles.bottom.x));
      s.paddles.left.y = Math.max(76, Math.min(height - 260 - s.paddles.left.height, s.paddles.left.y));
      s.paddles.right.y = Math.max(76, Math.min(height - 260 - s.paddles.right.height, s.paddles.right.y));

      // Draw Paddles
      ctx.fillStyle = '#FFFFFF';
      ctx.shadowColor = 'rgba(255, 255, 255, 0.4)';
      ctx.shadowBlur = 8;
      // Top
      ctx.fillRect(s.paddles.top.x, s.paddles.top.y, s.paddles.top.width, s.paddles.top.height);
      // Bottom
      ctx.fillRect(s.paddles.bottom.x, s.paddles.bottom.y, s.paddles.bottom.width, s.paddles.bottom.height);
      // Left
      ctx.fillRect(s.paddles.left.x, s.paddles.left.y, s.paddles.left.width, s.paddles.left.height);
      // Right
      ctx.fillRect(s.paddles.right.x, s.paddles.right.y, s.paddles.right.width, s.paddles.right.height);

      // Move Ball
      s.ball.x += s.ball.vx * speedMultiplier;
      s.ball.y += s.ball.vy * speedMultiplier;

      // Check Paddle Collisions
      // Top paddle
      if (
        s.ball.y - s.ball.radius <= s.paddles.top.y + s.paddles.top.height &&
        s.ball.y + s.ball.radius >= s.paddles.top.y &&
        s.ball.x >= s.paddles.top.x &&
        s.ball.x <= s.paddles.top.x + s.paddles.top.width &&
        s.ball.vy < 0
      ) {
        s.ball.vy = -s.ball.vy;
        s.collisions++;
        soundFx.playPaddleHit();
      }

      // Bottom paddle
      if (
        s.ball.y + s.ball.radius >= s.paddles.bottom.y &&
        s.ball.y - s.ball.radius <= s.paddles.bottom.y + s.paddles.bottom.height &&
        s.ball.x >= s.paddles.bottom.x &&
        s.ball.x <= s.paddles.bottom.x + s.paddles.bottom.width &&
        s.ball.vy > 0
      ) {
        s.ball.vy = -s.ball.vy;
        s.collisions++;
        soundFx.playPaddleHit();
      }

      // Left paddle
      if (
        s.ball.x - s.ball.radius <= s.paddles.left.x + s.paddles.left.width &&
        s.ball.x + s.ball.radius >= s.paddles.left.x &&
        s.ball.y >= s.paddles.left.y &&
        s.ball.y <= s.paddles.left.y + s.paddles.left.height &&
        s.ball.vx < 0
      ) {
        s.ball.vx = -s.ball.vx;
        s.collisions++;
        soundFx.playPaddleHit();
      }

      // Right paddle
      if (
        s.ball.x + s.ball.radius >= s.paddles.right.x &&
        s.ball.x - s.ball.radius <= s.paddles.right.x + s.paddles.right.width &&
        s.ball.y >= s.paddles.right.y &&
        s.ball.y <= s.paddles.right.y + s.paddles.right.height &&
        s.ball.vx > 0
      ) {
        s.ball.vx = -s.ball.vx;
        s.collisions++;
        soundFx.playPaddleHit();
      }

      // Boundary Wall Collisions (fallback if missed by paddle)
      if (s.ball.x - s.ball.radius <= 0) {
        s.ball.x = s.ball.radius;
        s.ball.vx = Math.abs(s.ball.vx);
        soundFx.playPaddleHit();
      } else if (s.ball.x + s.ball.radius >= width) {
        s.ball.x = width - s.ball.radius;
        s.ball.vx = -Math.abs(s.ball.vx);
        soundFx.playPaddleHit();
      }
      if (s.ball.y - s.ball.radius <= 68) {
        s.ball.y = 68 + s.ball.radius;
        s.ball.vy = Math.abs(s.ball.vy);
        soundFx.playPaddleHit();
      } else if (s.ball.y + s.ball.radius >= height - 240) {
        s.ball.y = height - 240 - s.ball.radius;
        s.ball.vy = -Math.abs(s.ball.vy);
        soundFx.playPaddleHit();
      }

      // Draw & Collide Text Pixels
      ctx.shadowBlur = 0;
      const bRad = s.ball.radius;
      const bx = s.ball.x;
      const by = s.ball.y;

      for (let i = 0; i < s.pixels.length; i++) {
        const p = s.pixels[i];

        // Collision check if pixel is still intact
        if (!p.isHit) {
          if (
            bx + bRad >= p.x &&
            bx - bRad <= p.x + p.size &&
            by + bRad >= p.y &&
            by - bRad <= p.y + p.size
          ) {
            p.isHit = true;
            s.collisions++;
            soundFx.playPixelHit();

            // Reverse ball velocity based on collision edge
            const overlapLeft = bx + bRad - p.x;
            const overlapRight = p.x + p.size - (bx - bRad);
            const overlapTop = by + bRad - p.y;
            const overlapBottom = p.y + p.size - (by - bRad);

            const minOverlap = Math.min(overlapLeft, overlapRight, overlapTop, overlapBottom);
            if (minOverlap === overlapLeft || minOverlap === overlapRight) {
              s.ball.vx = -s.ball.vx;
            } else {
              s.ball.vy = -s.ball.vy;
            }

            // Spawn spark burst
            for (let k = 0; k < 5; k++) {
              const pAngle = Math.random() * Math.PI * 2;
              const pSpeed = Math.random() * 3 + 1;
              s.particles.push({
                x: p.x + p.size / 2,
                y: p.y + p.size / 2,
                vx: Math.cos(pAngle) * pSpeed,
                vy: Math.sin(pAngle) * pSpeed,
                size: Math.max(2, p.size * 0.4),
                life: 1.0,
                color: Math.random() > 0.3 ? '#FFFFFF' : '#10B981'
              });
            }
          }
        }

        // Render pixel
        if (p.isHit) {
          ctx.fillStyle = '#222222';
          ctx.fillRect(p.x, p.y, p.size, p.size);
        } else {
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(p.x, p.y, p.size, p.size);
        }
      }

      // Update and Draw Particles
      for (let i = s.particles.length - 1; i >= 0; i--) {
        const pt = s.particles[i];
        pt.x += pt.vx;
        pt.y += pt.vy;
        pt.life -= 0.035;

        if (pt.life <= 0) {
          s.particles.splice(i, 1);
        } else {
          ctx.fillStyle = pt.color;
          ctx.globalAlpha = Math.max(0, pt.life);
          ctx.fillRect(pt.x, pt.y, pt.size, pt.size);
          ctx.globalAlpha = 1.0;
        }
      }

      // Draw Ball
      ctx.fillStyle = '#FFFFFF';
      ctx.shadowColor = 'rgba(255, 255, 255, 0.7)';
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.arc(s.ball.x, s.ball.y, s.ball.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      ctx.restore();
      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(animId);
    };
  }, [speedMultiplier, isInteractive, onTelemetryUpdate]);

  return (
    <div className="pixel-canvas-container">
      <canvas ref={canvasRef} className="pixel-canvas" />
    </div>
  );
};
