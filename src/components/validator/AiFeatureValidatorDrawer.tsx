import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Sparkles, 
  TestTube, 
  Flame, 
  ShieldCheck, 
  Scale, 
  Zap, 
  Check, 
  Copy, 
  Loader2, 
  Play, 
  AlertTriangle,
  ArrowUp,
  RotateCcw,
  Monitor
} from '../ui/icons/CyberIcons';
import { 
  AiFeatureIoSpec, 
  CanvasScreen,
  runSyntheticAiTest, 
  GrillMeChatMessage,
  chatWithGrillMeArchitect
} from '../../services/aiService';
import '../../styles/validator.css';

interface AiFeatureValidatorDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  spec: AiFeatureIoSpec | null;
  onUpdateSpec: (updated: AiFeatureIoSpec) => void;
  theme?: 'dark' | 'light';
  ideaPrompt?: string;
  activeScreen?: CanvasScreen | null;
}

export const AiFeatureValidatorDrawer: React.FC<AiFeatureValidatorDrawerProps> = ({
  isOpen,
  onClose,
  spec,
  onUpdateSpec,
  theme = 'dark',
  ideaPrompt = 'Dự án AI',
  activeScreen
}) => {
  const [activeTab, setActiveTab] = useState<'contract' | 'grill' | 'testbench'>('grill');
  const [runningTestId, setRunningTestId] = useState<string | null>(null);
  const [customInputText, setCustomInputText] = useState('');
  const [customTestResult, setCustomTestResult] = useState<{
    simulatedOutput: string;
    simulatedLatencyMs: number;
    simulatedStatus: 'success' | 'flagged' | 'fallback';
    tokenCount: number;
    validationNotes: string;
  } | null>(null);
  const [isCustomTesting, setIsCustomTesting] = useState(false);
  const [copiedSchema, setCopiedSchema] = useState(false);

  // ====== REALTIME GRILL-ME CHAT STATE (Grounded in Idea & Canvas) ======
  const [chatMessages, setChatMessages] = useState<GrillMeChatMessage[]>([]);
  const [chatInputText, setChatInputText] = useState('');
  const [isArchitectTyping, setIsArchitectTyping] = useState(false);
  const [activeQuickOptions, setActiveQuickOptions] = useState<string[]>([]);
  const chatScrollRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll chat to bottom
  const scrollToBottom = () => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages, isArchitectTyping]);

  // Initialize or reset opening message when drawer opens or screen changes
  useEffect(() => {
    if (isOpen && spec && chatMessages.length === 0) {
      const screenTitle = activeScreen?.title || 'Canvas';
      const initialOpening: GrillMeChatMessage = {
        id: 'msg_open_0',
        role: 'architect',
        content: `Chào bạn! Tôi là **Principal AI Architect** của bạn. Tôi vừa soi chiếu toàn bộ mã nguồn ý tưởng **"${ideaPrompt}"** và màn hình **"${screenTitle}"** trên Canvas.
Tại màn hình này, tính năng **${spec.featureName}** đang được đề xuất.
👉 **Thách thức đầu tiên của tôi cho bạn:**
Dữ liệu đầu vào (Input) của tính năng này sẽ lấy từ người dùng gõ trực tiếp hay đọc từ cơ sở dữ liệu có sẵn? Và nếu người dùng nhập một câu cực kỳ mơ hồ (ví dụ: 'làm đi'), ứng dụng sẽ làm gì để tránh việc AI đoán mò và bịa đặt?`,
        timestamp: Date.now(),
        quickOptions: [
          'Người dùng gõ trực tiếp - Phải hỏi lại nếu quá mơ hồ (Fallback)',
          'Đọc từ Database có sẵn - Tự động gợi ý danh mục phổ biến',
          'Tải tài liệu/ảnh lên - Báo lỗi nếu thiếu ngữ cảnh'
        ]
      };
      setChatMessages([initialOpening]);
      setActiveQuickOptions(initialOpening.quickOptions || []);
    }
  }, [isOpen, spec, activeScreen, ideaPrompt, chatMessages.length]);

  if (!isOpen || !spec) return null;

  const handleSendGrillReply = async (userText: string) => {
    const cleanText = userText.trim();
    if (!cleanText || isArchitectTyping) return;

    const userMsg: GrillMeChatMessage = {
      id: `usr_${Date.now()}`,
      role: 'user',
      content: cleanText,
      timestamp: Date.now()
    };

    const newHistory = [...chatMessages, userMsg];
    setChatMessages(newHistory);
    setChatInputText('');
    setIsArchitectTyping(true);

    try {
      const result = await chatWithGrillMeArchitect(
        cleanText,
        newHistory,
        spec,
        ideaPrompt,
        activeScreen
      );

      const architectMsg: GrillMeChatMessage = {
        id: `arch_${Date.now()}`,
        role: 'architect',
        content: result.replyText,
        timestamp: Date.now(),
        impactNote: result.impactNote,
        quickOptions: result.nextQuickOptions
      };

      setChatMessages([...newHistory, architectMsg]);
      setActiveQuickOptions(result.nextQuickOptions || []);

      if (result.updatedSpec) {
        onUpdateSpec(result.updatedSpec);
      }
    } catch (err) {
      console.error('Grill me architect chat error:', err);
    } finally {
      setIsArchitectTyping(false);
    }
  };

  const handleResetGrillChat = () => {
    const screenTitle = activeScreen?.title || 'Canvas';
    const freshOpening: GrillMeChatMessage = {
      id: `msg_open_${Date.now()}`,
      role: 'architect',
      content: `Đã khởi động lại phiên phản biện cho màn hình **"${screenTitle}"** và ý tưởng **"${ideaPrompt}"**.
👉 **Câu hỏi mở màn:** Mục tiêu cốt lõi của tính năng **${spec.featureName}** ở màn hình này là gì: Tăng tỷ lệ hoàn thành tác vụ hay tạo điểm nhấn giữ chân người dùng? Bạn chấp nhận dung sai sai sót là bao nhiêu %?`,
      timestamp: Date.now(),
      quickOptions: [
        'Tăng tốc hoàn thành tác vụ - Dung sai sai sót rất thấp (< 2%)',
        'Gợi ý sáng tạo tham khảo - Dung sai trung bình (< 10%)',
        'Tự động hoá ngầm - Bắt buộc có con người kiểm duyệt'
      ]
    };
    setChatMessages([freshOpening]);
    setActiveQuickOptions(freshOpening.quickOptions || []);
  };

  const handleRunTestCase = async (testCaseId: string, sampleInput: string) => {
    setRunningTestId(testCaseId);
    try {
      const result = await runSyntheticAiTest(spec, sampleInput, testCaseId);
      const updatedTestCases = spec.testCases.map(tc => {
        if (tc.id === testCaseId) {
          return {
            ...tc,
            simulatedOutput: result.simulatedOutput,
            simulatedLatencyMs: result.simulatedLatencyMs,
            simulatedStatus: result.simulatedStatus,
            tokenCount: result.tokenCount,
            validationNotes: result.validationNotes
          };
        }
        return tc;
      });
      onUpdateSpec({ ...spec, testCases: updatedTestCases });
    } catch (err) {
      console.error('Synthetic test failed:', err);
    } finally {
      setRunningTestId(null);
    }
  };

  const handleRunCustomTest = async () => {
    if (!customInputText.trim()) return;
    setIsCustomTesting(true);
    try {
      const res = await runSyntheticAiTest(spec, customInputText.trim(), 'custom');
      setCustomTestResult(res);
    } catch (err) {
      console.error('Custom test error:', err);
    } finally {
      setIsCustomTesting(false);
    }
  };

  const handleCopySchema = () => {
    navigator.clipboard.writeText(spec.expectedOutput.schemaSnippet);
    setCopiedSchema(true);
    setTimeout(() => setCopiedSchema(false), 2000);
  };

  return (
    <div className={`ai-validator-backdrop ${theme === 'light' ? 'theme-light' : ''}`} onClick={onClose}>
      <aside 
        className="ai-validator-drawer" 
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Thẩm định Tính năng AI & Realtime Grill Me"
      >
        {/* Top Header */}
        <div className="validator-drawer-header">
          <div className="validator-header-left">
            <div className="validator-title-badge">
              <Sparkles style={{ width: 14, height: 14, color: '#10B981' }} />
              <span>AI Feature Validator &amp; Testbench</span>
            </div>
            <h2 className="validator-feature-name" title={spec.featureName}>
              {spec.featureName}
            </h2>
          </div>

          <div className="validator-header-right">
            {/* AI Necessity Badge */}
            <div 
              className={`necessity-badge ${spec.aiNecessityScore >= 80 ? 'high' : 'medium'}`}
              title="Độ cần thiết dùng AI so với code if/else thường"
            >
              <Zap style={{ width: 12, height: 12 }} />
              <span>Cần AI: {spec.aiNecessityScore}%</span>
            </div>

            <button 
              type="button" 
              className="validator-close-btn"
              onClick={onClose}
              title="Đóng bảng thẩm định"
            >
              <X style={{ width: 16, height: 16 }} />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="validator-nav-tabs">
          <button 
            type="button" 
            className={`validator-tab-btn ${activeTab === 'grill' ? 'active' : ''}`}
            onClick={() => setActiveTab('grill')}
          >
            <Flame style={{ width: 14, height: 14, color: '#F59E0B' }} />
            <span>1. Thử thách tôi (Realtime Grill Me)</span>
            <span className="live-indicator-dot" />
          </button>

          <button 
            type="button" 
            className={`validator-tab-btn ${activeTab === 'contract' ? 'active' : ''}`}
            onClick={() => setActiveTab('contract')}
          >
            <Scale style={{ width: 14, height: 14 }} />
            <span>2. Hợp đồng I/O &amp; Kiến trúc</span>
          </button>

          <button 
            type="button" 
            className={`validator-tab-btn ${activeTab === 'testbench' ? 'active' : ''}`}
            onClick={() => setActiveTab('testbench')}
          >
            <TestTube style={{ width: 14, height: 14, color: '#34D399' }} />
            <span>3. Chạy giả lập (Testbench)</span>
          </button>
        </div>

        {/* Body Content */}
        <div className="validator-drawer-body">
          {/* ============================================================= */}
          {/* TAB 1: REALTIME GRILL ME CHAT (IDEA & CANVAS GROUNDED)        */}
          {/* ============================================================= */}
          {activeTab === 'grill' && (
            <div className="validator-tab-content realtime-grill-tab">
              {/* Grounding Context Bar */}
              <div className="grill-grounding-bar">
                <div className="grounding-item">
                  <Monitor style={{ width: 13, height: 13, color: '#10B981' }} />
                  <span>Màn hình: <strong>{activeScreen?.title || 'Canvas hiện tại'}</strong></span>
                </div>
                <div className="grounding-item">
                  <Sparkles style={{ width: 13, height: 13, color: '#38BDF8' }} />
                  <span>Ý tưởng: <strong>{ideaPrompt.slice(0, 36)}...</strong></span>
                </div>
                <button
                  type="button"
                  className="grill-reset-btn"
                  onClick={handleResetGrillChat}
                  title="Khởi động lại phiên phỏng vấn Grill Me"
                >
                  <RotateCcw style={{ width: 12, height: 12 }} />
                  <span>Làm mới</span>
                </button>
              </div>

              {/* Chat Message Stream */}
              <div className="grill-chat-stream" ref={chatScrollRef}>
                {chatMessages.map((msg) => {
                  const isArch = msg.role === 'architect';

                  return (
                    <div key={msg.id} className={`grill-chat-row ${isArch ? 'architect' : 'user'}`}>
                      {isArch && (
                        <div className="architect-avatar">
                          <Flame style={{ width: 16, height: 16, color: '#F59E0B' }} />
                        </div>
                      )}

                      <div className={`grill-bubble ${isArch ? 'architect' : 'user'}`}>
                        <div className="bubble-sender">
                          {isArch ? 'AI Systems Architect' : 'Bạn (Founder / Tech Lead)'}
                        </div>
                        <div className="bubble-text">
                          {msg.content.split('\n').map((line, lIdx) => (
                            <p key={lIdx} style={{ margin: line ? '0.25rem 0' : '0.15rem 0' }}>
                              {line.startsWith('👉') ? <strong>{line}</strong> : line}
                            </p>
                          ))}
                        </div>

                        {/* Architectural Impact Tag if mutated */}
                        {msg.impactNote && (
                          <div className="architect-impact-badge">
                            <Zap style={{ width: 12, height: 12, color: '#10B981' }} />
                            <span><strong>Tác động kiến trúc:</strong> {msg.impactNote}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}

                {/* Typing Indicator */}
                {isArchitectTyping && (
                  <div className="grill-chat-row architect">
                    <div className="architect-avatar">
                      <Flame style={{ width: 16, height: 16, color: '#F59E0B' }} />
                    </div>
                    <div className="grill-bubble architect typing">
                      <Loader2 style={{ width: 14, height: 14 }} className="animate-spin" />
                      <span>AI Architect đang phân tích mã nguồn Canvas &amp; chuẩn bị câu hỏi phản biện...</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Fast Quick-Reply Chips */}
              {activeQuickOptions.length > 0 && !isArchitectTyping && (
                <div className="grill-quick-chips-bar">
                  <div className="chips-label">Gợi ý phản hồi nhanh:</div>
                  <div className="chips-wrapper">
                    {activeQuickOptions.map((opt, i) => (
                      <button
                        key={i}
                        type="button"
                        className="grill-fast-chip"
                        onClick={() => handleSendGrillReply(opt)}
                      >
                        <span>{opt}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Realtime Chat Input Box */}
              <div className="grill-chat-input-bar">
                <textarea
                  className="grill-chat-textarea"
                  rows={2}
                  value={chatInputText}
                  onChange={(e) => setChatInputText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendGrillReply(chatInputText);
                    }
                  }}
                  placeholder="Trả lời câu hỏi phản biện của AI Architect hoặc chất vấn lại (Shift+Enter để xuống dòng)..."
                />
                <button
                  type="button"
                  className="grill-send-btn"
                  disabled={isArchitectTyping || !chatInputText.trim()}
                  onClick={() => handleSendGrillReply(chatInputText)}
                >
                  <ArrowUp style={{ width: 15, height: 15 }} />
                </button>
              </div>
            </div>
          )}

          {/* ============================================================= */}
          {/* TAB 2: I/O CONTRACT & ARCHITECTURAL VALIDATION                */}
          {/* ============================================================= */}
          {activeTab === 'contract' && (
            <div className="validator-tab-content">
              {/* AI Necessity Statement */}
              <div className="validator-card necessity-card">
                <div className="card-headline">
                  <ShieldCheck style={{ width: 16, height: 16, color: '#10B981' }} />
                  <h4>Thẩm định: Có thực sự cần AI cho tính năng này?</h4>
                </div>
                <p className="necessity-text">{spec.necessityReasoning}</p>
              </div>

              {/* Side-by-Side I/O Contract */}
              <div className="io-contract-grid">
                {/* Expected Input */}
                <div className="validator-card io-card">
                  <div className="io-card-header">
                    <span className="io-badge input">ĐẦU VÀO KỲ VỌNG (INPUT)</span>
                    <span className="token-counter">~{spec.expectedInput.estimatedTokens} tokens</span>
                  </div>

                  <div className="io-field">
                    <label>Nguồn dữ liệu:</label>
                    <p>{spec.expectedInput.source}</p>
                  </div>

                  <div className="io-field">
                    <label>Định dạng truyền vào:</label>
                    <code>{spec.expectedInput.format}</code>
                  </div>

                  <div className="io-field">
                    <label>Lỗ hổng đầu vào tiềm ẩn (Input Flaws):</label>
                    <ul className="flaw-list">
                      {spec.expectedInput.potentialInputFlaws.map((flaw, i) => (
                        <li key={i}>
                          <AlertTriangle style={{ width: 12, height: 12, color: '#F59E0B', flexShrink: 0 }} />
                          <span>{flaw}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Expected Output */}
                <div className="validator-card io-card">
                  <div className="io-card-header">
                    <span className="io-badge output">ĐẦU RA KỲ VỌNG (OUTPUT)</span>
                    <span className="latency-target">SLA: &lt;{spec.expectedOutput.targetLatencyMs}ms</span>
                  </div>

                  <div className="io-field">
                    <label>Định dạng đầu ra:</label>
                    <p>{spec.expectedOutput.format}</p>
                  </div>

                  <div className="io-field">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <label>Cấu trúc Schema (Zod / JSON):</label>
                      <button 
                        type="button" 
                        className="copy-schema-btn"
                        onClick={handleCopySchema}
                      >
                        {copiedSchema ? <Check style={{ width: 12, height: 12, color: '#10B981' }} /> : <Copy style={{ width: 12, height: 12 }} />}
                        <span>{copiedSchema ? 'Đã sao chép' : 'Sao chép'}</span>
                      </button>
                    </div>
                    <pre className="schema-code-block">
                      <code>{spec.expectedOutput.schemaSnippet}</code>
                    </pre>
                  </div>
                </div>
              </div>

              {/* Model Recommendation & Cost */}
              <div className="validator-card model-strategy-card">
                <div className="card-headline">
                  <Zap style={{ width: 16, height: 16, color: '#38BDF8' }} />
                  <h4>Khuyến nghị Mô hình &amp; Chi phí Vận hành</h4>
                </div>
                <div className="model-strategy-row">
                  <div className="model-chip">
                    <span className="model-name">{spec.recommendedModel.modelTier}</span>
                    <span className="cost-tag">{spec.recommendedModel.estimatedCostPer1k}</span>
                  </div>
                  <p className="model-reason">{spec.recommendedModel.whyThisModel}</p>
                </div>
              </div>

              {/* Failure Risk & UX Fallback */}
              <div className="validator-card risk-card">
                <div className="card-headline">
                  <AlertTriangle style={{ width: 16, height: 16, color: spec.failureAndRisk.hallucinationRisk === 'high' ? '#EF4444' : '#F59E0B' }} />
                  <h4>Rủi ro ảo giác (Hallucination) &amp; Chiến lược Fallback khi AI lỗi</h4>
                </div>
                <div className="risk-content-grid">
                  <div>
                    <label>Cấp độ rủi ro ảo giác:</label>
                    <span className={`risk-level-tag ${spec.failureAndRisk.hallucinationRisk}`}>
                      {spec.failureAndRisk.hallucinationRisk === 'high' ? 'Cao (Cần duyệt)' : spec.failureAndRisk.hallucinationRisk === 'medium' ? 'Trung bình' : 'Thấp'}
                    </span>
                  </div>
                  <div>
                    <label>Phương án Fallback trên Giao diện:</label>
                    <p className="fallback-text">{spec.failureAndRisk.fallbackBehavior}</p>
                  </div>
                </div>
              </div>

              {/* Action Banner to Testbench */}
              <div className="contract-footer-cta">
                <button 
                  type="button"
                  className="cta-testbench-btn"
                  onClick={() => setActiveTab('testbench')}
                >
                  <TestTube style={{ width: 15, height: 15 }} />
                  <span>Chuyển sang Chạy thử nghiệm giả lập (Testbench)</span>
                </button>
              </div>
            </div>
          )}

          {/* ============================================================= */}
          {/* TAB 3: SYNTHETIC TESTBENCH RUNNER                             */}
          {/* ============================================================= */}
          {activeTab === 'testbench' && (
            <div className="validator-tab-content">
              <div className="testbench-intro-bar">
                <div>
                  <h4 style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    Môi trường Chạy thử nghiệm Giả lập (Synthetic Testbench)
                  </h4>
                  <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                    Bấm &quot;Chạy thử nghiệm&quot; để quan sát cách AI xử lý từng trường hợp: từ đầu vào chuẩn đến dữ liệu thiếu hoặc dữ liệu tấn công.
                  </p>
                </div>
              </div>

              {/* Preset Test Cases */}
              <div className="test-cases-container">
                {spec.testCases.map((tc) => {
                  const isRunning = runningTestId === tc.id;
                  const hasRun = !!tc.simulatedOutput;

                  return (
                    <div key={tc.id} className={`test-case-card ${tc.type}`}>
                      <div className="tc-header">
                        <div className="tc-header-title">
                          <span className={`tc-badge ${tc.type}`}>
                            {tc.type === 'happy' ? 'Happy Path' : tc.type === 'sparse' ? 'Sparse Data' : 'Adversarial Edge'}
                          </span>
                          <h4>{tc.name}</h4>
                        </div>

                        <button
                          type="button"
                          className="run-test-btn"
                          disabled={isRunning}
                          onClick={() => handleRunTestCase(tc.id, tc.sampleInput)}
                        >
                          {isRunning ? (
                            <>
                              <Loader2 style={{ width: 13, height: 13 }} className="animate-spin" />
                              <span>Đang chạy...</span>
                            </>
                          ) : (
                            <>
                              <Play style={{ width: 13, height: 13 }} />
                              <span>{hasRun ? 'Chạy lại' : 'Chạy thử nghiệm'}</span>
                            </>
                          )}
                        </button>
                      </div>

                      {/* Sample Input */}
                      <div className="tc-input-box">
                        <label>Đầu vào kiểm thử (Input):</label>
                        <p>{tc.sampleInput}</p>
                      </div>

                      {/* Execution Results if Run */}
                      {hasRun && (
                        <div className="tc-result-box">
                          <div className="tc-result-metrics">
                            <span className={`status-pill ${tc.simulatedStatus}`}>
                              {tc.simulatedStatus === 'success' ? '✓ Hợp lệ (Valid)' : tc.simulatedStatus === 'flagged' ? '⚠ Đã chặn an toàn' : '⟳ Kích hoạt Fallback'}
                            </span>
                            <span className="metric-pill">Độ trễ: {tc.simulatedLatencyMs}ms</span>
                            <span className="metric-pill">Tokens: {tc.tokenCount}</span>
                          </div>

                          <label>Đầu ra mô phỏng (Output):</label>
                          <pre className="result-code-block">
                            <code>{tc.simulatedOutput}</code>
                          </pre>

                          {tc.validationNotes && (
                            <p className="tc-notes">
                              <strong>Đánh giá kiểm thử:</strong> {tc.validationNotes}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Custom Input Testbench Playground */}
              <div className="custom-test-card">
                <div className="custom-test-header">
                  <TestTube style={{ width: 16, height: 16, color: '#10B981' }} />
                  <h4>Thử nghiệm với Dữ liệu tuỳ chỉnh của bạn</h4>
                </div>

                <textarea
                  className="custom-test-textarea"
                  rows={3}
                  value={customInputText}
                  onChange={(e) => setCustomInputText(e.target.value)}
                  placeholder="Nhập bất kỳ chuỗi đầu vào nào để kiểm tra khả năng xử lý của tính năng AI này..."
                />

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.65rem' }}>
                  <button
                    type="button"
                    className="run-test-btn primary"
                    disabled={isCustomTesting || !customInputText.trim()}
                    onClick={handleRunCustomTest}
                  >
                    {isCustomTesting ? (
                      <>
                        <Loader2 style={{ width: 14, height: 14 }} className="animate-spin" />
                        <span>Đang giả lập...</span>
                      </>
                    ) : (
                      <>
                        <Play style={{ width: 14, height: 14 }} />
                        <span>Chạy thử nghiệm giả lập (Run Synthetic Test)</span>
                      </>
                    )}
                  </button>
                </div>

                {customTestResult && (
                  <div className="tc-result-box" style={{ marginTop: '1rem' }}>
                    <div className="tc-result-metrics">
                      <span className={`status-pill ${customTestResult.simulatedStatus}`}>
                        {customTestResult.simulatedStatus === 'success' ? '✓ Hợp lệ (Valid)' : customTestResult.simulatedStatus === 'flagged' ? '⚠ Đã chặn an toàn' : '⟳ Kích hoạt Fallback'}
                      </span>
                      <span className="metric-pill">Độ trễ: {customTestResult.simulatedLatencyMs}ms</span>
                      <span className="metric-pill">Tokens: {customTestResult.tokenCount}</span>
                    </div>

                    <label>Đầu ra mô phỏng:</label>
                    <pre className="result-code-block">
                      <code>{customTestResult.simulatedOutput}</code>
                    </pre>

                    <p className="tc-notes">
                      <strong>Đánh giá kiểm thử:</strong> {customTestResult.validationNotes}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </aside>
    </div>
  );
};
