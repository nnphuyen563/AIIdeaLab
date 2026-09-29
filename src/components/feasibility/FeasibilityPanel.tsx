import React, { useState, useEffect } from 'react';
import {
  X,
  Target,
  Shield,
  Clock,
  DollarSign,
  Users,
  AlertTriangle,
  Loader2,
  BarChart3,
  Zap,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Scale,
  Copy,
  Check
} from '../ui/icons/CyberIcons';
import {
  FeasibilityScore,
  evaluateFeasibility,
  evaluateAiNecessity,
  AiNecessityScorecard,
  evaluateVisualAesthetic,
  VisualAestheticReport,
  runSyntheticUsabilityTest,
  SyntheticUsabilityReport
} from '../../services/aiService';
import '../../styles/feasibility.css';

interface FeasibilityPanelProps {
  isOpen: boolean;
  onClose: () => void;
  idea: string;
  mockHtml: string;
  specSummary: string;
}

const SLIDES_META = [
  { id: 0, title: '01. Sức Khỏe & Khả Thi', icon: BarChart3 },
  { id: 1, title: '02. Thẩm Định "Cần AI?"', icon: Zap },
  { id: 2, title: '03. Thẩm Mỹ & Anti-Slop', icon: Sparkles },
  { id: 3, title: '04. Giả Lập 3 Persona', icon: Users },
  { id: 4, title: '05. Lộ Trình & Moat', icon: Target },
];

export const FeasibilityPanel: React.FC<FeasibilityPanelProps> = ({
  isOpen,
  onClose,
  idea,
  mockHtml,
  specSummary
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [viewMode, setViewMode] = useState<'slides' | 'document'>('slides');
  const [isLoading, setIsLoading] = useState(false);
  const [feasibilityResult, setFeasibilityResult] = useState<FeasibilityScore | null>(null);
  const [necessityResult, setNecessityResult] = useState<AiNecessityScorecard | null>(null);
  const [visualResult, setVisualResult] = useState<VisualAestheticReport | null>(null);
  const [usabilityResult, setUsabilityResult] = useState<SyntheticUsabilityReport | null>(null);
  const [hasRun, setHasRun] = useState(false);
  const [copiedSnippetIdx, setCopiedSnippetIdx] = useState<number | null>(null);

  // Keyboard navigation for slide deck
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'ArrowRight' || e.key === 'PageDown') {
        setCurrentSlide(prev => Math.min(4, prev + 1));
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        setCurrentSlide(prev => Math.max(0, prev - 1));
      } else if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const runAllEvaluations = async () => {
    setIsLoading(true);
    try {
      const [feasRes, necRes, visRes, useRes] = await Promise.allSettled([
        evaluateFeasibility(idea, mockHtml, specSummary),
        evaluateAiNecessity(idea, specSummary, mockHtml),
        evaluateVisualAesthetic(mockHtml, idea),
        runSyntheticUsabilityTest(idea, mockHtml, idea)
      ]);

      if (feasRes.status === 'fulfilled') setFeasibilityResult(feasRes.value);
      if (necRes.status === 'fulfilled') setNecessityResult(necRes.value);
      if (visRes.status === 'fulfilled') setVisualResult(visRes.value);
      if (useRes.status === 'fulfilled') setUsabilityResult(useRes.value);

      setHasRun(true);
    } catch (err) {
      console.error('Evaluations failed:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && !hasRun && idea.trim()) {
      runAllEvaluations();
    }
  }, [isOpen, idea, hasRun]);

  if (!isOpen) return null;

  const getScoreColor = (score: number) => {
    if (score >= 80) return '#10B981';
    if (score >= 60) return '#F59E0B';
    if (score >= 40) return '#F97316';
    return '#EF4444';
  };

  const handleCopyCss = (code: string, idx: number) => {
    navigator.clipboard.writeText(code);
    setCopiedSnippetIdx(idx);
    setTimeout(() => setCopiedSnippetIdx(null), 2000);
  };

  return (
    <div className="feasibility-deck-overlay" onClick={onClose}>
      <div 
        className="feasibility-deck-stage" 
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Executive AI Evaluation Deck"
      >
        {/* Top Control Bar */}
        <header className="deck-top-bar">
          <div className="deck-branding">
            <div className="deck-logo-badge">
              <Sparkles style={{ width: 14, height: 14, color: '#10B981' }} />
            </div>
            <div>
              <h2 className="deck-main-title">AI Evaluation Deck</h2>
              <span className="deck-idea-slug" title={idea}>"{idea.slice(0, 36)}..."</span>
            </div>
          </div>

          {/* Stepper Timeline Navigation */}
          <nav className="deck-stepper-bar">
            {SLIDES_META.map((meta, idx) => {
              const Icon = meta.icon;
              return (
                <button
                  key={meta.id}
                  type="button"
                  className={`deck-step-btn ${currentSlide === idx ? 'active' : ''}`}
                  onClick={() => {
                    setCurrentSlide(idx);
                    setViewMode('slides');
                  }}
                  title={meta.title}
                >
                  <Icon style={{ width: 12, height: 12 }} />
                  <span>{meta.title}</span>
                </button>
              );
            })}
          </nav>

          {/* Actions on Top Right */}
          <div className="deck-actions-right">
            {/* View Mode Toggle */}
            <div className="deck-view-toggle">
              <button
                type="button"
                className={`view-mode-btn ${viewMode === 'slides' ? 'active' : ''}`}
                onClick={() => setViewMode('slides')}
                title="Chế độ Slide trình chiếu (Visual-first)"
              >
                <span>Slides</span>
              </button>
              <button
                type="button"
                className={`view-mode-btn ${viewMode === 'document' ? 'active' : ''}`}
                onClick={() => setViewMode('document')}
                title="Chế độ Tài liệu cuộn dọc (Document)"
              >
                <span>Văn Bản</span>
              </button>
            </div>

            <button 
              type="button" 
              className="deck-close-btn" 
              onClick={onClose} 
              title="Đóng bài thuyết trình (Esc)"
            >
              <X style={{ width: 16, height: 16 }} />
            </button>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="deck-body-stage">
          {isLoading ? (
            <div className="deck-loading-state">
              <div className="deck-loading-orb">
                <Loader2 className="spin-icon" style={{ width: 36, height: 36, color: '#10B981' }} />
              </div>
              <div className="deck-loading-copy">
                <h3>Đang tạo Slide Thẩm định 4 Chiều...</h3>
                <p>Khảo sát Tính khả thi • Trắc nghiệm Cần AI • Thẩm mỹ DOM • Mô phỏng 3 Persona</p>
              </div>
            </div>
          ) : viewMode === 'slides' ? (
            /* =============================================================== */
            /* SLIDE PRESENTATION MODE (VISUAL-FIRST EXECUTIVE SLIDES)          */
            /* =============================================================== */
            <div className="slide-card-container">
              {/* SLIDE 0: SỨC KHỎE Ý TƯỞNG & ĐÁNH GIÁ KHẢ THI */}
              {currentSlide === 0 && feasibilityResult && (
                <section className="executive-slide slide-fade-in">
                  <div className="slide-hero-header">
                    <span className="slide-eyebrow">01 / 05 • EXECUTIVE HEALTH CHECK</span>
                    <h3 className="slide-headline">Tổng Quan Sức Khỏe Ý Tưởng &amp; Mức Sẵn Sàng PoC</h3>
                    <p className="slide-subline">{feasibilityResult.summary}</p>
                  </div>

                  <div className="slide-split-grid">
                    {/* Left Hero Dial */}
                    <div className="slide-hero-dial-card">
                      <div className="big-dial-wrap">
                        <svg width="128" height="128" viewBox="0 0 128 128">
                          <circle cx="64" cy="64" r="54" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
                          <circle
                            cx="64" cy="64" r="54" fill="none"
                            stroke={getScoreColor(feasibilityResult.overallScore)}
                            strokeWidth="8"
                            strokeLinecap="round"
                            strokeDasharray={2 * Math.PI * 54}
                            strokeDashoffset={2 * Math.PI * 54 - (2 * Math.PI * 54 * feasibilityResult.overallScore) / 100}
                            transform="rotate(-90 64 64)"
                            style={{ transition: 'stroke-dashoffset 1s ease' }}
                          />
                        </svg>
                        <div className="big-dial-num" style={{ color: getScoreColor(feasibilityResult.overallScore) }}>
                          {feasibilityResult.overallScore}
                        </div>
                      </div>
                      <span className="big-dial-badge" style={{ background: `${getScoreColor(feasibilityResult.overallScore)}20`, color: getScoreColor(feasibilityResult.overallScore) }}>
                        {feasibilityResult.overallScore >= 80 ? 'TIỀM NĂNG XUẤT SẮC' : feasibilityResult.overallScore >= 60 ? 'KHÁ KHẢ THI' : 'CẦN ĐIỀU CHỈNH'}
                      </span>
                      <div className="quick-kpi-chips">
                        <span className="kpi-chip">⏱️ {feasibilityResult.estimatedTimeline}</span>
                        <span className="kpi-chip">💰 {feasibilityResult.estimatedCost}</span>
                      </div>
                    </div>

                    {/* Right 6-Pillar Radar Grid */}
                    <div className="slide-six-pillars">
                      <div className="radar-tile">
                        <div className="radar-top">
                          <span>Kỹ Thuật</span>
                          <strong style={{ color: getScoreColor(feasibilityResult.technicalFeasibility) }}>{feasibilityResult.technicalFeasibility}%</strong>
                        </div>
                        <div className="radar-bar"><div style={{ width: `${feasibilityResult.technicalFeasibility}%`, background: getScoreColor(feasibilityResult.technicalFeasibility) }} /></div>
                      </div>

                      <div className="radar-tile">
                        <div className="radar-top">
                          <span>Thị Trường</span>
                          <strong style={{ color: getScoreColor(feasibilityResult.marketFit) }}>{feasibilityResult.marketFit}%</strong>
                        </div>
                        <div className="radar-bar"><div style={{ width: `${feasibilityResult.marketFit}%`, background: getScoreColor(feasibilityResult.marketFit) }} /></div>
                      </div>

                      <div className="radar-tile">
                        <div className="radar-top">
                          <span>PoC Sẵn Sàng</span>
                          <strong style={{ color: getScoreColor(feasibilityResult.pocReadiness) }}>{feasibilityResult.pocReadiness}%</strong>
                        </div>
                        <div className="radar-bar"><div style={{ width: `${feasibilityResult.pocReadiness}%`, background: getScoreColor(feasibilityResult.pocReadiness) }} /></div>
                      </div>

                      <div className="radar-tile">
                        <div className="radar-top">
                          <span>Tài Nguyên</span>
                          <strong style={{ color: getScoreColor(feasibilityResult.resourceEstimate) }}>{feasibilityResult.resourceEstimate}%</strong>
                        </div>
                        <div className="radar-bar"><div style={{ width: `${feasibilityResult.resourceEstimate}%`, background: getScoreColor(feasibilityResult.resourceEstimate) }} /></div>
                      </div>

                      <div className="radar-tile">
                        <div className="radar-top">
                          <span>Rủi Ro Thấp</span>
                          <strong style={{ color: getScoreColor(feasibilityResult.riskLevel) }}>{feasibilityResult.riskLevel}%</strong>
                        </div>
                        <div className="radar-bar"><div style={{ width: `${feasibilityResult.riskLevel}%`, background: getScoreColor(feasibilityResult.riskLevel) }} /></div>
                      </div>

                      <div className="radar-tile">
                        <div className="radar-top">
                          <span>Giá Trị KD</span>
                          <strong style={{ color: getScoreColor(feasibilityResult.businessValue) }}>{feasibilityResult.businessValue}%</strong>
                        </div>
                        <div className="radar-bar"><div style={{ width: `${feasibilityResult.businessValue}%`, background: getScoreColor(feasibilityResult.businessValue) }} /></div>
                      </div>
                    </div>
                  </div>

                  {/* 3 Executive Bullet Takeaways */}
                  <div className="slide-bullets-row">
                    {feasibilityResult.recommendations.slice(0, 3).map((rec, i) => (
                      <div key={i} className="bullet-card">
                        <span className="bullet-num">0{i + 1}</span>
                        <p>{rec}</p>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* SLIDE 1: BÀI TEST "CÓ THỰC SỰ CẦN AI?" (THE LITMUS TEST) */}
              {currentSlide === 1 && necessityResult && (
                <section className="executive-slide slide-fade-in">
                  <div className="slide-hero-header">
                    <span className="slide-eyebrow">02 / 05 • THE "WHY AI?" LITMUS TEST</span>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                      <h3 className="slide-headline">Giải Pháp Này Có Thực Sự Cần Đến AI?</h3>
                      <div className="necessity-pill-glow" style={{ borderColor: necessityResult.architectureRecommendation.badgeColor, color: necessityResult.architectureRecommendation.badgeColor }}>
                        {necessityResult.levelBadge} • {necessityResult.overallScore}% CẦN AI
                      </div>
                    </div>
                    <p className="slide-subline">{necessityResult.levelVerdict}</p>
                  </div>

                  {/* Battle Arena: Code Cổ Điển vs Giải Pháp AI */}
                  <div className="battle-arena-grid">
                    {/* Deterministic Code Card */}
                    <div className="battle-card deterministic-side">
                      <div className="battle-card-head">
                        <span className="tag-side">GIẢI PHÁP CODE CỔ ĐIỂN</span>
                        <h4>{necessityResult.headToHead.classicalCode.title}</h4>
                      </div>
                      <div className="battle-metrics-row">
                        <div className="metric-box">
                          <span className="lbl">⏱️ Độ trễ:</span>
                          <strong className="green-txt">{necessityResult.headToHead.classicalCode.latencyEstimate}</strong>
                        </div>
                        <div className="metric-box">
                          <span className="lbl">💰 Chi phí/10k:</span>
                          <strong className="green-txt">{necessityResult.headToHead.classicalCode.costPer10k}</strong>
                        </div>
                        <div className="metric-box">
                          <span className="lbl">🎯 Ảo giác:</span>
                          <strong className="green-txt">0% Tuyệt Đối</strong>
                        </div>
                      </div>
                      <ul className="battle-pros-list">
                        {necessityResult.headToHead.classicalCode.pros.slice(0, 2).map((p, i) => (
                          <li key={i}>✓ {p}</li>
                        ))}
                      </ul>
                    </div>

                    {/* AI Solution Card */}
                    <div className="battle-card ai-side">
                      <div className="battle-card-head">
                        <span className="tag-side ai">GIẢI PHÁP TRÍ TUỆ NHÂN TẠO</span>
                        <h4>{necessityResult.headToHead.aiSolution.title}</h4>
                      </div>
                      <div className="battle-metrics-row">
                        <div className="metric-box">
                          <span className="lbl">⏱️ Độ trễ:</span>
                          <strong className="amber-txt">{necessityResult.headToHead.aiSolution.latencyEstimate}</strong>
                        </div>
                        <div className="metric-box">
                          <span className="lbl">💰 Chi phí/10k:</span>
                          <strong className="amber-txt">{necessityResult.headToHead.aiSolution.costPer10k}</strong>
                        </div>
                        <div className="metric-box">
                          <span className="lbl">🎯 Rủi ro:</span>
                          <strong>{necessityResult.headToHead.aiSolution.hallucinationRisk.slice(0, 18)}...</strong>
                        </div>
                      </div>
                      <ul className="battle-pros-list">
                        {necessityResult.headToHead.aiSolution.pros.slice(0, 2).map((p, i) => (
                          <li key={i} className="ai-pro-item">★ {p}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* 5-Pillar Score Bar */}
                  <div className="slide-pillars-strip">
                    {Object.entries(necessityResult.dimensions).map(([key, dim]) => (
                      <div key={key} className="pillar-chip">
                        <span className="p-title">{dim.label.split('(')[0]}</span>
                        <div className="p-bar"><div style={{ width: `${dim.score}%`, background: getScoreColor(dim.score) }} /></div>
                        <span className="p-num" style={{ color: getScoreColor(dim.score) }}>{dim.score}%</span>
                      </div>
                    ))}
                  </div>

                  {/* Architect Recommendation Takeaway */}
                  <div className="slide-architect-banner">
                    <Scale style={{ width: 14, height: 14, color: necessityResult.architectureRecommendation.badgeColor, flexShrink: 0 }} />
                    <span><strong>Phán Quyết Kiến Trúc:</strong> {necessityResult.architectureRecommendation.summary}</span>
                  </div>
                </section>
              )}

              {/* SLIDE 2: THẨM MỸ GIAO DIỆN & ANTI-SLOP AUDIT */}
              {currentSlide === 2 && visualResult && (
                <section className="executive-slide slide-fade-in">
                  <div className="slide-hero-header">
                    <span className="slide-eyebrow">03 / 05 • VISUAL &amp; AESTHETIC AUDIT</span>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                      <h3 className="slide-headline">Chất Lượng Thẩm Mỹ &amp; Phân Cấp Thị Giác Prototype</h3>
                      <div className="grade-badge-glow">
                        {visualResult.gradeBadge} • {visualResult.overallScore}/100 ĐIỂM
                      </div>
                    </div>
                    <p className="slide-subline">{visualResult.summary}</p>
                  </div>

                  {/* 4 Pillar Visual Gauges */}
                  <div className="slide-four-gauges">
                    <div className="visual-gauge-box">
                      <span className="v-num">{visualResult.pillarScores.typographyHierarchy}</span>
                      <span className="v-name">Kiểu Chữ (Typography)</span>
                    </div>
                    <div className="visual-gauge-box">
                      <span className="v-num">{visualResult.pillarScores.spatialRhythmAndGrid}</span>
                      <span className="v-name">Lưới 8-pt (Grid/Spacing)</span>
                    </div>
                    <div className="visual-gauge-box">
                      <span className="v-num">{visualResult.pillarScores.colorHarmonyAndContrast}</span>
                      <span className="v-name">Màu Sắc &amp; WCAG</span>
                    </div>
                    <div className="visual-gauge-box">
                      <span className="v-num">{visualResult.pillarScores.antiSlopAndPolish}</span>
                      <span className="v-name">Chống Mẫu AI Slop</span>
                    </div>
                  </div>

                  {/* Visual Flaws vs Instant CSS Level-Up */}
                  <div className="slide-visual-details-grid">
                    {/* Flaws Column */}
                    <div className="visual-column-card">
                      <h4 className="v-col-title">
                        <AlertTriangle style={{ width: 13, height: 13, color: '#F59E0B' }} />
                        <span>Phát hiện Cần Tinh Chỉnh ({visualResult.detectedFlaws.length})</span>
                      </h4>
                      <div className="flaws-compact-list">
                        {visualResult.detectedFlaws.slice(0, 3).map(flaw => (
                          <div key={flaw.id} className={`flaw-compact-item ${flaw.severity}`}>
                            <span className="f-tag">{flaw.category}</span>
                            <span className="f-title">{flaw.title}</span>
                          </div>
                        ))}
                        {visualResult.detectedFlaws.length === 0 && (
                          <div className="no-flaws-note">✓ Không có lỗi thị giác nghiêm trọng!</div>
                        )}
                      </div>
                    </div>

                    {/* Instant CSS Level-Up */}
                    <div className="visual-column-card">
                      <div className="v-col-title" style={{ justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <Sparkles style={{ width: 13, height: 13, color: '#10B981' }} />
                          <span>Code CSS Nâng Cấp Tức Thì</span>
                        </div>
                        {visualResult.instantLevelUpCssSnippets.length > 0 && (
                          <button
                            type="button"
                            className="mini-copy-css-btn"
                            onClick={() => handleCopyCss(visualResult.instantLevelUpCssSnippets[0].cssCode, 0)}
                          >
                            {copiedSnippetIdx === 0 ? <Check style={{ width: 11, height: 11 }} /> : <Copy style={{ width: 11, height: 11 }} />}
                            <span>{copiedSnippetIdx === 0 ? 'Đã chép' : 'Chép CSS'}</span>
                          </button>
                        )}
                      </div>
                      {visualResult.instantLevelUpCssSnippets.length > 0 && (
                        <div className="compact-css-preview">
                          <span className="css-target-label">{visualResult.instantLevelUpCssSnippets[0].targetComponent}</span>
                          <pre><code>{visualResult.instantLevelUpCssSnippets[0].cssCode}</code></pre>
                        </div>
                      )}
                    </div>
                  </div>
                </section>
              )}

              {/* SLIDE 3: GIẢ LẬP 3 PERSONA NGƯỜI DÙNG & USABILITY LAB */}
              {currentSlide === 3 && usabilityResult && (
                <section className="executive-slide slide-fade-in">
                  <div className="slide-hero-header">
                    <span className="slide-eyebrow">04 / 05 • SYNTHETIC USER LAB</span>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                      <h3 className="slide-headline">Giả Lập Hành Vi 3 Persona Người Dùng Thực Tế</h3>
                      <div className={`stamp-pill ${usabilityResult.fiveSecondTest.passed ? 'passed' : 'failed'}`}>
                        {usabilityResult.fiveSecondTest.passed ? '✓ ĐẠT BÀI TEST 5 GIÂY' : '⚠️ CHƯA ĐẠT TEST 5 GIÂY'}
                      </div>
                    </div>
                    <p className="slide-subline">{usabilityResult.fiveSecondTest.comprehensionSummary}</p>
                  </div>

                  {/* 3 Personas Reaction Cards */}
                  <div className="slide-personas-grid">
                    {usabilityResult.personaWalkthroughs.map((persona, i) => (
                      <div key={i} className="persona-compact-card">
                        <div className="persona-top-row">
                          <div className="avatar-chip">
                            {persona.avatarIcon === 'zap' && <Zap style={{ width: 13, height: 13, color: '#F59E0B' }} />}
                            {persona.avatarIcon === 'users' && <Users style={{ width: 13, height: 13, color: '#38BDF8' }} />}
                            {persona.avatarIcon === 'shield' && <Shield style={{ width: 13, height: 13, color: '#10B981' }} />}
                          </div>
                          <div className="p-meta">
                            <strong className="p-name">{persona.personaName.split('(')[0]}</strong>
                            <span className="p-sub">{persona.personaRole}</span>
                          </div>
                          <span className={`p-status-tag ${persona.taskCompletionStatus}`}>
                            {persona.taskCompletionStatus === 'completed_smoothly' ? '✓ Mượt mà' : '⚠️ Có cản trở'}
                          </span>
                        </div>

                        <div className="persona-quote-box">
                          "{persona.firstImpressionQuote}"
                        </div>

                        <div className="persona-verdict-line">
                          <span>Đánh giá: <strong>{persona.verdictQuote}</strong></span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Usability Friction Alerts */}
                  <div className="slide-friction-bar">
                    <Target style={{ width: 14, height: 14, color: '#10B981', flexShrink: 0 }} />
                    <span><strong>Điểm Neo Thị Giác:</strong> {usabilityResult.fiveSecondTest.focalPointDetected} • Ước tính {usabilityResult.jtbdEfficiency.estimatedClicksToComplete} lần chạm để hoàn tất mục tiêu.</span>
                  </div>
                </section>
              )}

              {/* SLIDE 4: LỘ TRÌNH TRIỂN KHAI & RÀO CẢN PHÒNG THỦ (MOAT) */}
              {currentSlide === 4 && feasibilityResult && (
                <section className="executive-slide slide-fade-in">
                  <div className="slide-hero-header">
                    <span className="slide-eyebrow">05 / 05 • EXECUTION &amp; DEFENSE MOAT</span>
                    <h3 className="slide-headline">Lộ Trình Triển Khai &amp; Xây Dựng Rào Cản Phòng Thủ</h3>
                    <p className="slide-subline">Các mốc hành động cụ thể để biến PoC thành sản phẩm có rào cản công nghệ</p>
                  </div>

                  {/* 3 Metric Summary Boxes */}
                  <div className="slide-meta-triplet">
                    <div className="meta-box">
                      <Clock style={{ width: 16, height: 16, color: '#38BDF8' }} />
                      <div>
                        <span className="m-lbl">Thời gian xây dựng</span>
                        <strong className="m-val">{feasibilityResult.estimatedTimeline}</strong>
                      </div>
                    </div>

                    <div className="meta-box">
                      <DollarSign style={{ width: 16, height: 16, color: '#10B981' }} />
                      <div>
                        <span className="m-lbl">Dự toán ngân sách</span>
                        <strong className="m-val">{feasibilityResult.estimatedCost}</strong>
                      </div>
                    </div>

                    <div className="meta-box">
                      <Users style={{ width: 16, height: 16, color: '#A78BFA' }} />
                      <div>
                        <span className="m-lbl">Nhóm mục tiêu</span>
                        <strong className="m-val">{feasibilityResult.targetUsers.slice(0, 32)}...</strong>
                      </div>
                    </div>
                  </div>

                  {/* 3 Action Milestones */}
                  <div className="slide-milestones-row">
                    {feasibilityResult.nextSteps.map((step, idx) => (
                      <div key={idx} className="milestone-card">
                        <span className="step-idx">BƯỚC 0{idx + 1}</span>
                        <h4>{step}</h4>
                      </div>
                    ))}
                  </div>

                  {/* Defensibility Moat Insight */}
                  {feasibilityResult.competitorInsight && (
                    <div className="slide-moat-banner">
                      <Shield style={{ width: 15, height: 15, color: '#A78BFA', flexShrink: 0 }} />
                      <div>
                        <strong>Rào Cản Cạnh Tranh (Moat):</strong> {feasibilityResult.competitorInsight}
                      </div>
                    </div>
                  )}
                </section>
              )}
            </div>
          ) : (
            /* =============================================================== */
            /* DOCUMENT MODE (SCROLLABLE COMPREHENSIVE TEXT VIEW)              */
            /* =============================================================== */
            <div className="deck-doc-scrollable">
              {feasibilityResult && (
                <div className="doc-section-card">
                  <h4>1. Tổng quan Khả thi &amp; Thị trường</h4>
                  <p>{feasibilityResult.summary}</p>
                </div>
              )}
              {necessityResult && (
                <div className="doc-section-card">
                  <h4>2. Thẩm định Cần AI Không ({necessityResult.overallScore}%)</h4>
                  <p>{necessityResult.summary}</p>
                </div>
              )}
              {visualResult && (
                <div className="doc-section-card">
                  <h4>3. Thẩm định Thẩm mỹ Thị giác ({visualResult.overallScore}/100)</h4>
                  <p>{visualResult.summary}</p>
                </div>
              )}
              {usabilityResult && (
                <div className="doc-section-card">
                  <h4>4. Thử nghiệm Trải nghiệm Usability ({usabilityResult.overallUsabilityScore}/100)</h4>
                  <p>{usabilityResult.summary}</p>
                </div>
              )}
            </div>
          )}
        </main>

        {/* Bottom Slide Controller Bar */}
        <footer className="deck-bottom-controller">
          <div className="slide-counter-badge">
            <span>SLIDE 0{currentSlide + 1} / 05</span>
          </div>

          <div className="slide-dots-stepper">
            {[0, 1, 2, 3, 4].map(idx => (
              <button
                key={idx}
                type="button"
                className={`dot-indicator ${currentSlide === idx ? 'active' : ''}`}
                onClick={() => setCurrentSlide(idx)}
                aria-label={`Chuyển đến Slide 0${idx + 1}`}
              />
            ))}
          </div>

          <div className="deck-nav-buttons">
            <span className="kbd-hint">Dùng phím mũi tên ← → để lướt</span>

            <button
              type="button"
              className="deck-nav-btn prev"
              disabled={currentSlide === 0}
              onClick={() => setCurrentSlide(prev => Math.max(0, prev - 1))}
            >
              <ChevronLeft style={{ width: 14, height: 14 }} />
              <span>Trước</span>
            </button>

            <button
              type="button"
              className="deck-nav-btn next"
              disabled={currentSlide === 4}
              onClick={() => setCurrentSlide(prev => Math.min(4, prev + 1))}
            >
              <span>Tiếp Theo</span>
              <ChevronRight style={{ width: 14, height: 14 }} />
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
};
