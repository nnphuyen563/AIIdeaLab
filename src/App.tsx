import React, { useState } from 'react';
import { PromptingIsAllYouNeed, SimulationTelemetry } from './components/canvas/PromptingIsAllYouNeed';
import { StitchChatBar } from './components/chat/StitchChatBar';
import { StitchStudio } from './components/studio/StitchStudio';
import { FooterStatusBar } from './components/ui/FooterStatusBar';
import { ApiKeyModal } from './components/settings/ApiKeyModal';
import { 
  AppConceptResult, 
  generateAppConcept 
} from './services/aiService';
import { Sparkles } from 'lucide-react';

import { LockerAuthModal } from './components/auth/LockerAuthModal';
import { 
  isUserAuthenticated, 
  getCurrentAuthUser,
  AuthUser 
} from './services/supabaseService';

export const App: React.FC = () => {
  const [viewMode, setViewMode] = useState<'initial' | 'studio'>('initial');
  const [currentPrompt, setCurrentPrompt] = useState('Retro Pong Hero Section');
  const [generatedConcept, setGeneratedConcept] = useState<AppConceptResult | null>(null);
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => getCurrentAuthUser());
  const [activeVariantCount, setActiveVariantCount] = useState<number>(3);
  const [pendingIdea, setPendingIdea] = useState<{
    prompt: string;
    mode: 'app' | 'web';
    model: string;
    presetId?: string;
    customDesignMd?: string;
    variantCount?: number;
  } | null>(null);

  const [, setTelemetry] = useState<SimulationTelemetry>({
    fps: 60,
    totalPixels: 0,
    remainingPixels: 0,
    collisions: 0,
    ballSpeed: 5.5,
    aiAccuracy: 99.4
  });

  const [resetSignal] = useState(0);
  const [headline] = useState('IDEA');
  const [subheadline] = useState('IS ALL YOU NEED');
  const [lastActionMessage, setLastActionMessage] = useState<string | null>(null);
  const [activePresetId, setActivePresetId] = useState<string | undefined>(undefined);
  const [activeCustomDesignMd, setActiveCustomDesignMd] = useState<string | undefined>(undefined);

  const executeGeneration = async (
    prompt: string, 
    mode: 'app' | 'web', 
    model: string,
    presetId?: string,
    customDesignMd?: string,
    variantCount: number = 3
  ) => {
    setCurrentPrompt(prompt);
    setActivePresetId(presetId);
    setActiveCustomDesignMd(customDesignMd);
    setActiveVariantCount(variantCount);
    setIsAiGenerating(true);
    setLastActionMessage(`AI đang brainstorm DESIGN.md và kiến tạo ${variantCount} màn hình độc lập...`);

    try {
      const concept = await generateAppConcept(
        prompt, 
        mode, 
        model as any, 
        [], 
        undefined, 
        presetId, 
        customDesignMd
      );
      setGeneratedConcept(concept);
      // Move user into the main Stitch Studio UI with the generated concept
      setViewMode('studio');
    } catch (err) {
      console.error('Failed to generate app concept:', err);
      // Fallback transition still moves to studio
      setViewMode('studio');
    } finally {
      setIsAiGenerating(false);
      setLastActionMessage(null);
    }
  };

  const handleSubmitPrompt = async (
    prompt: string, 
    mode: 'app' | 'web', 
    model: string,
    presetId?: string,
    customDesignMd?: string,
    variantCount: number = 3
  ) => {
    // If user is not yet logged in or registered, prompt them with the Vault Auth modal!
    if (!isUserAuthenticated()) {
      setPendingIdea({ prompt, mode, model, presetId, customDesignMd, variantCount });
      setShowAuthModal(true);
      return;
    }

    // Already authenticated, proceed directly
    await executeGeneration(prompt, mode, model, presetId, customDesignMd, variantCount);
  };

  const handleAuthSuccess = (user: AuthUser) => {
    setCurrentUser(user);
    setShowAuthModal(false);
    if (pendingIdea) {
      executeGeneration(
        pendingIdea.prompt,
        pendingIdea.mode,
        pendingIdea.model,
        pendingIdea.presetId,
        pendingIdea.customDesignMd,
        pendingIdea.variantCount || 3
      );
      setPendingIdea(null);
    }
  };

  // If moved into the Main App UI, render StitchStudio
  if (viewMode === 'studio') {
    return (
      <StitchStudio
        initialPrompt={currentPrompt}
        initialConcept={generatedConcept || undefined}
        initialPresetId={activePresetId}
        initialCustomDesignMd={activeCustomDesignMd}
        initialVariantCount={activeVariantCount}
        onBackToHero={() => setViewMode('initial')}
      />
    );
  }

  return (
    <div className="app-viewport">
      {/* Background Simulation Canvas */}
      <PromptingIsAllYouNeed
        onTelemetryUpdate={setTelemetry}
        resetSignal={resetSignal}
        headline={headline}
        subheadline={subheadline}
      />

      {/* Top Right Locker Auth Gateway (Fixed coordinate, large target >= 48px, high contrast) */}
      <div style={{ position: 'fixed', top: '1.5rem', right: '1.75rem', zIndex: 9999, pointerEvents: 'auto' }}>
        {currentUser ? (
          <button
            type="button"
            onClick={() => setShowAuthModal(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              height: '48px',
              padding: '0 1.25rem',
              background: '#0B0F19',
              border: '1.5px solid rgba(255, 255, 255, 0.28)',
              borderRadius: '12px',
              fontSize: '0.9375rem',
              fontWeight: 600,
              color: '#FFFFFF',
              cursor: 'pointer',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.8)',
              transition: 'all 0.15s ease',
              pointerEvents: 'auto'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#151C2C';
              e.currentTarget.style.borderColor = '#10B981';
              e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#0B0F19';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.28)';
              e.currentTarget.style.transform = 'none';
            }}
          >
            <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#10B981' }} />
            <span>Locker: <strong style={{ color: '#34D399' }}>{currentUser.handle}</strong></span>
            <span style={{
              fontSize: '0.75rem',
              padding: '0.2rem 0.5rem',
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '6px',
              color: '#CBD5E1'
            }}>
              Đổi
            </span>
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setShowAuthModal(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              height: '48px',
              padding: '0 1.5rem',
              background: '#0B0F19',
              border: '1.5px solid rgba(255, 255, 255, 0.3)',
              borderRadius: '12px',
              fontSize: '1rem',
              fontWeight: 700,
              color: '#FFFFFF',
              cursor: 'pointer',
              boxShadow: '0 2px 6px rgba(0, 0, 0, 0.5)',
              transition: 'all 0.15s ease',
              pointerEvents: 'auto'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#151C2C';
              e.currentTarget.style.borderColor = '#10B981';
              e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#0B0F19';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)';
              e.currentTarget.style.transform = 'none';
            }}
          >
            {/* Custom SVG Padlock */}
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#10B981" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              <circle cx="12" cy="16" r="1.5" fill="#10B981" />
            </svg>
            <span>Đăng nhập Locker</span>
          </button>
        )}
      </div>

      {/* Center Spacer with notification badge */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
        {lastActionMessage && (
          <div style={{
            background: 'rgba(16, 185, 129, 0.12)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            color: '#34D399',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.75rem',
            padding: '0.35rem 0.85rem',
            borderRadius: '9999px',
            marginBottom: '0.75rem',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            backdropFilter: 'blur(10px)',
            animation: 'pulse 1.5s infinite'
          }}>
            <Sparkles style={{ width: 12, height: 12 }} />
            <span>{lastActionMessage}</span>
          </div>
        )}
      </div>

      {/* Floating Stitch Chat Bar (Exact 2nd image layout) */}
      <StitchChatBar 
        onSubmitPrompt={handleSubmitPrompt}
        onOpenApiKeyModal={() => setShowApiKeyModal(true)}
        isGenerating={isAiGenerating}
      />

      {/* Footer Status Bar */}
      <FooterStatusBar />

      {/* AI API Configuration Modal */}
      <ApiKeyModal
        isOpen={showApiKeyModal}
        onClose={() => setShowApiKeyModal(false)}
      />

      {/* User Locker Security Auth Gateway (Non-generic, Zero Lucide Icons) */}
      <LockerAuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        pendingIdeaPrompt={pendingIdea?.prompt}
        onAuthSuccess={handleAuthSuccess}
        currentUser={currentUser}
        onLogout={() => setCurrentUser(null)}
      />
    </div>
  );
};

export default App;
