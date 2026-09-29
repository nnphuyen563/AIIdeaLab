import React, { useState, useEffect, useRef } from 'react';
import { 
  Menu, 
  Download, 
  Plus, 
  Minus,
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
  X,
  MessageSquare,
  Wrench,
  Compass,
  Sun,
  Moon,
  TestTube,
  LogOut
} from '../ui/icons/CyberIcons';
import { ApiKeyModal } from '../settings/ApiKeyModal';
import { FeasibilityPanel } from '../feasibility/FeasibilityPanel';
import { AiFeatureValidatorDrawer } from '../validator/AiFeatureValidatorDrawer';
import { 
  AppConceptResult, 
  CanvasScreen,
  STITCH_PRESETS,
  compileDesignSystem,
  generateProceduralDesignMd,
  synthesizePrototypeHtml,
  generateAppConcept,
  chatWithCanvasCopilot,
  CanvasCopilotAction,
  CanvasScreenChatMessage,
  AiFeatureIoSpec,
  generateAiFeatureValidation,
  detectAiFeatures,
  generateContinuationScreen,
  performAiHealthCheck,
  AiHealthCheckResult
} from '../../services/aiService';
import { 
  UserDesign, 
  getCurrentUserId, 
  saveDesignToLocker, 
  loadUserLocker, 
  getCurrentAuthUser,
  AuthUser,
  checkSupabaseTableStatus,
  logoutUser
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
  theme?: 'dark' | 'light';
  onToggleTheme?: () => void;
  onBackToHero?: () => void;
  onLogout?: () => void;
}

export const StitchStudio: React.FC<StitchStudioProps> = ({
  initialPrompt = 'Retro Pong Hero Section',
  initialConcept,
  initialPresetId,
  initialCustomDesignMd,
  initialVariantCount = 3,
  theme = 'dark',
  onToggleTheme,
  onBackToHero,
  onLogout
}) => {
  const [promptText, setPromptText] = useState('');
  const [variantCount, setVariantCount] = useState<number>(initialVariantCount);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [showFeasibilityPanel, setShowFeasibilityPanel] = useState(false);
  const [toolMode, setToolMode] = useState<'select' | 'frame' | 'pen' | 'pan' | 'layers' | 'chat' | 'presets'>('select');

  // ====== DYNAMIC PROTOTYPE SCALE & NEW SCREEN FRAME STATE ======
  const [prototypeScale, setPrototypeScale] = useState<number>(1.0); // 0.75x, 1.0x, 1.25x, 1.5x
  const [screenDeviceModes, setScreenDeviceModes] = useState<Record<string, 'mobile' | 'desktop'>>({});
  const [showNewScreenModal, setShowNewScreenModal] = useState(false);
  const [newScreenInputText, setNewScreenInputText] = useState('');
  const [isGeneratingContinuation, setIsGeneratingContinuation] = useState(false);

  // ====== AI FEATURE VALIDATOR & SYNTHETIC TESTBENCH STATE ======
  const [showAiValidatorDrawer, setShowAiValidatorDrawer] = useState(false);
  const [aiFeatureSpec, setAiFeatureSpec] = useState<AiFeatureIoSpec | null>(null);
  const [detectedAi, setDetectedAi] = useState<{ hasAiFeature: boolean; featureName: string; confidence: number }>(() => detectAiFeatures(initialPrompt));
  const [, setIsValidatingAi] = useState(false);

  // Auto-detect and pre-generate AI Feature Validation when prompt or concept changes
  useEffect(() => {
    const det = detectAiFeatures(initialPrompt);
    setDetectedAi(det);

    let isMounted = true;
    setIsValidatingAi(true);
    generateAiFeatureValidation(initialPrompt).then(spec => {
      if (isMounted) {
        setAiFeatureSpec(spec);
        setIsValidatingAi(false);
      }
    }).catch(err => {
      console.warn('Failed to pre-generate AI validation:', err);
      if (isMounted) setIsValidatingAi(false);
    });

    return () => {
      isMounted = false;
    };
  }, [initialPrompt]);

  // ====== PROACTIVE AI HEALTH CHECK STATE ======
  const [aiHealth, setAiHealth] = useState<AiHealthCheckResult | null>(null);
  const [isCheckingAiHealth, setIsCheckingAiHealth] = useState<boolean>(true);

  useEffect(() => {
    let active = true;
    setIsCheckingAiHealth(true);
    performAiHealthCheck().then(res => {
      if (active) {
        setAiHealth(res);
        setIsCheckingAiHealth(false);
      }
    }).catch(err => {
      if (active) {
        setAiHealth({
          ok: false,
          provider: 'gemini',
          model: 'gemini-2.5-flash-lite',
          latencyMs: 0,
          message: err?.message || 'Không thể kiểm tra AI'
        });
        setIsCheckingAiHealth(false);
      }
    });

    return () => {
      active = false;
    };
  }, []);

  // Canvas Pan & Zoom State (Matches 22% in screenshot)
  const [zoom, setZoom] = useState<number>(0.28);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 340, y: 140 });
  const [isPanning, setIsPanning] = useState(false);
  const startPanRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLElement | null>(null);
  const panRef = useRef(pan);
  const zoomRef = useRef(zoom);

  useEffect(() => {
    panRef.current = pan;
  }, [pan]);

  useEffect(() => {
    zoomRef.current = zoom;
  }, [zoom]);

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

  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef<HTMLDivElement | null>(null);

  const handleStudioLogout = async () => {
    await logoutUser();
    setCurrentUser(null);
    setShowAuthModal(false);
    setShowUserMenu(false);
    if (onLogout) {
      onLogout();
    } else if (onBackToHero) {
      onBackToHero();
    }
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setShowUserMenu(false);
      }
    };
    if (showUserMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showUserMenu]);

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

    const lowerPrompt = prompt.toLowerCase();
    let stepMetadata: { step: number; title: string; desc: string; screenIdx: number; x: number }[] = [];

    if (lowerPrompt.includes('claim') || lowerPrompt.includes('receipt') || lowerPrompt.includes('hóa đơn') || lowerPrompt.includes('approval') || lowerPrompt.includes('duyệt') || lowerPrompt.includes('expense')) {
      stepMetadata = [
        {
          step: 1,
          title: `${mainTitle} - Bảng điều khiển & Tải hóa đơn`,
          desc: concept?.summary || 'Bảng theo dõi tỷ lệ tự động duyệt, vùng quét hóa đơn OCR và danh sách yêu cầu mới.',
          screenIdx: 0,
          x: 0
        },
        {
          step: 2,
          title: `${mainTitle} - Chi tiết Trích xuất & Đối chiếu`,
          desc: 'Xem trước hóa đơn song song với dữ liệu bóc tách, đối chiếu chính sách chi tiêu.',
          screenIdx: 1,
          x: 560
        },
        {
          step: 3,
          title: `${mainTitle} - Cấu hình Quy tắc Tự động duyệt`,
          desc: 'Bộ quy tắc nghiệp vụ: hạn mức phê duyệt tự động, nhà cung cấp tin cậy và bộ lọc rủi ro.',
          screenIdx: 2,
          x: 1120
        },
        {
          step: 4,
          title: `${mainTitle} - Kiểm toán & Lịch sử Phê duyệt`,
          desc: 'Nhật ký audit trail, xuất báo cáo tài chính và phân tích xu hướng chi phí.',
          screenIdx: 3,
          x: 1680
        }
      ];
    } else if (
      (lowerPrompt.includes('pacemate') || lowerPrompt.includes('chạy bộ') || lowerPrompt.includes('marathon') || (lowerPrompt.includes('tinder') && (lowerPrompt.includes('run') || lowerPrompt.includes('chạy'))) || (lowerPrompt.includes('runner') && !lowerPrompt.includes('test') && !lowerPrompt.includes('task'))) &&
      !lowerPrompt.includes('claim') && !lowerPrompt.includes('receipt') && !lowerPrompt.includes('hóa đơn') && !lowerPrompt.includes('expense') && !lowerPrompt.includes('approval') && !lowerPrompt.includes('duyệt')
    ) {
      stepMetadata = [
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
          title: `${mainTitle} - Hồ sơ Runner`,
          desc: 'Thành tích cá nhân, theo dõi số km tích lũy và cài đặt ghép đôi.',
          screenIdx: 2,
          x: 1120
        },
        {
          step: 4,
          title: `${mainTitle} - Hẹn lịch & Trò chuyện`,
          desc: 'Hội thoại trực tiếp với bạn chạy và xác nhận lịch hẹn chạy bộ.',
          screenIdx: 3,
          x: 1680
        }
      ];
    } else {
      stepMetadata = [
        {
          step: 1,
          title: mainTitle,
          desc: concept?.summary || 'Không gian làm việc chính và các tác vụ tương tác cốt lõi của hệ thống.',
          screenIdx: 0,
          x: 0
        },
        {
          step: 2,
          title: `${mainTitle} - Chi tiết Dữ liệu & Xử lý`,
          desc: 'Bảng phân tích chuyên sâu, các bộ lọc nâng cao và quy trình hoàn thành công việc.',
          screenIdx: 1,
          x: 560
        },
        {
          step: 3,
          title: `${mainTitle} - Quản lý Danh sách & Tiến trình`,
          desc: 'Tổng hợp danh sách hồ sơ, trạng thái thực thi và lịch sử tương tác người dùng.',
          screenIdx: 2,
          x: 1120
        },
        {
          step: 4,
          title: `${mainTitle} - Cấu hình & Báo cáo Tổng quan`,
          desc: 'Cài đặt tham số vận hành, quản trị phân quyền và trích xuất số liệu phân tích.',
          screenIdx: 3,
          x: 1680
        }
      ];
    }

    const screenDefs = stepMetadata;

    return screenDefs.slice(0, safeCount).map(def => {
      const isSlopHtml = Boolean(concept?.mockHtml && (concept.mockHtml.includes('<select') || concept.mockHtml.includes('type="file"')));
      const v1Html = (def.screenIdx === 0 && concept?.mockHtml && !isSlopHtml)
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
  const activeScreen = screens.find(s => s.id === activeScreenId) || null;
  const activeVariant = activeScreen?.variants.find(v => v.id === activeScreen.activeVariantId) || activeScreen?.variants[0] || null;

  // ====== CANVAS CONTEXT COPILOT STATE ======
  const [screenChatThreads, setScreenChatThreads] = useState<Record<string, CanvasScreenChatMessage[]>>({});
  const [activeCopilotAction, setActiveCopilotAction] = useState<CanvasCopilotAction>('chat');
  const [showCanvasInspector, setShowCanvasInspector] = useState(false);
  const [isCopilotLoading, setIsCopilotLoading] = useState(false);
  const [drawerInputText, setDrawerInputText] = useState('');
  const [inspectorActiveTab, setInspectorActiveTab] = useState<'chat' | 'usability' | 'feasibility'>('chat');

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

  // Native non-passive Wheel listener to smoothly zoom/pan canvas ONLY (never zoom the whole page)
  useEffect(() => {
    const canvasEl = canvasRef.current;
    if (!canvasEl) return;

    const handleCanvasWheelNative = (e: WheelEvent) => {
      // CRITICAL: Stop the browser from zooming or scrolling the whole HTML document/page
      e.preventDefault();
      e.stopPropagation();

      const rect = canvasEl.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      // Pinch-to-zoom on touchpad or Ctrl/Meta/Alt + Mouse Wheel
      if (e.ctrlKey || e.metaKey || e.altKey) {
        const delta = -e.deltaY;
        const factor = delta > 0 ? 1.08 : 0.92;
        const currentZoom = zoomRef.current;
        const newZoom = Math.min(Math.max(0.1, +(currentZoom * factor).toFixed(3)), 2.5);

        if (newZoom !== currentZoom) {
          const scaleRatio = newZoom / currentZoom;
          const currentPan = panRef.current;
          // Zoom toward mouse pointer
          const newPanX = mouseX - (mouseX - currentPan.x) * scaleRatio;
          const newPanY = mouseY - (mouseY - currentPan.y) * scaleRatio;

          setZoom(newZoom);
          setPan({ x: newPanX, y: newPanY });
        }
      } else {
        // Standard mouse wheel over canvas: pan the canvas smoothly
        setPan(prev => ({
          x: prev.x - (e.shiftKey ? e.deltaY : e.deltaX),
          y: prev.y - (e.shiftKey ? 0 : e.deltaY)
        }));
      }
    };

    // { passive: false } allows e.preventDefault() to actually prevent native browser page zoom
    canvasEl.addEventListener('wheel', handleCanvasWheelNative, { passive: false });

    return () => {
      canvasEl.removeEventListener('wheel', handleCanvasWheelNative);
    };
  }, []);

  // Global keyboard shortcuts to zoom/reset canvas without zooming entire browser window
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if user is typing in an input or textarea
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) {
        return;
      }

      if (e.ctrlKey || e.metaKey) {
        if (e.key === '=' || e.key === '+') {
          e.preventDefault();
          e.stopPropagation();
          setZoom(z => Math.min(2.5, +(z + 0.05).toFixed(2)));
        } else if (e.key === '-' || e.key === '_') {
          e.preventDefault();
          e.stopPropagation();
          setZoom(z => Math.max(0.1, +(z - 0.05).toFixed(2)));
        } else if (e.key === '0') {
          e.preventDefault();
          e.stopPropagation();
          setZoom(0.28);
          setPan({ x: 340, y: 140 });
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown, { passive: false });
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Trigger regeneration or new variant
  const handlePromptSubmit = async (customText?: string) => {
    const textToSubmit = customText || promptText;
    if (!textToSubmit.trim() || isGenerating) return;

    setIsGenerating(true);

    try {
      // Ensure additive/continuation prompts preserve root project domain context
      const lowerText = textToSubmit.toLowerCase();
      const lowerInit = initialPrompt.toLowerCase();
      const hasRootContext = lowerText.includes(lowerInit.slice(0, 15)) || 
        (lowerInit.includes('claim') && (lowerText.includes('claim') || lowerText.includes('hóa đơn') || lowerText.includes('approval') || lowerText.includes('duyệt'))) ||
        (lowerInit.includes('runner') && (lowerText.includes('runner') || lowerText.includes('chạy bộ')));

      const contextualPrompt = hasRootContext 
        ? textToSubmit 
        : `${initialPrompt} - ${textToSubmit}`;

      // Call real AI service to generate prototype dynamically
      const generated = await generateAppConcept(
        contextualPrompt,
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
      const newTitle = `${initialPrompt} - ${textToSubmit.slice(0, 32)}`;

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

  // ====== CONTINUATION SCREEN CREATOR (FEEDS SELECTED CANVAS CONTEXT) ======
  const handleCreateContinuationScreen = async () => {
    if (!newScreenInputText.trim() || isGeneratingContinuation) return;
    setIsGeneratingContinuation(true);
    try {
      const parentScreen = activeScreen || screens[screens.length - 1] || null;
      const parentVariant = parentScreen?.variants.find(v => v.id === parentScreen.activeVariantId) || parentScreen?.variants[0] || null;
      const nextStep = screens.length + 1;

      // Position new screen right after the rightmost screen
      const lastX = screens.reduce((max, s) => Math.max(max, s.position.x), 0);
      const isMobile = (parentScreen && (screenDeviceModes[parentScreen.id] || parentScreen.deviceMode) === 'mobile');
      const baseWidth = isMobile ? 390 : 540;
      const nextX = lastX + Math.round(baseWidth * prototypeScale) + 50;

      const result = await generateContinuationScreen({
        newScreenPrompt: newScreenInputText.trim(),
        selectedScreenTitle: parentScreen?.title || initialPrompt,
        selectedScreenHtml: parentVariant?.htmlContent || '',
        selectedScreenDescription: parentScreen?.description,
        selectedFlowStep: parentScreen?.flowStep || 1,
        platform: targetPlatform,
        presetId: selectedPresetId,
        designMd
      });

      const newVarId = `var_${Date.now()}`;
      const newScreenId = `screen_${Date.now()}`;

      const newScreen: CanvasScreen = {
        id: newScreenId,
        flowStep: nextStep,
        title: result.title,
        description: result.description,
        deviceMode: targetPlatform === 'app' ? 'mobile' : 'desktop',
        position: { x: nextX, y: 0 },
        activeVariantId: newVarId,
        variants: [
          {
            id: newVarId,
            name: `v1 - Tiếp nối (${result.title.slice(0, 20)})`,
            htmlContent: result.htmlContent,
            designTokens: result.designTokens,
            summary: result.summary,
            createdAt: Date.now()
          }
        ]
      };

      setScreens(prev => [...prev, newScreen]);
      setActiveScreenId(newScreenId);
      setShowNewScreenModal(false);
      setNewScreenInputText('');

      // Auto-pan canvas to focus on newly created screen
      setPan({ x: -nextX * zoom + 350, y: 140 });

      // Auto-save to Supabase locker
      saveDesignToLocker({
        id: activeDesignId,
        user_id: userId,
        title: initialPrompt,
        design_md: designMd,
        preset_id: selectedPresetId,
        screens: [...screens, newScreen],
        created_at: Date.now()
      }).catch(err => console.warn('Locker sync warning:', err));

    } catch (err: any) {
      console.error('Failed to create continuation screen:', err);
      alert('Lỗi tạo màn hình mới: ' + (err.message || 'Không thể kết nối API'));
    } finally {
      setIsGeneratingContinuation(false);
    }
  };

  // ====== GRILL ME CONTEXT EXTRACTION ======
  const getGrillMeContextSummary = (): string => {
    const parts: string[] = [];
    if (initialConcept?.summary) {
      parts.push(`Ý đồ sản phẩm: ${initialConcept.summary}`);
    }
    if (aiFeatureSpec) {
      parts.push(`Tính năng AI: ${aiFeatureSpec.featureName} (Mức cần thiết: ${aiFeatureSpec.aiNecessityScore}/100)`);
      if (aiFeatureSpec.failureAndRisk) {
        parts.push(`Rủi ro & Dung sai lỗi: Ảo giác=${aiFeatureSpec.failureAndRisk.hallucinationRisk}, ${aiFeatureSpec.failureAndRisk.safetyConsiderations}`);
      }
      const answered = aiFeatureSpec.grillMeQuestions?.filter(q => q.userAnswer) || [];
      if (answered.length > 0) {
        parts.push('Ngữ cảnh đã làm rõ từ phỏng vấn Grill Me:');
        answered.forEach(q => {
          parts.push(`• Câu hỏi: "${q.question}" -> Người dùng chốt: "${q.userAnswer}"`);
        });
      }
    }
    return parts.join('\n');
  };

  // ====== CANVAS CONTEXT COPILOT HANDLERS ======
  const handleCanvasCopilotSubmit = async (promptOverride?: string, actionOverride?: CanvasCopilotAction) => {
    if (!activeScreen || !activeVariant) return;

    const actionToRun = actionOverride || activeCopilotAction;
    const isFromDrawer = Boolean(drawerInputText.trim());
    const textPrompt = promptOverride !== undefined ? promptOverride : (drawerInputText || promptText);

    if (actionToRun === 'chat' && !textPrompt.trim()) return;

    setIsCopilotLoading(true);

    const userMsgId = `msg_${Date.now()}`;
    const userMessage: CanvasScreenChatMessage = {
      id: userMsgId,
      role: 'user',
      content: textPrompt || (actionToRun === 'usability' ? 'Đánh giá tính dễ dùng (Usability) của màn hình này' : actionToRun === 'feasibility' ? 'Đánh giá tính khả thi và hướng dẫn cách làm (How-To) cho non-tech' : 'Thiết kế lại màn hình này'),
      timestamp: Date.now(),
      action: actionToRun
    };

    setScreenChatThreads(prev => ({
      ...prev,
      [activeScreen.id]: [...(prev[activeScreen.id] || []), userMessage]
    }));

    setPromptText('');
    setDrawerInputText('');
    
    // When executing usability or feasibility, or when chatting inside the drawer:
    // ALWAYS open/keep the drawer open!
    if (actionToRun === 'usability' || actionToRun === 'feasibility' || isFromDrawer) {
      setShowCanvasInspector(true);
      if (actionToRun === 'usability') setInspectorActiveTab('usability');
      else if (actionToRun === 'feasibility') setInspectorActiveTab('feasibility');
      else setInspectorActiveTab('chat');
    }

    try {
      const historyForApi = (screenChatThreads[activeScreen.id] || []).map(m => ({
        role: m.role,
        content: m.content
      }));

      const response = await chatWithCanvasCopilot(
        activeScreen.title,
        activeVariant.htmlContent,
        textPrompt || activeScreen.title,
        actionToRun,
        targetPlatform,
        selectedPresetId,
        designMd,
        historyForApi,
        initialPrompt,
        initialConcept?.summary,
        getGrillMeContextSummary()
      );

      // Auto-apply redesign directly to active screen variant without requiring manual drawer clicks
      if (response.redesignHtml) {
        applyRedesignReplaceCurrent(response.redesignHtml);
      }

      const assistantMsgId = `asst_${Date.now()}`;
      const assistantMessage: CanvasScreenChatMessage = {
        id: assistantMsgId,
        role: 'assistant',
        content: response.replyText,
        timestamp: Date.now(),
        action: response.action,
        redesignHtml: response.redesignHtml,
        redesignTokens: response.redesignTokens,
        redesignSummary: response.redesignSummary,
        usability: response.usability,
        feasibility: response.feasibility
      };

      setScreenChatThreads(prev => ({
        ...prev,
        [activeScreen.id]: [...(prev[activeScreen.id] || []), assistantMessage]
      }));

      if (actionToRun === 'usability') setInspectorActiveTab('usability');
      else if (actionToRun === 'feasibility') setInspectorActiveTab('feasibility');

    } catch (err) {
      console.error('Canvas copilot interaction error:', err);
      const errMsg: CanvasScreenChatMessage = {
        id: `err_${Date.now()}`,
        role: 'assistant',
        content: 'Có lỗi xảy ra khi xử lý yêu cầu với màn hình này. Vui lòng kiểm tra lại kết nối API hoặc thử lại.',
        timestamp: Date.now()
      };
      setScreenChatThreads(prev => ({
        ...prev,
        [activeScreen.id]: [...(prev[activeScreen.id] || []), errMsg]
      }));
    } finally {
      setIsCopilotLoading(false);
    }
  };

  const handleGenerateThreeVariants = async () => {
    if (!activeScreen) return;
    setIsGenerating(true);
    try {
      const activePreset = STITCH_PRESETS[selectedPresetId] || STITCH_PRESETS.alexandria;
      const count = activeScreen.variants.length;

      const variantConfigs = [
        {
          name: `v${count + 1} - Tối giản & Tinh gọn`,
          summary: 'Phong cách Minimalist: Giản lược viền thẻ, tăng khoảng cách trắng, tập trung vào nội dung chính',
          tokens: [activePreset.baseBg, '#38BDF8', '#FFFFFF']
        },
        {
          name: `v${count + 2} - Tương phản cao & Thể thao`,
          summary: 'Phong cách High-Contrast: Đậm nét, nền đen sâu, điểm nhấn màu vàng chanh/neon rực rỡ',
          tokens: ['#0A0D14', '#F59E0B', '#FFFFFF']
        },
        {
          name: `v${count + 3} - Nút lớn & Tối ưu chạm`,
          summary: 'Phong cách Touch-First: Nút bấm lớn tối thiểu 48px, cỡ chữ lớn, tối ưu thao tác 1 tay',
          tokens: [activePreset.baseBg, '#10B981', '#F8FAFC']
        }
      ];

      const newVariants = variantConfigs.map((cfg, idx) => {
        const newHtml = synthesizePrototypeHtml(
          `${activeScreen.title} (${cfg.summary})`,
          targetPlatform,
          activePreset,
          designMd,
          activeScreen.flowStep,
          count + 1 + idx
        );
        return {
          id: `v${activeScreen.flowStep}_${count + 1 + idx}`,
          name: cfg.name,
          htmlContent: newHtml,
          designTokens: cfg.tokens,
          summary: cfg.summary,
          createdAt: Date.now() + idx
        };
      });

      const updatedScreens = screens.map(s => {
        if (s.id === activeScreen.id) {
          return {
            ...s,
            variants: [...s.variants, ...newVariants],
            activeVariantId: newVariants[0].id
          };
        }
        return s;
      });

      setScreens(updatedScreens);
    } catch (err) {
      console.error('Generate 3 variants error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleApplyColorPaletteToScreen = (presetKey: string) => {
    if (!activeScreen) return;
    const targetPreset = STITCH_PRESETS[presetKey];
    if (!targetPreset) return;

    const count = activeScreen.variants.length;
    const newHtml = synthesizePrototypeHtml(
      activeScreen.title,
      targetPlatform,
      targetPreset,
      designMd,
      activeScreen.flowStep,
      count + 1
    );

    const newVariantId = `v${activeScreen.flowStep}_${count + 1}`;
    const newVariant = {
      id: newVariantId,
      name: `v${count + 1} - Bảng màu ${targetPreset.name}`,
      htmlContent: newHtml,
      designTokens: [targetPreset.baseBg, targetPreset.primaryAccent, '#FFFFFF'],
      summary: `Áp dụng dải màu ${targetPreset.name} (${targetPreset.atmosphere})`,
      createdAt: Date.now()
    };

    const updatedScreens = screens.map(s => {
      if (s.id === activeScreen.id) {
        return {
          ...s,
          variants: [...s.variants, newVariant],
          activeVariantId: newVariantId
        };
      }
      return s;
    });

    setScreens(updatedScreens);
  };

  const applyRedesignAsNewVariant = (redesignHtml: string, summary: string, tokens: string[]) => {
    if (!activeScreen) return;
    const newVariantId = `v${activeScreen.flowStep}_${activeScreen.variants.length + 1}`;
    const newVariant = {
      id: newVariantId,
      name: `v${activeScreen.variants.length + 1} - ${summary.slice(0, 18)}`,
      htmlContent: redesignHtml,
      designTokens: tokens,
      summary,
      createdAt: Date.now()
    };

    const updatedScreens = screens.map(s => {
      if (s.id === activeScreen.id) {
        return {
          ...s,
          variants: [...s.variants, newVariant],
          activeVariantId: newVariantId
        };
      }
      return s;
    });

    setScreens(updatedScreens);

    saveDesignToLocker({
      id: activeDesignId,
      user_id: userId,
      title: initialPrompt,
      design_md: designMd,
      preset_id: selectedPresetId,
      screens: updatedScreens,
      created_at: Date.now()
    }).catch(err => console.warn('Locker save warning:', err));
  };

  const applyRedesignReplaceCurrent = (redesignHtml: string) => {
    if (!activeScreen) return;
    const updatedScreens = screens.map(s => {
      if (s.id === activeScreen.id) {
        return {
          ...s,
          variants: s.variants.map(v => v.id === s.activeVariantId ? { ...v, htmlContent: redesignHtml } : v)
        };
      }
      return s;
    });

    setScreens(updatedScreens);

    saveDesignToLocker({
      id: activeDesignId,
      user_id: userId,
      title: initialPrompt,
      design_md: designMd,
      preset_id: selectedPresetId,
      screens: updatedScreens,
      created_at: Date.now()
    }).catch(err => console.warn('Locker save warning:', err));
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
    <div className="stitch-exact-container">
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
          <span 
            className="exact-doc-title" 
            title={initialPrompt || 'Retro Pong Hero Section'}
          >
            {initialPrompt && initialPrompt.length > 52 ? `${initialPrompt.slice(0, 50)}...` : initialPrompt || 'Retro Pong Hero Section'}
          </span>
        </div>

        {/* Right: Play, Export, Share, User Profile */}
        <div className="exact-topbar-right">
          {/* Live AI Status & Quick Provider Switch Button */}
          <button 
            type="button" 
            className="exact-topbar-pill-btn"
            onClick={() => setShowApiKeyModal(true)}
            title={aiHealth?.message ? `AI Status: ${aiHealth.message}. Bấm để đổi giữa OpenAI / Google Gemini hoặc nạp khóa.` : 'Kiểm tra trạng thái AI'}
            style={{
              background: aiHealth?.ok ? 'rgba(16, 185, 129, 0.12)' : 'rgba(245, 158, 11, 0.12)',
              borderColor: aiHealth?.ok ? 'rgba(16, 185, 129, 0.35)' : 'rgba(245, 158, 11, 0.35)',
              color: aiHealth?.ok ? '#34D399' : '#FBBF24',
              fontWeight: 600,
              whiteSpace: 'nowrap',
              flexShrink: 0,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              cursor: 'pointer'
            }}
          >
            <span style={{
              width: 7,
              height: 7,
              borderRadius: '50%',
              backgroundColor: aiHealth?.ok ? '#10B981' : '#F59E0B',
              boxShadow: aiHealth?.ok ? '0 0 8px #10B981' : '0 0 8px #F59E0B'
            }} />
            <span>
              {isCheckingAiHealth 
                ? 'Đang kiểm tra AI...' 
                : aiHealth?.ok 
                  ? `${aiHealth.provider === 'openai' ? 'OpenAI' : 'Gemini'} Live (${aiHealth.latencyMs}ms)`
                  : 'AI: Chọn OpenAI / Gemini'}
            </span>
          </button>

          {/* Create New Screen Frame Button */}
          <button 
            type="button" 
            className="exact-topbar-pill-btn"
            onClick={() => setShowNewScreenModal(true)}
            style={{
              background: 'rgba(16, 185, 129, 0.15)',
              borderColor: 'rgba(16, 185, 129, 0.4)',
              color: '#34D399',
              fontWeight: 600,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              whiteSpace: 'nowrap',
              flexShrink: 0
            }}
            title="Tạo Màn Hình Mới Tiếp Nối Luồng (Kèm Context Canvas)"
          >
            <Plus style={{ width: 13, height: 13, color: '#10B981' }} />
            <span>+ Màn hình mới</span>
          </button>

          {/* AI Feature Validator Button */}
          <button 
            type="button" 
            className="exact-topbar-pill-btn"
            onClick={() => setShowAiValidatorDrawer(true)}
            title="Thẩm định Tính năng AI: Hợp đồng I/O, Grill Me và Chạy thử nghiệm giả lập"
            style={{
              background: detectedAi.hasAiFeature ? (theme === 'light' ? 'rgba(5, 150, 105, 0.1)' : 'rgba(16, 185, 129, 0.14)') : undefined,
              borderColor: detectedAi.hasAiFeature ? (theme === 'light' ? '#059669' : '#10B981') : undefined,
              color: detectedAi.hasAiFeature ? (theme === 'light' ? '#059669' : '#34D399') : undefined,
              fontWeight: detectedAi.hasAiFeature ? 600 : 500,
              whiteSpace: 'nowrap',
              flexShrink: 0
            }}
          >
            <TestTube style={{ width: 13, height: 13, color: detectedAi.hasAiFeature ? (theme === 'light' ? '#059669' : '#34D399') : '#94A3B8' }} />
            <span>Thẩm định AI {detectedAi.hasAiFeature ? '• Sẵn sàng' : ''}</span>
          </button>

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

          {/* Theme Switcher Button */}
          {onToggleTheme && (
            <button
              type="button"
              className="exact-topbar-pill-btn"
              onClick={onToggleTheme}
              title={theme === 'light' ? 'Chuyển sang giao diện Tối (Dark mode)' : 'Chuyển sang giao diện Sáng (Light mode)'}
              style={{ padding: '0 0.65rem' }}
            >
              {theme === 'light' ? (
                <>
                  <Moon style={{ width: 13, height: 13, color: '#64748B' }} />
                  <span>Tối</span>
                </>
              ) : (
                <>
                  <Sun style={{ width: 13, height: 13, color: '#F59E0B' }} />
                  <span>Sáng</span>
                </>
              )}
            </button>
          )}

          {/* User Locker Profile Avatar & Dropdown */}
          <div ref={userMenuRef} style={{ position: 'relative' }}>
            <button 
              type="button"
              className="exact-avatar-btn"
              onClick={() => {
                if (currentUser) {
                  setShowUserMenu(!showUserMenu);
                } else {
                  setShowAuthModal(true);
                }
              }}
              title={currentUser ? `Tài khoản: ${currentUser.handle} (Nhấp để mở menu / Đăng xuất)` : 'Đăng nhập vào Locker'}
            >
              {(currentUser?.handle || userId).charAt(0).toUpperCase()}
            </button>

            {/* Quick Account Dropdown */}
            {showUserMenu && currentUser && (
              <div
                style={{
                  position: 'absolute',
                  top: 'calc(100% + 8px)',
                  right: 0,
                  width: '240px',
                  background: theme === 'light' ? '#FFFFFF' : '#0E131F',
                  border: theme === 'light' ? '1.5px solid rgba(15, 23, 42, 0.12)' : '1px solid rgba(255, 255, 255, 0.16)',
                  borderRadius: '14px',
                  padding: '0.6rem',
                  boxShadow: '0 20px 50px rgba(0, 0, 0, 0.65)',
                  zIndex: 10000
                }}
              >
                {/* User Info Header */}
                <div style={{
                  padding: '0.5rem 0.6rem 0.6rem',
                  borderBottom: theme === 'light' ? '1px solid rgba(15, 23, 42, 0.08)' : '1px solid rgba(255, 255, 255, 0.08)',
                  marginBottom: '0.4rem'
                }}>
                  <div style={{ fontSize: '0.75rem', color: theme === 'light' ? '#64748B' : '#94A3B8' }}>
                    Tài khoản đang mở
                  </div>
                  <div style={{
                    fontSize: '0.9375rem',
                    fontWeight: 700,
                    color: theme === 'light' ? '#0F172A' : '#F8FAFC',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    marginTop: '2px'
                  }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#10B981' }} />
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {currentUser.handle}
                    </span>
                  </div>
                  {currentUser.email && (
                    <div style={{ fontSize: '0.75rem', color: theme === 'light' ? '#94A3B8' : '#64748B', marginTop: '2px' }}>
                      {currentUser.email}
                    </div>
                  )}
                </div>

                {/* Locker Designs */}
                <button
                  type="button"
                  onClick={() => {
                    setShowUserMenu(false);
                    setShowLockerModal(true);
                  }}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.6rem',
                    padding: '0.5rem 0.6rem',
                    borderRadius: '8px',
                    border: 'none',
                    background: 'transparent',
                    color: theme === 'light' ? '#1E293B' : '#E2E8F0',
                    fontSize: '0.84rem',
                    fontWeight: 500,
                    cursor: 'pointer',
                    textAlign: 'left'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = theme === 'light' ? 'rgba(15, 23, 42, 0.05)' : 'rgba(255, 255, 255, 0.06)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                  }}
                >
                  <FolderLock style={{ width: 14, height: 14, color: '#10B981' }} />
                  <span>Kho lưu trữ Locker</span>
                </button>

                {/* Switch Account */}
                <button
                  type="button"
                  onClick={() => {
                    setShowUserMenu(false);
                    setShowAuthModal(true);
                  }}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.6rem',
                    padding: '0.5rem 0.6rem',
                    borderRadius: '8px',
                    border: 'none',
                    background: 'transparent',
                    color: theme === 'light' ? '#1E293B' : '#E2E8F0',
                    fontSize: '0.84rem',
                    fontWeight: 500,
                    cursor: 'pointer',
                    textAlign: 'left'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = theme === 'light' ? 'rgba(15, 23, 42, 0.05)' : 'rgba(255, 255, 255, 0.06)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                  }}
                >
                  <Star style={{ width: 14, height: 14, color: '#38BDF8' }} />
                  <span>Đổi tài khoản</span>
                </button>

                {/* Logout and return to main screen */}
                <button
                  type="button"
                  onClick={handleStudioLogout}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.6rem',
                    padding: '0.5rem 0.6rem',
                    borderRadius: '8px',
                    border: '1px solid rgba(239, 68, 68, 0.25)',
                    background: 'rgba(239, 68, 68, 0.08)',
                    color: '#EF4444',
                    fontSize: '0.84rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    textAlign: 'left',
                    marginTop: '0.35rem'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(239, 68, 68, 0.18)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(239, 68, 68, 0.08)';
                  }}
                >
                  <LogOut style={{ width: 14, height: 14, color: '#EF4444' }} />
                  <span>Đăng xuất &amp; Về trang chính</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* =================================================================== */}
      {/* 2. INFINITE DOTTED GRID CANVAS WITH HORIZONTAL MULTI-VARIANT CARDS  */}
      {/* =================================================================== */}
      <main 
        ref={canvasRef}
        className={`stitch-exact-canvas ${isPanning || toolMode === 'pan' ? 'panning' : ''}`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        {/* Floating Smart AI Feature Banner */}
        {detectedAi.hasAiFeature && (
          <div 
            className="canvas-ai-feature-pill"
            onClick={() => setShowAiValidatorDrawer(true)}
            title="Nhấn để mở Bảng Thẩm định Tính năng AI & Chạy thử giả lập"
            style={{
              position: 'fixed',
              top: '4.25rem',
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 45,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.65rem',
              padding: '0.45rem 1.15rem',
              background: theme === 'light' ? 'rgba(255, 255, 255, 0.95)' : 'rgba(11, 15, 25, 0.92)',
              border: '1.5px solid #10B981',
              borderRadius: '9999px',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.25)',
              cursor: 'pointer',
              fontFamily: 'var(--font-sans)',
              fontSize: '0.8125rem',
              backdropFilter: 'blur(10px)',
              transition: 'all 0.15s ease'
            }}
          >
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#10B981' }} />
            <span>Phát hiện Tính năng AI: <strong style={{ color: theme === 'light' ? '#059669' : '#34D399' }}>{detectedAi.featureName}</strong></span>
            <span style={{
              fontSize: '0.6875rem',
              padding: '0.15rem 0.55rem',
              background: theme === 'light' ? 'rgba(5, 150, 105, 0.1)' : 'rgba(16, 185, 129, 0.18)',
              color: theme === 'light' ? '#059669' : '#34D399',
              borderRadius: '9999px',
              fontWeight: 700
            }}>
              Thẩm định I/O &amp; Testbench ➔
            </span>
          </div>
        )}
        <div 
          className="exact-screens-track"
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`
          }}
        >
          {screens.map((screen) => {
            const isSelected = screen.id === activeScreenId;
            const variant = screen.variants.find(v => v.id === screen.activeVariantId) || screen.variants[0];
            const currentMode = screenDeviceModes[screen.id] || screen.deviceMode || (targetPlatform === 'app' ? 'mobile' : 'desktop');
            const isMobile = currentMode === 'mobile';
            const baseWidth = isMobile ? 390 : 540;
            const baseHeight = isMobile ? 740 : 360;
            const cardWidth = Math.round(baseWidth * prototypeScale);
            const cardHeight = Math.round(baseHeight * prototypeScale);

            return (
              <div 
                key={screen.id}
                className={`exact-screen-card ${isSelected ? 'selected' : ''} ${isMobile ? 'mobile-device' : 'desktop-device'}`}
                style={{
                  width: `${cardWidth}px`,
                  height: `${cardHeight}px`
                }}
                onClick={() => setActiveScreenId(screen.id)}
              >
                {/* Header with Title and Mode */}
                <div className="exact-screen-card-header">
                  <div className="exact-screen-title-area">
                    <button
                      type="button"
                      style={{
                        background: isMobile ? 'rgba(56, 189, 248, 0.15)' : 'rgba(255, 255, 255, 0.08)',
                        border: '1px solid ' + (isMobile ? 'rgba(56, 189, 248, 0.3)' : 'rgba(255, 255, 255, 0.12)'),
                        color: isMobile ? '#38BDF8' : '#94A3B8',
                        cursor: 'pointer',
                        padding: '1px 5px',
                        borderRadius: '4px',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '3px',
                        fontSize: '0.62rem',
                        fontWeight: 600,
                        marginRight: '4px'
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setScreenDeviceModes(prev => ({
                          ...prev,
                          [screen.id]: isMobile ? 'desktop' : 'mobile'
                        }));
                      }}
                      title={`Tỉ lệ: ${isMobile ? 'Mobile App (390px)' : 'Desktop Web (540px)'} • Nhấn để đổi`}
                    >
                      {isMobile ? <Smartphone style={{ width: 10, height: 10 }} /> : <Monitor style={{ width: 10, height: 10 }} />}
                      <span>{isMobile ? 'Mobile' : 'Web'}</span>
                    </button>
                    <span title={screen.title} style={{ fontWeight: 600 }}>{screen.title}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <button
                      type="button"
                      style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', padding: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setFullscreenHtml(variant.htmlContent);
                      }}
                      title="Xem toàn màn hình"
                    >
                      <Maximize2 style={{ width: 12, height: 12 }} />
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

          {/* Interactive Ghost Card to Add New Screen Directly on the Track */}
          <div
            className="exact-add-screen-ghost"
            style={{
              width: `${Math.round(260 * prototypeScale)}px`,
              height: `${Math.round(360 * prototypeScale)}px`
            }}
            onClick={() => setShowNewScreenModal(true)}
            title="Nhấn để tạo màn hình mới tiếp nối luồng"
          >
            <div className="ghost-inner">
              <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10B981', marginBottom: '0.5rem' }}>
                <Plus style={{ width: 22, height: 22 }} />
              </div>
              <strong style={{ fontSize: '0.85rem', color: '#F8FAFC' }}>+ Tạo Màn Hình Mới</strong>
              <span style={{ fontSize: '0.7rem', color: '#94A3B8', marginTop: '0.25rem', textAlign: 'center', padding: '0 0.5rem' }}>
                {activeScreen 
                  ? `Tiếp nối luồng từ "${activeScreen.title.slice(0, 16)}..."`
                  : 'Tiếp nối ý tưởng tổng thể'}
              </span>
            </div>
          </div>
        </div>
      </main>

      {/* =================================================================== */}
      {/* 3. FLOATING LEFT PANEL (TOP): SPEC DETAILS & TOGGLE PILL            */}
      {/* =================================================================== */}
      {!showSpecCard && (
        <button
          type="button"
          className="exact-spec-toggle-pill"
          onClick={() => setShowSpecCard(true)}
          title="Mở bảng Đặc tả & IDE Workspace"
        >
          <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#10B981' }} />
          <span>⚡ IDE Workspace ▶</span>
        </button>
      )}

      {showSpecCard && (
        <aside className="exact-floating-spec">
          <div className="exact-spec-top-row">
            <div className="exact-spec-badge">
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10B981' }} />
              <span>IDE Workspace</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <button
                type="button"
                style={{
                  background: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '6px',
                  color: '#CBD5E1',
                  fontSize: '0.6875rem',
                  padding: '2px 7px',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
                onClick={() => setShowSpecCard(false)}
                title="Thu gọn bảng điều khiển"
              >
                ◀ Thu gọn
              </button>
              <button
                type="button"
                style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', padding: 2 }}
                onClick={() => setShowSpecCard(false)}
                title="Đóng bảng"
              >
                <X style={{ width: 14, height: 14 }} />
              </button>
            </div>
          </div>

          <div className="exact-spec-title-row">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', maxWidth: '190px', overflow: 'hidden' }}>
              <span 
                style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                title={initialConcept?.headline || initialConcept?.title || initialPrompt}
              >
                🎨 {initialConcept?.headline || initialConcept?.title || 'Đặc tả Kiến trúc'}
              </span>
              <button 
                type="button" 
                style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', flexShrink: 0 }}
                onClick={() => navigator.clipboard.writeText(designMd)}
                title="Sao chép đặc tả"
              >
                <Copy style={{ width: 12, height: 12 }} />
              </button>
            </div>
            <button
              type="button"
              style={{ background: 'none', border: 'none', color: '#10B981', fontSize: '0.75rem', cursor: 'pointer', flexShrink: 0 }}
              onClick={() => setShowDesignMdModal(true)}
            >
              DESIGN.md ⌵
            </button>
          </div>

          <div className="exact-spec-bullets">
            {initialConcept?.intentAnalysis && (
              <div style={{ marginBottom: '0.6rem', padding: '0.5rem 0.6rem', background: 'rgba(16, 185, 129, 0.08)', borderRadius: '6px', border: '1px solid rgba(16, 185, 129, 0.25)' }}>
                <div style={{ color: '#10B981', fontWeight: 600, fontSize: '0.7rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <Sparkles style={{ width: 11, height: 11 }} />
                    <strong>Ý đồ sản phẩm:</strong>
                  </span>
                  <span style={{ padding: '1px 6px', background: 'rgba(16, 185, 129, 0.2)', borderRadius: '4px', fontSize: '0.65rem', color: '#34D399', fontWeight: 600 }}>
                    {initialConcept.intentAnalysis.surfaceMode} Mode
                  </span>
                </div>
                <div style={{ fontSize: '0.72rem', color: '#F8FAFC', marginBottom: '0.2rem', lineHeight: '1.2' }}>
                  <strong>{initialConcept.intentAnalysis.coreAnalogy}</strong>
                </div>
                <div style={{ fontSize: '0.66rem', color: '#94A3B8', marginBottom: '0.2rem' }}>
                  👤 Đối tượng: {initialConcept.intentAnalysis.targetPersona}
                </div>
                <div style={{ fontSize: '0.64rem', color: '#64748B', fontFamily: 'monospace' }}>
                  Dials: V:{initialConcept.intentAnalysis.designDials?.variance || 5} • M:{initialConcept.intentAnalysis.designDials?.motion || 5} • D:{initialConcept.intentAnalysis.designDials?.density || 6}
                </div>
              </div>
            )}
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
      {showSpecCard && (
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
          <div style={{ padding: '0.5rem', background: '#0a0d14', borderRadius: '8px', fontSize: '0.7rem', color: '#94A3B8', maxHeight: '130px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            {initialConcept?.worklog && initialConcept.worklog.length > 0 ? (
              initialConcept.worklog.map((log, idx) => (
                <div key={idx} style={{ borderLeft: '2px solid #10B981', paddingLeft: '0.4rem', color: idx === initialConcept.worklog.length - 1 ? '#34D399' : '#94A3B8' }}>
                  {log}
                </div>
              ))
            ) : (
              <>
                <div style={{ borderLeft: '2px solid #10B981', paddingLeft: '0.4rem' }}>[1/5] Intent Deconstruction: Phân tích mental model & ẩn dụ người dùng.</div>
                <div style={{ borderLeft: '2px solid #10B981', paddingLeft: '0.4rem' }}>[2/5] Dial Calibration: Xác định Surface Mode & 3 Dials thiết kế.</div>
                <div style={{ borderLeft: '2px solid #10B981', paddingLeft: '0.4rem' }}>[3/5] Skill Reprompting: Kích hoạt Taste Skills (impeccable + stitch).</div>
                <div style={{ borderLeft: '2px solid #10B981', paddingLeft: '0.4rem' }}>[4/5] DESIGN.md: Biên dịch typography và bảng màu obsidian.</div>
                <div style={{ borderLeft: '2px solid #10B981', paddingLeft: '0.4rem', color: '#34D399' }}>[5/5] Live Canvas: Tổng hợp HTML tương tác hoàn chỉnh.</div>
              </>
            )}
          </div>
        )}
      </aside>
      )}

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
            setShowNewScreenModal(true);
          }}
          title="Tạo Màn hình mới dựa trên Canvas đang chọn (+)"
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

        {/* AI Feature Validator */}
        <button 
          type="button" 
          className={`exact-tool-btn ${showAiValidatorDrawer ? 'active' : ''}`}
          onClick={() => setShowAiValidatorDrawer(true)}
          title="Thẩm định Tính năng AI, Hợp đồng I/O & Synthetic Testbench"
        >
          <TestTube style={{ width: 15, height: 15, color: detectedAi.hasAiFeature ? '#10B981' : undefined }} />
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
        {/* Selected Canvas Context Capsule OR Suggestion Action Pills */}
        {activeScreen ? (
          <div className="exact-context-capsule">
            <div className="exact-context-dot" />
            <span className="exact-context-label">Canvas đang chọn:</span>
            <strong className="exact-context-title" title={activeScreen.title}>{activeScreen.title}</strong>
            <span className="exact-context-variant-tag">{activeVariant?.name || 'v1'}</span>

            <div className="exact-context-actions">
              <button 
                type="button"
                className="exact-chip-btn"
                style={{ background: 'rgba(16, 185, 129, 0.2)', borderColor: 'rgba(16, 185, 129, 0.45)', color: '#34D399', fontWeight: 600 }}
                onClick={() => setShowNewScreenModal(true)}
                title="Tạo màn hình tiếp nối luồng dựa trên Canvas này"
              >
                <Plus style={{ width: 12, height: 12, color: '#10B981' }} />
                <span>+ Màn hình mới</span>
              </button>

              <button 
                type="button"
                className={`exact-chip-btn ${activeCopilotAction === 'redesign' ? 'active' : ''}`}
                onClick={() => {
                  setActiveCopilotAction('redesign');
                  setShowCanvasInspector(false);
                  setPromptText('Thiết kế lại: ');
                  setTimeout(() => {
                    const textarea = document.querySelector('.exact-prompt-textarea') as HTMLTextAreaElement | null;
                    if (textarea) {
                      textarea.focus();
                      textarea.setSelectionRange(textarea.value.length, textarea.value.length);
                    }
                  }, 50);
                }}
                title="Thiết kế lại trực tiếp qua ô chat ở dưới (Enter để áp dụng ngay vào màn hình)"
              >
                <Palette style={{ width: 12, height: 12 }} />
                <span>Thiết kế lại</span>
              </button>

              <button 
                type="button"
                className={`exact-chip-btn ${activeCopilotAction === 'usability' ? 'active' : ''}`}
                onClick={() => {
                  setActiveCopilotAction('usability');
                  handleCanvasCopilotSubmit('Đánh giá tính dễ dùng (Usability) của màn hình này', 'usability');
                }}
                title="Đánh giá tính dễ dùng và các rào cản thao tác (cho non-tech)"
              >
                <Compass style={{ width: 12, height: 12 }} />
                <span>Usability</span>
              </button>

              <button 
                type="button"
                className={`exact-chip-btn ${activeCopilotAction === 'feasibility' ? 'active' : ''}`}
                onClick={() => {
                  setActiveCopilotAction('feasibility');
                  handleCanvasCopilotSubmit('Đánh giá tính khả thi và hướng dẫn cách làm (How-To) cho non-tech', 'feasibility');
                }}
                title="Đánh giá độ phức tạp và hướng dẫn từng bước lập trình cho người không chuyên"
              >
                <Wrench style={{ width: 12, height: 12 }} />
                <span>Khả thi &amp; Cách làm</span>
              </button>

              <button 
                type="button"
                className="exact-chip-btn"
                onClick={() => setShowCanvasInspector(!showCanvasInspector)}
                title="Mở bảng hội thoại chi tiết"
              >
                <MessageSquare style={{ width: 12, height: 12 }} />
                <span>Hộp thoại</span>
              </button>
            </div>

            <button 
              type="button"
              className="exact-context-close-btn"
              onClick={() => setActiveScreenId('')}
              title="Bỏ chọn để tạo màn hình mới hoàn toàn"
            >
              ✕ Bỏ chọn
            </button>
          </div>
        ) : (
          <div className="exact-suggestion-row">
            {(() => {
              const lowerP = initialPrompt.toLowerCase();
              const isClaimDomain = lowerP.includes('claim') || lowerP.includes('receipt') || lowerP.includes('hóa đơn') || lowerP.includes('expense') || lowerP.includes('approval') || lowerP.includes('duyệt');
              const isRunnerDomain = lowerP.includes('runner') || lowerP.includes('chạy bộ') || lowerP.includes('pacemate') || (lowerP.includes('tinder') && lowerP.includes('chạy'));

              const pill1Text = initialConcept?.nextQuestion || (
                isClaimDomain 
                  ? 'Thêm quy tắc tự động duyệt theo hạn mức chi tiêu' 
                  : isRunnerDomain 
                  ? 'Thêm bộ lọc cự ly và tốc độ pace chạy bộ' 
                  : `Thêm cấu hình quy trình cho ${initialPrompt.slice(0, 25)}`
              );

              const pill2Text = isClaimDomain 
                ? 'Xuất báo cáo kiểm toán tài chính & đồng bộ ERP' 
                : isRunnerDomain 
                ? 'Mở rộng tính năng hẹn chạy nhóm và phòng chat' 
                : 'Mở rộng bảng phân tích & xuất báo cáo';

              return (
                <>
                  <div 
                    className="exact-suggestion-pill"
                    onClick={() => handlePromptSubmit(pill1Text)}
                    title={pill1Text}
                  >
                    <span>{pill1Text.slice(0, 36)}...</span>
                    <span style={{ color: '#64748B', fontFamily: 'monospace' }}>1</span>
                  </div>

                  <div 
                    className="exact-suggestion-pill"
                    onClick={() => handlePromptSubmit(pill2Text)}
                    title={pill2Text}
                  >
                    <span>{pill2Text.slice(0, 36)}...</span>
                    <span style={{ color: '#64748B', fontFamily: 'monospace' }}>2</span>
                  </div>
                </>
              );
            })()}
          </div>
        )}

        {/* Dedicated Redesign & Visual Variants Settings Strip (When a screen is selected) */}
        {activeScreen && (
          <div className="exact-redesign-settings-strip">
            <span className="redesign-strip-label">
              <Palette style={{ width: 12, height: 12, color: '#38BDF8' }} />
              <span>Redesign &amp; Styling:</span>
            </span>

            {/* Quick Action: + 3 Variants */}
            <button
              type="button"
              className="redesign-chip-btn special-btn"
              onClick={handleGenerateThreeVariants}
              title="Tự động kiến tạo 3 biến thể phong cách khác nhau cho màn hình này"
              disabled={isGenerating}
            >
              <Sparkles style={{ width: 11, height: 11 }} />
              <span>+ 3 Biến thể mới</span>
            </button>

            {/* Quick Palettes */}
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
              <button
                type="button"
                className="redesign-chip-btn"
                onClick={() => handleApplyColorPaletteToScreen('alexandria')}
                title="Bảng màu Alexandria (Vàng hoàng gia & Xanh thẫm)"
              >
                <span className="redesign-palette-pill" style={{ background: '#D97706' }} />
                <span>Alexandria</span>
              </button>

              <button
                type="button"
                className="redesign-chip-btn"
                onClick={() => handleApplyColorPaletteToScreen('bauhaus')}
                title="Bảng màu Bauhaus (Đỏ rực & Vàng nghệ thuật)"
              >
                <span className="redesign-palette-pill" style={{ background: '#EF4444' }} />
                <span>Bauhaus</span>
              </button>

              <button
                type="button"
                className="redesign-chip-btn"
                onClick={() => handleApplyColorPaletteToScreen('glacier')}
                title="Bảng màu Glacier (Xanh băng tuyết & Cyan)"
              >
                <span className="redesign-palette-pill" style={{ background: '#06B6D4' }} />
                <span>Glacier</span>
              </button>

              <button
                type="button"
                className="redesign-chip-btn"
                onClick={() => handleApplyColorPaletteToScreen('neon_tokyo')}
                title="Bảng màu Carbon Neon (Đen tuyền & Lục bảo Neon)"
              >
                <span className="redesign-palette-pill" style={{ background: '#10B981' }} />
                <span>Carbon Neon</span>
              </button>
            </div>

            {/* Quick Layout Tweaks */}
            <button
              type="button"
              className="redesign-chip-btn"
              onClick={() => handleCanvasCopilotSubmit('Tối giản bố cục, tăng khoảng đệm (padding) và làm phẳng các thẻ hiển thị', 'redesign')}
              title="Tối giản và nới rộng khoảng cách thẻ"
            >
              <span>✨ Tối giản bố cục</span>
            </button>

            <button
              type="button"
              className="redesign-chip-btn"
              onClick={() => handleCanvasCopilotSubmit('Tối ưu kích thước nút bấm to rõ, tăng cỡ chữ và hỗ trợ thao tác 1 tay trên di động', 'redesign')}
              title="Nút bấm lớn và thân thiện với ngón tay"
            >
              <span>📱 Nút bấm lớn</span>
            </button>

            {/* Screen Variants Switcher Pills */}
            <div className="redesign-variant-pills">
              <span style={{ fontSize: '0.65rem', color: '#64748B' }}>Biến thể:</span>
              {activeScreen.variants.map((v, idx) => (
                <button
                  key={v.id}
                  type="button"
                  className={`redesign-variant-pill ${v.id === activeScreen.activeVariantId ? 'active' : ''}`}
                  onClick={() => {
                    const updatedScreens = screens.map(s => s.id === activeScreen.id ? { ...s, activeVariantId: v.id } : s);
                    setScreens(updatedScreens);
                  }}
                  title={v.name}
                >
                  v{idx + 1}
                </button>
              ))}
            </div>
          </div>
        )}

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
                if (activeScreen) {
                  handleCanvasCopilotSubmit(promptText, 'redesign');
                } else {
                  handlePromptSubmit();
                }
              }
            }}
            placeholder={
              activeScreen 
                ? `Thiết kế lại "${activeScreen.title.slice(0, 24)}..." (VD: Thêm 3 biến thể, đổi dải màu Neon, tối giản bố cục...)`
                : "Bạn muốn thay đổi hoặc tạo nội dung gì?"
            }
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
                disabled={(isGenerating || isCopilotLoading) || !promptText.trim()}
                onClick={() => {
                  if (activeScreen) {
                    handleCanvasCopilotSubmit(promptText, 'redesign');
                  } else {
                    handlePromptSubmit();
                  }
                }}
                title={activeScreen ? "Áp dụng thiết kế lại lên Canvas (Enter)" : "Tạo màn hình mới (Enter)"}
              >
                {(isGenerating || isCopilotLoading) ? (
                  <Loader2 style={{ width: 14, height: 14, animation: 'spin 1s linear infinite' }} />
                ) : (
                  <ArrowUp style={{ width: 14, height: 14 }} />
                )}
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

        {/* Prototype Dynamic Scale Selector */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '2px',
          background: 'rgba(255, 255, 255, 0.08)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          borderRadius: '6px',
          padding: '2px 4px',
          marginRight: '6px'
        }} title="Tỉ lệ kích thước Prototype (Dynamic Prototype Scale)">
          <span style={{ fontSize: '0.65rem', color: '#94A3B8', fontWeight: 600, paddingRight: '2px' }}>
            Scale:
          </span>
          {[0.8, 1.0, 1.25, 1.5].map(sc => (
            <button
              key={sc}
              type="button"
              onClick={() => setPrototypeScale(sc)}
              style={{
                background: prototypeScale === sc ? '#10B981' : 'transparent',
                color: prototypeScale === sc ? '#000000' : 'rgba(255, 255, 255, 0.75)',
                border: 'none',
                borderRadius: '4px',
                padding: '1px 5px',
                fontSize: '0.68rem',
                fontWeight: prototypeScale === sc ? 700 : 500,
                cursor: 'pointer'
              }}
            >
              {sc}x
            </button>
          ))}
        </div>

        {/* Zoom Out Button */}
        <button
          type="button"
          className="exact-hud-icon-btn"
          onClick={() => setZoom(z => Math.max(0.1, +(z - 0.05).toFixed(2)))}
          title="Thu nhỏ Canvas (Ctrl - hoặc cuộn chuột xuống + Ctrl)"
        >
          <Minus style={{ width: 12, height: 12 }} />
        </button>

        <span 
          style={{ cursor: 'pointer', userSelect: 'none', minWidth: '40px', textAlign: 'center', fontWeight: 600, fontSize: '0.75rem' }}
          onClick={() => {
            setZoom(0.28);
            setPan({ x: 340, y: 140 });
          }}
          title="Nhấn để đặt lại thu phóng 28% và căn giữa (Ctrl 0)"
        >
          {Math.round(zoom * 100)}%
        </span>

        {/* Zoom In Button */}
        <button
          type="button"
          className="exact-hud-icon-btn"
          onClick={() => setZoom(z => Math.min(2.5, +(z + 0.05).toFixed(2)))}
          title="Phóng to Canvas (Ctrl + hoặc cuộn chuột lên + Ctrl)"
        >
          <Plus style={{ width: 12, height: 12 }} />
        </button>

        <button 
          type="button" 
          className="exact-hud-icon-btn"
          onClick={() => alert('Phím tắt điều khiển Canvas:\n• Cuộn chuột + Ctrl (hoặc chụm ngón tay trên trackpad): Thu phóng Canvas mượt mà\n• Nút - / + ở thanh công cụ góc phải: Thu nhỏ / Phóng to\n• Nhấn % thu phóng (hoặc Ctrl 0): Căn giữa và đặt lại 28%\n• Phím cách / Alt + Kéo chuột: Di chuyển góc nhìn (Pan)\n• Cuộn chuột không giữ phím: Di chuyển lên / xuống')}
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
      {/* =================================================================== */}
      {/* 8. CANVAS COPILOT INSPECTOR & NON-TECH ADVISORY DRAWER              */}
      {/* =================================================================== */}
      {showCanvasInspector && activeScreen && (
        <aside className="exact-copilot-drawer">
          {/* Header */}
          <div className="copilot-drawer-header">
            <div className="copilot-drawer-title-area">
              <MessageSquare style={{ width: 16, height: 16, color: '#10B981' }} />
              <div>
                <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#FFFFFF' }}>
                  Canvas Copilot
                </div>
                <div style={{ fontSize: '0.71875rem', color: '#94A3B8' }}>
                  {activeScreen.title} • <span style={{ color: '#38BDF8' }}>{activeVariant?.name || 'v1'}</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              className="studio-icon-btn"
              onClick={() => setShowCanvasInspector(false)}
              title="Đóng bảng cố vấn"
            >
              <X style={{ width: 15, height: 15 }} />
            </button>
          </div>

          {/* Mode Tabs */}
          <div className="copilot-mode-tabs">
            <button
              type="button"
              className={`copilot-tab-btn ${inspectorActiveTab === 'chat' ? 'active' : ''}`}
              onClick={() => {
                setInspectorActiveTab('chat');
                setActiveCopilotAction('chat');
              }}
            >
              💬 Hội thoại
            </button>
            <button
              type="button"
              className={`copilot-tab-btn ${inspectorActiveTab === 'usability' ? 'active' : ''}`}
              onClick={() => {
                setInspectorActiveTab('usability');
                setActiveCopilotAction('usability');
                handleCanvasCopilotSubmit('Đánh giá tính dễ dùng (Usability) của màn hình này', 'usability');
              }}
            >
              🔍 Usability
            </button>
            <button
              type="button"
              className={`copilot-tab-btn ${inspectorActiveTab === 'feasibility' ? 'active' : ''}`}
              onClick={() => {
                setInspectorActiveTab('feasibility');
                setActiveCopilotAction('feasibility');
                handleCanvasCopilotSubmit('Đánh giá tính khả thi và hướng dẫn cách làm (How-To) cho non-tech', 'feasibility');
              }}
            >
              🛠️ Cách làm (Non-Tech)
            </button>
          </div>

          {/* Grounding Context Info Strip */}
          <div style={{
            padding: '0.4rem 0.85rem',
            background: 'rgba(56, 189, 248, 0.08)',
            borderBottom: '1px solid rgba(56, 189, 248, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '0.6875rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#CBD5E1' }}>
              <Sparkles style={{ width: 11, height: 11, color: '#38BDF8' }} />
              <span>
                Ngữ cảnh: {aiFeatureSpec?.grillMeQuestions?.some(q => q.userAnswer) 
                  ? 'Đã nạp hỏi đáp Grill Me' 
                  : 'Từ prompt & ý tưởng sản phẩm'}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setShowAiValidatorDrawer(true)}
              style={{
                background: 'rgba(16, 185, 129, 0.15)',
                border: '1px solid rgba(16, 185, 129, 0.35)',
                color: '#34D399',
                borderRadius: '4px',
                padding: '2px 7px',
                fontSize: '0.65rem',
                cursor: 'pointer',
                fontWeight: 600
              }}
              title="Mở Grill Me để AI chất vấn thu thập thêm ngữ cảnh thực chiến"
            >
              ⚡ Grill Me phỏng vấn
            </button>
          </div>

          {/* Messages Stream */}
          <div className="copilot-messages-feed">
            {(!screenChatThreads[activeScreen.id] || screenChatThreads[activeScreen.id].length === 0) ? (
              <div style={{ padding: '2rem 1rem', textAlign: 'center', color: '#64748B' }}>
                <MessageSquare style={{ width: 28, height: 28, margin: '0 auto 0.75rem', opacity: 0.5 }} />
                <p style={{ fontSize: '0.8125rem', margin: '0 0 0.5rem 0', color: '#94A3B8', fontWeight: 600 }}>
                  Chưa có hội thoại cho màn hình này
                </p>
                <p style={{ fontSize: '0.75rem', margin: 0, lineHeight: 1.5 }}>
                  Hãy đặt câu hỏi, yêu cầu AI thiết kế lại, kiểm tra độ dễ dùng hoặc xem cách lập trình bằng ngôn ngữ đời thường!
                </p>

                {/* Starter Prompts */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginTop: '1.25rem' }}>
                  <button
                    type="button"
                    className="exact-chip-btn"
                    style={{ justifyContent: 'center' }}
                    onClick={() => handleCanvasCopilotSubmit('Đánh giá tính dễ dùng (Usability) của màn hình này', 'usability')}
                  >
                    🔍 Người dùng mới có dễ hiểu màn hình này không?
                  </button>
                  <button
                    type="button"
                    className="exact-chip-btn"
                    style={{ justifyContent: 'center' }}
                    onClick={() => handleCanvasCopilotSubmit('Đánh giá tính khả thi và hướng dẫn cách làm (How-To) cho non-tech', 'feasibility')}
                  >
                    🛠️ Cần làm những bước gì để biến màn hình này thành sản phẩm thật?
                  </button>
                  <button
                    type="button"
                    className="exact-chip-btn"
                    style={{ justifyContent: 'center' }}
                    onClick={() => handleCanvasCopilotSubmit('Làm cho nút bấm nổi bật hơn và màu sắc ấm áp hơn', 'redesign')}
                  >
                    🎨 Thiết kế lại: Làm nổi bật nút bấm chính
                  </button>
                </div>
              </div>
            ) : (
              screenChatThreads[activeScreen.id].map(msg => (
                <div key={msg.id} className={`copilot-message-bubble ${msg.role}`}>
                  <div style={{ whiteSpace: 'pre-wrap' }}>{msg.content}</div>

                  {/* If response has Usability Data */}
                  {msg.usability && (
                    <div className="nontech-usability-card">
                      <div className="usability-badge-row">
                        <div className={`usability-status-badge ${msg.usability.verdict}`}>
                          <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'currentColor' }} />
                          <span>{msg.usability.verdictLabel}</span>
                        </div>
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#F8FAFC' }}>
                          Điểm số: {msg.usability.score}/100
                        </span>
                      </div>

                      <div className="nontech-section-block">
                        <div className="nontech-section-label">
                          <span>⏱️ Bài kiểm tra 5 giây</span>
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#CBD5E1', lineHeight: 1.4 }}>
                          {msg.usability.theFiveSecondTest.summary}
                        </div>
                      </div>

                      <div className="nontech-section-block">
                        <div className="nontech-section-label">
                          <span>👆 Độ thuận tiện khi chạm / bấm</span>
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#CBD5E1', lineHeight: 1.4 }}>
                          {msg.usability.tapAndClickComfort.summary}
                        </div>
                      </div>

                      {msg.usability.plainEnglishFixes.length > 0 && (
                        <div className="nontech-section-block">
                          <div className="nontech-section-label" style={{ color: '#10B981' }}>
                            <span>💡 3 Mẹo cải thiện dễ hiểu</span>
                          </div>
                          <ul style={{ margin: '0.25rem 0 0 0', paddingLeft: '1rem', fontSize: '0.75rem', color: '#CBD5E1', lineHeight: 1.4 }}>
                            {msg.usability.plainEnglishFixes.map((fix, idx) => (
                              <li key={idx}>{fix}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}

                  {/* If response has Feasibility & How-to Data */}
                  {msg.feasibility && (
                    <div className="nontech-feasibility-card">
                      <div className="usability-badge-row">
                        <div className="usability-status-badge good">
                          <span>Mức độ: {msg.feasibility.complexityLabel}</span>
                        </div>
                        <span style={{ fontSize: '0.71875rem', color: '#38BDF8' }}>
                          {msg.feasibility.estimatedBuildTime}
                        </span>
                      </div>

                      <div className="nontech-section-block">
                        <div className="nontech-section-label">
                          <span>🥣 Các nguyên liệu cần có (Giải thích đời thường)</span>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', marginTop: '0.3rem' }}>
                          {msg.feasibility.plainEnglishIngredients.map((ing, idx) => (
                            <div key={idx} style={{ fontSize: '0.75rem', color: '#CBD5E1', lineHeight: 1.4 }}>
                              <strong style={{ color: '#F8FAFC' }}>{ing.name}:</strong> {ing.role}
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="nontech-section-block">
                        <div className="nontech-section-label" style={{ color: '#FBBF24' }}>
                          <span>📝 Hướng dẫn từng bước thực tế (Recipe)</span>
                        </div>
                        {msg.feasibility.stepByStepRecipe.map(step => (
                          <div key={step.step} className="recipe-step-item">
                            <div className="recipe-step-number">{step.step}</div>
                            <div style={{ fontSize: '0.75rem', color: '#CBD5E1', lineHeight: 1.4 }}>
                              <strong style={{ color: '#FFFFFF' }}>{step.title}</strong>
                              <div style={{ marginTop: '0.15rem' }}>{step.laymanExplanation}</div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {msg.feasibility.recommendedShortcuts.length > 0 && (
                        <div className="nontech-section-block">
                          <div className="nontech-section-label" style={{ color: '#10B981' }}>
                            <span>🚀 Đường tắt tiết kiệm chi phí</span>
                          </div>
                          <ul style={{ margin: '0.25rem 0 0 0', paddingLeft: '1rem', fontSize: '0.75rem', color: '#CBD5E1', lineHeight: 1.4 }}>
                            {msg.feasibility.recommendedShortcuts.map((sc, idx) => (
                              <li key={idx}>{sc}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}

                  {/* If response has Redesign HTML */}
                  {msg.redesignHtml && (
                    <div className="redesign-action-box">
                      <div style={{ fontSize: '0.75rem', color: '#34D399', fontWeight: 600 }}>
                        ✨ {msg.redesignSummary || 'Biến thể thiết kế mới đã sẵn sàng'}
                      </div>
                      <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem' }}>
                        <button
                          type="button"
                          className="exact-chip-btn active"
                          onClick={() => applyRedesignAsNewVariant(msg.redesignHtml!, msg.redesignSummary || 'Biến thể mới', msg.redesignTokens || [])}
                        >
                          + Thêm làm Biến thể mới
                        </button>
                        <button
                          type="button"
                          className="exact-chip-btn"
                          onClick={() => applyRedesignReplaceCurrent(msg.redesignHtml!)}
                        >
                          ⚡ Thay thế màn hình này
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}

            {isCopilotLoading && (
              <div className="copilot-message-bubble assistant" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#38BDF8' }}>
                <Loader2 style={{ width: 14, height: 14, animation: 'spin 1s linear infinite' }} />
                <span>AI đang phân tích mã nguồn canvas và biên soạn lời giải...</span>
              </div>
            )}
          </div>

          {/* Drawer Input Area */}
          <div className="copilot-drawer-input-area">
            <div style={{ display: 'flex', gap: '0.4rem' }}>
              <input
                type="text"
                value={drawerInputText}
                onChange={e => setDrawerInputText(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleCanvasCopilotSubmit(drawerInputText, 'chat');
                  }
                }}
                placeholder="Nhập câu hỏi hoặc yêu cầu thiết kế..."
                style={{
                  flex: 1,
                  background: '#131722',
                  border: '1px solid rgba(255, 255, 255, 0.14)',
                  borderRadius: '8px',
                  padding: '0.5rem 0.75rem',
                  color: '#FFFFFF',
                  fontSize: '0.75rem',
                  outline: 'none'
                }}
              />
              <button
                type="button"
                className="exact-send-btn"
                disabled={isCopilotLoading || !drawerInputText.trim()}
                onClick={() => handleCanvasCopilotSubmit(drawerInputText, 'chat')}
              >
                <ArrowUp style={{ width: 14, height: 14 }} />
              </button>
            </div>
          </div>
        </aside>
      )}

      {/* =================================================================== */}
      {/* 9. MODAL: CREATE NEW SCREEN FRAME WITH SELECTED CANVAS CONTEXT      */}
      {/* =================================================================== */}
      {showNewScreenModal && (
        <div className="modal-overlay" onClick={() => setShowNewScreenModal(false)} style={{ zIndex: 10001 }}>
          <div 
            className="modal-card" 
            onClick={e => e.stopPropagation()} 
            style={{ width: '92vw', maxWidth: '640px', background: '#0B0F19', border: '1px solid rgba(16, 185, 129, 0.35)', borderRadius: '16px', boxShadow: '0 25px 60px rgba(0,0,0,0.85)', padding: '1.5rem' }}
          >
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ width: 32, height: 32, borderRadius: '8px', background: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10B981' }}>
                  <Plus style={{ width: 18, height: 18 }} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: '#F8FAFC' }}>
                    Tạo Màn Hình Mới Tiếp Nối Luồng
                  </h3>
                  <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>
                    Khung tạo màn hình thông minh kèm trích xuất ngữ cảnh Canvas
                  </div>
                </div>
              </div>
              <button
                type="button"
                className="studio-icon-btn"
                onClick={() => setShowNewScreenModal(false)}
              >
                <X style={{ width: 16, height: 16 }} />
              </button>
            </div>

            {/* Selected Canvas Context Banner */}
            {activeScreen ? (
              <div style={{
                padding: '0.75rem 1rem',
                background: 'rgba(16, 185, 129, 0.08)',
                border: '1px solid rgba(16, 185, 129, 0.25)',
                borderRadius: '10px',
                marginBottom: '1rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                  <span style={{ fontSize: '0.7rem', color: '#10B981', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <Sparkles style={{ width: 12, height: 12 }} />
                    NGỮ CẢNH CANVAS ĐƯỢC CHỌN (BƯỚC {activeScreen.flowStep}):
                  </span>
                  <span style={{ padding: '1px 6px', background: 'rgba(16, 185, 129, 0.2)', borderRadius: '4px', fontSize: '0.65rem', color: '#34D399', fontWeight: 600 }}>
                    {activeVariant?.name || 'v1'}
                  </span>
                </div>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#FFFFFF', marginBottom: '0.2rem' }}>
                  {activeScreen.title}
                </div>
                <div style={{ fontSize: '0.72rem', color: '#94A3B8', lineHeight: 1.4 }}>
                  {activeScreen.description || 'Toàn bộ mã HTML, cấu trúc typography, bảng màu và trạng thái của canvas này sẽ được feed vào AI API để sinh màn hình tiếp theo.'}
                </div>
              </div>
            ) : (
              <div style={{
                padding: '0.75rem 1rem',
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '10px',
                marginBottom: '1rem',
                fontSize: '0.75rem',
                color: '#94A3B8'
              }}>
                💡 Bạn chưa chọn canvas cụ thể nào. Màn hình mới sẽ được tạo dựa trên ý tưởng gốc: <strong style={{ color: '#F8FAFC' }}>"{initialPrompt}"</strong>.
              </div>
            )}

            {/* Input Textarea & Contextual Quick Tags */}
            {(() => {
              const lowerP = (activeScreen?.title || initialPrompt).toLowerCase();
              const isClaimDomain = lowerP.includes('claim') || lowerP.includes('receipt') || lowerP.includes('hóa đơn') || lowerP.includes('expense') || lowerP.includes('approval') || lowerP.includes('duyệt');
              const isRunnerDomain = lowerP.includes('runner') || lowerP.includes('chạy bộ') || lowerP.includes('pacemate');

              const placeholderText = isClaimDomain
                ? "Ví dụ: Màn hình kiểm toán thuế VAT và xuất hóa đơn điện tử, hoặc Màn hình cài đặt hạn mức duyệt đa cấp..."
                : isRunnerDomain
                ? "Ví dụ: Màn hình chi tiết lộ trình chạy GPS, hoặc Màn hình huy hiệu thành tích và bảng xếp hạng..."
                : `Ví dụ: Màn hình báo cáo phân tích số liệu hoặc Màn hình cấu hình nâng cao cho ${initialPrompt}...`;

              const quickTags = isClaimDomain
                ? [
                    'Màn hình Chi tiết Thanh toán & Quét mã QR',
                    'Màn hình Báo cáo Đối soát Thuế & Xuất ERP',
                    'Màn hình Cấu hình Phân quyền Duyệt đa cấp',
                    'Màn hình Lịch sử & Nhật ký Kiểm toán (Audit Log)'
                  ]
                : isRunnerDomain
                ? [
                    'Màn hình Chi tiết Cung đường & Bản đồ GPS',
                    'Màn hình Thống kê Thành tích & Pace cá nhân',
                    'Màn hình Lên lịch Chạy nhóm Cuối tuần',
                    'Màn hình Phòng chat & Ghép đôi Runner'
                  ]
                : [
                    'Màn hình Chi tiết Dữ liệu & Thao tác',
                    'Màn hình Báo cáo Phân tích & Xuất dữ liệu',
                    'Màn hình Cấu hình & Cài đặt Quy trình',
                    'Màn hình Lịch sử Hoạt động & Nhật ký'
                  ];

              return (
                <>
                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#E2E8F0', marginBottom: '0.4rem' }}>
                      Mô tả nội dung &amp; tác vụ màn hình bạn muốn tạo thêm:
                    </label>
                    <textarea
                      value={newScreenInputText}
                      onChange={e => setNewScreenInputText(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleCreateContinuationScreen();
                        }
                      }}
                      rows={3}
                      placeholder={placeholderText}
                      style={{
                        width: '100%',
                        background: '#06080F',
                        border: '1px solid rgba(255, 255, 255, 0.15)',
                        borderRadius: '10px',
                        color: '#FFFFFF',
                        padding: '0.75rem',
                        fontSize: '0.875rem',
                        fontFamily: 'inherit',
                        resize: 'vertical',
                        outline: 'none',
                        boxSizing: 'border-box'
                      }}
                      autoFocus
                    />
                  </div>

                  {/* Quick Suggestion Pills */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1.25rem' }}>
                    <span style={{ fontSize: '0.7rem', color: '#64748B', alignSelf: 'center', marginRight: '0.2rem' }}>
                      Gợi ý nhanh:
                    </span>
                    {quickTags.map((tag, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setNewScreenInputText(tag)}
                        style={{
                          background: 'rgba(255, 255, 255, 0.05)',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          borderRadius: '9999px',
                          color: '#94A3B8',
                          padding: '3px 9px',
                          fontSize: '0.7rem',
                          cursor: 'pointer',
                          transition: 'all 0.15s'
                        }}
                        onMouseEnter={e => {
                          e.currentTarget.style.color = '#FFFFFF';
                          e.currentTarget.style.borderColor = '#10B981';
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.color = '#94A3B8';
                          e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                        }}
                      >
                        + {tag}
                      </button>
                    ))}
                  </div>
                </>
              );
            })()}

            {/* Footer Buttons */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button
                type="button"
                onClick={() => setShowNewScreenModal(false)}
                style={{
                  background: 'transparent',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  color: '#94A3B8',
                  borderRadius: '8px',
                  padding: '0.5rem 1rem',
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Hủy
              </button>
              <button
                type="button"
                disabled={!newScreenInputText.trim() || isGeneratingContinuation}
                onClick={handleCreateContinuationScreen}
                style={{
                  background: isGeneratingContinuation || !newScreenInputText.trim() ? '#1E2538' : '#10B981',
                  color: isGeneratingContinuation || !newScreenInputText.trim() ? '#64748B' : '#000000',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '0.5rem 1.25rem',
                  fontSize: '0.8125rem',
                  fontWeight: 700,
                  cursor: isGeneratingContinuation || !newScreenInputText.trim() ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem'
                }}
              >
                {isGeneratingContinuation ? (
                  <>
                    <Loader2 style={{ width: 14, height: 14, animation: 'spin 1s linear infinite' }} />
                    <span>Đang sinh màn hình từ Context...</span>
                  </>
                ) : (
                  <>
                    <Sparkles style={{ width: 14, height: 14 }} />
                    <span>Tạo Màn Hình với AI (Kèm Context)</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AI Feature Validator, Grill-Me Interview & Synthetic Testbench Drawer */}
      <AiFeatureValidatorDrawer
        isOpen={showAiValidatorDrawer}
        onClose={() => setShowAiValidatorDrawer(false)}
        spec={aiFeatureSpec}
        onUpdateSpec={setAiFeatureSpec}
        theme={theme}
        ideaPrompt={initialPrompt}
        activeScreen={activeScreen}
      />

      {/* AI API Key & Model Configuration Modal */}
      <ApiKeyModal
        isOpen={showApiKeyModal}
        onClose={() => {
          setShowApiKeyModal(false);
          setIsCheckingAiHealth(true);
          performAiHealthCheck().then(setAiHealth).catch(() => {}).finally(() => setIsCheckingAiHealth(false));
        }}
        onConfigSaved={() => {
          setIsCheckingAiHealth(true);
          performAiHealthCheck().then(setAiHealth).catch(() => {}).finally(() => setIsCheckingAiHealth(false));
        }}
      />
    </div>
  );
};

export default StitchStudio;
