import React, { useState, useRef, useEffect } from 'react';
import { 
  Plus, 
  Smartphone, 
  Globe, 
  Palette, 
  Sparkles, 
  ChevronDown, 
  Mic, 
  MicOff, 
  ArrowUp,
  Check,
  Key,
  Loader2,
  X,
  FileCode,
  RotateCcw
} from 'lucide-react';
import { 
  hasValidApiKey, 
  getDefaultAiConfig, 
  STITCH_PRESETS, 
  generateProceduralDesignMd 
} from '../../services/aiService';

interface StitchChatBarProps {
  onSubmitPrompt: (
    prompt: string, 
    mode: 'app' | 'web', 
    model: string, 
    presetId?: string, 
    customDesignMd?: string,
    variantCount?: number
  ) => void;
  currentPrompt?: string;
  onOpenApiKeyModal?: () => void;
  isGenerating?: boolean;
  initialPresetId?: string;
  initialVariantCount?: number;
}

export const StitchChatBar: React.FC<StitchChatBarProps> = ({
  onSubmitPrompt,
  currentPrompt = '',
  onOpenApiKeyModal,
  isGenerating = false,
  initialPresetId,
  initialVariantCount = 3
}) => {
  const [promptText, setPromptText] = useState(currentPrompt);
  const [targetPlatform, setTargetPlatform] = useState<'app' | 'web'>('app');
  const [variantCount, setVariantCount] = useState<number>(initialVariantCount);
  const [reasoningMode, setReasoningMode] = useState<'balanced' | 'fast' | 'creative'>('balanced');
  const [showModelDropdown, setShowModelDropdown] = useState(false);
  
  // DESIGN.md Popover & Preset State (Matching Image 2)
  const [showDesignPopover, setShowDesignPopover] = useState(false);
  const [selectedPresetId, setSelectedPresetId] = useState<string | null>(initialPresetId || null);
  const [customDesignMd, setCustomDesignMd] = useState<string>('');
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [tempCustomMd, setTempCustomMd] = useState<string>('');

  const [isListening, setIsListening] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  // Auto-resize textarea as text grows
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 160)}px`;
    }
  }, [promptText]);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanText = promptText.trim();
    if (!cleanText) return;
    onSubmitPrompt(
      cleanText, 
      targetPlatform, 
      reasoningMode, 
      selectedPresetId || undefined, 
      customDesignMd || undefined,
      variantCount
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const modeLabels: Record<string, string> = {
    balanced: 'Cân bằng',
    fast: 'Nhanh',
    creative: 'Sáng tạo'
  };

  const activePreset = selectedPresetId ? STITCH_PRESETS[selectedPresetId] : null;

  return (
    <div className="stitch-chat-container">
      <div className="stitch-chat-card">
        {/* Top Iridescent Edge Highlight */}
        <div className="stitch-chat-glow-rim" />

        {/* Textarea Input Field */}
        <div className="stitch-chat-input-area">
          <textarea
            ref={textareaRef}
            rows={1}
            value={promptText}
            onChange={(e) => setPromptText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Chúng ta nên thiết kế ứng dụng gốc nào dành cho thiết bị di động?"
            className="stitch-chat-textarea"
          />
        </div>

        {/* Bottom Actions Row (Exact layout from Image 2) */}
        <div className="stitch-chat-action-row">
          {/* Left Actions */}
          <div className="stitch-left-actions">
            {/* Plus Attachment Button */}
            <button
              type="button"
              className="stitch-action-btn plus-btn"
              title="Thêm ý tưởng mẫu"
              onClick={() => {
                const sampleIdeas = [
                  'PIXEL PONG HERO',
                  'IDEA IS ALL YOU NEED',
                  'FINTECH PORTFOLIO TRACKER',
                  'AI MEDICAL ASSISTANT',
                  'CYBERPUNK CODE EDITOR'
                ];
                const next = sampleIdeas[(sampleIdeas.indexOf(promptText) + 1) % sampleIdeas.length];
                setPromptText(next);
              }}
            >
              <Plus style={{ width: 16, height: 16 }} />
            </button>

            {/* Segmented Platform Toggle Capsule */}
            <div className="stitch-platform-capsule">
              <button
                type="button"
                className={`stitch-capsule-item ${targetPlatform === 'app' ? 'active' : ''}`}
                onClick={() => setTargetPlatform('app')}
              >
                <Smartphone style={{ width: 14, height: 14 }} />
                <span>Ứng dụng</span>
              </button>
              <button
                type="button"
                className={`stitch-capsule-item ${targetPlatform === 'web' ? 'active' : ''}`}
                onClick={() => setTargetPlatform('web')}
              >
                <Globe style={{ width: 14, height: 14 }} />
                <span>Web</span>
              </button>
            </div>

            {/* Number of Variants / Screens Selector */}
            <div className="stitch-platform-capsule" title="Chọn số lượng màn hình / biến thể cần tạo (1 đến 4)">
              <span style={{ fontSize: '0.6875rem', color: '#94A3B8', padding: '0 0.25rem 0 0.45rem', fontWeight: 600 }}>
                Biến thể:
              </span>
              {[1, 2, 3, 4].map((num) => (
                <button
                  key={num}
                  type="button"
                  className={`stitch-capsule-item ${variantCount === num ? 'active' : ''}`}
                  onClick={() => setVariantCount(num)}
                  style={{ padding: '0.2rem 0.5rem', minWidth: '22px', justifyContent: 'center' }}
                >
                  <span>{num}</span>
                </button>
              ))}
            </div>

            {/* Active Design System Badge indicator */}
            {selectedPresetId && activePreset && (
              <div 
                className="active-preset-capsule" 
                title={`Đang áp dụng hệ thống thiết kế: ${activePreset.name}`}
                onClick={() => setShowDesignPopover(true)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  padding: '0.2rem 0.6rem',
                  borderRadius: '9999px',
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  fontSize: '0.6875rem',
                  fontFamily: 'var(--font-mono)',
                  color: '#F8FAFC',
                  cursor: 'pointer'
                }}
              >
                <div className="split-swatch" style={{ width: 12, height: 12 }}>
                  <div className="swatch-left" style={{ background: activePreset.swatchColors[0] }} />
                  <div className="swatch-right" style={{ background: activePreset.swatchColors[1] }} />
                </div>
                <span>{activePreset.name}</span>
                <span 
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedPresetId(null);
                  }}
                  title="Bỏ chọn để Stitch tự động chọn"
                  style={{ opacity: 0.6, marginLeft: 2 }}
                >
                  ×
                </span>
              </div>
            )}

            {customDesignMd && (
              <div
                className="active-preset-capsule"
                title="Đang áp dụng Custom DESIGN.md của bạn"
                onClick={() => setShowCustomModal(true)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  padding: '0.2rem 0.6rem',
                  borderRadius: '9999px',
                  background: 'rgba(16, 185, 129, 0.12)',
                  border: '1px solid rgba(16, 185, 129, 0.35)',
                  fontSize: '0.6875rem',
                  fontFamily: 'var(--font-mono)',
                  color: '#34D399',
                  cursor: 'pointer'
                }}
              >
                <span>Thiết kế riêng</span>
              </div>
            )}
          </div>

          {/* Right Actions */}
          <div className="stitch-right-actions">
            {/* ============================================================= */}
            {/* DESIGN.MD POPOVER BUTTON (IMAGE 2)                            */}
            {/* ============================================================= */}
            <div className="stitch-relative-menu">
              <button
                type="button"
                className={`stitch-action-btn ${showDesignPopover ? 'active' : ''}`}
                title="Hệ thống Thiết kế & DESIGN.md"
                onClick={() => setShowDesignPopover(!showDesignPopover)}
              >
                <Palette style={{ width: 16, height: 16 }} />
              </button>

              {showDesignPopover && (
                <div className="stitch-design-popover">
                  {/* Header: Palette Icon + DESIGN.md */}
                  <div className="design-popover-header">
                    <Palette style={{ width: 15, height: 15, color: '#10B981' }} />
                    <span>DESIGN.md</span>
                  </div>

                  {/* Subtitle */}
                  <div className="design-popover-sub">
                    Stitch sẽ tự động chọn dựa trên câu lệnh của bạn, trừ phi bạn chọn một Hệ thống thiết kế cụ thể.
                  </div>

                  {/* Button: + Bắt đầu với thiết kế của bạn */}
                  <button
                    type="button"
                    className="design-custom-trigger-btn"
                    onClick={() => {
                      setShowDesignPopover(false);
                      setTempCustomMd(customDesignMd || generateProceduralDesignMd(promptText || 'Thiết kế của tôi', undefined, targetPlatform));
                      setShowCustomModal(true);
                    }}
                  >
                    <Plus style={{ width: 14, height: 14 }} />
                    <span>Bắt đầu với thiết kế của bạn</span>
                  </button>

                  {/* Section Title */}
                  <div className="design-section-heading">
                    Chế độ đặt sẵn của Stitch
                  </div>

                  {/* Presets List with Circular Split Swatches */}
                  <div className="design-presets-list">
                    {Object.values(STITCH_PRESETS).map((preset) => {
                      const isSelected = selectedPresetId === preset.id;
                      return (
                        <button
                          key={preset.id}
                          type="button"
                          className={`design-preset-row ${isSelected ? 'selected' : ''}`}
                          onClick={() => {
                            if (isSelected) {
                              // Toggle off to return to auto
                              setSelectedPresetId(null);
                            } else {
                              setSelectedPresetId(preset.id);
                              setCustomDesignMd('');
                            }
                            setShowDesignPopover(false);
                          }}
                        >
                          <div className="design-preset-left">
                            <div className="split-swatch">
                              <div 
                                className="swatch-left" 
                                style={{ background: preset.swatchColors[0] }} 
                              />
                              <div 
                                className="swatch-right" 
                                style={{ background: preset.swatchColors[1] }} 
                              />
                            </div>
                            <span>{preset.name}</span>
                          </div>

                          {isSelected && (
                            <Check style={{ width: 14, height: 14, color: '#10B981' }} />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Model Reasoning Mode Pill */}
            <div className="stitch-relative-menu">
              <button
                type="button"
                className="stitch-model-pill"
                onClick={() => setShowModelDropdown(!showModelDropdown)}
              >
                <Sparkles style={{ width: 13, height: 13, color: 'rgba(255, 255, 255, 0.85)' }} />
                <span>{modeLabels[reasoningMode]}</span>
                <ChevronDown style={{ width: 12, height: 12, opacity: 0.7 }} />
              </button>

              {showModelDropdown && (
                <div className="stitch-dropdown-popover right-aligned">
                  <div className="dropdown-title">CHẾ ĐỘ SUY LUẬN</div>
                  <button
                    type="button"
                    className={`dropdown-item ${reasoningMode === 'fast' ? 'selected' : ''}`}
                    onClick={() => {
                      setReasoningMode('fast');
                      setShowModelDropdown(false);
                    }}
                  >
                    <span>⚡ Nhanh</span>
                  </button>
                  <button
                    type="button"
                    className={`dropdown-item ${reasoningMode === 'balanced' ? 'selected' : ''}`}
                    onClick={() => {
                      setReasoningMode('balanced');
                      setShowModelDropdown(false);
                    }}
                  >
                    <span>✨ Cân bằng</span>
                  </button>
                  <button
                    type="button"
                    className={`dropdown-item ${reasoningMode === 'creative' ? 'selected' : ''}`}
                    onClick={() => {
                      setReasoningMode('creative');
                      setShowModelDropdown(false);
                    }}
                  >
                    <span>🧠 Sâu sắc / Sáng tạo</span>
                  </button>
                </div>
              )}
            </div>

            {/* AI API Key Configuration Trigger */}
            <button
              type="button"
              className={`ai-key-trigger-btn ${hasValidApiKey() ? 'configured' : ''}`}
              title={hasValidApiKey() ? `AI API Sẵn sàng (${getDefaultAiConfig().provider.toUpperCase()}) - Nhấp để sửa cấu hình` : 'Nhập API Key (Google Gemini / OpenAI)'}
              onClick={onOpenApiKeyModal}
            >
              <Key style={{ width: 12, height: 12 }} />
              <span>{hasValidApiKey() ? (getDefaultAiConfig().provider === 'gemini' ? 'Gemini' : 'AI API') : 'API Key'}</span>
              <span className={`status-dot ${hasValidApiKey() ? 'green' : 'amber'}`} style={{ width: 5, height: 5 }} />
            </button>

            {/* Microphone Button */}
            <button
              type="button"
              className={`stitch-action-btn ${isListening ? 'listening' : ''}`}
              title={isListening ? 'Dừng nhận diện giọng nói' : 'Nhập bằng giọng nói'}
              onClick={() => setIsListening(!isListening)}
            >
              {isListening ? (
                <MicOff style={{ width: 16, height: 16, color: '#F59E0B' }} />
              ) : (
                <Mic style={{ width: 16, height: 16 }} />
              )}
            </button>

            {/* Send Button */}
            <button
              type="button"
              className={`stitch-send-btn ${(promptText.trim() && !isGenerating) ? 'active' : ''}`}
              title={isGenerating ? 'AI đang suy luận...' : 'Gửi ý tưởng thiết kế (Enter)'}
              disabled={isGenerating}
              onClick={() => handleSubmit()}
            >
              {isGenerating ? (
                <Loader2 className="spin-icon" style={{ width: 16, height: 16 }} />
              ) : (
                <ArrowUp style={{ width: 16, height: 16 }} />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* =================================================================== */}
      {/* CUSTOM DESIGN.MD MODAL ("+ Bắt đầu với thiết kế của bạn")           */}
      {/* =================================================================== */}
      {showCustomModal && (
        <div className="modal-overlay" onClick={() => setShowCustomModal(false)}>
          <div 
            className="modal-card" 
            onClick={(e) => e.stopPropagation()}
            style={{ width: '92vw', maxWidth: '780px', maxHeight: '88vh', display: 'flex', flexDirection: 'column' }}
          >
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingBottom: '0.85rem',
              borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FileCode style={{ width: 18, height: 18, color: '#10B981' }} />
                <span style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#FFFFFF' }}>
                  Bắt đầu với Thiết kế của bạn (DESIGN.md)
                </span>
              </div>
              <button 
                type="button"
                className="studio-icon-btn" 
                onClick={() => setShowCustomModal(false)}
              >
                <X style={{ width: 16, height: 16 }} />
              </button>
            </div>

            <p style={{ fontSize: '0.75rem', color: '#94A3B8', marginTop: '0.75rem', marginBottom: '0.75rem', lineHeight: 1.5 }}>
              Viết hoặc dán tài liệu <code>DESIGN.md</code> định nghĩa hệ thống thiết kế (Visual Atmosphere, Bảng màu & Tokens, Typography, Thành phần, Quy tắc Anti-slop). AI sẽ dựa trực tiếp vào đặc tả này để dựng Prototype trên Canvas.
            </p>

            <div style={{ flex: 1, minHeight: '280px', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                <button
                  type="button"
                  className="studio-btn-pill"
                  onClick={() => setTempCustomMd(generateProceduralDesignMd(promptText || 'Thiết kế Đột phá', undefined, targetPlatform))}
                  style={{ fontSize: '0.7rem', padding: '0.25rem 0.6rem' }}
                >
                  <RotateCcw style={{ width: 11, height: 11 }} />
                  <span>Nạp mẫu chuẩn Google Stitch</span>
                </button>
              </div>

              <textarea
                value={tempCustomMd}
                onChange={(e) => setTempCustomMd(e.target.value)}
                placeholder="# DESIGN.md&#10;## 1. Visual Atmosphere...&#10;## 2. Color Tokens...&#10;## 3. Typography..."
                style={{
                  flex: 1,
                  minHeight: '260px',
                  width: '100%',
                  background: '#0a0d14',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '10px',
                  padding: '0.85rem',
                  color: '#F8FAFC',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.78125rem',
                  lineHeight: 1.6,
                  resize: 'vertical'
                }}
              />
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: '1rem',
              paddingTop: '0.85rem',
              borderTop: '1px solid rgba(255, 255, 255, 0.08)'
            }}>
              <button
                type="button"
                className="studio-btn-pill"
                onClick={() => {
                  setCustomDesignMd('');
                  setTempCustomMd('');
                  setShowCustomModal(false);
                }}
              >
                Xóa bỏ
              </button>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  type="button"
                  className="studio-btn-pill"
                  onClick={() => setShowCustomModal(false)}
                >
                  Hủy
                </button>
                <button
                  type="button"
                  className="studio-btn-pill"
                  style={{ background: '#10B981', color: '#000000', fontWeight: 600, borderColor: '#10B981' }}
                  onClick={() => {
                    setCustomDesignMd(tempCustomMd);
                    setSelectedPresetId(null);
                    setShowCustomModal(false);
                  }}
                >
                  <Check style={{ width: 13, height: 13 }} />
                  <span>Áp dụng Hệ thống thiết kế này</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
