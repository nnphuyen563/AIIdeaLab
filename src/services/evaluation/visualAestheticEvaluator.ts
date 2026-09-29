import { getDefaultAiConfig, hasValidApiKey } from '../aiService';

export interface VisualFlaw {
  id: string;
  category: 'typography' | 'spacing' | 'contrast' | 'anti_slop' | 'hierarchy';
  severity: 'critical' | 'warning' | 'suggestion';
  title: string;
  description: string;
  suggestedCssFix?: string;
}

export interface VisualAestheticReport {
  overallScore: number; // 0 - 100
  gradeBadge: string;
  gradeTier: 'luxury_agency' | 'modern_clean' | 'acceptable_minimal' | 'needs_polish';
  summary: string;
  pillarScores: {
    typographyHierarchy: number; // 0 - 100
    spatialRhythmAndGrid: number; // 0 - 100
    colorHarmonyAndContrast: number; // 0 - 100
    antiSlopAndPolish: number; // 0 - 100
  };
  detectedFlaws: VisualFlaw[];
  positiveHighlights: string[];
  instantLevelUpCssSnippets: {
    targetComponent: string;
    explanation: string;
    cssCode: string;
  }[];
}

const VISUAL_EVALUATION_SYSTEM_PROMPT = `Bạn là Trưởng nhóm Thiết kế Giao diện Cấp cao (Design Director & Lead UI/UX Engineer) chuyên đánh giá các sản phẩm web và ứng dụng tiêu chuẩn quốc tế (như Stripe, Apple, Vercel, Linear).
Nhiệm vụ của bạn là thẩm định mã nguồn HTML/CSS của prototype một cách khắt khe:

Tiêu chuẩn đánh giá:
1. typographyHierarchy (25%): Phân cấp cỡ chữ, độ dãn dòng (line-height >= 1.4), khoảng cách tiêu đề.
2. spatialRhythmAndGrid (25%): Nhịp điệu khoảng trắng (8px grid), lề padding/margin cân đối, không chen chúc.
3. colorHarmonyAndContrast (25%): Độ tương phản màu chữ/nền chuẩn WCAG AA, bảng màu tinh tế, không chói gắt.
4. antiSlopAndPolish (25%): Loại trừ "AI Template Slop" (nền gradient tím hồng rẻ tiền, thẻ lồng thẻ vô nghĩa, căn giữa toàn bộ, thiếu hiệu ứng hover/active/transition).

Hãy trả về CHÍNH XÁC định dạng JSON:
{
  "overallScore": number (0-100),
  "gradeBadge": string,
  "gradeTier": "luxury_agency" | "modern_clean" | "acceptable_minimal" | "needs_polish",
  "summary": string (tiếng Việt),
  "pillarScores": {
    "typographyHierarchy": number,
    "spatialRhythmAndGrid": number,
    "colorHarmonyAndContrast": number,
    "antiSlopAndPolish": number
  },
  "detectedFlaws": [
    {
      "id": string,
      "category": "typography" | "spacing" | "contrast" | "anti_slop" | "hierarchy",
      "severity": "critical" | "warning" | "suggestion",
      "title": string,
      "description": string,
      "suggestedCssFix": string
    }
  ],
  "positiveHighlights": [string, string],
  "instantLevelUpCssSnippets": [
    {
      "targetComponent": string,
      "explanation": string,
      "cssCode": string
    }
  ]
}`;

/**
 * Evaluates the visual aesthetic, DOM hierarchy, and design quality of a prototype
 */
export async function evaluateVisualAesthetic(
  htmlContent: string,
  screenTitle: string = 'Prototype Canvas'
): Promise<VisualAestheticReport> {
  const config = getDefaultAiConfig();

  // If live API key is present, run deep LLM critique
  if (hasValidApiKey() && config.apiKey && config.apiKey.trim().length > 5) {
    try {
      const userMessage = `
MÀN HÌNH CẦN THẨM ĐỊNH THỊ GIÁC: "${screenTitle}"
MÃ NGUỒN HTML/CSS CỦA PROTOTYPE (trích đoạn 3500 ký tự):
\`\`\`html
${htmlContent.slice(0, 3500)}
\`\`\`

Hãy phân tích tính thẩm mỹ thị giác, phân cấp kiểu chữ, bảng màu, khoảng trắng và các lỗi AI slop.`;

      if (config.provider === 'gemini') {
        const model = config.model || 'gemini-2.5-flash';
        const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${config.apiKey.trim()}`;

        const res = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              { role: 'user', parts: [{ text: `${VISUAL_EVALUATION_SYSTEM_PROMPT}\n\n${userMessage}` }] }
            ],
            generationConfig: {
              responseMimeType: 'application/json',
              temperature: 0.25
            }
          })
        });

        if (res.ok) {
          const data = await res.json();
          const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (text) {
            return JSON.parse(text) as VisualAestheticReport;
          }
        }
      } else {
        const baseUrl = config.customBaseUrl?.trim() || 'https://api.openai.com/v1';
        const endpoint = `${baseUrl.replace(/\/+$/, '')}/chat/completions`;
        const model = config.model || 'gpt-4o-mini';

        const res = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${config.apiKey.trim()}`
          },
          body: JSON.stringify({
            model,
            messages: [
              { role: 'system', content: VISUAL_EVALUATION_SYSTEM_PROMPT },
              { role: 'user', content: userMessage }
            ],
            response_format: { type: 'json_object' },
            temperature: 0.25
          })
        });

        if (res.ok) {
          const data = await res.json();
          const text = data.choices?.[0]?.message?.content;
          if (text) {
            return JSON.parse(text) as VisualAestheticReport;
          }
        }
      }
    } catch (err) {
      console.warn('Live visual aesthetic evaluation failed, using procedural DOM audit:', err);
    }
  }

  // Deep Procedural DOM & CSS Visual Inspector
  return auditDomVisualAesthetics(htmlContent, screenTitle);
}

/**
 * Procedural DOM & CSS inspection analyzing typography, contrast, spacing and anti-slop rules
 */
export function auditDomVisualAesthetics(html: string, screenTitle: string): VisualAestheticReport {
  const lowerHtml = html.toLowerCase();
  const flaws: VisualFlaw[] = [];
  const positiveHighlights: string[] = [];

  // 1. Typography & Hierarchy Analysis
  const hasH1 = /<h1[^>]*>/i.test(html);
  const hasH2 = /<h2[^>]*>/i.test(html);
  const hasH3 = /<h3[^>]*>/i.test(html);
  const headingCount = (html.match(/<h[1-6][^>]*>/gi) || []).length;
  const paragraphCount = (html.match(/<p[^>]*>/gi) || []).length;
  const hasFontFamily = /font-family/i.test(html);

  let typographyScore = 70;
  if (!hasH1 && !hasH2) {
    typographyScore -= 25;
    flaws.push({
      id: 'flaw_no_heading',
      category: 'hierarchy',
      severity: 'critical',
      title: 'Thiếu tiêu đề phân cấp chính (H1/H2)',
      description: 'Màn hình không có thẻ tiêu đề cấu trúc rõ ràng, khiến mắt người dùng không tìm được điểm neo thị giác (Focal Point).',
      suggestedCssFix: 'h1 { font-size: 1.75rem; font-weight: 700; letter-spacing: -0.02em; line-height: 1.25; }'
    });
  } else if (hasH1 && hasH2) {
    typographyScore += 15;
    positiveHighlights.push('Hệ thống tiêu đề phân cấp H1/H2 rõ nét, định hướng ánh mắt tốt.');
  }

  if (hasH3 && headingCount >= 3) {
    typographyScore += 5;
  }
  if (paragraphCount > 4 && !hasFontFamily) {
    typographyScore -= 5;
  }

  if (lowerHtml.includes('line-height: 1') && !lowerHtml.includes('line-height: 1.5') && !lowerHtml.includes('line-height: 1.6')) {
    typographyScore -= 12;
    flaws.push({
      id: 'flaw_tight_leading',
      category: 'typography',
      severity: 'warning',
      title: 'Khoảng cách dòng quá sát (Tight Leading)',
      description: 'Đoạn văn có line-height quá thấp làm dính chữ, gây mỏi mắt khi đọc trên thiết bị di động.',
      suggestedCssFix: 'p, .body-text { line-height: 1.6; letter-spacing: 0.01em; }'
    });
  }

  // 2. Spatial Rhythm & Grid Analysis
  const hasGrid = /display:\s*grid/i.test(html) || lowerHtml.includes('grid-cols-') || lowerHtml.includes('grid');
  const hasFlex = /display:\s*flex/i.test(html) || lowerHtml.includes('flex');
  const hasGap = /gap:\s*\d+/i.test(html) || lowerHtml.includes('gap-');
  const hasBorders = /border:\s*1px/i.test(html) || lowerHtml.includes('border');
  const hasBorderRadius = /border-radius/i.test(html) || lowerHtml.includes('rounded');

  let spatialScore = 65;
  if (hasGrid || hasFlex) {
    spatialScore += 15;
    positiveHighlights.push('Áp dụng Flexbox / Grid hiện đại cho bố cục tổng thể.');
  } else {
    spatialScore -= 20;
    flaws.push({
      id: 'flaw_no_grid',
      category: 'spacing',
      severity: 'warning',
      title: 'Thiếu hệ lưới căn chỉnh bố cục',
      description: 'Các phần tử đang được bố trí theo luồng tài liệu tự nhiên, dễ vỡ cấu trúc khi thay đổi kích thước cửa sổ.',
      suggestedCssFix: '.canvas-container { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem; }'
    });
  }

  if (hasBorders && hasBorderRadius) {
    spatialScore += 5;
    positiveHighlights.push('Đường viền bo góc mềm mại, tạo chiều sâu thẻ tốt.');
  }

  if (hasGap) {
    spatialScore += 10;
  } else {
    flaws.push({
      id: 'flaw_missing_gap',
      category: 'spacing',
      severity: 'suggestion',
      title: 'Khoảng cách giữa các thành phần chưa chuẩn 8-pt',
      description: 'Nên dùng thuộc tính gap nhất quán (gap: 1rem hoặc gap: 1.5rem) thay vì margin phân tán.',
      suggestedCssFix: '.card-grid { display: flex; flex-direction: column; gap: 1rem; }'
    });
  }

  // 3. Color Harmony & WCAG Contrast Analysis
  const hasPureBlackBg = /background(-color)?:\s*(#000|#000000|black)/i.test(html);
  const hasPureWhiteText = /color:\s*(#fff|#ffffff|white)/i.test(html);
  const hasSubtleNeutral = /#0f172a|#1e293b|#111827|#0b0f17|rgba\(255,\s*255,\s*255,\s*0\./i.test(html);

  let colorScore = 70;
  if (hasPureBlackBg && hasPureWhiteText && !hasSubtleNeutral) {
    colorScore -= 15;
    flaws.push({
      id: 'flaw_stark_contrast',
      category: 'contrast',
      severity: 'warning',
      title: 'Độ tương phản quá gắt (Harsh Stark Contrast)',
      description: 'Nền đen tuyệt đối (#000000) đối chọi chữ trắng tinh (#FFFFFF) gây hiện tượng lóa mắt (halation effect). Nên dùng xám đậm cao cấp (ví dụ #0B0F17 hoặc #0F172A).',
      suggestedCssFix: 'body { background-color: #0B0F17; color: #E2E8F0; }'
    });
  } else if (hasSubtleNeutral) {
    colorScore += 18;
    positiveHighlights.push('Sử dụng tông màu nền xám slate/navy cao cấp, dịu mắt chuẩn Dark-mode hiện đại.');
  }

  // 4. Anti-Slop & Polish Detection
  let antiSlopScore = 75;
  const hasPurplePinkGradient = /linear-gradient\(.*(#a855f7|#ec4899|#8b5cf6|#d946ef|magenta|purple)/i.test(html);
  const hasAllCenter = (html.match(/text-align:\s*center/gi) || []).length >= 4;
  const hasHoverTransitions = /transition:/i.test(html) || /:hover/i.test(html);
  const hasButtons = /<button[^>]*>/i.test(html);

  if (hasPurplePinkGradient) {
    antiSlopScore -= 18;
    flaws.push({
      id: 'flaw_purple_slop',
      category: 'anti_slop',
      severity: 'warning',
      title: 'Mẫu Gradient tím/hồng kiểu AI mẫu (Generic AI Slop)',
      description: 'Dải màu gradient tím/hồng phổ thông tạo cảm giác sản phẩm tạo vội bằng AI generator mà thiếu cá tính thương hiệu riêng.',
      suggestedCssFix: 'background: linear-gradient(180deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%); border: 1px solid rgba(255,255,255,0.08);'
    });
  }

  if (hasAllCenter) {
    antiSlopScore -= 15;
    flaws.push({
      id: 'flaw_over_centered',
      category: 'anti_slop',
      severity: 'warning',
      title: 'Lạm dụng căn giữa (Over-centered Alignment)',
      description: 'Căn giữa toàn bộ văn bản và nút bấm làm mắt người dùng phải nhảy zíc-zắc khi đọc. Các giao diện chuyên nghiệp luôn ưu tiên căn trái (Left-aligned).',
      suggestedCssFix: '.content-body { text-align: left; }'
    });
  }

  if (hasButtons && !hasHoverTransitions) {
    antiSlopScore -= 10;
    flaws.push({
      id: 'flaw_no_hover_state',
      category: 'anti_slop',
      severity: 'suggestion',
      title: 'Nút bấm thiếu hiệu ứng phản hồi (Hover/Active Affordance)',
      description: 'Nút bấm tĩnh không đổi màu hay hiệu ứng khi rê chuột làm giảm cảm giác tương tác thực tế.',
      suggestedCssFix: 'button { transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1); } button:hover { transform: translateY(-1px); filter: brightness(1.1); }'
    });
  } else if (hasHoverTransitions) {
    antiSlopScore += 12;
    positiveHighlights.push('Có tích hợp micro-interactions và hiệu ứng hover mượt mà.');
  }

  // Ensure minimum positive highlights
  if (positiveHighlights.length === 0) {
    positiveHighlights.push('Khung HTML hợp lệ, sẵn sàng hiển thị trực quan trên Live Mock Canvas.');
  }

  // Compute Overall Score
  typographyScore = Math.max(30, Math.min(95, typographyScore));
  spatialScore = Math.max(30, Math.min(95, spatialScore));
  colorScore = Math.max(30, Math.min(95, colorScore));
  antiSlopScore = Math.max(30, Math.min(95, antiSlopScore));

  const overallScore = Math.round(
    typographyScore * 0.25 +
    spatialScore * 0.25 +
    colorScore * 0.25 +
    antiSlopScore * 0.25
  );

  let gradeBadge = 'Khá Hiện Đại';
  let gradeTier: 'luxury_agency' | 'modern_clean' | 'acceptable_minimal' | 'needs_polish' = 'modern_clean';
  if (overallScore >= 85) {
    gradeBadge = 'Chuẩn Agency Cao Cấp';
    gradeTier = 'luxury_agency';
  } else if (overallScore >= 70) {
    gradeBadge = 'Sạch Sẽ & Hiện Đại';
    gradeTier = 'modern_clean';
  } else if (overallScore >= 55) {
    gradeBadge = 'Tối Giản Cơ Bản';
    gradeTier = 'acceptable_minimal';
  } else {
    gradeBadge = 'Cần Trau Chuốt Thêm';
    gradeTier = 'needs_polish';
  }

  return {
    overallScore,
    gradeBadge,
    gradeTier,
    summary: `Thẩm định thẩm mỹ cho "${screenTitle}": Đạt ${overallScore}/100 điểm (${gradeBadge}). ${
      flaws.length === 0 
        ? 'Giao diện đạt chuẩn phân cấp thị giác và nhịp điệu khoảng trắng rất tốt.'
        : `Phát hiện ${flaws.length} điểm cần tinh chỉnh để loại bỏ cảm giác template thô và nâng tầm trải nghiệm thị giác.`
    }`,
    pillarScores: {
      typographyHierarchy: typographyScore,
      spatialRhythmAndGrid: spatialScore,
      colorHarmonyAndContrast: colorScore,
      antiSlopAndPolish: antiSlopScore
    },
    detectedFlaws: flaws,
    positiveHighlights,
    instantLevelUpCssSnippets: [
      {
        targetComponent: 'Thẻ Nội dung & Khối Card',
        explanation: 'Thay thế viền thô bằng hiệu ứng Glassmorphism vi mô với bóng đổ nhiều tầng:',
        cssCode: `.premium-card {
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  box-shadow: 0 4px 20px -2px rgba(0, 0, 0, 0.35);
}`
      },
      {
        targetComponent: 'Nút Hành Động Chính (Primary CTA)',
        explanation: 'Tạo độ sâu thị giác và viền sáng trên đỉnh nút (rim-light) theo chuẩn Stripe/Linear:',
        cssCode: `.primary-btn {
  background: linear-gradient(180deg, #10B981 0%, #059669 100%);
  border: 1px solid #34D399;
  box-shadow: inset 0 1px 0 rgba(255,255,255,0.25), 0 2px 8px rgba(16, 185, 129, 0.35);
  font-weight: 600;
  transition: all 0.2s ease;
}`
      }
    ]
  };
}
