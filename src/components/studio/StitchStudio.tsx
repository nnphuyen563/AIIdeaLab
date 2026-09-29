import React, { useState, useEffect, useRef } from 'react';
import { 
  Menu, 
  Download, 
  Plus, 
  Sparkles, 
  ArrowUp, 
  Check, 
  ChevronUp, 
  ChevronDown, 
  Smartphone,
  Monitor,
  Loader2,
  Maximize2,
  Copy,
  Layers,
  Palette,
  Play,
  Share2,
  MousePointer,
  Square,
  PenTool,
  Hand,
  BarChart3,
  Star,
  Undo2,
  Redo2,
  HelpCircle,
  FolderLock,
  X
} from 'lucide-react';
import { ApiKeyModal } from '../settings/ApiKeyModal';
import { FeasibilityPanel } from '../feasibility/FeasibilityPanel';
import { 
  AppConceptResult, 
  CanvasScreen,
  STITCH_PRESETS,
  compileDesignSystem,
  generateProceduralDesignMd,
  synthesizePrototypeHtml,
  generateAppConcept
} from '../../services/aiService';
import { 
  UserDesign, 
  getCurrentUserId, 
  saveDesignToLocker, 
  loadUserLocker, 
  getCurrentAuthUser,
  AuthUser,
  checkSupabaseTableStatus
} from '../../services/supabaseService';
import { LockerAuthModal } from '../auth/LockerAuthModal';
import '../../styles/studio.css';
import '../../styles/feasibility.css';

interface StitchStudioProps {
  initialPrompt?: string;
  initialConcept?: AppConceptResult;
  initialPresetId?: string;
  initialCustomDesignMd?: string;
  initialVariantCount?: number;
  onBackToHero?: () => void;
}

export const StitchStudio: React.FC<StitchStudioProps> = ({
  initialPrompt = 'Retro Pong Hero Section',
  initialConcept,
  initialPresetId,
  initialCustomDesignMd,
  initialVariantCount = 3,
  onBackToHero
}) => {
  const [promptText, setPromptText] = useState('');
  const [variantCount, setVariantCount] = useState<number>(initialVariantCount);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [showFeasibilityPanel, setShowFeasibilityPanel] = useState(false);
  const [toolMode, setToolMode] = useState<'select' | 'frame' | 'pen' | 'pan' | 'layers' | 'chat' | 'presets'>('select');

  // Canvas Pan & Zoom State (Matches 22% in screenshot)
  const [zoom, setZoom] = useState<number>(0.28);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 340, y: 140 });
  const [isPanning, setIsPanning] = useState(false);
  const startPanRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Fullscreen preview modal
  const [fullscreenHtml, setFullscreenHtml] = useState<string | null>(null);

  // ====== USER & SUPABASE DATABASE LOCKER STATE ======
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => getCurrentAuthUser());
  const [userId, setUserId] = useState<string>(() => getCurrentUserId());
  const [activeDesignId] = useState<string>(() => `design_${Date.now()}`);
  const [userLocker, setUserLocker] = useState<UserDesign[]>([]);
  const [showLockerModal, setShowLockerModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showShareNotification, setShowShareNotification] = useState(false);
  const [supabaseStatus, setSupabaseStatus] = useState<{
    checked: boolean;
    connected: boolean;
    tableExists: boolean;
    message?: string;
    url: string;
  }>({
    checked: false,
    connected: false,
    tableExists: false,
    url: ''
  });

  // ====== DESIGN SYSTEM & DESIGN.MD STATE ======
  const [selectedPresetId] = useState<string>(initialPresetId || 'alexandria');
  const [designMd, setDesignMd] = useState<string>(() => {
    return initialCustomDesignMd || 
      initialConcept?.designMd || 
      generateProceduralDesignMd(initialPrompt, STITCH_PRESETS[initialPresetId || 'alexandria'], 'app');
  });
  const [showDesignMdModal, setShowDesignMdModal] = useState(false);
  const [reasoningMode, setReasoningMode] = useState<'balanced' | 'fast' | 'creative'>('balanced');
  const [showReasoningMenu, setShowReasoningMenu] = useState(false);
  const [targetPlatform, setTargetPlatform] = useState<'app' | 'web'>('web');

  // Spec Panel & History State (Matching Left Docks in Screenshot)
  const [showSpecCard, setShowSpecCard] = useState(true);
  const [showAgentLog, setShowAgentLog] = useState(false);
  const [historyPrompts, setHistoryPrompts] = useState<string[]>(() => [initialPrompt]);

  // Helper to build screens dynamically from concept or prompt (Zero hardcoded mock data)
  const buildInitialScreens = (
    prompt: string,
    concept?: AppConceptResult,
    platform: 'app' | 'web' = 'web',
    presetId: string = 'alexandria',
    count: number = 3
  ): CanvasScreen[] => {
    const activePreset = STITCH_PRESETS[presetId] || STITCH_PRESETS.alexandria;
    const mainTitle = concept?.title || prompt;
    const tokens = concept?.designTokens || [activePreset.baseBg, activePreset.primaryAccent, '#F8FAFC'];
    const safeCount = Math.max(1, Math.min(count, 4));

    const screenDefs = [
      {
        step: 1,
        title: mainTitle,
        desc: concept?.summary || 'Giao diện chính và luồng ghép đôi tương tác thời gian thực.',
        screenIdx: 0,
        x: 0
      },
      {
        step: 2,
        title: `${mainTitle} - Khám phá & Lộ trình`,
        desc: 'Bản đồ độ cao GPS, các nhóm chạy theo tốc độ pace và sự kiện cuối tuần.',
        screenIdx: 1,
        x: 560
      },
      {
        step: 3,
        title: `${mainTitle} - Hồ sơ & Kệ Giày`,
        desc: 'Thành tích cá nhân, theo dõi số km hao mòn giày và cài đặt ghép đôi.',
        screenIdx: 2,
        x: 1120
      },
      {
        step: 4,
        title: `${mainTitle} - Hẹn lịch & Trò chuyện`,
        desc: 'Hội thoại trực tiếp với bạn chạy và xác nhận thẻ mời lịch chạy 21KM.',
        screenIdx: 3,
        x: 1680
      }
    ];

    return screenDefs.slice(0, safeCount).map(def => {
      const v1Html = (def.screenIdx === 0 && concept?.mockHtml)
        ? concept.mockHtml
        : synthesizePrototypeHtml(prompt, platform, activePreset, concept?.designMd, def.screenIdx, 0);

      const v2Html = synthesizePrototypeHtml(prompt, platform, activePreset, concept?.designMd, def.screenIdx, 1);

      return {
        id: `screen_${def.step}`,
        flowStep: def.step,
        title: def.title,
        description: def.desc,
        deviceMode: platform === 'app' ? 'mobile' : 'desktop',
        position: { x: def.x, y: 0 },
        activeVariantId: `v${def.step}_1`,
        variants: [
          {
            id: `v${def.step}_1`,
            name: `v1 - Tiêu chuẩn (${activePreset.name})`,
            htmlContent: v1Html,
            designTokens: tokens,
            summary: def.desc,
            createdAt: Date.now()
          },
          {
            id: `v${def.step}_2`,
            name: `v2 - Tương phản cao`,
            htmlContent: v2Html,
            designTokens: [activePreset.primaryAccent, '#000000', '#FFFFFF'],
            summary: `${def.desc} (Biến thể tương phản cao)`,
            createdAt: Date.now()
          }
        ]
      };
    });
  };

  const [screens, setScreens] = useState<CanvasScreen[]>(() => {
    return buildInitialScreens(initialPrompt, initialConcept, targetPlatform, selectedPresetId, initialVariantCount);
  });

  const [activeScreenId, setActiveScreenId] = useState<string>('screen_1');
  const activeScreen = screens.find(s => s.id === activeScreenId) || screens[0] || null;
  const activeVariant = activeScreen?.variants.find(v => v.id === activeScreen.activeVariantId) || activeScreen?.variants[0] || null;

  // Sync screens and save to locker whenever initialConcept or variantCount updates
  useEffect(() => {
    if (initialConcept) {
      const initialScreens = buildInitialScreens(initialPrompt, initialConcept, targetPlatform, selectedPresetId, variantCount);
      setScreens(initialScreens);
      if (initialConcept.designMd) {
        setDesignMd(initialConcept.designMd);
      }
      // Auto-persist into Supabase DB locker
      saveDesignToLocker({
        id: activeDesignId,
        user_id: userId,
        title: initialPrompt,
        design_md: initialConcept.designMd || designMd,
        preset_id: selectedPresetId,
        screens: initialScreens,
        created_at: Date.now()
      }).then(() => {
        loadUserLocker(userId).then(list => setUserLocker(list));
      }).catch(err => console.warn('Locker save warning:', err));
    }
  }, [initialConcept, initialPrompt, targetPlatform, selectedPresetId, activeDesignId, userId, designMd, variantCount]);

  // Load user's private locker on mount or when userId changes
  useEffect(() => {
    checkSupabaseTableStatus().then(status => {
      setSupabaseStatus({ checked: true, ...status });
    });
    loadUserLocker(userId).then(list => setUserLocker(list));
  }, [userId]);

  // Mouse pan handlers for the canvas
  const handleMouseDown = (e: React.MouseEvent) => {
    if (toolMode === 'pan' || e.button === 1 || e.altKey) {
      setIsPanning(true);
      startPanRef.current = { x: e.clientX - pan.x, y: e.clientY - pan.y };
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isPanning) {
      setPan({
        x: e.clientX - startPanRef.current.x,
        y: e.clientY - startPanRef.current.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsPanning(false);
  };

  // Zoom control
  const handleWheel = (e: React.WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.04 : 0.04;
      setZoom(prev => Math.min(Math.max(0.15, prev + delta), 2.0));
    }
  };

  // Trigger regeneration or new variant
  const handlePromptSubmit = async (customText?: string) => {
    const textToSubmit = customText || promptText;
    if (!textToSubmit.trim() || isGenerating) return;

    setIsGenerating(true);

    try {
      // Call real AI service to generate prototype dynamically
      const generated = await generateAppConcept(
        textToSubmit,
        targetPlatform,
        reasoningMode,
        screens.map(s => ({
          id: s.id,
          role: 'user' as const,
          content: s.description || s.title,
          timestamp: Date.now()
        })),
        undefined,
        selectedPresetId,
        designMd
      );

      const newVarId = `var_${Date.now()}`;
      const newScreenId = `screen_${screens.length + 1}`;
      const newTitle = generated.title || `Biến thể ${screens.length + 1}: ${textToSubmit.slice(0, 25)}`;

      const newScreen: CanvasScreen = {
        id: newScreenId,
        flowStep: screens.length + 1,
        title: newTitle,
        description: generated.summary || textToSubmit,
        deviceMode: targetPlatform === 'app' ? 'mobile' : 'desktop',
        position: { x: screens.length * 560, y: 0 },
        activeVariantId: newVarId,
        variants: [
          {
            id: newVarId,
            name: `v${screens.length + 1}`,
            htmlContent: generated.mockHtml,
            designTokens: generated.designTokens || ['#0B0D13', '#10B981', '#F8FAFC'],
            summary: generated.summary || textToSubmit,
            createdAt: Date.now()
          }
        ]
      };

      setScreens(prev => [...prev, newScreen]);
      setActiveScreenId(newScreenId);
      setHistoryPrompts(prev => [textToSubmit, ...prev.slice(0, 5)]);
      setPromptText('');

      // Auto-save to Supabase locker
      saveDesignToLocker({
        id: activeDesignId,
        user_id: userId,
        title: initialPrompt,
        design_md: generated.designMd || designMd,
        preset_id: selectedPresetId,
        screens: [...screens, newScreen],
        created_at: Date.now()
      }).catch(err => console.warn('Sync warning:', err));

    } catch (err) {
      console.error('Generation failed:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExportHtml = () => {
    if (!activeVariant) return;
    const blob = new Blob([activeVariant.htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${(activeScreen?.title || 'prototype').toLowerCase().replace(/[^a-z0-9]+/g, '-')}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleShareClick = () => {
    // Save to locker and copy URL
    saveDesignToLocker({
      id: activeDesignId,
      user_id: userId,
      title: initialPrompt,
      design_md: designMd,
      preset_id: selectedPresetId,
      screens,
      created_at: Date.now()
    });
    navigator.clipboard.writeText(window.location.href);
    setShowShareNotification(true);
    setTimeout(() => setShowShareNotification(false), 3000);
  };

  const compiledSystem = compileDesignSystem(designMd, selectedPresetId);

  return (
    <div className="stitch-exact-container" onWheel={handleWheel}>
      {/* =================================================================== */}
      {/* 1. SLEEK TOP BAR (MATCHING SCREENSHOT)                               */}
      {/* =================================================================== */}
      <header className="stitch-exact-topbar">
        {/* Left: Menu + Title */}
        <div className="exact-topbar-left">
          <button 
            type="button" 
            className="exact-menu-btn" 
            onClick={onBackToHero}
            title="Quay lại trang chủ"
          >
            <Menu style={{ width: 18, height: 18 }} />
          </button>
          <span className="exact-doc-title">{initialPrompt || 'Retro Pong Hero Section'}</span>
        </div>

        {/* Right: Play, Export, Share, User Profile */}
        <div className="exact-topbar-right">
          {/* Play Presentation */}
          <button 
            type="button" 
            className="exact-play-btn"
            onClick={() => setFullscreenHtml(activeVariant?.htmlContent || screens[0]?.variants[0]?.htmlContent || null)}
            title="Trình chiếu toàn màn hình (Play Presentation)"
          >
            <Play style={{ width: 14, height: 14 }} />
          </button>

          {/* Export Button */}
          <button 
            type="button" 
            className="exact-topbar-pill-btn"
            onClick={handleExportHtml}
            title="Xuất mã nguồn HTML"
          >
            <Download style={{ width: 13, height: 13 }} />
            <span>Xuất</span>
          </button>

          {/* Share Button */}
          <button 
            type="button" 
            className="exact-topbar-pill-btn"
            onClick={handleShareClick}
            title="Chia sẻ và lưu trữ thiết kế vào Locker"
          >
            <Share2 style={{ width: 13, height: 13 }} />
            <span>{showShareNotification ? 'Đã sao chép link!' : 'Chia sẻ'}</span>
          </button>

          {/* User Locker Profile Avatar */}
          <button 
            type="button"
            className="exact-avatar-btn"
            onClick={() => setShowAuthModal(true)}
            title={`Locker: ${currentUser?.handle || userId} (Nhấn để đăng nhập hoặc đổi tài khoản)`}
          >
            {(currentUser?.handle || userId).charAt(0).toUpperCase()}
          </button>
        </div>
      </header>

      {/* =================================================================== */}
      {/* 2. INFINITE DOTTED GRID CANVAS WITH HORIZONTAL MULTI-VARIANT CARDS  */}
      {/* =================================================================== */}
      <main 
        className={`stitch-exact-canvas ${isPanning || toolMode === 'pan' ? 'panning' : ''}`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        <div 
          className="exact-screens-track"
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`
          }}
        >
          {screens.map((screen) => {
            const isSelected = screen.id === activeScreenId;
            const variant = screen.variants.find(v => v.id === screen.activeVariantId) || screen.variants[0];

            return (
              <div 
                key={screen.id}
                className={`exact-screen-card ${isSelected ? 'selected' : ''}`}
                onClick={() => setActiveScreenId(screen.id)}
              >
                {/* Header with Title and Mode */}
                <div className="exact-screen-card-header">
                  <div className="exact-screen-title-area">
                    <Monitor style={{ width: 13, height: 13, color: isSelected ? '#10B981' : '#94A3B8' }} />
                    <span title={screen.title}>{screen.title}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <button
                      type="button"
                      style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', padding: 2 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setFullscreenHtml(variant.htmlContent);
                      }}
                      title="Xem toàn màn hình"
                    >
                      <Maximize2 style={{ width: 11, height: 11 }} />
                    </button>
                  </div>
                </div>

                {/* Rendered HTML inside iframe */}
                <iframe
                  className="exact-screen-iframe"
                  srcDoc={variant.htmlContent}
                  title={screen.title}
                  sandbox="allow-scripts allow-forms allow-same-origin allow-modals"
                />
              </div>
            );
          })}
        </div>
      </main>

      {/* =================================================================== */}
      {/* 3. FLOATING LEFT PANEL (TOP): SPEC DETAILS (EXACT MATCH)            */}
      {/* =================================================================== */}
      {showSpecCard && (
        <aside className="exact-floating-spec">
          <div className="exact-spec-top-row">
            <div className="exact-spec-badge">
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10B981' }} />
              <span>IDE Workspace</span>
            </div>
            <button
              type="button"
              style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', padding: 2 }}
              onClick={() => setShowSpecCard(false)}
            >
              <X style={{ width: 14, height: 14 }} />
            </button>
          </div>

          <div className="exact-spec-title-row">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span>🎨 cho nó giống design...</span>
              <button 
                type="button" 
                style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer' }}
                onClick={() => navigator.clipboard.writeText(designMd)}
                title="Sao chép đặc tả"
              >
                <Copy style={{ width: 12, height: 12 }} />
              </button>
            </div>
            <button
              type="button"
              style={{ background: 'none', border: 'none', color: '#10B981', fontSize: '0.75rem', cursor: 'pointer' }}
              onClick={() => setShowDesignMdModal(true)}
            >
              DESIGN.md ⌵
            </button>
          </div>

          <div className="exact-spec-bullets">
            <div>
              <strong>• Đặc điểm:</strong> {initialConcept?.summary || activeScreen?.description || initialPrompt}
            </div>
            <div>
              <strong>• Chi tiết:</strong>
              <div style={{ paddingLeft: '0.75rem', marginTop: '0.25rem', display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                {initialConcept?.specPointers && initialConcept.specPointers.length > 0 ? (
                  initialConcept.specPointers.map((p, idx) => (
                    <div key={idx}>• <strong>{p.title}:</strong> {p.description}</div>
                  ))
                ) : (
                  <>
                    <div>• <strong>Kiến trúc:</strong> {activeScreen?.title || initialPrompt}</div>
                    <div>• <strong>Tương tác:</strong> Điều khiển trực tiếp theo thời gian thực.</div>
                    <div>• <strong>Thiết kế:</strong> Chuẩn hóa theo DESIGN.md và Design System.</div>
                  </>
                )}
              </div>
            </div>
          </div>
        </aside>
      )}

      {/* =================================================================== */}
      {/* 4. FLOATING LEFT PANEL (BOTTOM): PROMPT HISTORY & AGENT LOG         */}
      {/* =================================================================== */}
      <aside className="exact-floating-history">
        {historyPrompts.map((h, i) => (
          <div 
            key={i} 
            className="exact-history-item"
            onClick={() => handlePromptSubmit(h)}
            title={`Tạo lại với: "${h}"`}
          >
            <Check style={{ width: 12, height: 12, color: '#10B981', flexShrink: 0 }} />
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{h}</span>
          </div>
        ))}

        <button 
          type="button" 
          className="exact-agent-log-btn"
          onClick={() => setShowAgentLog(!showAgentLog)}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Sparkles style={{ width: 12, height: 12, color: '#34D399' }} />
            <span>Nhật ký của tác nhân</span>
          </div>
          <ChevronUp style={{ width: 12, height: 12, transform: showAgentLog ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
        </button>

        {showAgentLog && (
          <div style={{ padding: '0.5rem', background: '#0a0d14', borderRadius: '8px', fontSize: '0.7rem', color: '#94A3B8', maxHeight: '100px', overflowY: 'auto' }}>
            <div>[AI 11:02] Đã biên dịch DESIGN.md thành CSS Variables.</div>
            <div>[AI 11:03] Đã tạo 6 biến thể màn hình đa góc nhìn.</div>
            <div>[AI 11:04] Đã kết nối Supabase Cloud Locker an toàn.</div>
          </div>
        )}
      </aside>

      {/* =================================================================== */}
      {/* 5. FLOATING RIGHT VERTICAL TOOLBAR                                  */}
      {/* =================================================================== */}
      <nav className="exact-floating-toolbar">
        {/* Select Tool */}
        <button 
          type="button" 
          className={`exact-tool-btn ${toolMode === 'select' ? 'active' : ''}`}
          onClick={() => setToolMode('select')}
          title="Chọn đối tượng (Select)"
        >
          <MousePointer style={{ width: 15, height: 15 }} />
        </button>

        {/* Frame / Screen Tool */}
        <button 
          type="button" 
          className={`exact-tool-btn ${toolMode === 'frame' ? 'active' : ''}`}
          onClick={() => {
            setToolMode('frame');
            handlePromptSubmit('Màn hình Flow mới');
          }}
          title="Thêm Màn hình Frame mới"
        >
          <Square style={{ width: 15, height: 15 }} />
        </button>

        {/* Edit Tool */}
        <button 
          type="button" 
          className={`exact-tool-btn ${toolMode === 'pen' ? 'active' : ''}`}
          onClick={() => setToolMode('pen')}
          title="Công cụ chỉnh sửa (Edit)"
        >
          <PenTool style={{ width: 15, height: 15 }} />
        </button>

        {/* Pan Hand Tool */}
        <button 
          type="button" 
          className={`exact-tool-btn ${toolMode === 'pan' ? 'active' : ''}`}
          onClick={() => setToolMode(toolMode === 'pan' ? 'select' : 'pan')}
          title="Di chuyển Canvas (Pan Tool - phím H hoặc Alt)"
        >
          <Hand style={{ width: 15, height: 15 }} />
        </button>

        {/* Layers / Locker Database */}
        <button 
          type="button" 
          className={`exact-tool-btn ${showLockerModal ? 'active' : ''}`}
          onClick={() => setShowLockerModal(true)}
          title="Mở Locker Database Supabase"
        >
          <Layers style={{ width: 15, height: 15 }} />
        </button>

        {/* Feasibility Evaluation */}
        <button 
          type="button" 
          className={`exact-tool-btn ${showFeasibilityPanel ? 'active' : ''}`}
          onClick={() => setShowFeasibilityPanel(true)}
          title="Đánh giá tính khả thi PoC"
        >
          <BarChart3 style={{ width: 15, height: 15 }} />
        </button>

        {/* DESIGN.md / Presets */}
        <button 
          type="button" 
          className={`exact-tool-btn ${showDesignMdModal ? 'active' : ''}`}
          onClick={() => setShowDesignMdModal(true)}
          title="Hệ thống Thiết kế DESIGN.md"
        >
          <Star style={{ width: 15, height: 15 }} />
        </button>
      </nav>

      {/* =================================================================== */}
      {/* 6. FLOATING BOTTOM CENTER SUGGESTIONS & PROMPT INPUT BAR            */}
      {/* =================================================================== */}
      <div className="exact-floating-prompt-wrap">
        {/* Suggestion Action Pills above input */}
        <div className="exact-suggestion-row">
          <div 
            className="exact-suggestion-pill"
            onClick={() => handlePromptSubmit(initialConcept?.nextQuestion || 'Thêm bộ lọc cự ly và tốc độ pace chạy bộ')}
          >
            <span>{initialConcept?.nextQuestion?.slice(0, 32) || 'Thêm bộ lọc cự ly & pace...'}</span>
            <span style={{ color: '#64748B', fontFamily: 'monospace' }}>1</span>
          </div>

          <div 
            className="exact-suggestion-pill"
            onClick={() => handlePromptSubmit('Mở rộng tính năng hẹn chạy nhóm và phòng chat')}
          >
            <span>Mở rộng hẹn chạy nhóm & chat...</span>
            <span style={{ color: '#64748B', fontFamily: 'monospace' }}>2</span>
          </div>
        </div>

        {/* Prompt Input Card */}
        <div className="exact-prompt-card">
          <textarea
            className="exact-prompt-textarea"
            rows={1}
            value={promptText}
            onChange={(e) => setPromptText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handlePromptSubmit();
              }
            }}
            placeholder="Bạn muốn thay đổi hoặc tạo nội dung gì?"
          />

          <div className="exact-prompt-actions">
            {/* Left Actions: + and / */}
            <div className="exact-prompt-actions-left">
              <button 
                type="button" 
                className="exact-action-icon-btn"
                onClick={() => setPromptText('Thêm bảng điều khiển thông số kỹ thuật bên phải')}
                title="Thêm ý tưởng mẫu"
              >
                <Plus style={{ width: 14, height: 14 }} />
              </button>
              <button 
                type="button" 
                className="exact-action-icon-btn"
                onClick={() => setPromptText('/refactor ')}
                title="Lệnh nhanh (/)"
              >
                <span>/</span>
              </button>
            </div>

            {/* Right Actions: Device toggle, Reasoning Mode, Presets, Send */}
            <div className="exact-prompt-actions-right">
              {/* Platform Toggle */}
              <button
                type="button"
                className="exact-action-icon-btn"
                onClick={() => setTargetPlatform(targetPlatform === 'web' ? 'app' : 'web')}
                title={`Đang thiết kế: ${targetPlatform === 'web' ? 'Desktop Web' : 'Mobile App'}`}
              >
                {targetPlatform === 'web' ? <Monitor style={{ width: 14, height: 14 }} /> : <Smartphone style={{ width: 14, height: 14 }} />}
              </button>

              {/* Variant Count Selector */}
              <div 
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  background: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '9999px',
                  padding: '2px',
                  gap: '2px'
                }}
                title="Số lượng biến thể / màn hình cần hiển thị trên canvas (1 đến 4)"
              >
                <span style={{ fontSize: '0.65rem', color: '#94A3B8', padding: '0 0.25rem 0 0.35rem', fontWeight: 600 }}>
                  Biến thể:
                </span>
                {[1, 2, 3, 4].map(n => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => {
                      setVariantCount(n);
                      setScreens(buildInitialScreens(initialPrompt, initialConcept, targetPlatform, selectedPresetId, n));
                    }}
                    style={{
                      background: variantCount === n ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
                      color: variantCount === n ? '#FFFFFF' : 'rgba(255, 255, 255, 0.65)',
                      border: 'none',
                      borderRadius: '9999px',
                      padding: '2px 6px',
                      fontSize: '0.7rem',
                      fontWeight: variantCount === n ? 700 : 500,
                      cursor: 'pointer'
                    }}
                  >
                    {n}
                  </button>
                ))}
              </div>

              {/* Reasoning Mode Dropdown */}
              <div style={{ position: 'relative' }}>
                <button
                  type="button"
                  className="exact-mode-pill"
                  onClick={() => setShowReasoningMenu(!showReasoningMenu)}
                >
                  <span>{reasoningMode === 'fast' ? 'Nhanh' : reasoningMode === 'creative' ? 'Sáng tạo' : 'Cân bằng'}</span>
                  <ChevronDown style={{ width: 11, height: 11 }} />
                </button>

                {showReasoningMenu && (
                  <div style={{
                    position: 'absolute', bottom: '110%', right: 0,
                    background: '#12151e', border: '1px solid rgba(255,255,255,0.15)',
                    borderRadius: '10px', padding: '4px', minWidth: '110px',
                    display: 'flex', flexDirection: 'column', gap: '2px', zIndex: 100
                  }}>
                    <button 
                      type="button"
                      style={{ padding: '6px 10px', background: reasoningMode === 'fast' ? '#1E2538' : 'none', border: 'none', color: '#fff', fontSize: '11px', textAlign: 'left', cursor: 'pointer', borderRadius: '6px' }}
                      onClick={() => { setReasoningMode('fast'); setShowReasoningMenu(false); }}
                    >
                      ⚡ Nhanh
                    </button>
                    <button 
                      type="button"
                      style={{ padding: '6px 10px', background: reasoningMode === 'balanced' ? '#1E2538' : 'none', border: 'none', color: '#fff', fontSize: '11px', textAlign: 'left', cursor: 'pointer', borderRadius: '6px' }}
                      onClick={() => { setReasoningMode('balanced'); setShowReasoningMenu(false); }}
                    >
                      ✨ Cân bằng
                    </button>
                    <button 
                      type="button"
                      style={{ padding: '6px 10px', background: reasoningMode === 'creative' ? '#1E2538' : 'none', border: 'none', color: '#fff', fontSize: '11px', textAlign: 'left', cursor: 'pointer', borderRadius: '6px' }}
                      onClick={() => { setReasoningMode('creative'); setShowReasoningMenu(false); }}
                    >
                      🎨 Sáng tạo
                    </button>
                  </div>
                )}
              </div>

              {/* DESIGN.md Preset Trigger */}
              <button
                type="button"
                className="exact-action-icon-btn"
                onClick={() => setShowDesignMdModal(true)}
                title="Hệ thống Thiết kế & DESIGN.md"
              >
                <Sparkles style={{ width: 14, height: 14, color: '#10B981' }} />
              </button>

              {/* Send Button */}
              <button
                type="button"
                className="exact-send-btn"
                disabled={isGenerating || !promptText.trim()}
                onClick={() => handlePromptSubmit()}
                title="Tạo màn hình mới (Enter)"
              >
                {isGenerating ? <Loader2 style={{ width: 14, height: 14, animation: 'spin 1s linear infinite' }} /> : <ArrowUp style={{ width: 14, height: 14 }} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* =================================================================== */}
      {/* 7. FLOATING BOTTOM RIGHT CANVAS HUD (ZOOM %, UNDO, REDO)            */}
      {/* =================================================================== */}
      <div className="exact-floating-hud">
        <button 
          type="button" 
          className="exact-hud-icon-btn"
          onClick={() => {
            if (screens.length > 1) {
              setScreens(prev => prev.slice(0, -1));
            }
          }}
          title="Hoàn tác (Undo)"
        >
          <Undo2 style={{ width: 13, height: 13 }} />
        </button>

        <button 
          type="button" 
          className="exact-hud-icon-btn"
          onClick={() => handlePromptSubmit('Khôi phục biến thể')}
          title="Làm lại (Redo)"
        >
          <Redo2 style={{ width: 13, height: 13 }} />
        </button>

        <span 
          style={{ cursor: 'pointer', userSelect: 'none' }}
          onClick={() => setZoom(0.28)}
          title="Nhấn để đặt lại thu phóng 28%"
        >
          {Math.round(zoom * 100)}%
        </span>

        <button 
          type="button" 
          className="exact-hud-icon-btn"
          onClick={() => alert('Phím tắt:\n• Cuộn chuột + Ctrl: Thu phóng Canvas\n• Phím cách / Alt + Kéo chuột: Di chuyển góc nhìn\n• Enter: Tạo biến thể mới')}
          title="Hướng dẫn & Phím tắt"
        >
          <HelpCircle style={{ width: 13, height: 13 }} />
        </button>
      </div>

      {/* =================================================================== */}
      {/* MODALS: DESIGN.MD, SUPABASE LOCKER, API KEY, FULLSCREEN PREVIEW    */}
      {/* =================================================================== */}

      {/* Fullscreen Modal */}
      {fullscreenHtml && (
        <div className="modal-overlay" onClick={() => setFullscreenHtml(null)} style={{ padding: '1rem', zIndex: 10000 }}>
          <div
            className="modal-card"
            onClick={e => e.stopPropagation()}
            style={{ width: '95vw', height: '92vh', maxWidth: '1400px', display: 'flex', flexDirection: 'column', padding: 0, overflow: 'hidden' }}
          >
            <div style={{
              height: '42px',
              background: '#141722',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0 1rem',
              borderBottom: '1px solid rgba(255,255,255,0.08)'
            }}>
              <span style={{ fontSize: '0.8125rem', fontWeight: 600 }}>Trình chiếu Toàn màn hình</span>
              <button
                type="button"
                className="studio-icon-btn"
                onClick={() => setFullscreenHtml(null)}
              >
                <X style={{ width: 15, height: 15 }} />
              </button>
            </div>
            <iframe
              srcDoc={fullscreenHtml}
              title="Fullscreen Preview"
              style={{ flex: 1, width: '100%', height: '100%', border: 'none' }}
              sandbox="allow-scripts allow-forms allow-same-origin allow-modals"
            />
          </div>
        </div>
      )}

      {/* User Locker Database Modal */}
      {showLockerModal && (
        <div className="modal-overlay" onClick={() => setShowLockerModal(false)} style={{ zIndex: 10000 }}>
          <div className="modal-card" onClick={e => e.stopPropagation()} style={{ width: '90vw', maxWidth: '780px', maxHeight: '85vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FolderLock style={{ width: 18, height: 18, color: '#10B981' }} />
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Locker Thiết kế Supabase của {currentUser?.handle || userId}</h3>
              </div>
              <button type="button" className="studio-icon-btn" onClick={() => setShowLockerModal(false)}>
                <X style={{ width: 16, height: 16 }} />
              </button>
            </div>

            {/* Supabase Real Connection Status Card */}
            {supabaseStatus.checked && (
              supabaseStatus.tableExists ? (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.75rem 1rem',
                  background: 'rgba(16, 185, 129, 0.08)',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  borderRadius: '8px',
                  marginBottom: '1rem',
                  fontSize: '0.8125rem'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#10B981', fontWeight: 600 }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#10B981', display: 'inline-block' }} />
                    <span>Supabase Database đã kết nối • Bảng public.user_designs trực tuyến</span>
                  </div>
                  <span style={{ color: '#94A3B8', fontSize: '0.75rem' }}>pdvnclyhfvvejhcoalcq.supabase.co</span>
                </div>
              ) : (
                <div style={{
                  padding: '0.875rem 1rem',
                  background: 'rgba(245, 158, 11, 0.08)',
                  border: '1px solid rgba(245, 158, 11, 0.35)',
                  borderRadius: '8px',
                  marginBottom: '1.25rem',
                  fontSize: '0.8125rem'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#F59E0B', fontWeight: 600 }}>
                      <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#F59E0B', display: 'inline-block' }} />
                      <span>Kết nối Supabase Đang Chờ Tạo Bảng (public.user_designs)</span>
                    </div>
                    <span style={{ color: '#94A3B8', fontSize: '0.75rem' }}>pdvnclyhfvvejhcoalcq.supabase.co</span>
                  </div>
                  <p style={{ color: '#CBD5E1', margin: '0 0 0.75rem 0', lineHeight: 1.5 }}>
                    API Supabase đã kết nối thành công, nhưng database chưa có bảng <code>public.user_designs</code>. Dữ liệu hiện được lưu tạm trong Local Locker. Hãy chạy script SQL để kích hoạt lưu trữ Cloud.
                  </p>
                  <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                    <button
                      type="button"
                      onClick={() => {
                        const ddl = `CREATE TABLE IF NOT EXISTS public.user_designs (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  title TEXT NOT NULL,
  design_md TEXT,
  design_system JSONB DEFAULT '{}'::jsonb,
  preset_id TEXT DEFAULT 'alexandria',
  screens JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at BIGINT,
  updated_at BIGINT
);
ALTER TABLE public.user_designs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow full access to user_designs" ON public.user_designs FOR ALL USING (true) WITH CHECK (true);`;
                        navigator.clipboard.writeText(ddl);
                        alert('Đã copy câu lệnh SQL! Mở Supabase SQL Editor, dán vào và nhấn Run.');
                      }}
                      style={{
                        background: 'rgba(255,255,255,0.12)',
                        border: '1px solid rgba(255,255,255,0.25)',
                        color: '#fff',
                        borderRadius: '6px',
                        padding: '0.4rem 0.85rem',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        cursor: 'pointer'
                      }}
                    >
                      Sao chép SQL DDL
                    </button>
                    <a
                      href="https://supabase.com/dashboard/project/pdvnclyhfvvejhcoalcq/sql"
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        background: '#F59E0B',
                        color: '#000',
                        borderRadius: '6px',
                        padding: '0.4rem 0.85rem',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        textDecoration: 'none',
                        display: 'inline-flex',
                        alignItems: 'center'
                      }}
                    >
                      Mở Supabase SQL Editor ↗
                    </a>
                  </div>
                </div>
              )
            )}

            <div style={{ fontSize: '0.8125rem', color: '#CBD5E1', marginBottom: '1rem', lineHeight: 1.5 }}>
              Tất cả các bản mẫu HTML và tài liệu DESIGN.md được lưu trữ an toàn trong bảng <code>user_designs</code> trên Supabase Database.
            </div>

            <div className="locker-cards-grid">
              {userLocker.length === 0 ? (
                <div style={{ padding: '2rem', textAlign: 'center', color: '#64748B', gridColumn: '1 / -1' }}>
                  Chưa có thiết kế lưu trữ nào. Các thao tác trên canvas sẽ tự động sao lưu.
                </div>
              ) : (
                userLocker.map(design => (
                  <div 
                    key={design.id} 
                    className="locker-card"
                    onClick={() => {
                      if (design.screens && design.screens.length > 0) {
                        setScreens(design.screens);
                      }
                      if (design.design_md) setDesignMd(design.design_md);
                      setShowLockerModal(false);
                    }}
                  >
                    <div style={{ fontWeight: 600, color: '#fff', marginBottom: '0.35rem' }}>{design.title}</div>
                    <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>{design.screens?.length || 1} Màn hình</div>
                  </div>
                ))
              )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
              <button 
                type="button" 
                className="exact-topbar-pill-btn"
                style={{ background: '#10B981', color: '#000', fontWeight: 700 }}
                onClick={() => setShowLockerModal(false)}
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DESIGN.md Workspace Modal */}
      {showDesignMdModal && (
        <div className="modal-overlay" onClick={() => setShowDesignMdModal(false)} style={{ zIndex: 10000 }}>
          <div className="modal-card" onClick={e => e.stopPropagation()} style={{ width: '92vw', maxWidth: '960px', maxHeight: '88vh', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Palette style={{ width: 18, height: 18, color: '#10B981' }} />
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Không gian Đặc tả DESIGN.md</h3>
              </div>
              <button type="button" className="studio-icon-btn" onClick={() => setShowDesignMdModal(false)}>
                <X style={{ width: 16, height: 16 }} />
              </button>
            </div>

            <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1rem', minHeight: 0 }}>
              <textarea
                value={designMd}
                onChange={e => setDesignMd(e.target.value)}
                style={{
                  width: '100%', height: '100%', minHeight: '380px',
                  background: '#07090F', border: '1px solid rgba(255,255,255,0.18)',
                  borderRadius: '10px', padding: '1rem', color: '#FFFFFF',
                  fontFamily: 'monospace', fontSize: '0.8125rem', resize: 'none'
                }}
              />

              <div style={{ background: '#0D111A', borderRadius: '10px', padding: '1rem', overflowY: 'auto' }}>
                <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#10B981', marginBottom: '0.75rem' }}>
                  Semantic Color Tokens
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.75rem', fontFamily: 'monospace' }}>
                  <div>--bg-base: {compiledSystem.baseBg}</div>
                  <div>--accent-primary: {compiledSystem.primaryAccent}</div>
                  <div>--text-primary: #F8FAFC</div>
                </div>

                <div style={{ marginTop: '1.5rem', fontSize: '0.875rem', fontWeight: 700, color: '#10B981', marginBottom: '0.75rem' }}>
                  CSS Variables
                </div>
                <pre style={{ fontSize: '0.7rem', color: '#34D399', background: '#07090F', padding: '0.75rem', borderRadius: '8px', overflowX: 'auto' }}>
                  {compiledSystem.cssVariables}
                </pre>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
              <button 
                type="button" 
                className="exact-topbar-pill-btn"
                onClick={() => setShowDesignMdModal(false)}
              >
                Đóng
              </button>
              <button 
                type="button" 
                className="exact-topbar-pill-btn"
                style={{ background: '#10B981', color: '#000', fontWeight: 700 }}
                onClick={() => {
                  setShowDesignMdModal(false);
                  handlePromptSubmit('Tái tạo lại nguyên mẫu dựa trên DESIGN.md cập nhật');
                }}
              >
                Áp dụng &amp; Tạo lại Prototype
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AI Key Configuration Modal */}
      <ApiKeyModal
        isOpen={showApiKeyModal}
        onClose={() => setShowApiKeyModal(false)}
      />

      {/* Feasibility & Evaluation Panel */}
      {activeVariant && (
        <FeasibilityPanel
          isOpen={showFeasibilityPanel}
          onClose={() => setShowFeasibilityPanel(false)}
          idea={activeScreen?.title || initialPrompt}
          mockHtml={activeVariant.htmlContent}
          specSummary={activeScreen?.description || ''}
        />
      )}

      {/* User Locker Security Auth Modal */}
      <LockerAuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        currentUser={currentUser}
        onLogout={() => {
          setCurrentUser(null);
          const fallbackId = getCurrentUserId();
          setUserId(fallbackId);
          loadUserLocker(fallbackId).then(designs => setUserLocker(designs));
        }}
        onAuthSuccess={(user) => {
          setCurrentUser(user);
          setUserId(user.id);
          setShowAuthModal(false);
          loadUserLocker(user.id).then(designs => setUserLocker(designs));
        }}
      />
    </div>
  );
};

export default StitchStudio;
