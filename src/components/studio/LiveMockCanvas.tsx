import React, { useRef, useState } from 'react';
import { 
  RotateCw, 
  Smartphone, 
  Monitor, 
  ExternalLink, 
  Copy, 
  Check, 
  Sparkles
} from 'lucide-react';

interface LiveMockCanvasProps {
  htmlContent: string;
  title: string;
  isGenerating?: boolean;
  platform?: 'app' | 'web';
}

export const LiveMockCanvas: React.FC<LiveMockCanvasProps> = ({
  htmlContent,
  title,
  isGenerating = false,
  platform = 'app'
}) => {
  const [deviceMode, setDeviceMode] = useState<'mobile' | 'desktop'>(platform === 'web' ? 'desktop' : 'mobile');
  const [copied, setCopied] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  const handleCopyHtml = () => {
    navigator.clipboard.writeText(htmlContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenExternal = () => {
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
  };

  return (
    <div className="live-mock-canvas-wrapper">
      {/* Device & Preview Controls Header Bar */}
      <div className="live-mock-control-bar">
        {/* Device Mode Switcher */}
        <div className="live-mock-mode-capsule">
          <button
            type="button"
            className={`mock-mode-btn ${deviceMode === 'mobile' ? 'active' : ''}`}
            onClick={() => setDeviceMode('mobile')}
            title="Xem giao diện Di động (390px)"
          >
            <Smartphone style={{ width: 13, height: 13 }} />
            <span>Di động</span>
          </button>
          <button
            type="button"
            className={`mock-mode-btn ${deviceMode === 'desktop' ? 'active' : ''}`}
            onClick={() => setDeviceMode('desktop')}
            title="Xem giao diện Web / Desktop"
          >
            <Monitor style={{ width: 13, height: 13 }} />
            <span>Web</span>
          </button>
        </div>

        {/* Center URL Pill (Browser aesthetic) */}
        <div className="live-mock-url-pill">
          <span className="mock-url-dot" />
          <span className="mock-url-text">preview://{title.toLowerCase().replace(/[^a-z0-9]/g, '-') || 'app'}.stitch</span>
        </div>

        {/* Right Actions */}
        <div className="live-mock-right-actions">
          <button
            type="button"
            className="mock-action-btn"
            onClick={() => setReloadKey(prev => prev + 1)}
            title="Tải lại giao diện mô phỏng"
          >
            <RotateCw style={{ width: 13, height: 13 }} />
          </button>

          <button
            type="button"
            className="mock-action-btn"
            onClick={handleCopyHtml}
            title="Sao chép toàn bộ mã HTML"
          >
            {copied ? <Check style={{ width: 13, height: 13, color: '#10B981' }} /> : <Copy style={{ width: 13, height: 13 }} />}
          </button>

          <button
            type="button"
            className="mock-action-btn"
            onClick={handleOpenExternal}
            title="Mở trong tab mới"
          >
            <ExternalLink style={{ width: 13, height: 13 }} />
          </button>
        </div>
      </div>

      {/* Main Viewport Container */}
      <div className="live-mock-viewport-area">
        {isGenerating && (
          <div className="live-mock-loading-overlay">
            <div className="mock-loader-card">
              <Sparkles className="spin-icon" style={{ width: 22, height: 22, color: '#38BDF8' }} />
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>AI Agent đang tạo Mock HTML...</div>
                <div style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.65)', marginTop: '0.2rem' }}>
                  Xây dựng bố cục single-page view với dữ liệu và mã tương tác thời gian thực.
                </div>
              </div>
            </div>
          </div>
        )}

        <div className={`live-mock-frame-container ${deviceMode}`}>
          {deviceMode === 'mobile' && (
            <div className="mobile-bezel-notch">
              <span className="bezel-camera" />
              <span className="bezel-speaker" />
            </div>
          )}

          <iframe
            key={reloadKey}
            ref={iframeRef}
            srcDoc={htmlContent}
            title="Live Mock HTML Preview"
            className="live-mock-iframe"
            sandbox="allow-scripts allow-forms allow-same-origin allow-modals"
          />

          {deviceMode === 'mobile' && (
            <div className="mobile-home-indicator" />
          )}
        </div>
      </div>
    </div>
  );
};
