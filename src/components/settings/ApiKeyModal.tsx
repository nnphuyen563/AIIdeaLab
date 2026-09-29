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
} from '../ui/icons/CyberIcons';
import { 
  AiConfig, 
  AiProvider, 
  AvailableEnvKey,
  getAvailableEnvKeys,
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
  const [availableEnvKeys, setAvailableEnvKeys] = useState<AvailableEnvKey[]>([]);
  const [selectedEnvKeyId, setSelectedEnvKeyId] = useState<string>('');
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

  // Load configuration and discover .env keys whenever modal opens
  useEffect(() => {
    if (isOpen) {
      const envKeys = getAvailableEnvKeys();
      setAvailableEnvKeys(envKeys);

      const currentConfig = getDefaultAiConfig();
      setConfig(currentConfig);

      // Match current key with any discovered .env keys
      const matched = envKeys.find(k => k.value === currentConfig.apiKey);
      if (matched) {
        setSelectedEnvKeyId(matched.id);
      } else if (currentConfig.apiKey) {
        setSelectedEnvKeyId('__custom__');
      } else {
        // If empty, auto-select first available key matching current provider
        const firstMatch = envKeys.find(k => 
          currentConfig.provider === 'openai' 
            ? (k.providerHint === 'openai' || k.envVarName.includes('OPENAI'))
            : (k.providerHint === 'gemini' || k.envVarName.includes('GEMINI'))
        );
        if (firstMatch) {
          setSelectedEnvKeyId(firstMatch.id);
          setConfig(prev => ({ ...prev, apiKey: firstMatch.value }));
        } else {
          setSelectedEnvKeyId('');
        }
      }

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
    let defaultModel = 'gemini-flash-lite-latest';
    if (provider === 'openai') defaultModel = 'gpt-4o-mini';
    if (provider === 'custom') defaultModel = 'deepseek-chat';

    // Find keys matching the selected provider
    const keysForProvider = availableEnvKeys.filter(k => 
      k.providerHint === provider || 
      (provider === 'openai' && k.envVarName.toUpperCase().includes('OPENAI')) ||
      (provider === 'gemini' && (k.envVarName.toUpperCase().includes('GEMINI') || k.envVarName.includes('AI_API')))
    );

    let nextApiKey = config.apiKey;
    let nextEnvKeyId = selectedEnvKeyId;

    // If current key doesn't match this provider's keys, switch to first available key
    const currentKeyMatches = keysForProvider.some(k => k.value === config.apiKey);
    if (!currentKeyMatches && keysForProvider.length > 0) {
      nextApiKey = keysForProvider[0].value;
      nextEnvKeyId = keysForProvider[0].id;
    }

    setConfig(prev => ({
      ...prev,
      provider,
      apiKey: nextApiKey,
      model: defaultModel
    }));
    setSelectedEnvKeyId(nextEnvKeyId);
    setTestResult({ tested: false, success: false, message: '' });
  };

  const handleSelectEnvKey = (keyId: string) => {
    setSelectedEnvKeyId(keyId);
    if (!keyId) return;

    if (keyId === '__custom__') {
      return;
    }

    const found = availableEnvKeys.find(k => k.id === keyId);
    if (found) {
      const targetProvider = found.providerHint === 'openai' || found.envVarName.toUpperCase().includes('OPENAI')
        ? 'openai'
        : found.providerHint === 'gemini' || found.envVarName.toUpperCase().includes('GEMINI')
          ? 'gemini'
          : config.provider;

      let targetModel = config.model;
      if (targetProvider === 'openai' && config.provider !== 'openai') {
        targetModel = 'gpt-4o-mini';
      } else if (targetProvider === 'gemini' && config.provider !== 'gemini') {
        targetModel = 'gemini-2.5-flash-lite';
      }

      setConfig(prev => ({
        ...prev,
        provider: targetProvider,
        apiKey: found.value,
        model: targetModel
      }));
      setTestResult({ tested: false, success: false, message: '' });
    }
  };

  const handleApiKeyInput = (val: string) => {
    setConfig(prev => ({ ...prev, apiKey: val }));
    const match = availableEnvKeys.find(k => k.value === val.trim());
    if (match) {
      setSelectedEnvKeyId(match.id);
    } else {
      setSelectedEnvKeyId(val.trim() ? '__custom__' : '');
    }
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
        handleApiKeyInput(text.trim());
      }
    } catch (err) {
      console.warn('Cannot read clipboard', err);
    }
  };

  const handleClearKey = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setConfig(prev => ({ ...prev, apiKey: '' }));
    setSelectedEnvKeyId('');
    setTestResult({ tested: false, success: false, message: '' });
  };

  const isConfigured = Boolean(config.apiKey && config.apiKey.trim().length > 5);

  // Group detected .env keys strictly by provider
  const openaiKeys = availableEnvKeys.filter(k => k.providerHint === 'openai');
  const geminiKeys = availableEnvKeys.filter(k => k.providerHint === 'gemini');

  const relevantEnvKeys = config.provider === 'openai' 
    ? openaiKeys 
    : config.provider === 'gemini' 
      ? geminiKeys 
      : availableEnvKeys;

  const otherEnvKeys = availableEnvKeys.filter(k => !relevantEnvKeys.some(r => r.id === k.id));
  const activeMatchedKey = availableEnvKeys.find(k => k.value === config.apiKey);
  const currentActiveEnvKey = availableEnvKeys.find(k => k.id === selectedEnvKeyId) || activeMatchedKey;

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
                Kết nối OpenAI hoặc Google Gemini để tự động suy luận và thiết kế giao diện từ ý tưởng.
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
            className={`provider-tab ${config.provider === 'openai' ? 'active' : ''}`}
            onClick={() => handleProviderChange('openai')}
            style={{ pointerEvents: 'auto', cursor: 'pointer' }}
          >
            <Cpu style={{ width: 14, height: 14, color: '#10B981' }} />
            <span>OpenAI</span>
            {openaiKeys.length > 0 && (
              <span className="rec-badge" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#34D399', borderColor: 'rgba(16, 185, 129, 0.3)' }}>
                {openaiKeys.length} khóa .env
              </span>
            )}
          </button>

          <button
            type="button"
            className={`provider-tab ${config.provider === 'gemini' ? 'active' : ''}`}
            onClick={() => handleProviderChange('gemini')}
            style={{ pointerEvents: 'auto', cursor: 'pointer' }}
          >
            <Sparkles style={{ width: 14, height: 14, color: '#38BDF8' }} />
            <span>Google Gemini</span>
            <span className="rec-badge">Miễn phí</span>
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
          {/* Pre-select from .env Select Dropdown */}
          <div className="api-env-select-box">
            <div className="api-field-header" style={{ marginBottom: '0.35rem' }}>
              <label htmlFor="envKeySelect" className="api-field-label" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#38BDF8' }}>
                <Sparkles style={{ width: 13, height: 13, color: '#38BDF8' }} />
                <span>
                  {config.provider === 'openai' 
                    ? 'Tùy chọn Khóa OpenAI từ .env (Pre-select)' 
                    : 'Tùy chọn Khóa AI từ .env (Pre-select)'}
                </span>
              </label>

              {currentActiveEnvKey ? (
                <span className="api-env-badge-active">
                  <Check style={{ width: 10, height: 10 }} />
                  <span>Đang dùng: {currentActiveEnvKey.envVarName}</span>
                </span>
              ) : (
                <span style={{ 
                  fontSize: '0.6875rem', 
                  color: 'rgba(255, 255, 255, 0.5)',
                  background: 'rgba(255, 255, 255, 0.05)',
                  padding: '0.15rem 0.45rem',
                  borderRadius: '9999px'
                }}>
                  {relevantEnvKeys.length} khóa tìm thấy
                </span>
              )}
            </div>

            {/* Select Dropdown for Pre-selection */}
            <select
              id="envKeySelect"
              value={selectedEnvKeyId}
              onChange={(e) => handleSelectEnvKey(e.target.value)}
              className="api-select-input"
              style={{
                width: '100%',
                background: '#090a0d',
                borderColor: currentActiveEnvKey ? '#10B981' : 'rgba(255, 255, 255, 0.16)',
                fontWeight: 500,
                padding: '0.55rem 0.75rem',
                fontSize: '0.8125rem'
              }}
            >
              <option value="">-- Chọn khóa có sẵn từ file .env --</option>
              {relevantEnvKeys.map((k, idx) => (
                <option key={k.id} value={k.id}>
                  🔑 {config.provider === 'openai' ? `OpenAI Khóa ${idx + 1}` : k.name}: {k.envVarName} [{k.preview}]
                </option>
              ))}
              {otherEnvKeys.length > 0 && (
                <optgroup label="Các khóa AI khác trong .env">
                  {otherEnvKeys.map(k => (
                    <option key={k.id} value={k.id}>
                      🔑 {k.name} [{k.preview}]
                    </option>
                  ))}
                </optgroup>
              )}
              <option value="__custom__">✏️ Nhập thủ công (Tự dán khóa khác)...</option>
            </select>

            {/* Quick 1-Click Key Selector Chips */}
            {relevantEnvKeys.length > 0 && (
              <div className="api-key-chip-group">
                <span style={{ fontSize: '0.6875rem', color: 'rgba(255, 255, 255, 0.45)', marginRight: '2px' }}>
                  Chọn nhanh:
                </span>
                {relevantEnvKeys.map((k, idx) => {
                  const isSelected = selectedEnvKeyId ? selectedEnvKeyId === k.id : (activeMatchedKey?.id === k.id && idx === 0);
                  return (
                    <button
                      key={k.id}
                      type="button"
                      className={`api-key-chip ${isSelected ? 'active' : ''}`}
                      onClick={() => handleSelectEnvKey(k.id)}
                      title={`Áp dụng ${k.envVarName}`}
                    >
                      <span className="chip-dot" />
                      <span>{config.provider === 'openai' ? `OpenAI Key ${idx + 1}` : k.envVarName}</span>
                      <span style={{ opacity: 0.6, fontSize: '0.68rem', fontFamily: 'var(--font-mono)' }}>
                        ({k.preview})
                      </span>
                      {isSelected && <Check style={{ width: 11, height: 11, marginLeft: 1 }} />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* API Key Input */}
          <div className="api-field-group">
            <div className="api-field-header">
              <label htmlFor="apiKeyInput" className="api-field-label">
                {config.provider === 'gemini' 
                  ? 'Google Gemini API Key' 
                  : config.provider === 'openai' 
                    ? 'OpenAI API Key (Đã tự động nạp từ lựa chọn trên)' 
                    : 'OpenAI / Custom API Key'}
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
                onChange={(e) => handleApiKeyInput(e.target.value)}
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
              🔒 Khóa được lưu an toàn trong trình duyệt hoặc nạp từ file <code>.env</code>. Bạn có thể chọn nhanh bất kỳ khóa nào giữa 2 khóa OpenAI đã tạo.
            </p>

            {/* Smart AI Proxy Reassurance for OpenAI + AQ. key */}
            {config.provider === 'openai' && (config.apiKey.startsWith('AQ.') || config.apiKey.startsWith('AIza')) && (
              <div style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.5rem',
                padding: '0.65rem 0.85rem',
                borderRadius: '8px',
                background: 'rgba(16, 185, 129, 0.08)',
                border: '1px solid rgba(16, 185, 129, 0.25)',
                fontSize: '0.8rem',
                color: '#a7f3d0',
                marginTop: '0.6rem',
                lineHeight: 1.45
              }}>
                <Sparkles style={{ width: 15, height: 15, color: '#34d399', flexShrink: 0, marginTop: 2 }} />
                <div>
                  <strong>Cầu nối Thông minh (Smart AI Proxy) tự động kích hoạt:</strong> Khóa này mang định dạng Google Gemini trong <code>.env</code>. Hệ thống sẽ tự động định tuyến toàn bộ phản biện Realtime Grill Me và AI Canvas qua mô hình <strong>Gemini Flash Lite</strong> thời gian thực, đảm bảo bạn chọn OpenAI hay Gemini thì AI đều hoạt động 100% mượt mà!
                </div>
              </div>
            )}
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
                  <option value="gemini-flash-lite-latest">gemini-flash-lite-latest (Nhanh nhất & Hạn ngạch cao - Khuyên dùng)</option>
                  <option value="gemini-3.1-flash-lite">gemini-3.1-flash-lite (Thế hệ mới 2026)</option>
                  <option value="gemini-3.5-flash-lite">gemini-3.5-flash-lite (Siêu tốc độ)</option>
                  <option value="gemini-flash-latest">gemini-flash-latest (Chuẩn ổn định)</option>
                  <option value="gemini-2.5-flash-lite">gemini-2.5-flash-lite (Dự phòng)</option>
                </>
              ) : (
                <>
                  <option value="gpt-4o-mini">gpt-4o-mini (Cân bằng tốc độ & chi phí - Mặc định)</option>
                  <option value="gpt-4o">gpt-4o (Mô hình tiêu chuẩn cao cấp OpenAI)</option>
                  <option value="gpt-4-turbo">gpt-4-turbo (Phiên bản Turbo hiệu suất cao)</option>
                  <option value="deepseek-chat">deepseek-chat (DeepSeek V3 qua Custom URL)</option>
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
