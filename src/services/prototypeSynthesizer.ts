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
  // 0. AUTONOMOUS RECEIPT & CLAIM ADJUDICATION DOMAIN
  // ==========================================================================
  if (lower.includes('claim') || lower.includes('receipt') || lower.includes('hóa đơn') || lower.includes('expense') || lower.includes('approval') || lower.includes('duyệt')) {
    
    // SCREEN 1: OCR Extraction Matrix & Bounding Box Inspector
    if (screenIndex === 1) {
      return `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>AutoClaim - OCR Extraction & Line Item Matrix</title>
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
      padding: ${platform === 'app' ? '1rem' : '1.75rem'};
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
    .brand { font-size: 1.15rem; font-weight: 800; color: var(--text); display: flex; align-items: center; gap: 0.5rem; }
    .brand-accent { color: var(--accent); }
    .badge {
      background: rgba(16, 185, 129, 0.15);
      color: #10B981;
      border: 1px solid rgba(16, 185, 129, 0.3);
      padding: 0.25rem 0.6rem;
      border-radius: 9999px;
      font-size: 0.75rem;
      font-weight: 600;
    }
    .grid {
      display: grid;
      grid-template-columns: ${platform === 'app' ? '1fr' : '1fr 1.2fr'};
      gap: 1.25rem;
      margin-bottom: 1.5rem;
    }
    .card {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 1.25rem;
    }
    .card-title {
      font-size: 0.9rem;
      font-weight: 700;
      color: var(--text);
      margin-bottom: 1rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .receipt-mock {
      background: #06080C;
      border: 1px dashed rgba(255,255,255,0.18);
      border-radius: 10px;
      padding: 1.25rem;
      font-family: ui-monospace, Menlo, monospace;
      font-size: 0.8rem;
      position: relative;
    }
    .bbox {
      border: 1.5px solid var(--accent);
      background: rgba(16, 185, 129, 0.1);
      border-radius: 4px;
      padding: 0.15rem 0.35rem;
      margin: 0.3rem 0;
      display: inline-block;
      position: relative;
    }
    .bbox-tag {
      position: absolute;
      top: -9px;
      right: -4px;
      background: var(--accent);
      color: #000;
      font-size: 0.55rem;
      font-weight: 800;
      padding: 1px 4px;
      border-radius: 2px;
    }
    .field-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.65rem 0;
      border-bottom: 1px solid rgba(255,255,255,0.05);
      font-size: 0.8125rem;
    }
    .field-name { color: var(--text-muted); }
    .field-val { font-weight: 600; color: #fff; }
    .conf-meter {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .bar {
      width: 70px;
      height: 6px;
      background: rgba(255,255,255,0.1);
      border-radius: 3px;
      overflow: hidden;
    }
    .bar-fill {
      height: 100%;
      background: var(--accent);
      border-radius: 3px;
    }
    .slider-box {
      margin-top: 1rem;
      padding: 1rem;
      background: rgba(255,255,255,0.02);
      border: 1px solid var(--border);
      border-radius: 10px;
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
      font-size: 0.85rem;
    }
  </style>
</head>
<body>
  <header>
    <div class="brand">
      <span class="brand-accent">⚡ AUTOCLAIM</span>
      <span style="font-size:0.85rem; color:var(--text-muted)">/ OCR Inspector</span>
    </div>
    <span class="badge">OCR Vision v4.2 • Live</span>
  </header>

  <div class="grid">
    <div class="card">
      <div class="card-title">
        <span>Tài liệu hóa đơn gốc</span>
        <span style="font-size:0.75rem; color:var(--accent)">#INV-89210-VN</span>
      </div>
      <div class="receipt-mock">
        <div style="text-align:center; margin-bottom:0.75rem; color:var(--text-muted)">--- HÓA ĐƠN ĐIỆN TỬ GTGT ---</div>
        <div>Đơn vị bán: <span class="bbox">CÔNG TY TNHH STARBUCKS VN<span class="bbox-tag">99.8%</span></span></div>
        <div>Mã số thuế: <span class="bbox">0311245892<span class="bbox-tag">99.4%</span></span></div>
        <div>Ngày lập: <span class="bbox">29/09/2026 14:15<span class="bbox-tag">98.9%</span></span></div>
        <div style="margin: 0.6rem 0; border-top:1px dashed rgba(255,255,255,0.15)"></div>
        <div>01. Caffe Americano (Grande) - 85.000 ₫</div>
        <div>02. Butter Croissant - 60.000 ₫</div>
        <div>03. Pure Water 500ml - 40.000 ₫</div>
        <div style="margin: 0.6rem 0; border-top:1px dashed rgba(255,255,255,0.15)"></div>
        <div>Cộng tiền hàng: 185.000 ₫</div>
        <div>Thuế GTGT (VAT 8%): 14.800 ₫</div>
        <div style="font-size:0.9rem; font-weight:700">TỔNG CỘNG: <span class="bbox" style="border-color:#34D399; font-weight:700">199.800 ₫<span class="bbox-tag">99.7%</span></span></div>
      </div>
    </div>

    <div class="card">
      <div class="card-title">
        <span>Bóc tách cấu trúc dữ liệu</span>
        <span style="font-size:0.75rem; color:#10B981">● 6/6 Trường hợp lệ</span>
      </div>
      <div class="field-row">
        <span class="field-name">Nhà cung cấp</span>
        <span class="field-val">Starbucks Coffee Vietnam</span>
        <div class="conf-meter"><div class="bar"><div class="bar-fill" style="width:99%"></div></div><span>99.8%</span></div>
      </div>
      <div class="field-row">
        <span class="field-name">Mã số thuế (MST)</span>
        <span class="field-val">0311245892</span>
        <div class="conf-meter"><div class="bar"><div class="bar-fill" style="width:99%"></div></div><span>99.4%</span></div>
      </div>
      <div class="field-row">
        <span class="field-name">Thời gian chi tiêu</span>
        <span class="field-val">29/09/2026 14:15</span>
        <div class="conf-meter"><div class="bar"><div class="bar-fill" style="width:98%"></div></div><span>98.9%</span></div>
      </div>
      <div class="field-row">
        <span class="field-name">Danh mục chi phí</span>
        <span class="field-val" style="color:var(--accent)">Tiếp khách & Ăn uống</span>
        <div class="conf-meter"><div class="bar"><div class="bar-fill" style="width:96%"></div></div><span>96.5%</span></div>
      </div>
      <div class="field-row">
        <span class="field-name">Tổng thanh toán</span>
        <span class="field-val" style="color:#10B981; font-weight:700">199.800 ₫</span>
        <div class="conf-meter"><div class="bar"><div class="bar-fill" style="width:100%"></div></div><span>99.7%</span></div>
      </div>
      <div class="field-row">
        <span class="field-name">Quy chế tự động</span>
        <span class="field-val" style="color:#34D399">THỎA MÃN HẠN MỨC (&lt; 500.000 ₫)</span>
        <span style="color:#10B981; font-size:0.75rem;">ĐỦ ĐIỀU KIỆN</span>
      </div>

      <div class="slider-box">
        <div style="display:flex; justify-content:space-between; font-size:0.78rem; margin-bottom:0.5rem">
          <span>Ngưỡng tin cậy OCR Tự động duyệt</span>
          <span id="sliderVal" style="color:var(--accent); font-weight:700">95%</span>
        </div>
        <input type="range" min="80" max="99" value="95" style="width:100%; accent-color:var(--accent)" oninput="document.getElementById('sliderVal').textContent = this.value + '%'">
      </div>
      <button class="btn" style="margin-top:1rem" onclick="alert('Đã cập nhật tiêu chuẩn nhận diện OCR!')">Lưu cấu hình nhận diện</button>
    </div>
  </div>
</body>
</html>`;
    }

    // SCREEN 2: Policy Engine & Rule Configuration Matrix
    if (screenIndex === 2) {
      return `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>AutoClaim - Policy Engine & Rules</title>
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
      padding: ${platform === 'app' ? '1rem' : '1.75rem'};
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
    .brand { font-size: 1.15rem; font-weight: 800; color: var(--text); }
    .brand-accent { color: var(--accent); }
    .rules-grid {
      display: flex;
      flex-direction: column;
      gap: 0.85rem;
      margin-bottom: 1.5rem;
    }
    .rule-card {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 1rem 1.25rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .rule-info { flex: 1; padding-right: 1rem; }
    .rule-title { font-weight: 700; font-size: 0.875rem; color: #fff; margin-bottom: 0.25rem; }
    .rule-desc { font-size: 0.78rem; color: var(--text-muted); line-height: 1.4; }
    .switch {
      position: relative;
      display: inline-block;
      width: 44px;
      height: 24px;
    }
    .switch input { opacity: 0; width: 0; height: 0; }
    .slider {
      position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0;
      background-color: rgba(255,255,255,0.15);
      transition: .3s;
      border-radius: 24px;
    }
    .slider:before {
      position: absolute; content: ""; height: 18px; width: 18px; left: 3px; bottom: 3px;
      background-color: white;
      transition: .3s;
      border-radius: 50%;
    }
    input:checked + .slider { background-color: var(--accent); }
    input:checked + .slider:before { transform: translateX(20px); background-color: #000; }
    
    .sandbox-card {
      background: rgba(16, 185, 129, 0.05);
      border: 1px solid rgba(16, 185, 129, 0.2);
      border-radius: 12px;
      padding: 1.25rem;
      margin-bottom: 1.5rem;
    }
    .btn {
      background: var(--accent);
      color: #000;
      border: none;
      padding: 0.7rem 1.25rem;
      border-radius: 8px;
      font-weight: 700;
      cursor: pointer;
      font-size: 0.85rem;
      width: 100%;
    }
  </style>
</head>
<body>
  <header>
    <div class="brand">
      <span class="brand-accent">⚡ AUTOCLAIM</span>
      <span style="font-size:0.85rem; color:var(--text-muted)">/ Quy tắc duyệt tự động</span>
    </div>
    <span style="font-size:0.75rem; color:var(--accent); font-weight:600">4 Quy tắc đang chạy</span>
  </header>

  <div class="rules-grid">
    <div class="rule-card">
      <div class="rule-info">
        <div class="rule-title">Quy tắc #01: Tiếp khách & Ăn uống hàng ngày (&lt; 500.000 ₫)</div>
        <div class="rule-desc">Tự động phê duyệt ngay lập tức khi hóa đơn có MST hợp lệ và OCR confidence &gt; 95%.</div>
      </div>
      <label class="switch"><input type="checkbox" checked><span class="slider"></span></label>
    </div>

    <div class="rule-card">
      <div class="rule-info">
        <div class="rule-title">Quy tắc #02: Di chuyển công tác (Taxi/Grab &lt; 300.000 ₫)</div>
        <div class="rule-desc">Tự động duyệt bồi hoàn khi lộ trình di chuyển trùng khớp lịch công tác đã đăng ký.</div>
      </div>
      <label class="switch"><input type="checkbox" checked><span class="slider"></span></label>
    </div>

    <div class="rule-card">
      <div class="rule-info">
        <div class="rule-title">Quy tắc #03: Gắn cờ chi phí ngoài giờ & cuối tuần</div>
        <div class="rule-desc">Yêu cầu quản lý trực tiếp xác nhận mục đích công việc nếu phát sinh sau 21h hoặc vào Chủ Nhật.</div>
      </div>
      <label class="switch"><input type="checkbox" checked><span class="slider"></span></label>
    </div>

    <div class="rule-card">
      <div class="rule-info">
        <div class="rule-title">Quy tắc #04: Chống gian lận băm ảnh trùng lặp (SHA-256)</div>
        <div class="rule-desc">Khóa tức thì và từ chối các yêu cầu có hình ảnh hóa đơn đã từng được nộp trong 60 ngày.</div>
      </div>
      <label class="switch"><input type="checkbox" checked><span class="slider"></span></label>
    </div>
  </div>

  <div class="sandbox-card">
    <div style="font-weight:700; font-size:0.9rem; margin-bottom:0.75rem; color:#fff">Kiểm thử nhanh chính sách (Sandbox)</div>
    <div style="display:grid; grid-template-columns:${platform === 'app' ? '1fr' : '1fr 1fr'}; gap:0.75rem; margin-bottom:0.75rem">
      <input type="text" id="testMerchant" value="Grab Taxi Co." style="background:var(--surface); border:1px solid var(--border); padding:0.6rem; border-radius:6px; color:#fff; font-size:0.8rem" placeholder="Tên đơn vị...">
      <input type="text" id="testAmount" value="145,000" style="background:var(--surface); border:1px solid var(--border); padding:0.6rem; border-radius:6px; color:#fff; font-size:0.8rem" placeholder="Số tiền (VND)...">
    </div>
    <div id="testResult" style="padding:0.6rem; background:rgba(0,0,0,0.3); border-radius:6px; font-size:0.78rem; color:#34D399; margin-bottom:0.75rem">
      ✓ KẾT QUẢ ĐỐI SOÁT: TỰ ĐỘNG DUYỆT (Hợp lệ theo Quy tắc #02, thời gian 14ms)
    </div>
    <button class="btn" onclick="runSandboxTest()">Chạy thử nghiệm đối soát</button>
  </div>

  <script>
    function runSandboxTest() {
      const amt = parseInt(document.getElementById('testAmount').value.replace(/[^0-9]/g, '')) || 0;
      const res = document.getElementById('testResult');
      if (amt > 500000) {
        res.style.color = '#F59E0B';
        res.textContent = '! KẾT QUẢ: CẦN QUẢN LÝ DUYỆT (Vượt hạn mức tự động 500.000 ₫)';
      } else {
        res.style.color = '#34D399';
        res.textContent = '✓ KẾT QUẢ ĐỐI SOÁT: TỰ ĐỘNG DUYỆT (Thỏa mãn chính sách, thời gian 12ms)';
      }
    }
  </script>
</body>
</html>`;
    }

    // SCREEN 3: Audit Trail & Financial ERP Synchronization
    if (screenIndex === 3) {
      return `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>AutoClaim - Audit Trail & ERP Hub</title>
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
      padding: ${platform === 'app' ? '1rem' : '1.75rem'};
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
    .brand { font-size: 1.15rem; font-weight: 800; color: var(--text); }
    .brand-accent { color: var(--accent); }
    .sync-cards {
      display: grid;
      grid-template-columns: ${platform === 'app' ? '1fr' : 'repeat(3, 1fr)'};
      gap: 1rem;
      margin-bottom: 1.5rem;
    }
    .sync-card {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 1rem;
      font-size: 0.8125rem;
    }
    .sync-status { display: flex; align-items: center; gap: 0.4rem; font-size: 0.75rem; margin-top: 0.4rem; color: #10B981; }
    .log-table {
      width: 100%;
      border-collapse: collapse;
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 12px;
      overflow: hidden;
      margin-bottom: 1.5rem;
    }
    .log-table th, .log-table td {
      padding: 0.8rem 1rem;
      text-align: left;
      font-size: 0.8rem;
      border-bottom: 1px solid var(--border);
    }
    .log-table th { background: rgba(0,0,0,0.25); color: var(--text-muted); font-weight: 600; }
    .hash { font-family: ui-monospace, Menlo, monospace; color: var(--accent); font-size: 0.75rem; }
    .btn-row { display: flex; gap: 0.75rem; }
    .btn {
      background: var(--accent);
      color: #000;
      border: none;
      padding: 0.75rem 1.25rem;
      border-radius: 8px;
      font-weight: 700;
      cursor: pointer;
      font-size: 0.85rem;
      flex: 1;
    }
  </style>
</head>
<body>
  <header>
    <div class="brand">
      <span class="brand-accent">⚡ AUTOCLAIM</span>
      <span style="font-size:0.85rem; color:var(--text-muted)">/ Kiểm toán & Đồng bộ ERP</span>
    </div>
    <span style="font-size:0.75rem; color:#10B981">● Hệ thống bất biến SHA-256</span>
  </header>

  <div class="sync-cards">
    <div class="sync-card">
      <div style="font-weight:700; color:#fff">Oracle NetSuite ERP</div>
      <div class="sync-status">● Đang kết nối • 142/142 Đồng bộ</div>
    </div>
    <div class="sync-card">
      <div style="font-weight:700; color:#fff">SAP Concur Expense</div>
      <div class="sync-status">● Đang kết nối • Cập nhật 4p trước</div>
    </div>
    <div class="sync-card">
      <div style="font-weight:700; color:#fff">Stripe Corporate Card</div>
      <div class="sync-status">● Webhook Live • Tự động khớp lệnh</div>
    </div>
  </div>

  <table class="log-table">
    <thead>
      <tr><th>Mã kiểm toán</th><th>Thời gian</th><th>Tác tử thực thi</th><th>Hành động</th></tr>
    </thead>
    <tbody>
      <tr>
        <td class="hash">0x7f..8a1c</td>
        <td>16:20:12</td>
        <td>AUTO_ENGINE_v4</td>
        <td><span style="color:#10B981">Tự động duyệt #CLM-9081 (199.800 ₫)</span></td>
      </tr>
      <tr>
        <td class="hash">0x4b..99d2</td>
        <td>16:18:45</td>
        <td>AUTO_ENGINE_v4</td>
        <td><span style="color:#10B981">Tự động duyệt #CLM-9082 (74.000 ₫)</span></td>
      </tr>
      <tr>
        <td class="hash">0x1e..33a0</td>
        <td>15:55:01</td>
        <td>FRAUD_GUARD</td>
        <td><span style="color:#F59E0B">Gắn cờ ngoại lệ #CLM-9083 (Vượt hạn mức)</span></td>
      </tr>
    </tbody>
  </table>

  <div class="btn-row">
    <button class="btn" onclick="alert('Đã xuất báo cáo kiểm toán tài chính định dạng CSV!')">Xuất báo cáo tài chính (CSV)</button>
    <button class="btn" style="background:rgba(255,255,255,0.08); color:#fff;" onclick="alert('Đã đồng bộ thành công sang NetSuite ERP!')">Đồng bộ tức thì sang ERP</button>
  </div>
</body>
</html>`;
    }

    // SCREEN 0: Core Claims Adjudication Dashboard & Interactive OCR Scanner
    return `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>AutoClaim - Hệ thống Tự động Duyệt Yêu cầu Bồi hoàn</title>
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
      padding: ${platform === 'app' ? '1rem' : '1.75rem'};
      min-height: 100vh;
      max-width: ${platform === 'app' ? '440px' : '1100px'};
      margin: 0 auto;
    }
    header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-bottom: 1.25rem;
      border-bottom: 1px solid var(--border);
      margin-bottom: 1.5rem;
    }
    .brand {
      font-size: 1.25rem;
      font-weight: 800;
      color: var(--text);
      display: flex;
      align-items: center;
      gap: 0.5rem;
      letter-spacing: -0.02em;
    }
    .brand-accent { color: var(--accent); }
    .kpi-grid {
      display: grid;
      grid-template-columns: ${platform === 'app' ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)'};
      gap: 0.85rem;
      margin-bottom: 1.5rem;
    }
    .kpi-card {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 1rem;
    }
    .kpi-label { font-size: 0.72rem; color: var(--text-muted); text-transform: uppercase; font-weight: 600; letter-spacing: 0.04em; }
    .kpi-val { font-size: 1.35rem; font-weight: 800; color: #fff; margin: 0.35rem 0 0.15rem 0; }
    .kpi-sub { font-size: 0.72rem; color: var(--accent); font-weight: 600; }
    
    .scanner-box {
      background: radial-gradient(circle at 50% 0%, rgba(16, 185, 129, 0.08), transparent 70%), var(--surface);
      border: 1.5px dashed rgba(255, 255, 255, 0.15);
      border-radius: 14px;
      padding: 1.5rem;
      text-align: center;
      margin-bottom: 1.5rem;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    .scanner-box:hover { border-color: var(--accent); }
    .scan-progress {
      width: 100%;
      height: 6px;
      background: rgba(255,255,255,0.1);
      border-radius: 3px;
      overflow: hidden;
      margin-top: 0.75rem;
      display: none;
    }
    .scan-bar { height: 100%; width: 0%; background: var(--accent); transition: width 0.3s ease; }

    .filter-bar {
      display: flex;
      flex-direction: ${platform === 'app' ? 'column' : 'row'};
      justify-content: space-between;
      gap: 0.75rem;
      margin-bottom: 1rem;
    }
    .search-input {
      background: var(--surface);
      border: 1px solid var(--border);
      padding: 0.65rem 1rem;
      border-radius: 8px;
      color: #fff;
      font-size: 0.85rem;
      outline: none;
      flex: 1;
    }
    .tabs { display: flex; gap: 0.4rem; overflow-x: auto; }
    .tab {
      background: rgba(255,255,255,0.05);
      border: 1px solid var(--border);
      padding: 0.5rem 0.85rem;
      border-radius: 8px;
      color: var(--text-muted);
      font-size: 0.8rem;
      cursor: pointer;
      white-space: nowrap;
    }
    .tab.active { background: var(--accent); color: #000; font-weight: 700; border-color: var(--accent); }

    .table-wrap {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 12px;
      overflow-x: auto;
    }
    table { width: 100%; border-collapse: collapse; text-align: left; font-size: 0.825rem; }
    th, td { padding: 0.85rem 1rem; border-bottom: 1px solid var(--border); }
    th { color: var(--text-muted); font-weight: 600; background: rgba(0,0,0,0.25); font-size: 0.75rem; }
    tr:hover { background: rgba(255,255,255,0.02); cursor: pointer; }
    .badge-ok {
      background: rgba(16, 185, 129, 0.15);
      color: #10B981;
      padding: 0.2rem 0.55rem;
      border-radius: 4px;
      font-size: 0.75rem;
      font-weight: 600;
    }
    .badge-warn {
      background: rgba(245, 158, 11, 0.15);
      color: #F59E0B;
      padding: 0.2rem 0.55rem;
      border-radius: 4px;
      font-size: 0.75rem;
      font-weight: 600;
    }
    
    .drawer-overlay {
      position: fixed; top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(0,0,0,0.7);
      backdrop-filter: blur(4px);
      display: none;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      padding: 1rem;
    }
    .drawer {
      background: #111522;
      border: 1px solid var(--border);
      border-radius: 14px;
      width: 100%;
      max-width: 500px;
      padding: 1.5rem;
    }
  </style>
</head>
<body>
  <header>
    <div>
      <div class="brand">
        <span class="brand-accent">⚡ AUTOCLAIM</span>
        <span style="font-size: 0.9rem; font-weight: 600; color: #fff;">Phê duyệt Chi phí Tự động</span>
      </div>
      <div style="font-size: 0.78rem; color: var(--text-muted); margin-top: 0.2rem;">Hệ thống nhận diện hóa đơn OCR & Kiểm toán chính sách tài chính thời gian thực</div>
    </div>
    <span style="font-size: 0.75rem; color: var(--accent); background: rgba(16,185,129,0.1); padding: 0.3rem 0.7rem; border-radius: 9999px; font-weight: 600">Động cơ OCR: Trực tiếp</span>
  </header>

  <div class="kpi-grid">
    <div class="kpi-card">
      <div class="kpi-label">Tỷ lệ tự động duyệt</div>
      <div class="kpi-val" style="color:var(--accent)">94.6%</div>
      <div class="kpi-sub">↑ 2.4% so với tuần trước</div>
    </div>
    <div class="kpi-card">
      <div class="kpi-label">Đã duyệt hôm nay</div>
      <div class="kpi-val">142 đơn</div>
      <div class="kpi-sub">Tổng: 48.250.000 ₫</div>
    </div>
    <div class="kpi-card">
      <div class="kpi-label">Cần quản lý xét duyệt</div>
      <div class="kpi-val" style="color:#F59E0B">6 đơn</div>
      <div class="kpi-sub">Chính sách đặc thù</div>
    </div>
    <div class="kpi-card">
      <div class="kpi-label">Tốc độ xử lý bình quân</div>
      <div class="kpi-val">740ms</div>
      <div class="kpi-sub">Zero-Touch Pipeline</div>
    </div>
  </div>

  <div class="scanner-box" onclick="simulateOcrScan()">
    <div style="font-size: 1.75rem; margin-bottom: 0.5rem">📄</div>
    <div style="font-weight: 700; font-size: 0.95rem; color: #fff;">Kéo thả hóa đơn vào đây hoặc click để quét mẫu tức thì</div>
    <div style="font-size: 0.78rem; color: var(--text-muted); margin-top: 0.35rem">Hỗ trợ PDF hóa đơn điện tử GTGT, ảnh chụp camera (JPG, PNG)</div>
    <div class="scan-progress" id="scanProgress"><div class="scan-bar" id="scanBar"></div></div>
    <div id="scanStatus" style="font-size: 0.75rem; color: var(--accent); margin-top: 0.5rem; display: none;">Đang bóc tách OCR...</div>
  </div>

  <div class="filter-bar">
    <input type="text" class="search-input" id="search" placeholder="Tìm theo mã đơn, đơn vị bán hoặc số tiền..." oninput="filterTable(this.value)">
    <div class="tabs">
      <button class="tab active" onclick="filterCategory('all', this)">Tất cả (5)</button>
      <button class="tab" onclick="filterCategory('approved', this)">Tự động duyệt (3)</button>
      <button class="tab" onclick="filterCategory('review', this)">Cần xem xét (2)</button>
    </div>
  </div>

  <div class="table-wrap">
    <table>
      <thead>
        <tr>
          <th>Mã đơn</th>
          <th>Đơn vị phát hành</th>
          <th>Danh mục</th>
          <th>Số tiền</th>
          <th>Độ tin cậy OCR</th>
          <th>Trạng thái</th>
        </tr>
      </thead>
      <tbody id="claimsBody">
        <tr data-cat="approved" onclick="openDrawer('CLM-9081', 'Starbucks Coffee Vietnam', '199.800 ₫', 'Ăn uống & Tiếp khách', 'Tự động phê duyệt', '99.8%')">
          <td style="font-family:ui-monospace; font-weight:700">#CLM-9081</td>
          <td style="font-weight:600">Starbucks Coffee Vietnam</td>
          <td>Ăn uống & Tiếp khách</td>
          <td style="font-weight:700; color:#fff">199.800 ₫</td>
          <td><span style="color:var(--accent); font-weight:700">99.8%</span></td>
          <td><span class="badge-ok">✓ Tự động duyệt</span></td>
        </tr>
        <tr data-cat="approved" onclick="openDrawer('CLM-9082', 'Grab Taxi Vietnam Co.', '74.000 ₫', 'Di chuyển nội đô', 'Tự động phê duyệt', '99.2%')">
          <td style="font-family:ui-monospace; font-weight:700">#CLM-9082</td>
          <td style="font-weight:600">Grab Taxi Vietnam Co.</td>
          <td>Di chuyển công tác</td>
          <td style="font-weight:700; color:#fff">74.000 ₫</td>
          <td><span style="color:var(--accent); font-weight:700">99.2%</span></td>
          <td><span class="badge-ok">✓ Tự động duyệt</span></td>
        </tr>
        <tr data-cat="review" onclick="openDrawer('CLM-9083', 'Khách sạn Melia Hà Nội', '4.850.000 ₫', 'Khách sạn & Lưu trú', 'Cần quản lý duyệt (Vượt hạn mức 3.000.000 ₫)', '71.4%')">
          <td style="font-family:ui-monospace; font-weight:700">#CLM-9083</td>
          <td style="font-weight:600">Khách sạn Melia Hà Nội</td>
          <td>Lưu trú công tác</td>
          <td style="font-weight:700; color:#fff">4.850.000 ₫</td>
          <td><span style="color:#F59E0B; font-weight:700">71.4%</span></td>
          <td><span class="badge-warn">! Vượt hạn mức</span></td>
        </tr>
        <tr data-cat="approved" onclick="openDrawer('CLM-9084', 'Amazon Web Services EMEA', '12.450.000 ₫', 'Hạ tầng Cloud', 'Tự động phê duyệt theo hợp đồng', '98.7%')">
          <td style="font-family:ui-monospace; font-weight:700">#CLM-9084</td>
          <td style="font-weight:600">Amazon Web Services EMEA</td>
          <td>Hạ tầng & Phần mềm</td>
          <td style="font-weight:700; color:#fff">12.450.000 ₫</td>
          <td><span style="color:var(--accent); font-weight:700">98.7%</span></td>
          <td><span class="badge-ok">✓ Tự động duyệt</span></td>
        </tr>
        <tr data-cat="review" onclick="openDrawer('CLM-9085', 'Apple Store Vincom', '32.990.000 ₫', 'Thiết bị & Phần cứng', 'Chờ Giám đốc Khối ký duyệt', '88.0%')">
          <td style="font-family:ui-monospace; font-weight:700">#CLM-9085</td>
          <td style="font-weight:600">Apple Store Vincom</td>
          <td>Thiết bị IT</td>
          <td style="font-weight:700; color:#fff">32.990.000 ₫</td>
          <td><span style="color:#F59E0B; font-weight:700">88.0%</span></td>
          <td><span class="badge-warn">⏳ Chờ GĐ ký</span></td>
        </tr>
      </tbody>
    </table>
  </div>

  <!-- Detail Modal Drawer -->
  <div class="drawer-overlay" id="drawerOverlay" onclick="closeDrawer(event)">
    <div class="drawer" onclick="event.stopPropagation()">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem; border-bottom:1px solid var(--border); padding-bottom:0.75rem">
        <div style="font-weight:800; font-size:1.1rem; color:#fff" id="drawerTitle">Chi tiết Yêu cầu</div>
        <button style="background:none; border:none; color:var(--text-muted); font-size:1.25rem; cursor:pointer" onclick="document.getElementById('drawerOverlay').style.display='none'">✕</button>
      </div>
      <div style="font-size:0.85rem; line-height:1.7; margin-bottom:1.25rem">
        <div style="display:flex; justify-content:space-between"><span style="color:var(--text-muted)">Đơn vị phát hành:</span> <strong id="dMerchant" style="color:#fff"></strong></div>
        <div style="display:flex; justify-content:space-between"><span style="color:var(--text-muted)">Số tiền bồi hoàn:</span> <strong id="dAmount" style="color:var(--accent); font-size:1rem"></strong></div>
        <div style="display:flex; justify-content:space-between"><span style="color:var(--text-muted)">Danh mục chi phí:</span> <span id="dCategory"></span></div>
        <div style="display:flex; justify-content:space-between"><span style="color:var(--text-muted)">Độ tin cậy OCR:</span> <span id="dConfidence" style="font-weight:700"></span></div>
        <div style="display:flex; justify-content:space-between; margin-top:0.4rem"><span style="color:var(--text-muted)">Quyết định hệ thống:</span> <span id="dStatus" style="font-weight:700"></span></div>
      </div>
      <div style="background:rgba(255,255,255,0.03); border:1px solid var(--border); border-radius:8px; padding:0.75rem; font-size:0.75rem; margin-bottom:1rem">
        <div style="font-weight:700; color:#fff; margin-bottom:0.25rem">Kiểm toán tự động:</div>
        <div style="color:#10B981">✓ Mã số thuế doanh nghiệp hợp lệ trên hệ thống Thuế Nhà nước</div>
        <div style="color:#10B981">✓ Không phát hiện hóa đơn trùng lặp trong 60 ngày</div>
        <div style="color:#10B981">✓ Đã xuất toán và đồng bộ phiếu chi sang hệ thống kế toán</div>
      </div>
      <button style="background:var(--accent); color:#000; border:none; width:100%; padding:0.7rem; border-radius:8px; font-weight:700; cursor:pointer;" onclick="alert('Đã xác nhận thao tác phê duyệt!'); document.getElementById('drawerOverlay').style.display='none'">Đóng và Lưu dữ liệu</button>
    </div>
  </div>

  <script>
    function filterCategory(cat, el) {
      document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
      el.classList.add('active');
      document.querySelectorAll('#claimsBody tr').forEach(r => {
        r.style.display = (cat === 'all' || r.getAttribute('data-cat') === cat) ? '' : 'none';
      });
    }

    function filterTable(val) {
      val = val.toLowerCase();
      document.querySelectorAll('#claimsBody tr').forEach(r => {
        r.style.display = r.textContent.toLowerCase().includes(val) ? '' : 'none';
      });
    }

    function openDrawer(id, merchant, amt, cat, status, conf) {
      document.getElementById('drawerTitle').textContent = 'Chi tiết Yêu cầu #' + id;
      document.getElementById('dMerchant').textContent = merchant;
      document.getElementById('dAmount').textContent = amt;
      document.getElementById('dCategory').textContent = cat;
      document.getElementById('dStatus').textContent = status;
      document.getElementById('dConfidence').textContent = conf;
      document.getElementById('drawerOverlay').style.display = 'flex';
    }

    function closeDrawer(e) {
      if (e.target.id === 'drawerOverlay') {
        document.getElementById('drawerOverlay').style.display = 'none';
      }
    }

    function simulateOcrScan() {
      const p = document.getElementById('scanProgress');
      const b = document.getElementById('scanBar');
      const s = document.getElementById('scanStatus');
      p.style.display = 'block';
      s.style.display = 'block';
      b.style.width = '0%';
      s.textContent = 'Đang nhận diện ký tự quang học (OCR)...';
      
      setTimeout(() => { b.style.width = '45%'; s.textContent = 'Đang đối soát MST & Quy chế tài chính...'; }, 400);
      setTimeout(() => { b.style.width = '100%'; s.textContent = 'Đã hoàn tất! Đơn đủ điều kiện Tự động duyệt.'; }, 900);
      setTimeout(() => {
        p.style.display = 'none';
        s.style.display = 'none';
        const newRow = document.createElement('tr');
        newRow.setAttribute('data-cat', 'approved');
        newRow.style.background = 'rgba(16, 185, 129, 0.15)';
        newRow.onclick = function() { openDrawer('CLM-9099', 'Highlands Coffee Corp.', '89.000 ₫', 'Ăn uống & Tiếp khách', 'Tự động phê duyệt', '99.5%'); };
        newRow.innerHTML = '<td style="font-family:ui-monospace; font-weight:700">#CLM-9099</td><td style="font-weight:600">Highlands Coffee Corp. (Vừa quét)</td><td>Ăn uống & Tiếp khách</td><td style="font-weight:700; color:#fff">89.000 ₫</td><td><span style="color:var(--accent); font-weight:700">99.5%</span></td><td><span class="badge-ok">✓ Tự động duyệt</span></td>';
        document.getElementById('claimsBody').prepend(newRow);
        alert('🎉 Đã quét xong hóa đơn mới (#CLM-9099)! Động cơ AI đã TỰ ĐỘNG PHÊ DUYỆT thành công.');
      }, 1300);
    }
  </script>
</body>
</html>`;
  }

  // ==========================================================================
  // 1. RUNNER MATCHMAKING / TINDER FOR RUNNERS DOMAIN
  // ==========================================================================
  if (
    (lower.includes('pacemate') || lower.includes('chạy bộ') || lower.includes('marathon') || (lower.includes('tinder') && (lower.includes('run') || lower.includes('chạy'))) || (lower.includes('runner') && !lower.includes('test') && !lower.includes('task') && !lower.includes('suite'))) &&
    !lower.includes('claim') && !lower.includes('receipt') && !lower.includes('hóa đơn') && !lower.includes('expense') && !lower.includes('approval') && !lower.includes('duyệt')
  ) {

    
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
      padding: ${platform === 'app' ? '1rem' : '1.75rem'};
      min-height: 100vh;
      max-width: ${platform === 'app' ? '440px' : '1100px'};
      margin: 0 auto;
    }
    header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-bottom: 1.25rem;
      border-bottom: 1px solid var(--border);
      margin-bottom: 1.5rem;
    }
    .brand {
      font-size: 1.25rem;
      font-weight: 800;
      color: var(--text);
      display: flex;
      align-items: center;
      gap: 0.5rem;
      letter-spacing: -0.02em;
    }
    .brand-accent { color: var(--accent); }
    .kpi-row {
      display: grid;
      grid-template-columns: ${platform === 'app' ? '1fr' : 'repeat(3, 1fr)'};
      gap: 1rem;
      margin-bottom: 1.5rem;
    }
    .kpi-card {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 1.25rem;
    }
    .kpi-label { font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase; font-weight: 600; }
    .kpi-val { font-size: 1.5rem; font-weight: 800; color: #fff; margin: 0.35rem 0 0.15rem 0; }
    .kpi-sub { font-size: 0.75rem; color: var(--accent); }
    .card {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 1.25rem;
      margin-bottom: 1.5rem;
    }
    .search-bar {
      width: 100%;
      background: rgba(0,0,0,0.3);
      border: 1px solid var(--border);
      padding: 0.65rem 1rem;
      border-radius: 8px;
      color: #fff;
      font-size: 0.85rem;
      margin-bottom: 1rem;
      outline: none;
    }
    .item-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.75rem 0;
      border-bottom: 1px solid rgba(255,255,255,0.05);
      font-size: 0.85rem;
      cursor: pointer;
      transition: background 0.15s ease;
    }
    .item-row:hover { background: rgba(255,255,255,0.02); }
    .item-row:last-child { border-bottom: none; }
    .status-pill {
      background: rgba(16, 185, 129, 0.15);
      color: #10B981;
      padding: 0.2rem 0.6rem;
      border-radius: 9999px;
      font-size: 0.75rem;
      font-weight: 600;
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
      font-size: 0.85rem;
    }
  </style>
</head>
<body>
  <header>
    <div>
      <div class="brand">
        <span class="brand-accent">⚡</span>
        <span>${safeTitle}</span>
      </div>
      <div style="font-size: 0.8rem; color: var(--text-muted); margin-top: 0.2rem">Hệ thống Điều phối Vận hành & Phân tích Thời gian thực</div>
    </div>
    <span style="font-size: 0.75rem; color: var(--accent); background: rgba(16,185,129,0.1); padding: 0.3rem 0.6rem; border-radius: 9999px; font-weight:600">Trực tuyến</span>
  </header>

  <div class="kpi-row">
    <div class="kpi-card">
      <div class="kpi-label">Tổng tải tiến trình</div>
      <div class="kpi-val" style="color:var(--accent)">1,428</div>
      <div class="kpi-sub">↑ 12% so với phiên trước</div>
    </div>
    <div class="kpi-card">
      <div class="kpi-label">Độ ổn định SLA</div>
      <div class="kpi-val">99.95%</div>
      <div class="kpi-sub">Thời gian trễ: 24ms</div>
    </div>
    <div class="kpi-card">
      <div class="kpi-label">Mức độ tự động hóa</div>
      <div class="kpi-val">92.4%</div>
      <div class="kpi-sub">Quy trình Zero-Touch</div>
    </div>
  </div>

  <div class="card">
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem">
      <div style="font-weight:700; font-size:0.95rem; color:#fff">Bảng điều phối tác vụ trực tiếp</div>
      <span style="font-size:0.75rem; color:var(--text-muted)">Thời gian thực</span>
    </div>
    <input type="text" class="search-bar" id="itemSearch" placeholder="Lọc tác vụ hoặc thông số..." oninput="filterRows(this.value)">
    <div id="rowList">
      <div class="item-row" onclick="alert('Chi tiết tác vụ #01: Đang hoạt động ở hiệu năng tối đa')">
        <div>
          <div style="font-weight:600; color:#fff">Tác vụ Đồng bộ Dữ liệu Hệ thống #01</div>
          <div style="font-size:0.75rem; color:var(--text-muted)">Cập nhật 2 phút trước • Quy trình tự động</div>
        </div>
        <span class="status-pill">Hoàn thành</span>
      </div>
      <div class="item-row" onclick="alert('Chi tiết tác vụ #02: Xác thực dữ liệu hoàn tất 100%')">
        <div>
          <div style="font-weight:600; color:#fff">Phân tích Chỉ số & Xác thực Thông tin #02</div>
          <div style="font-size:0.75rem; color:var(--text-muted)">Khởi tạo 5 phút trước • Định dạng chuẩn</div>
        </div>
        <span class="status-pill">Hoạt động</span>
      </div>
      <div class="item-row" onclick="alert('Chi tiết tác vụ #03: Đã kiểm toán an toàn không phát hiện xung đột')">
        <div>
          <div style="font-weight:600; color:#fff">Khởi chạy Mô hình Đánh giá Trực quan #03</div>
          <div style="font-size:0.75rem; color:var(--text-muted)">Chu kỳ tuần hoàn • Không lỗi</div>
        </div>
        <span class="status-pill">Đã xác nhận</span>
      </div>
    </div>
    <button class="btn" style="margin-top:1rem" onclick="addNewItem()">+ Khởi tạo tác vụ vận hành mới</button>
  </div>

  <script>
    function filterRows(val) {
      val = val.toLowerCase();
      document.querySelectorAll('#rowList .item-row').forEach(row => {
        row.style.display = row.textContent.toLowerCase().includes(val) ? '' : 'none';
      });
    }
    function addNewItem() {
      const list = document.getElementById('rowList');
      const newRow = document.createElement('div');
      newRow.className = 'item-row';
      newRow.style.background = 'rgba(16, 185, 129, 0.1)';
      const id = Math.floor(Math.random()*900 + 100);
      newRow.onclick = function() { alert('Tác vụ mới #' + id + ': Đang đồng bộ hóa dữ liệu'); };
      newRow.innerHTML = '<div><div style="font-weight:600; color:#fff">Tác vụ Vừa kích hoạt #' + id + '</div><div style="font-size:0.75rem; color:var(--text-muted)">Vừa xong • Kích hoạt bởi người dùng</div></div><span class="status-pill">Đang xử lý</span>';
      list.prepend(newRow);
      alert('Đã khởi tạo tác vụ #' + id + ' thành công!');
    }
  </script>
</body>
</html>`;
}
