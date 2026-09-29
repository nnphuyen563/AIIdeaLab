import React from 'react';

export interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  color?: string;
  strokeWidth?: number | string;
  className?: string;
}

const defaultProps = {
  size: 16,
  color: 'currentColor',
  strokeWidth: 1.8,
};

/**
 * Neo-Brutalist & Cyberpunk Retro Icon System
 * Features razor-sharp vertices, geometric chamfers, 1.8px crisp lines,
 * and reticle accents matching the Retro-Cyberpunk terminal aesthetic.
 */

export const Sparkles: React.FC<IconProps> = ({ size = defaultProps.size, color = defaultProps.color, strokeWidth = defaultProps.strokeWidth, style, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="square" strokeLinejoin="miter" style={style} {...props}>
    {/* 4-point geometric cyber star */}
    <path d="M12 2L14.2 9.8L22 12L14.2 14.2L12 22L9.8 14.2L2 12L9.8 9.8L12 2Z" />
    <path d="M19 3L19.8 5.2L22 6L19.8 6.8L19 9L18.2 6.8L16 6L18.2 5.2L19 3Z" />
    <path d="M5 17L5.6 18.4L7 19L5.6 19.6L5 21L4.4 19.6L3 19L4.4 18.4L5 17Z" />
  </svg>
);

export const Menu: React.FC<IconProps> = ({ size = defaultProps.size, color = defaultProps.color, strokeWidth = defaultProps.strokeWidth, style, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="square" strokeLinejoin="miter" style={style} {...props}>
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="12" x2="16" y2="12" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);

export const Download: React.FC<IconProps> = ({ size = defaultProps.size, color = defaultProps.color, strokeWidth = defaultProps.strokeWidth, style, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="square" strokeLinejoin="miter" style={style} {...props}>
    <path d="M12 3V15M12 15L7 10M12 15L17 10" />
    <path d="M4 17V20H20V17" />
  </svg>
);

export const Plus: React.FC<IconProps> = ({ size = defaultProps.size, color = defaultProps.color, strokeWidth = defaultProps.strokeWidth, style, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="square" strokeLinejoin="miter" style={style} {...props}>
    <line x1="12" y1="4" x2="12" y2="20" />
    <line x1="4" y1="12" x2="20" y2="12" />
  </svg>
);

export const Minus: React.FC<IconProps> = ({ size = defaultProps.size, color = defaultProps.color, strokeWidth = defaultProps.strokeWidth, style, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="square" strokeLinejoin="miter" style={style} {...props}>
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

export const ArrowUp: React.FC<IconProps> = ({ size = defaultProps.size, color = defaultProps.color, strokeWidth = defaultProps.strokeWidth, style, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="square" strokeLinejoin="miter" style={style} {...props}>
    <line x1="12" y1="19" x2="12" y2="5" />
    <polyline points="5 12 12 5 19 12" />
  </svg>
);

export const ArrowRight: React.FC<IconProps> = ({ size = defaultProps.size, color = defaultProps.color, strokeWidth = defaultProps.strokeWidth, style, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="square" strokeLinejoin="miter" style={style} {...props}>
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

export const Check: React.FC<IconProps> = ({ size = defaultProps.size, color = defaultProps.color, strokeWidth = defaultProps.strokeWidth, style, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="square" strokeLinejoin="miter" style={style} {...props}>
    <polyline points="4 12 9 17 20 6" />
  </svg>
);

export const CheckCircle2: React.FC<IconProps> = ({ size = defaultProps.size, color = defaultProps.color, strokeWidth = defaultProps.strokeWidth, style, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="square" strokeLinejoin="miter" style={style} {...props}>
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <polyline points="8 12 11 15 16 9" />
  </svg>
);

export const ChevronUp: React.FC<IconProps> = ({ size = defaultProps.size, color = defaultProps.color, strokeWidth = defaultProps.strokeWidth, style, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="square" strokeLinejoin="miter" style={style} {...props}>
    <polyline points="18 15 12 9 6 15" />
  </svg>
);

export const ChevronDown: React.FC<IconProps> = ({ size = defaultProps.size, color = defaultProps.color, strokeWidth = defaultProps.strokeWidth, style, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="square" strokeLinejoin="miter" style={style} {...props}>
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

export const ChevronRight: React.FC<IconProps> = ({ size = defaultProps.size, color = defaultProps.color, strokeWidth = defaultProps.strokeWidth, style, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="square" strokeLinejoin="miter" style={style} {...props}>
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

export const Smartphone: React.FC<IconProps> = ({ size = defaultProps.size, color = defaultProps.color, strokeWidth = defaultProps.strokeWidth, style, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="square" strokeLinejoin="miter" style={style} {...props}>
    <rect x="6" y="2" width="12" height="20" rx="1.5" />
    <line x1="10" y1="5" x2="14" y2="5" />
    <line x1="11.5" y1="18" x2="12.5" y2="18" />
  </svg>
);

export const Monitor: React.FC<IconProps> = ({ size = defaultProps.size, color = defaultProps.color, strokeWidth = defaultProps.strokeWidth, style, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="square" strokeLinejoin="miter" style={style} {...props}>
    <rect x="2" y="3" width="20" height="14" rx="1" />
    <line x1="8" y1="21" x2="16" y2="21" />
    <line x1="12" y1="17" x2="12" y2="21" />
  </svg>
);

export const Loader2: React.FC<IconProps> = ({ size = defaultProps.size, color = defaultProps.color, strokeWidth = defaultProps.strokeWidth, className = '', style, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="square" className={className} style={style} {...props}>
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
  </svg>
);

export const Maximize2: React.FC<IconProps> = ({ size = defaultProps.size, color = defaultProps.color, strokeWidth = defaultProps.strokeWidth, style, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="square" strokeLinejoin="miter" style={style} {...props}>
    <polyline points="15 3 21 3 21 9" />
    <polyline points="9 21 3 21 3 15" />
    <line x1="21" y1="3" x2="14" y2="10" />
    <line x1="3" y1="21" x2="10" y2="14" />
  </svg>
);

export const Copy: React.FC<IconProps> = ({ size = defaultProps.size, color = defaultProps.color, strokeWidth = defaultProps.strokeWidth, style, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="square" strokeLinejoin="miter" style={style} {...props}>
    <rect x="9" y="9" width="13" height="13" rx="1" />
    <path d="M5 15H3V3H15V5" />
  </svg>
);

export const Layers: React.FC<IconProps> = ({ size = defaultProps.size, color = defaultProps.color, strokeWidth = defaultProps.strokeWidth, style, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="square" strokeLinejoin="miter" style={style} {...props}>
    <polygon points="12 2 2 7 12 12 22 7 12 2" />
    <polyline points="2 12 12 17 22 12" />
    <polyline points="2 17 12 22 22 17" />
  </svg>
);

export const Palette: React.FC<IconProps> = ({ size = defaultProps.size, color = defaultProps.color, strokeWidth = defaultProps.strokeWidth, style, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="square" strokeLinejoin="miter" style={style} {...props}>
    <path d="M12 3a9 9 0 0 0-9 9c0 4.97 4.03 9 9 9 1.5 0 2.5-1 2.5-2.2 0-.6-.2-1.1-.6-1.5-.4-.4-.6-.9-.6-1.5 0-1.2 1-2.2 2.2-2.2H17c2.76 0 5-2.24 5-5 0-4.97-4.48-8.6-10-8.6Z" />
    <circle cx="7.5" cy="10.5" r="1.2" fill={color} />
    <circle cx="12" cy="7.5" r="1.2" fill={color} />
    <circle cx="16.5" cy="10.5" r="1.2" fill={color} />
  </svg>
);

export const Play: React.FC<IconProps> = ({ size = defaultProps.size, color = defaultProps.color, strokeWidth = defaultProps.strokeWidth, style, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="square" strokeLinejoin="miter" style={style} {...props}>
    <polygon points="6 3 20 12 6 21 6 3" />
  </svg>
);

export const Share2: React.FC<IconProps> = ({ size = defaultProps.size, color = defaultProps.color, strokeWidth = defaultProps.strokeWidth, style, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="square" strokeLinejoin="miter" style={style} {...props}>
    <circle cx="18" cy="5" r="3" />
    <circle cx="6" cy="12" r="3" />
    <circle cx="18" cy="19" r="3" />
    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
  </svg>
);

export const MousePointer: React.FC<IconProps> = ({ size = defaultProps.size, color = defaultProps.color, strokeWidth = defaultProps.strokeWidth, style, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="square" strokeLinejoin="miter" style={style} {...props}>
    <polygon points="3 3 10 21 13 13 21 10 3 3" />
  </svg>
);

export const Square: React.FC<IconProps> = ({ size = defaultProps.size, color = defaultProps.color, strokeWidth = defaultProps.strokeWidth, style, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="square" strokeLinejoin="miter" style={style} {...props}>
    <rect x="3" y="3" width="18" height="18" rx="1.5" />
  </svg>
);

export const PenTool: React.FC<IconProps> = ({ size = defaultProps.size, color = defaultProps.color, strokeWidth = defaultProps.strokeWidth, style, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="square" strokeLinejoin="miter" style={style} {...props}>
    <path d="M12 19l7-7 3 3-7 7-3-3z" />
    <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
    <circle cx="11" cy="11" r="2" />
  </svg>
);

export const Hand: React.FC<IconProps> = ({ size = defaultProps.size, color = defaultProps.color, strokeWidth = defaultProps.strokeWidth, style, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="square" strokeLinejoin="miter" style={style} {...props}>
    <path d="M18 11V6a2 2 0 0 0-4 0v4" />
    <path d="M14 10V4a2 2 0 0 0-4 0v6" />
    <path d="M10 10.5V6a2 2 0 0 0-4 0v8" />
    <path d="M6 14v-2a2 2 0 0 0-4 0v5c0 5 4 9 9 9h4c4 0 7-3 7-7v-5a2 2 0 0 0-4 0" />
  </svg>
);

export const BarChart3: React.FC<IconProps> = ({ size = defaultProps.size, color = defaultProps.color, strokeWidth = defaultProps.strokeWidth, style, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="square" strokeLinejoin="miter" style={style} {...props}>
    <line x1="18" y1="20" x2="18" y2="6" />
    <line x1="12" y1="20" x2="12" y2="10" />
    <line x1="6" y1="20" x2="6" y2="14" />
    <line x1="3" y1="20" x2="21" y2="20" />
  </svg>
);

export const Star: React.FC<IconProps> = ({ size = defaultProps.size, color = defaultProps.color, strokeWidth = defaultProps.strokeWidth, style, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="square" strokeLinejoin="miter" style={style} {...props}>
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

export const Undo2: React.FC<IconProps> = ({ size = defaultProps.size, color = defaultProps.color, strokeWidth = defaultProps.strokeWidth, style, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="square" strokeLinejoin="miter" style={style} {...props}>
    <path d="M9 14L4 9l5-5" />
    <path d="M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5v1.5" />
  </svg>
);

export const Redo2: React.FC<IconProps> = ({ size = defaultProps.size, color = defaultProps.color, strokeWidth = defaultProps.strokeWidth, style, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="square" strokeLinejoin="miter" style={style} {...props}>
    <path d="M15 14l5-5-5-5" />
    <path d="M20 9H9.5A5.5 5.5 0 0 0 4 14.5v1.5" />
  </svg>
);

export const HelpCircle: React.FC<IconProps> = ({ size = defaultProps.size, color = defaultProps.color, strokeWidth = defaultProps.strokeWidth, style, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="square" strokeLinejoin="miter" style={style} {...props}>
    <circle cx="12" cy="12" r="10" />
    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);

export const FolderLock: React.FC<IconProps> = ({ size = defaultProps.size, color = defaultProps.color, strokeWidth = defaultProps.strokeWidth, style, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="square" strokeLinejoin="miter" style={style} {...props}>
    <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z" />
    <rect x="9" y="11" width="6" height="5" rx="1" />
    <path d="M10 11V9a2 2 0 0 1 4 0v2" />
  </svg>
);

export const X: React.FC<IconProps> = ({ size = defaultProps.size, color = defaultProps.color, strokeWidth = defaultProps.strokeWidth, style, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="square" strokeLinejoin="miter" style={style} {...props}>
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

export const RotateCw: React.FC<IconProps> = ({ size = defaultProps.size, color = defaultProps.color, strokeWidth = defaultProps.strokeWidth, style, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="square" strokeLinejoin="miter" style={style} {...props}>
    <path d="M21 2v6h-6" />
    <path d="M21 8a9 9 0 1 0 2.2 6.5" />
  </svg>
);

export const RotateCcw: React.FC<IconProps> = ({ size = defaultProps.size, color = defaultProps.color, strokeWidth = defaultProps.strokeWidth, style, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="square" strokeLinejoin="miter" style={style} {...props}>
    <path d="M3 2v6h6" />
    <path d="M3 8a9 9 0 1 1-2.2 6.5" />
  </svg>
);

export const ExternalLink: React.FC<IconProps> = ({ size = defaultProps.size, color = defaultProps.color, strokeWidth = defaultProps.strokeWidth, style, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="square" strokeLinejoin="miter" style={style} {...props}>
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    <polyline points="15 3 21 3 21 9" />
    <line x1="10" y1="14" x2="21" y2="3" />
  </svg>
);

export const Globe: React.FC<IconProps> = ({ size = defaultProps.size, color = defaultProps.color, strokeWidth = defaultProps.strokeWidth, style, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="square" strokeLinejoin="miter" style={style} {...props}>
    <circle cx="12" cy="12" r="10" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
);

export const Mic: React.FC<IconProps> = ({ size = defaultProps.size, color = defaultProps.color, strokeWidth = defaultProps.strokeWidth, style, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="square" strokeLinejoin="miter" style={style} {...props}>
    <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
    <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
    <line x1="12" y1="19" x2="12" y2="23" />
    <line x1="8" y1="23" x2="16" y2="23" />
  </svg>
);

export const MicOff: React.FC<IconProps> = ({ size = defaultProps.size, color = defaultProps.color, strokeWidth = defaultProps.strokeWidth, style, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="square" strokeLinejoin="miter" style={style} {...props}>
    <line x1="2" y1="2" x2="22" y2="22" />
    <path d="M18.89 13.23A7.12 7.12 0 0 0 19 12v-2" />
    <path d="M5 10v2a7 7 0 0 0 12 5" />
    <path d="M15 9.34V5a3 3 0 0 0-5.68-1.33" />
    <path d="M9 9v3a3 3 0 0 0 5.12 2.12" />
    <line x1="12" y1="19" x2="12" y2="23" />
    <line x1="8" y1="23" x2="16" y2="23" />
  </svg>
);

export const Key: React.FC<IconProps> = ({ size = defaultProps.size, color = defaultProps.color, strokeWidth = defaultProps.strokeWidth, style, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="square" strokeLinejoin="miter" style={style} {...props}>
    <path d="M21 2l-2 2m-1.5 1.5L14 9l2 2 3-3 2 2 1.5-1.5-2-2 2.5-2.5L21 2z" />
    <circle cx="7.5" cy="16.5" r="4.5" />
  </svg>
);

export const FileCode: React.FC<IconProps> = ({ size = defaultProps.size, color = defaultProps.color, strokeWidth = defaultProps.strokeWidth, style, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="square" strokeLinejoin="miter" style={style} {...props}>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <polyline points="10 13 8 15 10 17" />
    <polyline points="14 13 16 15 14 17" />
  </svg>
);

export const Target: React.FC<IconProps> = ({ size = defaultProps.size, color = defaultProps.color, strokeWidth = defaultProps.strokeWidth, style, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="square" strokeLinejoin="miter" style={style} {...props}>
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="6" />
    <circle cx="12" cy="12" r="2" fill={color} />
  </svg>
);

export const TrendingUp: React.FC<IconProps> = ({ size = defaultProps.size, color = defaultProps.color, strokeWidth = defaultProps.strokeWidth, style, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="square" strokeLinejoin="miter" style={style} {...props}>
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
    <polyline points="17 6 23 6 23 12" />
  </svg>
);

export const Shield: React.FC<IconProps> = ({ size = defaultProps.size, color = defaultProps.color, strokeWidth = defaultProps.strokeWidth, style, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="square" strokeLinejoin="miter" style={style} {...props}>
    <path d="M12 2L3 6v6c0 5.5 3.8 10.7 9 12 5.2-1.3 9-6.5 9-12V6l-9-4z" />
  </svg>
);

export const ShieldCheck: React.FC<IconProps> = ({ size = defaultProps.size, color = defaultProps.color, strokeWidth = defaultProps.strokeWidth, style, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="square" strokeLinejoin="miter" style={style} {...props}>
    <path d="M12 2L3 6v6c0 5.5 3.8 10.7 9 12 5.2-1.3 9-6.5 9-12V6l-9-4z" />
    <polyline points="9 12 11 14 15 10" />
  </svg>
);

export const Clock: React.FC<IconProps> = ({ size = defaultProps.size, color = defaultProps.color, strokeWidth = defaultProps.strokeWidth, style, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="square" strokeLinejoin="miter" style={style} {...props}>
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

export const DollarSign: React.FC<IconProps> = ({ size = defaultProps.size, color = defaultProps.color, strokeWidth = defaultProps.strokeWidth, style, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="square" strokeLinejoin="miter" style={style} {...props}>
    <line x1="12" y1="2" x2="12" y2="22" />
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
  </svg>
);

export const Users: React.FC<IconProps> = ({ size = defaultProps.size, color = defaultProps.color, strokeWidth = defaultProps.strokeWidth, style, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="square" strokeLinejoin="miter" style={style} {...props}>
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

export const AlertTriangle: React.FC<IconProps> = ({ size = defaultProps.size, color = defaultProps.color, strokeWidth = defaultProps.strokeWidth, style, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="square" strokeLinejoin="miter" style={style} {...props}>
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);

export const Zap: React.FC<IconProps> = ({ size = defaultProps.size, color = defaultProps.color, strokeWidth = defaultProps.strokeWidth, style, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="square" strokeLinejoin="miter" style={style} {...props}>
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
);

export const Lightbulb: React.FC<IconProps> = ({ size = defaultProps.size, color = defaultProps.color, strokeWidth = defaultProps.strokeWidth, style, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="square" strokeLinejoin="miter" style={style} {...props}>
    <path d="M9 18h6" />
    <path d="M10 22h4" />
    <path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A6 6 0 1 0 7.5 11.5c.76.76 1.23 1.52 1.41 2.5h6.18z" />
  </svg>
);

export const Eye: React.FC<IconProps> = ({ size = defaultProps.size, color = defaultProps.color, strokeWidth = defaultProps.strokeWidth, style, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="square" strokeLinejoin="miter" style={style} {...props}>
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

export const EyeOff: React.FC<IconProps> = ({ size = defaultProps.size, color = defaultProps.color, strokeWidth = defaultProps.strokeWidth, style, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="square" strokeLinejoin="miter" style={style} {...props}>
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);

export const XCircle: React.FC<IconProps> = ({ size = defaultProps.size, color = defaultProps.color, strokeWidth = defaultProps.strokeWidth, style, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="square" strokeLinejoin="miter" style={style} {...props}>
    <circle cx="12" cy="12" r="10" />
    <line x1="15" y1="9" x2="9" y2="15" />
    <line x1="9" y1="9" x2="15" y2="15" />
  </svg>
);

export const Cpu: React.FC<IconProps> = ({ size = defaultProps.size, color = defaultProps.color, strokeWidth = defaultProps.strokeWidth, style, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="square" strokeLinejoin="miter" style={style} {...props}>
    <rect x="4" y="4" width="16" height="16" rx="2" />
    <rect x="9" y="9" width="6" height="6" />
    <line x1="9" y1="1" x2="9" y2="4" />
    <line x1="15" y1="1" x2="15" y2="4" />
    <line x1="9" y1="20" x2="9" y2="23" />
    <line x1="15" y1="20" x2="15" y2="23" />
    <line x1="20" y1="9" x2="23" y2="9" />
    <line x1="20" y1="15" x2="23" y2="15" />
    <line x1="1" y1="9" x2="4" y2="9" />
    <line x1="1" y1="15" x2="4" y2="15" />
  </svg>
);

export const Clipboard: React.FC<IconProps> = ({ size = defaultProps.size, color = defaultProps.color, strokeWidth = defaultProps.strokeWidth, style, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="square" strokeLinejoin="miter" style={style} {...props}>
    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
    <rect x="8" y="2" width="8" height="4" rx="1" />
  </svg>
);

export const Trash2: React.FC<IconProps> = ({ size = defaultProps.size, color = defaultProps.color, strokeWidth = defaultProps.strokeWidth, style, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="square" strokeLinejoin="miter" style={style} {...props}>
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    <line x1="10" y1="11" x2="10" y2="17" />
    <line x1="14" y1="11" x2="14" y2="17" />
  </svg>
);

export const Terminal: React.FC<IconProps> = ({ size = defaultProps.size, color = defaultProps.color, strokeWidth = defaultProps.strokeWidth, style, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="square" strokeLinejoin="miter" style={style} {...props}>
    <polyline points="4 17 10 11 4 5" />
    <line x1="12" y1="19" x2="20" y2="19" />
  </svg>
);

export const Volume2: React.FC<IconProps> = ({ size = defaultProps.size, color = defaultProps.color, strokeWidth = defaultProps.strokeWidth, style, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="square" strokeLinejoin="miter" style={style} {...props}>
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
    <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
  </svg>
);

export const VolumeX: React.FC<IconProps> = ({ size = defaultProps.size, color = defaultProps.color, strokeWidth = defaultProps.strokeWidth, style, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="square" strokeLinejoin="miter" style={style} {...props}>
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
    <line x1="23" y1="9" x2="17" y2="15" />
    <line x1="17" y1="9" x2="23" y2="15" />
  </svg>
);

export const Gamepad2: React.FC<IconProps> = ({ size = defaultProps.size, color = defaultProps.color, strokeWidth = defaultProps.strokeWidth, style, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="square" strokeLinejoin="miter" style={style} {...props}>
    <line x1="6" y1="12" x2="10" y2="12" />
    <line x1="8" y1="10" x2="8" y2="14" />
    <line x1="15" y1="13" x2="15.01" y2="13" />
    <line x1="18" y1="11" x2="18.01" y2="11" />
    <rect x="2" y="6" width="20" height="12" rx="3" />
  </svg>
);

export const Bot: React.FC<IconProps> = ({ size = defaultProps.size, color = defaultProps.color, strokeWidth = defaultProps.strokeWidth, style, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="square" strokeLinejoin="miter" style={style} {...props}>
    <rect x="3" y="11" width="18" height="10" rx="2" />
    <circle cx="12" cy="5" r="2" />
    <path d="M12 7v4" />
    <line x1="8" y1="16" x2="8.01" y2="16" />
    <line x1="16" y1="16" x2="16.01" y2="16" />
  </svg>
);

export const Activity: React.FC<IconProps> = ({ size = defaultProps.size, color = defaultProps.color, strokeWidth = defaultProps.strokeWidth, style, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="square" strokeLinejoin="miter" style={style} {...props}>
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
  </svg>
);

export const MessageSquare: React.FC<IconProps> = ({ size = defaultProps.size, color = defaultProps.color, strokeWidth = defaultProps.strokeWidth, style, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="square" strokeLinejoin="miter" style={style} {...props}>
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

export const Compass: React.FC<IconProps> = ({ size = defaultProps.size, color = defaultProps.color, strokeWidth = defaultProps.strokeWidth, style, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="square" strokeLinejoin="miter" style={style} {...props}>
    <circle cx="12" cy="12" r="10" />
    <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
  </svg>
);

export const Wrench: React.FC<IconProps> = ({ size = defaultProps.size, color = defaultProps.color, strokeWidth = defaultProps.strokeWidth, style, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="square" strokeLinejoin="miter" style={style} {...props}>
    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
  </svg>
);

export const Sun: React.FC<IconProps> = ({ size = defaultProps.size, color = defaultProps.color, strokeWidth = defaultProps.strokeWidth, style, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="square" strokeLinejoin="miter" style={style} {...props}>
    <circle cx="12" cy="12" r="4" />
    <line x1="12" y1="2" x2="12" y2="5" />
    <line x1="12" y1="19" x2="12" y2="22" />
    <line x1="4.93" y1="4.93" x2="7.05" y2="7.05" />
    <line x1="16.95" y1="16.95" x2="19.07" y2="19.07" />
    <line x1="2" y1="12" x2="5" y2="12" />
    <line x1="19" y1="12" x2="22" y2="12" />
    <line x1="4.93" y1="19.07" x2="7.05" y2="16.95" />
    <line x1="16.95" y1="7.05" x2="19.07" y2="4.93" />
  </svg>
);

export const Moon: React.FC<IconProps> = ({ size = defaultProps.size, color = defaultProps.color, strokeWidth = defaultProps.strokeWidth, style, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="square" strokeLinejoin="miter" style={style} {...props}>
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
);

export const TestTube: React.FC<IconProps> = ({ size = defaultProps.size, color = defaultProps.color, strokeWidth = defaultProps.strokeWidth, style, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="square" strokeLinejoin="miter" style={style} {...props}>
    <path d="M14.5 2v17.5c0 1.4-1.1 2.5-2.5 2.5s-2.5-1.1-2.5-2.5V2" />
    <path d="M8.5 2h7" />
    <path d="M14.5 16h-5" />
    <path d="M14.5 11h-5" />
  </svg>
);

export const Flame: React.FC<IconProps> = ({ size = defaultProps.size, color = defaultProps.color, strokeWidth = defaultProps.strokeWidth, style, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="square" strokeLinejoin="miter" style={style} {...props}>
    <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
  </svg>
);

export const Scale: React.FC<IconProps> = ({ size = defaultProps.size, color = defaultProps.color, strokeWidth = defaultProps.strokeWidth, style, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="square" strokeLinejoin="miter" style={style} {...props}>
    <path d="M12 3v18" />
    <path d="M6 18h12" />
    <path d="M3 6l4-2 4 2-4 5z" />
    <path d="M13 6l4-2 4 2-4 5z" />
  </svg>
);
