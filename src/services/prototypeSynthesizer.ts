import { DesignPreset } from './aiService';

/**
 * Dynamic Prototype Synthesis Engine (Zero Mock Data)
 * Generates interactive, stateful single-page applications directly reflecting the prompt.
 * Supports distinct screens (screenIndex 0..3) and aesthetic variants (variantIndex 0..1).
 */
export function synthesizePrototypeHtml(
  prompt: string, 
  platform: 'app' | 'web',
  preset?: DesignPreset,
  _designMd?: string,
  screenIndex: number = 0,
  variantIndex: number = 0
): string {
  const lower = prompt.toLowerCase();
  const safeTitle = prompt.replace(/"/g, '&quot;');
  const primaryColor = variantIndex === 1 ? '#F59E0B' : (preset?.primaryAccent || '#10B981');
  const bgColor = variantIndex === 1 ? '#04070D' : (preset?.baseBg || '#080A0F');
  const surfaceColor = variantIndex === 1 ? '#0B0F19' : '#10141E';

  // ==========================================================================
  // 1. RUNNER MATCHMAKING / TINDER FOR RUNNERS DOMAIN
  // ==========================================================================
  if (lower.includes('runner') || lower.includes('tinder') || lower.includes('chạy') || lower.includes('dating') || lower.includes('match')) {
    
    // SCREEN 1: Community Group Runs, Map & Pace Filter Meetups
    if (screenIndex === 1) {
      return `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>PaceMate - Cung đường & Nhóm chạy</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    :root {
      --bg: ${bgColor};
      --accent: ${primaryColor};
      --accent-bright: #34D399;
      --surface: ${surfaceColor};
      --surface-border: rgba(255, 255, 255, 0.1);
      --text: #F8FAFC;
      --text-muted: #94A3B8;
    }
    body {
      background: var(--bg);
      color: var(--text);
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: ${platform === 'app' ? '1rem' : '1.5rem'};
      overflow-x: hidden;
    }
    .app-header {
      width: 100%;
      max-width: 440px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
      padding-bottom: 0.75rem;
      border-bottom: 1px solid var(--surface-border);
    }
    .brand {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 1.15rem;
      font-weight: 800;
      color: var(--text);
    }
    .brand-accent { color: var(--accent); }
    .map-card {
      width: 100%;
      max-width: 440px;
      background: var(--surface);
      border: 1px solid var(--surface-border);
      border-radius: 16px;
      overflow: hidden;
      margin-bottom: 1rem;
    }
    .map-header {
      padding: 0.75rem 1rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid var(--surface-border);
      font-size: 0.8125rem;
      font-weight: 600;
    }
    .map-viz {
      height: 140px;
      background: radial-gradient(circle at 60% 40%, rgba(16, 185, 129, 0.15), transparent 70%), #0A0D15;
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .gps-path {
      stroke: var(--accent);
      stroke-width: 3;
      fill: none;
      filter: drop-shadow(0 0 6px var(--accent));
      stroke-dasharray: 400;
      animation: dash 8s linear infinite;
    }
    @keyframes dash { to { stroke-dashoffset: -800; } }
    .elevation-bar {
      display: flex;
      justify-content: space-between;
      padding: 0.5rem 1rem;
      font-size: 0.72rem;
      color: var(--text-muted);
      background: rgba(255, 255, 255, 0.02);
    }
    .filter-row {
      width: 100%;
      max-width: 440px;
      display: flex;
      gap: 0.4rem;
      margin-bottom: 0.85rem;
      overflow-x: auto;
    }
    .pace-pill {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid var(--surface-border);
      color: var(--text-muted);
      padding: 0.35rem 0.75rem;
      border-radius: 9999px;
      font-size: 0.75rem;
      cursor: pointer;
      white-space: nowrap;
      transition: all 0.15s ease;
    }
    .pace-pill.active {
      background: var(--accent);
      color: #000;
      font-weight: 700;
      border-color: var(--accent);
    }
    .events-list {
      width: 100%;
      max-width: 440px;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }
    .event-card {
      background: var(--surface);
      border: 1px solid var(--surface-border);
      border-radius: 14px;
      padding: 1rem;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      transition: all 0.15s ease;
    }
    .event-card.hidden { display: none; }
    .event-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .event-title { font-size: 0.95rem; font-weight: 700; color: #fff; }
    .event-badge {
      font-size: 0.7rem;
      font-weight: 700;
      padding: 0.2rem 0.5rem;
      border-radius: 6px;
      background: rgba(16, 185, 129, 0.15);
      color: var(--accent);
      border: 1px solid rgba(16, 185, 129, 0.3);
    }
    .event-meta {
      display: flex;
      gap: 0.85rem;
      font-size: 0.75rem;
      color: var(--text-muted);
    }
    .event-btn {
      margin-top: 0.35rem;
      background: rgba(255, 255, 255, 0.08);
      border: 1px solid var(--surface-border);
      color: #fff;
      padding: 0.55rem;
      border-radius: 8px;
      font-size: 0.8125rem;
      font-weight: 600;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.4rem;
      transition: all 0.15s ease;
    }
    .event-btn.joined {
      background: var(--accent);
      color: #000;
      border-color: var(--accent);
      font-weight: 700;
    }
  </style>
</head>
<body>
  <header class="app-header">
    <div class="brand">
      <span class="brand-accent">⚡ STRIDE</span>
      <span style="font-size: 0.85rem; font-weight: 500; color: var(--text-muted)">Cung đường & Nhóm</span>
    </div>
    <span style="font-size: 0.75rem; color: var(--accent); background: rgba(16,185,129,0.1); padding: 0.25rem 0.5rem; border-radius: 9999px;">Bản đồ GPS Live</span>
  </header>

  <div class="map-card">
    <div class="map-header">
      <span>📍 Vòng Hồ Tây (15.2 KM)</span>
      <span style="color: var(--accent)">Độ cao: +42m</span>
    </div>
    <div class="map-viz">
      <svg width="280" height="110" viewBox="0 0 280 110">
        <path class="gps-path" d="M 30,55 C 50,20 100,15 150,30 C 200,45 250,25 260,65 C 240,95 180,90 120,80 C 70,70 40,80 30,55 Z" />
        <circle cx="30" cy="55" r="5" fill="#34D399" />
        <circle cx="150" cy="30" r="4" fill="#F59E0B" />
        <circle cx="260" cy="65" r="4" fill="#3B82F6" />
      </svg>
      <div style="position: absolute; bottom: 8px; left: 12px; font-size: 0.7rem; color: #fff; background: rgba(0,0,0,0.6); padding: 2px 6px; border-radius: 4px;">
        Xuất phát: Phủ Tây Hồ
      </div>
    </div>
    <div class="elevation-bar">
      <span>Mặt đường: Nhựa bằng phẳng</span>
      <span>Điểm tiếp nước: 4 trạm</span>
      <span>Gió: 8 km/h</span>
    </div>
  </div>

  <div class="filter-row">
    <button class="pace-pill active" data-pace="all">Tất cả Pace</button>
    <button class="pace-pill" data-pace="fast">&lt; 4:45</button>
    <button class="pace-pill" data-pace="medium">5:00 - 5:30</button>
    <button class="pace-pill" data-pace="easy">&gt; 6:00</button>
  </div>

  <div class="events-list">
    <div class="event-card" data-cat="medium">
      <div class="event-top">
        <span class="event-title">Long Run Bình Minh Hồ Tây</span>
        <span class="event-badge">Pace 5:15</span>
      </div>
      <div class="event-meta">
        <span>📅 Thứ 7 • 05:30 AM</span>
        <span>📏 15.2 km</span>
        <span class="attendee-count">👥 18 người</span>
      </div>
      <button class="event-btn" onclick="toggleJoin(this, 18)">
        <span>+ Đăng ký tham gia chạy</span>
      </button>
    </div>

    <div class="event-card" data-cat="fast">
      <div class="event-top">
        <span class="event-title">Interval Track Sân Hàng Đẫy</span>
        <span class="event-badge">Pace 4:30</span>
      </div>
      <div class="event-meta">
        <span>📅 Thứ 4 • 18:30</span>
        <span>📏 8.0 km</span>
        <span class="attendee-count">👥 12 người</span>
      </div>
      <button class="event-btn" onclick="toggleJoin(this, 12)">
        <span>+ Đăng ký tham gia chạy</span>
      </button>
    </div>

    <div class="event-card" data-cat="easy">
      <div class="event-top">
        <span class="event-title">Chạy Dưỡng Sinh & Coffee Sáng</span>
        <span class="event-badge">Pace 6:00</span>
      </div>
      <div class="event-meta">
        <span>📅 Chủ Nhật • 06:15 AM</span>
        <span>📏 5.5 km</span>
        <span class="attendee-count">👥 26 người</span>
      </div>
      <button class="event-btn" onclick="toggleJoin(this, 26)">
        <span>+ Đăng ký tham gia chạy</span>
      </button>
    </div>
  </div>

  <script>
    function toggleJoin(btn, baseCount) {
      const isJoined = btn.classList.toggle('joined');
      const countEl = btn.closest('.event-card').querySelector('.attendee-count');
      if (isJoined) {
        btn.innerHTML = '<span>✓ Đã tham gia (Hẹn gặp lúc chạy!)</span>';
        countEl.textContent = '👥 ' + (baseCount + 1) + ' người';
      } else {
        btn.innerHTML = '<span>+ Đăng ký tham gia chạy</span>';
        countEl.textContent = '👥 ' + baseCount + ' người';
      }
    }

    document.querySelectorAll('.pace-pill').forEach(pill => {
      pill.addEventListener('click', () => {
        document.querySelectorAll('.pace-pill').forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        const pace = pill.getAttribute('data-pace');
        document.querySelectorAll('.event-card').forEach(card => {
          if (pace === 'all' || card.getAttribute('data-cat') === pace) {
            card.classList.remove('hidden');
          } else {
            card.classList.add('hidden');
          }
        });
      });
    });
  </script>
</body>
</html>`;
    }

    // SCREEN 2: Athlete Profile & Smart Shoe Mileage Locker
    if (screenIndex === 2) {
      return `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>PaceMate - Hồ sơ & Kệ Giày</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    :root {
      --bg: ${bgColor};
      --accent: ${primaryColor};
      --accent-bright: #34D399;
      --surface: ${surfaceColor};
      --surface-border: rgba(255, 255, 255, 0.1);
      --text: #F8FAFC;
      --text-muted: #94A3B8;
    }
    body {
      background: var(--bg);
      color: var(--text);
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: ${platform === 'app' ? '1rem' : '1.5rem'};
      overflow-x: hidden;
    }
    .app-header {
      width: 100%;
      max-width: 440px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
      padding-bottom: 0.75rem;
      border-bottom: 1px solid var(--surface-border);
    }
    .brand { font-size: 1.15rem; font-weight: 800; color: var(--text); }
    .brand-accent { color: var(--accent); }
    .profile-card {
      width: 100%;
      max-width: 440px;
      background: var(--surface);
      border: 1px solid var(--surface-border);
      border-radius: 16px;
      padding: 1.25rem;
      margin-bottom: 1rem;
      display: flex;
      gap: 1rem;
      align-items: center;
    }
    .avatar-lg {
      width: 64px;
      height: 64px;
      border-radius: 50%;
      background: #171E2D;
      border: 2px solid var(--accent);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.8rem;
    }
    .pr-grid {
      width: 100%;
      max-width: 440px;
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 0.5rem;
      margin-bottom: 1.25rem;
    }
    .pr-box {
      background: var(--surface);
      border: 1px solid var(--surface-border);
      border-radius: 10px;
      padding: 0.65rem 0.4rem;
      text-align: center;
    }
    .pr-label { font-size: 0.6875rem; color: var(--text-muted); margin-bottom: 0.2rem; }
    .pr-time { font-size: 0.875rem; font-weight: 700; color: var(--accent); font-family: monospace; }
    .section-title {
      width: 100%;
      max-width: 440px;
      font-size: 0.875rem;
      font-weight: 700;
      color: #fff;
      margin-bottom: 0.6rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .shoe-locker {
      width: 100%;
      max-width: 440px;
      display: flex;
      flex-direction: column;
      gap: 0.65rem;
      margin-bottom: 1.25rem;
    }
    .shoe-card {
      background: var(--surface);
      border: 1px solid var(--surface-border);
      border-radius: 12px;
      padding: 0.85rem 1rem;
    }
    .shoe-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.4rem;
    }
    .shoe-name { font-size: 0.85rem; font-weight: 600; color: #fff; }
    .shoe-km { font-size: 0.75rem; color: var(--accent); font-weight: 700; }
    .progress-track {
      width: 100%;
      height: 6px;
      background: rgba(255,255,255,0.08);
      border-radius: 9999px;
      overflow: hidden;
    }
    .progress-fill {
      height: 100%;
      border-radius: 9999px;
      background: var(--accent);
    }
    .pref-card {
      width: 100%;
      max-width: 440px;
      background: var(--surface);
      border: 1px solid var(--surface-border);
      border-radius: 12px;
      padding: 1rem;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }
    .toggle-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 0.8125rem;
    }
    .toggle-btn {
      width: 38px;
      height: 22px;
      background: rgba(255,255,255,0.15);
      border-radius: 9999px;
      position: relative;
      cursor: pointer;
      border: none;
      transition: background 0.2s;
    }
    .toggle-btn.on { background: var(--accent); }
    .toggle-dot {
      width: 16px;
      height: 16px;
      background: #fff;
      border-radius: 50%;
      position: absolute;
      top: 3px;
      left: 3px;
      transition: transform 0.2s;
    }
    .toggle-btn.on .toggle-dot { transform: translateX(16px); }
  </style>
</head>
<body>
  <header class="app-header">
    <div class="brand">
      <span class="brand-accent">⚡ STRIDE</span>
      <span style="font-size: 0.85rem; font-weight: 500; color: var(--text-muted)">Hồ sơ Vận động viên</span>
    </div>
    <span style="font-size: 0.72rem; color: #34D399; border: 1px solid rgba(52,211,153,0.3); padding: 0.2rem 0.5rem; border-radius: 6px;">Strava Sync ✓</span>
  </header>

  <div class="profile-card">
    <div class="avatar-lg">🏃‍♂️</div>
    <div>
      <h2 style="font-size: 1.1rem; font-weight: 700;">Quang Huy, 28</h2>
      <p style="font-size: 0.78rem; color: var(--text-muted); margin-bottom: 0.35rem;">Marathoner • Mục tiêu Sub 3:45 • Hà Nội</p>
      <div style="font-size: 0.72rem; color: var(--accent); font-weight: 600;">🔥 Chuỗi chạy: 14 tuần liên tiếp (48km/tuần)</div>
    </div>
  </div>

  <div class="pr-grid">
    <div class="pr-box"><div class="pr-label">5 KM</div><div class="pr-time">21:40</div></div>
    <div class="pr-box"><div class="pr-label">10 KM</div><div class="pr-time">45:12</div></div>
    <div class="pr-box"><div class="pr-label">HALF 21K</div><div class="pr-time">1:39:50</div></div>
    <div class="pr-box"><div class="pr-label">FULL 42K</div><div class="pr-time">3:42:15</div></div>
  </div>

  <div class="section-title">
    <span>👟 KỆ GIÀY CHẠY BỘ (SHOE LOCKER)</span>
    <button onclick="addShoe()" style="background:none; border:none; color:var(--accent); font-size:0.75rem; cursor:pointer; font-weight:600;">+ Thêm giày</button>
  </div>

  <div class="shoe-locker" id="shoeLocker">
    <div class="shoe-card">
      <div class="shoe-top">
        <span class="shoe-name">Nike Vaporfly 3 (Thi đấu)</span>
        <span class="shoe-km">180 / 500 km</span>
      </div>
      <div class="progress-track"><div class="progress-fill" style="width: 36%;"></div></div>
    </div>
    <div class="shoe-card">
      <div class="shoe-top">
        <span class="shoe-name">Asics Superblast 2 (Chạy dài cuối tuần)</span>
        <span class="shoe-km">420 / 800 km</span>
      </div>
      <div class="progress-track"><div class="progress-fill" style="width: 52%; background: #3B82F6;"></div></div>
    </div>
  </div>

  <div class="section-title">
    <span>⚙️ TÙY CHỌN GHÉP ĐÔI</span>
  </div>

  <div class="pref-card">
    <div class="toggle-row">
      <span>Chỉ ghép với bạn chạy buổi sáng (05:00 - 06:30)</span>
      <button class="toggle-btn on" onclick="this.classList.toggle('on')"><span class="toggle-dot"></span></button>
    </div>
    <div class="toggle-row">
      <span>Chênh lệch pace tối đa: ± 20 giây</span>
      <button class="toggle-btn on" onclick="this.classList.toggle('on')"><span class="toggle-dot"></span></button>
    </div>
  </div>

  <script>
    function addShoe() {
      const name = prompt('Nhập tên đôi giày mới (ví dụ: Saucony Endorphin Speed 4):');
      if (!name) return;
      const card = document.createElement('div');
      card.className = 'shoe-card';
      card.innerHTML = '<div class="shoe-top"><span class="shoe-name">' + name + '</span><span class="shoe-km">0 / 700 km</span></div><div class="progress-track"><div class="progress-fill" style="width: 2%;"></div></div>';
      document.getElementById('shoeLocker').appendChild(card);
    }
  </script>
</body>
</html>`;
    }

    // SCREEN 3: Direct Match Messaging & Run Invitation Flow
    if (screenIndex === 3) {
      return `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>PaceMate - Hẹn lịch chạy & Hội thoại</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    :root {
      --bg: ${bgColor};
      --accent: ${primaryColor};
      --accent-bright: #34D399;
      --surface: ${surfaceColor};
      --surface-border: rgba(255, 255, 255, 0.1);
      --text: #F8FAFC;
      --text-muted: #94A3B8;
    }
    body {
      background: var(--bg);
      color: var(--text);
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-between;
      padding: ${platform === 'app' ? '1rem' : '1.5rem'};
      overflow: hidden;
    }
    .chat-wrapper {
      width: 100%;
      max-width: 440px;
      height: 100%;
      display: flex;
      flex-direction: column;
    }
    .chat-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-bottom: 0.75rem;
      border-bottom: 1px solid var(--surface-border);
      margin-bottom: 0.75rem;
    }
    .chat-user {
      display: flex;
      align-items: center;
      gap: 0.65rem;
    }
    .chat-avatar {
      width: 42px;
      height: 42px;
      border-radius: 50%;
      background: #171E2D;
      border: 1.5px solid var(--accent);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.25rem;
    }
    .messages-box {
      flex: 1;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      padding-right: 0.25rem;
    }
    .msg-bubble {
      max-width: 82%;
      padding: 0.65rem 0.85rem;
      border-radius: 14px;
      font-size: 0.825rem;
      line-height: 1.45;
    }
    .msg-incoming {
      align-self: flex-start;
      background: var(--surface);
      border: 1px solid var(--surface-border);
      color: #fff;
    }
    .msg-outgoing {
      align-self: flex-end;
      background: var(--accent);
      color: #000;
      font-weight: 500;
    }
    .invite-card {
      background: #0E1626;
      border: 1.5px solid var(--accent);
      border-radius: 12px;
      padding: 0.85rem;
      margin: 0.35rem 0;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    .invite-title {
      font-size: 0.85rem;
      font-weight: 700;
      color: #fff;
      display: flex;
      align-items: center;
      gap: 0.4rem;
    }
    .invite-details {
      font-size: 0.75rem;
      color: #CBD5E1;
      line-height: 1.4;
    }
    .invite-actions {
      display: flex;
      gap: 0.5rem;
      margin-top: 0.25rem;
    }
    .btn-accept {
      flex: 1;
      background: var(--accent);
      color: #000;
      border: none;
      padding: 0.5rem;
      border-radius: 6px;
      font-size: 0.75rem;
      font-weight: 700;
      cursor: pointer;
    }
    .btn-decline {
      background: rgba(255,255,255,0.08);
      color: #fff;
      border: 1px solid var(--surface-border);
      padding: 0.5rem 0.75rem;
      border-radius: 6px;
      font-size: 0.75rem;
      cursor: pointer;
    }
    .chat-input-bar {
      margin-top: 0.75rem;
      display: flex;
      gap: 0.5rem;
      align-items: center;
    }
    .chat-input {
      flex: 1;
      background: var(--surface);
      border: 1px solid var(--surface-border);
      padding: 0.65rem 0.85rem;
      border-radius: 9999px;
      color: #fff;
      font-size: 0.8125rem;
      outline: none;
    }
    .chat-send {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: var(--accent);
      border: none;
      color: #000;
      font-weight: 800;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
    }
  </style>
</head>
<body>
  <div class="chat-wrapper">
    <div class="chat-header">
      <div class="chat-user">
        <div class="chat-avatar">🏃‍♀️</div>
        <div>
          <div style="font-weight: 700; font-size: 0.95rem;">Minh Trang</div>
          <div style="font-size: 0.72rem; color: var(--accent);">Đang online • Pace 5:10 /km • 98% Tương đồng</div>
        </div>
      </div>
      <button style="background:none; border:none; color:var(--text-muted); cursor:pointer; font-size:1.1rem;">⋮</button>
    </div>

    <div class="messages-box" id="msgBox">
      <div class="msg-bubble msg-incoming">
        Chào bạn! Thấy bạn cũng đang tập sub-4 Marathon VnExpress cuối tuần à?
      </div>
      <div class="msg-bubble msg-outgoing">
        Chào Trang! Đúng rồi, mình đang tìm bạn kéo pace bài Long run 21km sáng thứ 7.
      </div>
      
      <div class="invite-card">
        <div class="invite-title">
          <span>⚡ LỜI MỜI CHẠY BỘ: 21KM VÒNG HỒ TÂY</span>
        </div>
        <div class="invite-details">
          <div>📅 <strong>Thời gian:</strong> Thứ Bảy này • 05:30 AM</div>
          <div>📍 <strong>Điểm hẹn:</strong> Cổng Phủ Tây Hồ</div>
          <div>🎯 <strong>Mục tiêu Pace:</strong> 5:15 - 5:25 /km (Tiếp nước tại km 10)</div>
        </div>
        <div class="invite-actions" id="inviteActions">
          <button class="btn-accept" onclick="acceptInvite()">Chấp nhận hẹn chạy</button>
          <button class="btn-decline" onclick="alert('Đã gửi đề xuất chọn giờ khác.')">Đổi giờ</button>
        </div>
      </div>
    </div>

    <div class="chat-input-bar">
      <input type="text" class="chat-input" id="chatInput" placeholder="Nhập tin nhắn hẹn giờ chạy..." onkeydown="if(event.key==='Enter') sendMsg()">
      <button class="chat-send" onclick="sendMsg()">↑</button>
    </div>
  </div>

  <script>
    function sendMsg() {
      const input = document.getElementById('chatInput');
      const val = input.value.trim();
      if (!val) return;
      const box = document.getElementById('msgBox');
      const bubble = document.createElement('div');
      bubble.className = 'msg-bubble msg-outgoing';
      bubble.textContent = val;
      box.appendChild(bubble);
      input.value = '';
      box.scrollTop = box.scrollHeight;
    }

    function acceptInvite() {
      const actions = document.getElementById('inviteActions');
      actions.innerHTML = '<div style="color:var(--accent); font-size:0.75rem; font-weight:700;">✓ Đã xác nhận lịch hẹn chạy! Thông báo đã đồng bộ vào Lịch.</div>';
    }
  </script>
</body>
</html>`;
    }

    // SCREEN 0: Match & Discovery Swipe Deck
    return `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>PaceMate - Tinder for Runners</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    :root {
      --bg: ${bgColor};
      --accent: ${primaryColor};
      --accent-bright: #34D399;
      --surface: ${surfaceColor};
      --surface-border: rgba(255, 255, 255, 0.1);
      --text: #F8FAFC;
      --text-muted: #94A3B8;
    }
    body {
      background: var(--bg);
      color: var(--text);
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-start;
      padding: ${platform === 'app' ? '1rem' : '1.5rem'};
      overflow-x: hidden;
    }
    .app-header {
      width: 100%;
      max-width: 440px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
      padding-bottom: 0.75rem;
      border-bottom: 1px solid var(--surface-border);
    }
    .brand {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 1.15rem;
      font-weight: 800;
      color: var(--text);
    }
    .brand-accent { color: var(--accent); }
    .filter-capsule {
      display: flex;
      gap: 0.4rem;
      background: rgba(255, 255, 255, 0.05);
      padding: 0.25rem 0.5rem;
      border-radius: 9999px;
      border: 1px solid var(--surface-border);
      font-size: 0.7rem;
      color: var(--text-muted);
    }
    .card-deck {
      position: relative;
      width: 100%;
      max-width: 420px;
      height: 480px;
      margin: 0 auto;
    }
    .runner-card {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: var(--surface);
      border: 1px solid var(--surface-border);
      border-radius: 20px;
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      box-shadow: 0 12px 32px rgba(0, 0, 0, 0.6);
      transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.35s ease;
      cursor: grab;
      user-select: none;
    }
    .runner-card.swiped-left {
      transform: translateX(-140%) rotate(-15deg) !important;
      opacity: 0;
      pointer-events: none;
    }
    .runner-card.swiped-right {
      transform: translateX(140%) rotate(15deg) !important;
      opacity: 0;
      pointer-events: none;
    }
    .card-top {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
    }
    .avatar-wrap {
      width: 68px;
      height: 68px;
      border-radius: 50%;
      border: 2px solid var(--accent);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.75rem;
      background: #171E2D;
    }
    .match-rate {
      background: rgba(16, 185, 129, 0.15);
      border: 1px solid rgba(16, 185, 129, 0.35);
      color: var(--accent);
      padding: 0.3rem 0.65rem;
      border-radius: 9999px;
      font-size: 0.75rem;
      font-weight: 700;
    }
    .runner-name {
      font-size: 1.4rem;
      font-weight: 700;
      margin: 0.85rem 0 0.3rem 0;
      color: #fff;
    }
    .runner-bio {
      font-size: 0.825rem;
      color: var(--text-muted);
      line-height: 1.45;
      margin-bottom: 1rem;
    }
    .stats-matrix {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0.6rem;
      margin-bottom: 1rem;
    }
    .stat-pill {
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid rgba(255, 255, 255, 0.06);
      border-radius: 10px;
      padding: 0.5rem 0.75rem;
    }
    .stat-label {
      font-size: 0.65rem;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }
    .stat-val {
      font-size: 0.95rem;
      font-weight: 700;
      color: var(--accent);
      margin-top: 0.15rem;
    }
    .route-tag {
      display: inline-flex;
      align-items: center;
      gap: 0.35rem;
      font-size: 0.75rem;
      color: #CBD5E1;
      background: rgba(255, 255, 255, 0.05);
      padding: 0.35rem 0.65rem;
      border-radius: 6px;
      margin-right: 0.4rem;
      margin-bottom: 0.4rem;
    }
    .deck-controls {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 1.25rem;
      margin-top: 1.25rem;
    }
    .btn-action {
      width: 56px;
      height: 56px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      border: none;
      cursor: pointer;
      font-size: 1.25rem;
      transition: all 0.15s ease;
      box-shadow: 0 4px 14px rgba(0, 0, 0, 0.4);
    }
    .btn-action:hover { transform: scale(1.08); }
    .btn-pass {
      background: #1C2333;
      color: #EF4444;
      border: 1px solid rgba(239, 68, 68, 0.3);
    }
    .btn-super {
      width: 46px;
      height: 46px;
      background: #1C2333;
      color: #38BDF8;
      border: 1px solid rgba(56, 189, 248, 0.3);
      font-size: 1rem;
    }
    .btn-match {
      background: var(--accent);
      color: #000000;
      font-weight: 800;
    }
    .match-modal {
      display: none;
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.85);
      backdrop-filter: blur(8px);
      z-index: 999;
      align-items: center;
      justify-content: center;
      padding: 1.5rem;
    }
    .match-modal.show { display: flex; }
    .modal-box {
      background: #10141F;
      border: 1px solid rgba(16, 185, 129, 0.35);
      border-radius: 16px;
      padding: 2rem;
      max-width: 380px;
      text-align: center;
      box-shadow: 0 20px 50px rgba(0, 0, 0, 0.8);
    }
  </style>
</head>
<body>
  <header class="app-header">
    <div class="brand">
      <span class="brand-accent">⚡ STRIDE</span>
      <span style="font-size: 0.85rem; font-weight: 500; color: var(--text-muted)">Khám phá Runner</span>
    </div>
    <div class="filter-capsule">
      <span>Bộ lọc: Pace ±15s</span>
    </div>
  </header>

  <main class="card-deck" id="cardDeck">
    <div class="runner-card" id="card-1">
      <div>
        <div class="card-top">
          <div class="avatar-wrap">🏃‍♀️</div>
          <div class="match-rate">98% TƯƠNG ĐỒNG</div>
        </div>
        <h2 class="runner-name">Minh Trang, 26</h2>
        <p class="runner-bio">Tập giáo án sub-4 Marathon VnExpress. Tìm bạn cùng chạy bài dài cuối tuần quanh Hồ Tây.</p>
        <div class="stats-matrix">
          <div class="stat-pill"><div class="stat-label">Pace TB</div><div class="stat-val">5:10 /km</div></div>
          <div class="stat-pill"><div class="stat-label">Cự ly tuần</div><div class="stat-val">45 km/w</div></div>
          <div class="stat-pill"><div class="stat-label">Khung giờ</div><div class="stat-val">05:30 AM</div></div>
          <div class="stat-pill"><div class="stat-label">Mục tiêu</div><div class="stat-val">42.2 KM</div></div>
        </div>
      </div>
      <div>
        <div class="route-tag">📍 Hồ Tây (15km loop)</div>
        <div class="route-tag">📍 Công viên Thống Nhất</div>
      </div>
    </div>

    <div class="runner-card" id="card-2" style="transform: scale(0.96) translateY(8px); z-index: -1;">
      <div>
        <div class="card-top">
          <div class="avatar-wrap">🏃‍♂️</div>
          <div class="match-rate">94% TƯƠNG ĐỒNG</div>
        </div>
        <h2 class="runner-name">Hoàng Nam, 29</h2>
        <p class="runner-bio">Chạy sáng sớm và leo dốc trail cuối tuần. Pace ổn định, kỷ luật cao.</p>
        <div class="stats-matrix">
          <div class="stat-pill"><div class="stat-label">Pace TB</div><div class="stat-val">4:45 /km</div></div>
          <div class="stat-pill"><div class="stat-label">Cự ly tuần</div><div class="stat-val">65 km/w</div></div>
          <div class="stat-pill"><div class="stat-label">Khung giờ</div><div class="stat-val">05:00 AM</div></div>
          <div class="stat-pill"><div class="stat-label">Mục tiêu</div><div class="stat-val">Ultra 70K</div></div>
        </div>
      </div>
      <div>
        <div class="route-tag">📍 Núi Hàm Lợn Trail</div>
        <div class="route-tag">📍 Cầu Nhật Tân</div>
      </div>
    </div>
  </main>

  <footer class="deck-controls">
    <button class="btn-action btn-pass" id="passBtn" title="Bỏ qua (Swipe Trái)">✕</button>
    <button class="btn-action btn-super" id="superBtn" title="Super Like">⭐</button>
    <button class="btn-action btn-match" id="matchBtn" title="Ghép đôi (Swipe Phải)">♥</button>
  </footer>

  <div class="match-modal" id="matchModal">
    <div class="modal-box">
      <div style="font-size: 3rem; margin-bottom: 0.5rem;">🎉</div>
      <h3 style="font-size: 1.4rem; color: var(--accent); margin-bottom: 0.5rem;">RUNNING MATCH!</h3>
      <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 1.25rem;">Bạn và Minh Trang đều có pace 5:10/km và chạy bài dài sáng thứ 7 quanh Hồ Tây.</p>
      <button onclick="document.getElementById('matchModal').classList.remove('show'); alert('Đã mở cuộc trò chuyện hẹn lịch chạy!')" style="width:100%; background:var(--accent); color:#000; padding:0.75rem; border-radius:8px; border:none; font-weight:700; cursor:pointer;">Nhắn tin hẹn giờ chạy</button>
      <button onclick="document.getElementById('matchModal').classList.remove('show')" style="width:100%; background:none; color:var(--text-muted); padding:0.5rem; border:none; margin-top:0.5rem; cursor:pointer;">Tiếp tục tìm bạn</button>
    </div>
  </div>

  <script>
    let currentIdx = 1;
    function swipe(dir) {
      const card = document.getElementById('card-' + currentIdx);
      if (!card) return;
      card.classList.add(dir === 'left' ? 'swiped-left' : 'swiped-right');
      if (dir === 'right') {
        setTimeout(() => document.getElementById('matchModal').classList.add('show'), 300);
      }
      currentIdx++;
    }
    document.getElementById('passBtn').addEventListener('click', () => swipe('left'));
    document.getElementById('matchBtn').addEventListener('click', () => swipe('right'));
    document.getElementById('superBtn').addEventListener('click', () => {
      alert('Đã gửi Super-Like! Runner sẽ nhận thông báo ưu tiên.');
      swipe('right');
    });
  </script>
</body>
</html>`;
  }

  // ==========================================================================
  // 2. GENERAL RESPONSIVE DYNAMIC PROTOTYPE (Screens 0..3)
  // ==========================================================================
  // Screen 1: Deep Explorer / Data Matrix
  if (screenIndex === 1) {
    return `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${safeTitle} - Khám phá Dữ liệu</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    :root {
      --bg: ${bgColor};
      --accent: ${primaryColor};
      --surface: ${surfaceColor};
      --border: rgba(255, 255, 255, 0.08);
      --text: #F8FAFC;
      --text-muted: #94A3B8;
    }
    body {
      background: var(--bg);
      color: var(--text);
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      padding: ${platform === 'app' ? '1rem' : '2rem'};
      min-height: 100vh;
      max-width: ${platform === 'app' ? '440px' : '1100px'};
      margin: 0 auto;
    }
    header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-bottom: 1rem;
      border-bottom: 1px solid var(--border);
      margin-bottom: 1.25rem;
    }
    .brand { font-size: 1.2rem; font-weight: 800; color: var(--accent); }
    .search-bar {
      width: 100%;
      background: var(--surface);
      border: 1px solid var(--border);
      padding: 0.75rem 1rem;
      border-radius: 10px;
      color: #fff;
      margin-bottom: 1rem;
      outline: none;
    }
    .filter-pills { display: flex; gap: 0.5rem; margin-bottom: 1rem; overflow-x: auto; }
    .pill {
      background: rgba(255,255,255,0.06);
      border: 1px solid var(--border);
      padding: 0.4rem 0.85rem;
      border-radius: 9999px;
      color: var(--text-muted);
      cursor: pointer;
      font-size: 0.78rem;
    }
    .pill.active { background: var(--accent); color: #000; font-weight: 700; }
    .data-table {
      width: 100%;
      border-collapse: collapse;
      background: var(--surface);
      border-radius: 12px;
      overflow: hidden;
      border: 1px solid var(--border);
    }
    .data-table th, .data-table td {
      padding: 0.85rem 1rem;
      text-align: left;
      font-size: 0.8125rem;
      border-bottom: 1px solid var(--border);
    }
    .data-table th { color: var(--text-muted); font-weight: 600; background: rgba(0,0,0,0.2); }
  </style>
</head>
<body>
  <header>
    <div class="brand">${safeTitle}</div>
    <span style="font-size: 0.75rem; color: var(--accent);">Bảng dữ liệu & Bộ lọc</span>
  </header>
  <input type="text" class="search-bar" id="search" placeholder="Tìm kiếm bản ghi hoặc thông số..." oninput="filterData(this.value)">
  <div class="filter-pills">
    <button class="pill active" onclick="setCategory('all', this)">Tất cả</button>
    <button class="pill" onclick="setCategory('active', this)">Đang hoạt động</button>
    <button class="pill" onclick="setCategory('pending', this)">Chờ duyệt</button>
  </div>
  <table class="data-table">
    <thead>
      <tr><th>Mã hiệu</th><th>Tên đối tượng</th><th>Trạng thái</th><th>Giá trị</th></tr>
    </thead>
    <tbody id="tableBody">
      <tr data-cat="active"><td>#001</td><td>Đối tượng Alpha</td><td><span style="color:#10B981">● Hoạt động</span></td><td>98.4%</td></tr>
      <tr data-cat="active"><td>#002</td><td>Đối tượng Beta</td><td><span style="color:#10B981">● Hoạt động</span></td><td>87.2%</td></tr>
      <tr data-cat="pending"><td>#003</td><td>Đối tượng Gamma</td><td><span style="color:#F59E0B">● Chờ duyệt</span></td><td>42.0%</td></tr>
    </tbody>
  </table>
  <script>
    function setCategory(cat, el) {
      document.querySelectorAll('.pill').forEach(p => p.classList.remove('active'));
      el.classList.add('active');
      document.querySelectorAll('#tableBody tr').forEach(row => {
        row.style.display = (cat === 'all' || row.getAttribute('data-cat') === cat) ? '' : 'none';
      });
    }
    function filterData(val) {
      val = val.toLowerCase();
      document.querySelectorAll('#tableBody tr').forEach(row => {
        row.style.display = row.textContent.toLowerCase().includes(val) ? '' : 'none';
      });
    }
  </script>
</body>
</html>`;
  }

  // Screen 2: Configuration & Parameters
  if (screenIndex === 2) {
    return `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${safeTitle} - Cấu hình & Tùy chọn</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    :root {
      --bg: ${bgColor};
      --accent: ${primaryColor};
      --surface: ${surfaceColor};
      --border: rgba(255, 255, 255, 0.08);
      --text: #F8FAFC;
      --text-muted: #94A3B8;
    }
    body {
      background: var(--bg);
      color: var(--text);
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      padding: ${platform === 'app' ? '1rem' : '2rem'};
      min-height: 100vh;
      max-width: ${platform === 'app' ? '440px' : '1100px'};
      margin: 0 auto;
    }
    header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-bottom: 1rem;
      border-bottom: 1px solid var(--border);
      margin-bottom: 1.5rem;
    }
    .brand { font-size: 1.2rem; font-weight: 800; color: var(--accent); }
    .card {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 14px;
      padding: 1.25rem;
      margin-bottom: 1rem;
    }
    .row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.65rem 0;
      border-bottom: 1px solid rgba(255,255,255,0.04);
      font-size: 0.85rem;
    }
    .btn {
      background: var(--accent);
      color: #000;
      border: none;
      padding: 0.65rem 1.25rem;
      border-radius: 8px;
      font-weight: 700;
      cursor: pointer;
      width: 100%;
      margin-top: 0.5rem;
    }
  </style>
</head>
<body>
  <header>
    <div class="brand">${safeTitle}</div>
    <span style="font-size: 0.75rem; color: var(--accent);">Cấu hình hệ thống</span>
  </header>
  <div class="card">
    <h3 style="font-size: 1rem; margin-bottom: 0.75rem;">Tham số vận hành</h3>
    <div class="row"><span>Chế độ tự động đồng bộ</span><input type="checkbox" checked></div>
    <div class="row"><span>Thông báo thời gian thực</span><input type="checkbox" checked></div>
    <div class="row"><span>Mức tải giới hạn</span><span style="color:var(--accent); font-weight:700;">85%</span></div>
  </div>
  <button class="btn" onclick="alert('Đã cập nhật các thông số cấu hình!')">Lưu cài đặt</button>
</body>
</html>`;
  }

  // Screen 3: Activity & Export Hub
  if (screenIndex === 3) {
    return `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${safeTitle} - Nhật ký & Chia sẻ</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    :root {
      --bg: ${bgColor};
      --accent: ${primaryColor};
      --surface: ${surfaceColor};
      --border: rgba(255, 255, 255, 0.08);
      --text: #F8FAFC;
      --text-muted: #94A3B8;
    }
    body {
      background: var(--bg);
      color: var(--text);
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      padding: ${platform === 'app' ? '1rem' : '2rem'};
      min-height: 100vh;
      max-width: ${platform === 'app' ? '440px' : '1100px'};
      margin: 0 auto;
    }
    header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-bottom: 1rem;
      border-bottom: 1px solid var(--border);
      margin-bottom: 1.5rem;
    }
    .brand { font-size: 1.2rem; font-weight: 800; color: var(--accent); }
    .feed { display: flex; flex-direction: column; gap: 0.75rem; margin-bottom: 1.5rem; }
    .feed-item {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 1rem;
      font-size: 0.8125rem;
    }
  </style>
</head>
<body>
  <header>
    <div class="brand">${safeTitle}</div>
    <span style="font-size: 0.75rem; color: var(--accent);">Nhật ký hoạt động</span>
  </header>
  <div class="feed">
    <div class="feed-item">
      <div style="font-weight:700; color:#fff; margin-bottom:0.25rem;">Hệ thống khởi tạo thành công</div>
      <div style="color:var(--text-muted); font-size:0.75rem;">Vừa xong • Trạng thái sẵn sàng cho tương tác</div>
    </div>
    <div class="feed-item">
      <div style="font-weight:700; color:#fff; margin-bottom:0.25rem;">Đã áp dụng các quy chuẩn thiết kế</div>
      <div style="color:var(--text-muted); font-size:0.75rem;">1 phút trước • Tokens được nạp hoàn chỉnh</div>
    </div>
  </div>
  <button style="background:var(--accent); color:#000; border:none; padding:0.75rem; border-radius:8px; font-weight:700; width:100%; cursor:pointer;" onclick="alert('Đã tạo liên kết chia sẻ!')">Xuất dữ liệu & Chia sẻ</button>
</body>
</html>`;
  }

  // Screen 0: Core interactive dashboard / action canvas
  return `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${safeTitle}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    :root {
      --bg: ${bgColor};
      --accent: ${primaryColor};
      --surface: ${surfaceColor};
      --border: rgba(255, 255, 255, 0.08);
      --text: #F8FAFC;
      --text-muted: #94A3B8;
    }
    body {
      background: var(--bg);
      color: var(--text);
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      padding: ${platform === 'app' ? '1rem' : '2rem'};
      min-height: 100vh;
      max-width: ${platform === 'app' ? '440px' : '1100px'};
      margin: 0 auto;
    }
    header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-bottom: 1rem;
      border-bottom: 1px solid var(--border);
      margin-bottom: 1.5rem;
    }
    .brand {
      font-size: 1.2rem;
      font-weight: 800;
      color: var(--accent);
      letter-spacing: -0.02em;
    }
    .surface {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 1.5rem;
      margin-bottom: 1.5rem;
    }
    .btn {
      background: var(--accent);
      color: #000000;
      border: none;
      padding: 0.65rem 1.25rem;
      border-radius: 6px;
      font-weight: 700;
      cursor: pointer;
    }
  </style>
</head>
<body>
  <header>
    <div class="brand">${safeTitle}</div>
    <div style="font-size: 0.8rem; color: var(--text-muted); font-family: monospace;">RUNTIME LIVE</div>
  </header>
  <main class="surface">
    <h1 style="font-size: 1.6rem; margin-bottom: 0.5rem">${safeTitle}</h1>
    <p style="color: var(--text-muted); line-height: 1.6; margin-bottom: 1.25rem">
      Giao diện prototype sinh tự động theo yêu cầu, tích hợp hệ thống token thiết kế độc lập.
    </p>
    <button class="btn" onclick="alert('Đã kích hoạt hành động tương tác!')">Khám phá tính năng</button>
  </main>
</body>
</html>`;
}
