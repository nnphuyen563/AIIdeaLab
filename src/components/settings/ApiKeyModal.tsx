import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
  Key, 
  Eye, 
  EyeOff, 
  ExternalLink, 
  CheckCircle2, 
  XCircle, 
  Loader2, 
  Sparkles, 
  ShieldCheck, 
  Cpu, 
  Clipboard, 
  Trash2,
  X,
  Check
} from 'lucide-react';
import { 
  AiConfig, 
  AiProvider, 
  getDefaultAiConfig, 
  saveAiConfig, 
  testAiConnection 
} from '../../services/aiService';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfigSaved?: (config: AiConfig) => void;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({
  isOpen,
  onClose,
  onConfigSaved
}) => {
  const [config, setConfig] = useState<AiConfig>(getDefaultAiConfig());
  const [showKey, setShowKey] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [testResult, setTestResult] = useState<{
    tested: boolean;
    success: boolean;
    message: string;
    latencyMs?: number;
  }>({
    tested: false,
    success: false,
    message: ''
  });

  // Load latest configuration whenever modal opens
  useEffect(() => {
    if (isOpen) {
      setConfig(getDefaultAiConfig());
      setTestResult({ tested: false, success: false, message: '' });
      setSaveSuccess(false);
    }
  }, [isOpen]);

  // Support closing modal with Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleProviderChange = (provider: AiProvider) => {
    let defaultModel = 'gemini-2.5-flash';
    if (provider === 'openai') defaultModel = 'gpt-4o-mini';
    if (provider === 'custom') defaultModel = 'deepseek-chat';

    setConfig(prev => ({
      ...prev,
      provider,
      model: defaultModel
    }));
    setTestResult({ tested: false, success: false, message: '' });
  };

  const handleTestConnection = async (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setIsTesting(true);
    setTestResult({ tested: false, success: false, message: '' });

    try {
      const res = await testAiConnection(config);
      setTestResult({
        tested: true,
        success: res.success,
        message: res.message,
        latencyMs: res.latencyMs
      });
    } catch (err: any) {
      setTestResult({
        tested: true,
        success: false,
        message: err.message || 'Lỗi không xác định khi kết nối'
      });
    } finally {
      setIsTesting(false);
    }
  };

  const handleSave = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    saveAiConfig(config);
    setSaveSuccess(true);
    if (onConfigSaved) onConfigSaved(config);
    setTimeout(() => {
      onClose();
    }, 400);
  };

  const handlePasteKey = async (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setConfig(prev => ({ ...prev, apiKey: text.trim() }));
      }
    } catch (err) {
      console.warn('Cannot read clipboard', err);
    }
  };

  const handleClearKey = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setConfig(prev => ({ ...prev, apiKey: '' }));
    setTestResult({ tested: false, success: false, message: '' });
  };

  const isConfigured = Boolean(config.apiKey && config.apiKey.trim().length > 5);

  const modalJSX = (
    <div 
      className="api-modal-overlay" 
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
      style={{ pointerEvents: 'auto' }}
    >
      <div 
        className="api-modal-card" 
        onClick={(e) => e.stopPropagation()}
        style={{ pointerEvents: 'auto' }}
      >
        {/* Modal Header */}
        <div className="api-modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div className="api-icon-badge">
              <Key style={{ width: 18, height: 18, color: '#10B981' }} />
            </div>
            <div>
              <h2 className="api-modal-title">Cấu hình Khóa AI API</h2>
              <p className="api-modal-subtitle">
                Kết nối Google Gemini hoặc OpenAI để tự động suy luận và thiết kế giao diện từ ý tưởng.
              </p>
            </div>
          </div>
          
          <button 
            type="button" 
            className="studio-icon-btn" 
            onClick={onClose}
            title="Đóng modal"
            style={{ pointerEvents: 'auto', cursor: 'pointer' }}
          >
            <X style={{ width: 18, height: 18 }} />
          </button>
        </div>

        {/* Current Status Banner */}
        <div className={`api-status-banner ${isConfigured ? 'active' : 'inactive'}`}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span className={`status-dot ${isConfigured ? 'green' : 'amber'}`} />
            <span style={{ fontWeight: 600 }}>
              {isConfigured ? 'AI API Sẵn sàng hoạt động' : 'Chưa có API Key (Đang dùng chế độ Giả lập Cục bộ)'}
            </span>
          </div>
          <span style={{ fontSize: '0.75rem', opacity: 0.8 }}>
            {config.provider.toUpperCase()} · {config.model}
          </span>
        </div>

        {/* Provider Tabs */}
        <div className="api-provider-tabs">
          <button
            type="button"
            className={`provider-tab ${config.provider === 'gemini' ? 'active' : ''}`}
            onClick={() => handleProviderChange('gemini')}
            style={{ pointerEvents: 'auto', cursor: 'pointer' }}
          >
            <Sparkles style={{ width: 14, height: 14, color: '#38BDF8' }} />
            <span>Google Gemini</span>
            <span className="rec-badge">Khuyên dùng</span>
          </button>

          <button
            type="button"
            className={`provider-tab ${config.provider === 'openai' ? 'active' : ''}`}
            onClick={() => handleProviderChange('openai')}
            style={{ pointerEvents: 'auto', cursor: 'pointer' }}
          >
            <Cpu style={{ width: 14, height: 14 }} />
            <span>OpenAI</span>
          </button>

          <button
            type="button"
            className={`provider-tab ${config.provider === 'custom' ? 'active' : ''}`}
            onClick={() => handleProviderChange('custom')}
            style={{ pointerEvents: 'auto', cursor: 'pointer' }}
          >
            <ShieldCheck style={{ width: 14, height: 14 }} />
            <span>Custom / OpenRouter</span>
          </button>
        </div>

        {/* Form Fields */}
        <div className="api-form-body">
          {/* API Key Input */}
          <div className="api-field-group">
            <div className="api-field-header">
              <label htmlFor="apiKeyInput" className="api-field-label">
                {config.provider === 'gemini' ? 'Google Gemini API Key' : 'OpenAI / Custom API Key'}
              </label>
              
              {config.provider === 'gemini' && (
                <a
                  href="https://aistudio.google.com/app/apikey"
                  target="_blank"
                  rel="noreferrer"
                  className="api-get-key-link"
                >
                  <span>Lấy khóa Gemini miễn phí tại Google AI Studio</span>
                  <ExternalLink style={{ width: 11, height: 11 }} />
                </a>
              )}
            </div>

            <div className="api-input-container">
              <input
                id="apiKeyInput"
                type={showKey ? 'text' : 'password'}
                value={config.apiKey}
                onChange={(e) => setConfig(prev => ({ ...prev, apiKey: e.target.value }))}
                placeholder={config.provider === 'gemini' ? 'AIzaSy...' : 'sk-...'}
                className="api-text-input"
                autoComplete="off"
                spellCheck="false"
                style={{ pointerEvents: 'auto' }}
              />

              <div className="api-input-actions">
                <button
                  type="button"
                  className="api-inline-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowKey(!showKey);
                  }}
                  title={showKey ? 'Ẩn khóa' : 'Hiện khóa'}
                  style={{ pointerEvents: 'auto', cursor: 'pointer' }}
                >
                  {showKey ? <EyeOff style={{ width: 14, height: 14 }} /> : <Eye style={{ width: 14, height: 14 }} />}
                </button>

                <button
                  type="button"
                  className="api-inline-btn"
                  onClick={handlePasteKey}
                  title="Dán từ bộ nhớ tạm"
                  style={{ pointerEvents: 'auto', cursor: 'pointer' }}
                >
                  <Clipboard style={{ width: 14, height: 14 }} />
                </button>

                {config.apiKey && (
                  <button
                    type="button"
                    className="api-inline-btn"
                    onClick={handleClearKey}
                    title="Xóa khóa"
                    style={{ pointerEvents: 'auto', cursor: 'pointer' }}
                  >
                    <Trash2 style={{ width: 14, height: 14, color: '#EF4444' }} />
                  </button>
                )}
              </div>
            </div>
            
            <p className="api-security-note">
              🔒 Khóa được lưu hoàn toàn trên trình duyệt của bạn (Local Storage) và chỉ gửi trực tiếp đến endpoint API chính thức của {config.provider === 'gemini' ? 'Google' : 'OpenAI'}.
            </p>
          </div>

          {/* Model Selection */}
          <div className="api-field-group">
            <label className="api-field-label">Mô hình AI (Model)</label>
            <select
              value={config.model}
              onChange={(e) => setConfig(prev => ({ ...prev, model: e.target.value }))}
              className="api-select-input"
              style={{ pointerEvents: 'auto', cursor: 'pointer' }}
            >
              {config.provider === 'gemini' ? (
                <>
                  <option value="gemini-2.5-flash">gemini-2.5-flash (Nhanh nhất & Thông minh nhất - Mặc định)</option>
                  <option value="gemini-1.5-flash">gemini-1.5-flash (Siêu tốc độ, độ trễ thấp)</option>
                  <option value="gemini-1.5-pro">gemini-1.5-pro (Suy luận sâu sắc, phân tích kiến trúc phức tạp)</option>
                </>
              ) : (
                <>
                  <option value="gpt-4o-mini">gpt-4o-mini (Cân bằng tốc độ & chi phí)</option>
                  <option value="gpt-4o">gpt-4o (Mô hình tiêu chuẩn cao cấp)</option>
                  <option value="deepseek-chat">deepseek-chat (DeepSeek V3)</option>
                </>
              )}
            </select>
          </div>

          {/* Custom Base URL (shown for Custom / OpenRouter) */}
          {(config.provider === 'custom' || config.provider === 'openai') && (
            <div className="api-field-group">
              <label className="api-field-label">API Base URL (Tùy chọn)</label>
              <input
                type="text"
                value={config.customBaseUrl || ''}
                onChange={(e) => setConfig(prev => ({ ...prev, customBaseUrl: e.target.value }))}
                placeholder="https://api.openai.com/v1 hoặc https://openrouter.ai/api/v1"
                className="api-text-input"
                style={{ pointerEvents: 'auto' }}
              />
            </div>
          )}

          {/* Test Connection Button & Result */}
          <div className="api-test-section">
            <button
              type="button"
              className="api-test-btn"
              onClick={handleTestConnection}
              disabled={isTesting || !config.apiKey.trim()}
              style={{ pointerEvents: 'auto', cursor: config.apiKey.trim() ? 'pointer' : 'not-allowed' }}
            >
              {isTesting ? (
                <>
                  <Loader2 className="spin-icon" style={{ width: 14, height: 14 }} />
                  <span>Đang kiểm tra kết nối...</span>
                </>
              ) : (
                <>
                  <Sparkles style={{ width: 14, height: 14 }} />
                  <span>Kiểm tra kết nối</span>
                </>
              )}
            </button>

            {testResult.tested && (
              <div className={`api-test-badge ${testResult.success ? 'success' : 'error'}`}>
                {testResult.success ? (
                  <CheckCircle2 style={{ width: 14, height: 14, color: '#10B981', flexShrink: 0 }} />
                ) : (
                  <XCircle style={{ width: 14, height: 14, color: '#EF4444', flexShrink: 0 }} />
                )}
                <span>{testResult.message}</span>
              </div>
            )}
          </div>
        </div>

        {/* Modal Actions Footer */}
        <div className="api-modal-footer">
          <button
            type="button"
            className="studio-btn-pill"
            onClick={onClose}
            style={{ pointerEvents: 'auto', cursor: 'pointer' }}
          >
            Đóng
          </button>

          <button
            type="button"
            className="btn-primary"
            onClick={handleSave}
            style={{ pointerEvents: 'auto', cursor: 'pointer' }}
          >
            {saveSuccess ? (
              <>
                <Check style={{ width: 14, height: 14 }} />
                <span>Đã lưu!</span>
              </>
            ) : (
              <span>Lưu & Áp dụng</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );

  return typeof document !== 'undefined' ? createPortal(modalJSX, document.body) : modalJSX;
};
