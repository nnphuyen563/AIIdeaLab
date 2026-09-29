import React, { useState, useEffect } from 'react';
import {
  X,
  Target,
  TrendingUp,
  Shield,
  Clock,
  DollarSign,
  Users,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  Loader2,
  BarChart3,
  Zap,
  Lightbulb,
  ChevronRight
} from 'lucide-react';
import { FeasibilityScore, evaluateFeasibility, hasValidApiKey } from '../../services/aiService';

interface FeasibilityPanelProps {
  isOpen: boolean;
  onClose: () => void;
  idea: string;
  mockHtml: string;
  specSummary: string;
}

interface ScoreGaugeProps {
  label: string;
  score: number;
  icon: React.ReactNode;
  color: string;
  delay?: number;
}

const ScoreGauge: React.FC<ScoreGaugeProps> = ({ label, score, icon, color, delay = 0 }) => {
  const [animatedScore, setAnimatedScore] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const visTimer = setTimeout(() => setIsVisible(true), delay);
    const scoreTimer = setTimeout(() => {
      let current = 0;
      const step = score / 30;
      const interval = setInterval(() => {
        current += step;
        if (current >= score) {
          current = score;
          clearInterval(interval);
        }
        setAnimatedScore(Math.round(current));
      }, 20);
      return () => clearInterval(interval);
    }, delay + 200);
    return () => { clearTimeout(visTimer); clearTimeout(scoreTimer); };
  }, [score, delay]);

  const circumference = 2 * Math.PI * 28;
  const strokeDashoffset = circumference - (circumference * animatedScore) / 100;

  return (
    <div className={`feasibility-gauge-card ${isVisible ? 'visible' : ''}`}>
      <div className="gauge-ring-container">
        <svg width="64" height="64" viewBox="0 0 64 64">
          <circle cx="32" cy="32" r="28" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="4" />
          <circle
            cx="32" cy="32" r="28" fill="none"
            stroke={color}
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            transform="rotate(-90 32 32)"
            style={{ transition: 'stroke-dashoffset 0.8s cubic-bezier(0.16, 1, 0.3, 1)' }}
          />
        </svg>
        <div className="gauge-value" style={{ color }}>{animatedScore}</div>
      </div>
      <div className="gauge-meta">
        <div className="gauge-icon" style={{ color }}>{icon}</div>
        <span className="gauge-label">{label}</span>
      </div>
    </div>
  );
};

export const FeasibilityPanel: React.FC<FeasibilityPanelProps> = ({
  isOpen,
  onClose,
  idea,
  mockHtml,
  specSummary
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<FeasibilityScore | null>(null);
  const [hasRun, setHasRun] = useState(false);

  const runEvaluation = async () => {
    setIsLoading(true);
    try {
      const score = await evaluateFeasibility(idea, mockHtml, specSummary);
      setResult(score);
      setHasRun(true);
    } catch (err) {
      console.error('Feasibility evaluation failed:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-run when panel opens if not already evaluated
  useEffect(() => {
    if (isOpen && !hasRun && idea.trim()) {
      runEvaluation();
    }
  }, [isOpen, idea]);

  if (!isOpen) return null;

  const getScoreColor = (score: number) => {
    if (score >= 80) return '#10B981';
    if (score >= 60) return '#F59E0B';
    if (score >= 40) return '#F97316';
    return '#EF4444';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 85) return 'Xuất sắc';
    if (score >= 70) return 'Tốt';
    if (score >= 55) return 'Khá';
    if (score >= 40) return 'Trung bình';
    return 'Cần cải thiện';
  };

  return (
    <div className="feasibility-panel-overlay" onClick={onClose}>
      <div className="feasibility-panel" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="feasibility-header">
          <div className="feasibility-title-group">
            <div className="feasibility-icon-badge">
              <BarChart3 style={{ width: 18, height: 18, color: '#38BDF8' }} />
            </div>
            <div>
              <h2 className="feasibility-title">Feasibility & Evaluation</h2>
              <p className="feasibility-subtitle">AI-powered prototype validation</p>
            </div>
          </div>
          <button type="button" className="feasibility-close-btn" onClick={onClose}>
            <X style={{ width: 16, height: 16 }} />
          </button>
        </div>

        {/* Content */}
        <div className="feasibility-body">
          {isLoading ? (
            <div className="feasibility-loading">
              <div className="feasibility-loading-ring">
                <Loader2 className="spin-icon" style={{ width: 32, height: 32, color: '#38BDF8' }} />
              </div>
              <div className="feasibility-loading-text">
                <span>AI đang phân tích prototype...</span>
                <span className="feasibility-loading-sub">Đánh giá tính khả thi, thị trường và rủi ro</span>
              </div>
            </div>
          ) : result ? (
            <>
              {/* Overall Score Hero */}
              <div className="feasibility-hero-score">
                <div className="hero-score-ring">
                  <svg width="100" height="100" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="44" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="6" />
                    <circle
                      cx="50" cy="50" r="44" fill="none"
                      stroke={getScoreColor(result.overallScore)}
                      strokeWidth="6"
                      strokeLinecap="round"
                      strokeDasharray={2 * Math.PI * 44}
                      strokeDashoffset={2 * Math.PI * 44 - (2 * Math.PI * 44 * result.overallScore) / 100}
                      transform="rotate(-90 50 50)"
                      style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(0.16, 1, 0.3, 1)' }}
                    />
                  </svg>
                  <div className="hero-score-value" style={{ color: getScoreColor(result.overallScore) }}>
                    {result.overallScore}
                  </div>
                </div>
                <div className="hero-score-meta">
                  <span className="hero-score-label" style={{ color: getScoreColor(result.overallScore) }}>
                    {getScoreLabel(result.overallScore)}
                  </span>
                  <span className="hero-score-idea">"{idea.slice(0, 50)}{idea.length > 50 ? '...' : ''}"</span>
                </div>
              </div>

              {/* Score Gauges Grid */}
              <div className="feasibility-gauges-grid">
                <ScoreGauge label="Kỹ thuật" score={result.technicalFeasibility} icon={<Zap style={{ width: 13, height: 13 }} />} color={getScoreColor(result.technicalFeasibility)} delay={100} />
                <ScoreGauge label="Thị trường" score={result.marketFit} icon={<Target style={{ width: 13, height: 13 }} />} color={getScoreColor(result.marketFit)} delay={200} />
                <ScoreGauge label="PoC sẵn sàng" score={result.pocReadiness} icon={<CheckCircle2 style={{ width: 13, height: 13 }} />} color={getScoreColor(result.pocReadiness)} delay={300} />
                <ScoreGauge label="Tài nguyên" score={result.resourceEstimate} icon={<DollarSign style={{ width: 13, height: 13 }} />} color={getScoreColor(result.resourceEstimate)} delay={400} />
                <ScoreGauge label="Rủi ro thấp" score={result.riskLevel} icon={<Shield style={{ width: 13, height: 13 }} />} color={getScoreColor(result.riskLevel)} delay={500} />
                <ScoreGauge label="Giá trị KD" score={result.businessValue} icon={<TrendingUp style={{ width: 13, height: 13 }} />} color={getScoreColor(result.businessValue)} delay={600} />
              </div>

              {/* Summary */}
              <div className="feasibility-section">
                <div className="feasibility-section-header">
                  <Lightbulb style={{ width: 14, height: 14, color: '#F59E0B' }} />
                  <span>Tổng quan</span>
                </div>
                <p className="feasibility-summary-text">{result.summary}</p>
              </div>

              {/* Meta Cards */}
              <div className="feasibility-meta-grid">
                <div className="feasibility-meta-card">
                  <Clock style={{ width: 14, height: 14, color: '#38BDF8' }} />
                  <div>
                    <span className="meta-card-label">Thời gian</span>
                    <span className="meta-card-value">{result.estimatedTimeline}</span>
                  </div>
                </div>
                <div className="feasibility-meta-card">
                  <DollarSign style={{ width: 14, height: 14, color: '#10B981' }} />
                  <div>
                    <span className="meta-card-label">Chi phí</span>
                    <span className="meta-card-value">{result.estimatedCost}</span>
                  </div>
                </div>
                <div className="feasibility-meta-card">
                  <Users style={{ width: 14, height: 14, color: '#A78BFA' }} />
                  <div>
                    <span className="meta-card-label">Người dùng mục tiêu</span>
                    <span className="meta-card-value">{result.targetUsers}</span>
                  </div>
                </div>
              </div>

              {/* Recommendations */}
              <div className="feasibility-section">
                <div className="feasibility-section-header">
                  <CheckCircle2 style={{ width: 14, height: 14, color: '#10B981' }} />
                  <span>Khuyến nghị</span>
                </div>
                <div className="feasibility-list">
                  {result.recommendations.map((rec, i) => (
                    <div key={i} className="feasibility-list-item recommendation">
                      <ChevronRight style={{ width: 12, height: 12, color: '#10B981', flexShrink: 0 }} />
                      <span>{rec}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Risks */}
              <div className="feasibility-section">
                <div className="feasibility-section-header">
                  <AlertTriangle style={{ width: 14, height: 14, color: '#F59E0B' }} />
                  <span>Rủi ro cần lưu ý</span>
                </div>
                <div className="feasibility-list">
                  {result.risks.map((risk, i) => (
                    <div key={i} className="feasibility-list-item risk">
                      <AlertTriangle style={{ width: 12, height: 12, color: '#F59E0B', flexShrink: 0 }} />
                      <span>{risk}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Next Steps */}
              <div className="feasibility-section">
                <div className="feasibility-section-header">
                  <ArrowRight style={{ width: 14, height: 14, color: '#38BDF8' }} />
                  <span>Bước tiếp theo</span>
                </div>
                <div className="feasibility-list">
                  {result.nextSteps.map((step, i) => (
                    <div key={i} className="feasibility-list-item next-step">
                      <span className="step-number">{i + 1}</span>
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Competitor Insight */}
              {result.competitorInsight && (
                <div className="feasibility-section">
                  <div className="feasibility-section-header">
                    <Target style={{ width: 14, height: 14, color: '#A78BFA' }} />
                    <span>Phân tích cạnh tranh</span>
                  </div>
                  <p className="feasibility-summary-text">{result.competitorInsight}</p>
                </div>
              )}

              {/* Re-evaluate button */}
              <button
                type="button"
                className="feasibility-rerun-btn"
                onClick={runEvaluation}
                disabled={isLoading}
              >
                <BarChart3 style={{ width: 14, height: 14 }} />
                <span>Đánh giá lại</span>
              </button>
            </>
          ) : (
            <div className="feasibility-empty">
              <BarChart3 style={{ width: 40, height: 40, color: 'rgba(255,255,255,0.15)' }} />
              <p>Nhập ý tưởng và tạo prototype để bắt đầu đánh giá</p>
              {!hasValidApiKey() && (
                <p className="feasibility-api-hint">
                  💡 Cấu hình API Key để nhận đánh giá AI chuyên sâu
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
