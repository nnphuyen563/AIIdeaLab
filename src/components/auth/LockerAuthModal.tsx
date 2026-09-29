import React, { useState } from 'react';
import { 
  loginUser, 
  registerUser, 
  quickGuestPass, 
  logoutUser,
  AuthUser 
} from '../../services/supabaseService';

interface LockerAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  pendingIdeaPrompt?: string;
  onAuthSuccess: (user: AuthUser) => void;
  currentUser?: AuthUser | null;
  onLogout?: () => void;
}

export const LockerAuthModal: React.FC<LockerAuthModalProps> = ({
  isOpen,
  onClose,
  pendingIdeaPrompt,
  onAuthSuccess,
  currentUser,
  onLogout
}) => {
  const [tab, setTab] = useState<'login' | 'register'>('login');
  const [identifier, setIdentifier] = useState('');
  const [handle, setHandle] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsLoading(true);

    try {
      const res = await loginUser(identifier, password);
      if (res.success && res.user) {
        onAuthSuccess(res.user);
      } else {
        setErrorMsg(res.error || 'Đăng nhập không thành công. Vui lòng kiểm tra lại tài khoản.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Lỗi kết nối cơ sở dữ liệu.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsLoading(true);

    try {
      const res = await registerUser(handle, email, password);
      if (res.success && res.user) {
        onAuthSuccess(res.user);
      } else {
        setErrorMsg(res.error || 'Khởi tạo tài khoản không thành công.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Lỗi kết nối cơ sở dữ liệu.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickGuest = () => {
    const guest = quickGuestPass();
    onAuthSuccess(guest);
  };

  const handleLogoutClick = async () => {
    await logoutUser();
    if (onLogout) {
      onLogout();
    }
    onClose();
  };

  return (
    <div 
      className="modal-overlay" 
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 10000,
        backgroundColor: 'rgba(3, 6, 12, 0.92)',
        backdropFilter: 'blur(16px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
        pointerEvents: 'auto'
      }}
    >
      <div 
        className="vault-auth-card"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '520px',
          background: '#0B0F19',
          border: '1.5px solid rgba(255, 255, 255, 0.22)',
          borderRadius: '20px',
          boxShadow: '0 30px 80px rgba(0, 0, 0, 0.95), 0 0 0 1px rgba(255, 255, 255, 0.08)',
          padding: '2.25rem',
          position: 'relative',
          color: '#FFFFFF',
          pointerEvents: 'auto'
        }}
      >
        {/* Close Button - 40x40px for high accessibility */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Đóng cửa sổ"
          style={{
            position: 'absolute',
            top: '1.25rem',
            right: '1.25rem',
            background: 'rgba(255, 255, 255, 0.08)',
            border: '1.5px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '10px',
            width: '40px',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFFFFF',
            cursor: 'pointer',
            transition: 'all 0.15s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.16)';
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
          }}
        >
          {/* Custom inline SVG Close Icon */}
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {/* Modal Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '0.65rem' }}>
          <div style={{
            width: '46px',
            height: '46px',
            borderRadius: '12px',
            background: 'rgba(16, 185, 129, 0.16)',
            border: '1.5px solid rgba(16, 185, 129, 0.45)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#34D399',
            flexShrink: 0
          }}>
            {/* Custom SVG Vault Padlock */}
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              <circle cx="12" cy="16" r="1.5" fill="currentColor" />
            </svg>
          </div>
          <div>
            <h2 style={{
              fontSize: '1.4375rem',
              fontWeight: 700,
              color: '#FFFFFF',
              margin: 0,
              letterSpacing: '-0.02em',
              lineHeight: 1.2
            }}>
              Mở khóa Locker Thiết kế
            </h2>
          </div>
        </div>

        {/* High-Contrast Subtitle (WCAG AAA compliant: #CBD5E1 on #0B0F19 > 10:1) */}
        <p style={{
          fontSize: '0.9375rem',
          color: '#CBD5E1',
          lineHeight: 1.5,
          marginTop: '0.5rem',
          marginBottom: '1.25rem'
        }}>
          Lưu trữ toàn bộ mã nguồn HTML, biến thể màn hình và đặc tả <strong>DESIGN.md</strong> an toàn trên Cloud Database.
        </p>

        {/* If user is already logged in, show current session banner with quick logout / switch options */}
        {currentUser && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0.85rem 1.15rem',
            background: '#131A29',
            border: '1px solid rgba(16, 185, 129, 0.35)',
            borderRadius: '12px',
            marginBottom: '1.25rem',
            gap: '0.75rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#10B981' }} />
              <div style={{ fontSize: '0.9375rem', color: '#F8FAFC' }}>
                Đang mở Locker: <strong style={{ color: '#34D399' }}>{currentUser.handle}</strong>
              </div>
            </div>
            <button
              type="button"
              onClick={handleLogoutClick}
              style={{
                height: '34px',
                padding: '0 0.85rem',
                background: 'rgba(239, 68, 68, 0.16)',
                border: '1px solid rgba(239, 68, 68, 0.4)',
                borderRadius: '8px',
                color: '#FCA5A5',
                fontSize: '0.8125rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(239, 68, 68, 0.28)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(239, 68, 68, 0.16)';
              }}
            >
              Đăng xuất
            </button>
          </div>
        )}

        {/* Pending Idea Preview Callout */}
        {pendingIdeaPrompt && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.65rem',
            padding: '0.85rem 1.15rem',
            background: 'rgba(16, 185, 129, 0.12)',
            border: '1px solid rgba(16, 185, 129, 0.35)',
            borderRadius: '12px',
            marginBottom: '1.25rem',
            fontSize: '0.9375rem',
            color: '#F8FAFC'
          }}>
            {/* Custom SVG Sparkles in Emerald */}
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#34D399" strokeWidth="2" style={{ flexShrink: 0 }}>
              <path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3L12 3z" />
            </svg>
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              Ý tưởng chờ tạo: <strong style={{ color: '#34D399' }}>"{pendingIdeaPrompt}"</strong>
            </span>
          </div>
        )}

        {/* High-Contrast Segmented Mode Switcher (46px height per button) */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          background: '#07090F',
          padding: '4px',
          borderRadius: '12px',
          marginBottom: '1.5rem',
          border: '1.5px solid rgba(255, 255, 255, 0.16)'
        }}>
          <button
            type="button"
            onClick={() => { setTab('login'); setErrorMsg(null); }}
            style={{
              height: '44px',
              borderRadius: '9px',
              border: tab === 'login' ? '1px solid rgba(255, 255, 255, 0.25)' : 'none',
              background: tab === 'login' ? '#1F293D' : 'transparent',
              color: tab === 'login' ? '#FFFFFF' : '#CBD5E1',
              fontSize: '0.9375rem',
              fontWeight: tab === 'login' ? 700 : 600,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              boxShadow: tab === 'login' ? '0 2px 8px rgba(0, 0, 0, 0.4)' : 'none'
            }}
          >
            Đăng nhập
          </button>
          <button
            type="button"
            onClick={() => { setTab('register'); setErrorMsg(null); }}
            style={{
              height: '44px',
              borderRadius: '9px',
              border: tab === 'register' ? '1px solid rgba(16, 185, 129, 0.5)' : 'none',
              background: tab === 'register' ? 'rgba(16, 185, 129, 0.22)' : 'transparent',
              color: tab === 'register' ? '#34D399' : '#CBD5E1',
              fontSize: '0.9375rem',
              fontWeight: tab === 'register' ? 700 : 600,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              boxShadow: tab === 'register' ? '0 2px 8px rgba(0, 0, 0, 0.4)' : 'none'
            }}
          >
            Tạo tài khoản mới
          </button>
        </div>

        {/* Error Notification Banner */}
        {errorMsg && (
          <div style={{
            padding: '0.85rem 1.15rem',
            background: 'rgba(239, 68, 68, 0.16)',
            border: '1.5px solid rgba(239, 68, 68, 0.45)',
            borderRadius: '12px',
            color: '#FCA5A5',
            fontSize: '0.9375rem',
            marginBottom: '1.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem'
          }}>
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.2" style={{ flexShrink: 0 }}>
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form Tab 1: LOGIN */}
        {tab === 'login' ? (
          <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <label style={{
                display: 'block',
                fontSize: '0.9375rem',
                fontWeight: 600,
                color: '#F8FAFC',
                marginBottom: '0.5rem'
              }}>
                Tên đăng nhập hoặc Email
              </label>
              <input
                type="text"
                required
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="Nhập tên tài khoản hoặc email..."
                style={{
                  width: '100%',
                  height: '48px',
                  background: '#07090F',
                  border: '1.5px solid rgba(255, 255, 255, 0.25)',
                  borderRadius: '11px',
                  padding: '0 1.15rem',
                  color: '#FFFFFF',
                  fontSize: '1rem',
                  outline: 'none',
                  boxSizing: 'border-box',
                  transition: 'all 0.15s ease'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#10B981';
                  e.target.style.boxShadow = '0 0 0 3px rgba(16, 185, 129, 0.3)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(255, 255, 255, 0.25)';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>

            <div>
              <label style={{
                display: 'block',
                fontSize: '0.9375rem',
                fontWeight: 600,
                color: '#F8FAFC',
                marginBottom: '0.5rem'
              }}>
                Mật mã truy cập
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Nhập mật mã bảo vệ..."
                style={{
                  width: '100%',
                  height: '48px',
                  background: '#07090F',
                  border: '1.5px solid rgba(255, 255, 255, 0.25)',
                  borderRadius: '11px',
                  padding: '0 1.15rem',
                  color: '#FFFFFF',
                  fontSize: '1rem',
                  outline: 'none',
                  boxSizing: 'border-box',
                  transition: 'all 0.15s ease'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#10B981';
                  e.target.style.boxShadow = '0 0 0 3px rgba(16, 185, 129, 0.3)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(255, 255, 255, 0.25)';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>

            {/* Primary Action Button - 52px height, High-Contrast 11.5:1 ratio */}
            <button
              type="submit"
              disabled={isLoading}
              style={{
                width: '100%',
                height: '52px',
                marginTop: '0.5rem',
                borderRadius: '11px',
                border: 'none',
                background: '#10B981',
                color: '#050811',
                fontSize: '1rem',
                fontWeight: 700,
                cursor: isLoading ? 'wait' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.65rem',
                boxShadow: '0 6px 20px -2px rgba(16, 185, 129, 0.5)',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={(e) => {
                if (!isLoading) e.currentTarget.style.background = '#34D399';
              }}
              onMouseLeave={(e) => {
                if (!isLoading) e.currentTarget.style.background = '#10B981';
              }}
            >
              {isLoading ? (
                <span>Đang xác thực...</span>
              ) : (
                <>
                  <span>Mở khóa Locker &amp; Tạo Prototype</span>
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </>
              )}
            </button>
          </form>
        ) : (
          /* Form Tab 2: REGISTER */
          <form onSubmit={handleRegisterSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <label style={{
                display: 'block',
                fontSize: '0.9375rem',
                fontWeight: 600,
                color: '#F8FAFC',
                marginBottom: '0.5rem'
              }}>
                Tên tài khoản (Locker Handle) *
              </label>
              <input
                type="text"
                required
                value={handle}
                onChange={(e) => setHandle(e.target.value)}
                placeholder="VD: alex_coder, dev_proto..."
                style={{
                  width: '100%',
                  height: '48px',
                  background: '#07090F',
                  border: '1.5px solid rgba(255, 255, 255, 0.25)',
                  borderRadius: '11px',
                  padding: '0 1.15rem',
                  color: '#FFFFFF',
                  fontSize: '1rem',
                  outline: 'none',
                  boxSizing: 'border-box',
                  transition: 'all 0.15s ease'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#10B981';
                  e.target.style.boxShadow = '0 0 0 3px rgba(16, 185, 129, 0.3)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(255, 255, 255, 0.25)';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>

            <div>
              <label style={{
                display: 'block',
                fontSize: '0.9375rem',
                fontWeight: 600,
                color: '#F8FAFC',
                marginBottom: '0.5rem'
              }}>
                Email Supabase (Tùy chọn)
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="designer@domain.com"
                style={{
                  width: '100%',
                  height: '48px',
                  background: '#07090F',
                  border: '1.5px solid rgba(255, 255, 255, 0.25)',
                  borderRadius: '11px',
                  padding: '0 1.15rem',
                  color: '#FFFFFF',
                  fontSize: '1rem',
                  outline: 'none',
                  boxSizing: 'border-box',
                  transition: 'all 0.15s ease'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#10B981';
                  e.target.style.boxShadow = '0 0 0 3px rgba(16, 185, 129, 0.3)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(255, 255, 255, 0.25)';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>

            <div>
              <label style={{
                display: 'block',
                fontSize: '0.9375rem',
                fontWeight: 600,
                color: '#F8FAFC',
                marginBottom: '0.5rem'
              }}>
                Mật mã bảo vệ
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Tối thiểu 6 ký tự..."
                style={{
                  width: '100%',
                  height: '48px',
                  background: '#07090F',
                  border: '1.5px solid rgba(255, 255, 255, 0.25)',
                  borderRadius: '11px',
                  padding: '0 1.15rem',
                  color: '#FFFFFF',
                  fontSize: '1rem',
                  outline: 'none',
                  boxSizing: 'border-box',
                  transition: 'all 0.15s ease'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#10B981';
                  e.target.style.boxShadow = '0 0 0 3px rgba(16, 185, 129, 0.3)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(255, 255, 255, 0.25)';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              style={{
                width: '100%',
                height: '52px',
                marginTop: '0.5rem',
                borderRadius: '11px',
                border: 'none',
                background: '#10B981',
                color: '#050811',
                fontSize: '1rem',
                fontWeight: 700,
                cursor: isLoading ? 'wait' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.65rem',
                boxShadow: '0 6px 20px -2px rgba(16, 185, 129, 0.5)',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={(e) => {
                if (!isLoading) e.currentTarget.style.background = '#34D399';
              }}
              onMouseLeave={(e) => {
                if (!isLoading) e.currentTarget.style.background = '#10B981';
              }}
            >
              {isLoading ? (
                <span>Đang khởi tạo Locker...</span>
              ) : (
                <>
                  <span>Khởi tạo Locker &amp; Bắt đầu</span>
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </>
              )}
            </button>
          </form>
        )}

        {/* Secondary Actions Row: High-Contrast Guest Pass & DB Info */}
        <div style={{
          marginTop: '1.75rem',
          paddingTop: '1.25rem',
          borderTop: '1px solid rgba(255, 255, 255, 0.12)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem'
        }}>
          <button
            type="button"
            onClick={handleQuickGuest}
            style={{
              height: '44px',
              padding: '0 1.25rem',
              background: '#131A29',
              border: '1.5px solid rgba(255, 255, 255, 0.22)',
              borderRadius: '10px',
              color: '#FFFFFF',
              fontSize: '0.9375rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.55rem',
              transition: 'all 0.15s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#1A2338';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#131A29';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.22)';
            }}
          >
            {/* Custom Lightning SVG in Emerald */}
            <svg viewBox="0 0 24 24" width="16" height="16" fill="#10B981">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
            </svg>
            <span>Dùng thử nhanh (Guest Pass)</span>
          </button>

          <span style={{ fontSize: '0.8125rem', color: '#CBD5E1', fontWeight: 500 }}>
            Supabase Cloud DB
          </span>
        </div>
      </div>
    </div>
  );
};
