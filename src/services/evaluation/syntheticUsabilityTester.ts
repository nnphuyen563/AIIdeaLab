import { getDefaultAiConfig, hasValidApiKey } from '../aiService';

export interface SyntheticPersonaJourney {
  personaName: string;
  personaRole: string;
  avatarIcon: 'zap' | 'users' | 'shield';
  patienceLevel: 'low' | 'moderate' | 'high';
  techLiteracy: 'novice' | 'intermediate' | 'expert';
  firstImpressionQuote: string;
  taskGoal: string;
  taskCompletionStatus: 'completed_smoothly' | 'completed_with_friction' | 'abandoned';
  frictionPointsEncountered: string[];
  verdictQuote: string;
}

export interface SyntheticUsabilityReport {
  overallUsabilityScore: number; // 0 - 100
  verdictLabel: string;
  frictionLevel: 'minimal' | 'moderate' | 'high_friction';
  summary: string;
  fiveSecondTest: {
    passed: boolean;
    comprehensionSummary: string;
    focalPointDetected: string;
  };
  jtbdEfficiency: {
    estimatedClicksToComplete: number;
    cognitiveLoadScore: number; // 0 - 100 (lower is better cognitive load)
    clarityScore: number; // 0 - 100
  };
  personaWalkthroughs: SyntheticPersonaJourney[];
  criticalUsabilityFixes: string[];
}

const USABILITY_TESTER_SYSTEM_PROMPT = `Bạn là Chuyên gia Nghiên cứu Trải nghiệm Người dùng & Kiểm thử Hành vi (Lead UX Researcher & Cognitive Walkthrough Specialist).
Nhiệm vụ của bạn là giả lập kiểm thử giao diện prototype với 3 persona người dùng thực tế:
1. Huy (Người dùng di động bận rộn, kiên nhẫn thấp, chỉ có 10 giây).
2. Cô Lan (Người dùng ngoại đạo công nghệ, sợ bấm nhầm, ghét thuật ngữ phức tạp).
3. Alex (Power user, thích tốc độ, mật độ thông tin cao, thao tác nhanh).

Hãy phân tích HTML/CSS của prototype và trả về kết quả chuẩn xác dạng JSON:
{
  "overallUsabilityScore": number (0-100),
  "verdictLabel": string,
  "frictionLevel": "minimal" | "moderate" | "high_friction",
  "summary": string (tiếng Việt),
  "fiveSecondTest": {
    "passed": boolean,
    "comprehensionSummary": string,
    "focalPointDetected": string
  },
  "jtbdEfficiency": {
    "estimatedClicksToComplete": number,
    "cognitiveLoadScore": number (0-100),
    "clarityScore": number (0-100)
  },
  "personaWalkthroughs": [
    {
      "personaName": "Huy (Người dùng bận rộn)",
      "personaRole": "Mobile First - Cần kết quả ngay",
      "avatarIcon": "zap",
      "patienceLevel": "low",
      "techLiteracy": "intermediate",
      "firstImpressionQuote": string,
      "taskGoal": string,
      "taskCompletionStatus": "completed_smoothly" | "completed_with_friction" | "abandoned",
      "frictionPointsEncountered": [string, string],
      "verdictQuote": string
    },
    {
      "personaName": "Cô Lan (Người dùng ngoại đạo)",
      "personaRole": "Non-Tech - Cần hướng dẫn trực quan",
      "avatarIcon": "users",
      "patienceLevel": "high",
      "techLiteracy": "novice",
      "firstImpressionQuote": string,
      "taskGoal": string,
      "taskCompletionStatus": "completed_smoothly" | "completed_with_friction" | "abandoned",
      "frictionPointsEncountered": [string],
      "verdictQuote": string
    },
    {
      "personaName": "Alex (Power User)",
      "personaRole": "Chuyên viên vận hành - Ưu tiên tốc độ",
      "avatarIcon": "shield",
      "patienceLevel": "moderate",
      "techLiteracy": "expert",
      "firstImpressionQuote": string,
      "taskGoal": string,
      "taskCompletionStatus": "completed_smoothly" | "completed_with_friction" | "abandoned",
      "frictionPointsEncountered": [string],
      "verdictQuote": string
    }
  ],
  "criticalUsabilityFixes": [string, string, string]
}`;

/**
 * Runs a simulated cognitive walkthrough test with synthetic personas on a prototype screen
 */
export async function runSyntheticUsabilityTest(
  screenTitle: string,
  htmlContent: string,
  ideaPrompt: string = 'Dự án AI'
): Promise<SyntheticUsabilityReport> {
  const config = getDefaultAiConfig();

  // If live API key is present, run AI Persona Simulation
  if (hasValidApiKey() && config.apiKey && config.apiKey.trim().length > 5) {
    try {
      const userMessage = `
Ý TƯỞNG CỐT LÕI: "${ideaPrompt}"
MÀN HÌNH PROTOTYPE: "${screenTitle}"
MÃ NGUỒN GIAO DIỆN (3000 ký tự đầu):
\`\`\`html
${htmlContent.slice(0, 3000)}
\`\`\`

Hãy giả lập quá trình 3 Persona trên tương tác với màn hình này để hoàn thành mục tiêu.`;

      if (config.provider === 'gemini') {
        const model = config.model || 'gemini-2.5-flash';
        const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${config.apiKey.trim()}`;

        const res = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              { role: 'user', parts: [{ text: `${USABILITY_TESTER_SYSTEM_PROMPT}\n\n${userMessage}` }] }
            ],
            generationConfig: {
              responseMimeType: 'application/json',
              temperature: 0.3
            }
          })
        });

        if (res.ok) {
          const data = await res.json();
          const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (text) {
            return JSON.parse(text) as SyntheticUsabilityReport;
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
              { role: 'system', content: USABILITY_TESTER_SYSTEM_PROMPT },
              { role: 'user', content: userMessage }
            ],
            response_format: { type: 'json_object' },
            temperature: 0.3
          })
        });

        if (res.ok) {
          const data = await res.json();
          const text = data.choices?.[0]?.message?.content;
          if (text) {
            return JSON.parse(text) as SyntheticUsabilityReport;
          }
        }
      }
    } catch (err) {
      console.warn('Live usability test simulation failed, running procedural persona engine:', err);
    }
  }

  // Deep Procedural Persona & Cognitive Walkthrough Simulator
  return computeProceduralUsabilitySimulation(screenTitle, htmlContent, ideaPrompt);
}

/**
 * Procedural cognitive walkthrough simulator based on actual element affordances
 */
export function computeProceduralUsabilitySimulation(
  screenTitle: string,
  html: string,
  _ideaPrompt: string
): SyntheticUsabilityReport {
  const lowerHtml = html.toLowerCase();

  const buttonMatches = html.match(/<button[^>]*>(.*?)<\/button>/gi) || [];
  const buttonLabels = buttonMatches
    .map(b => b.replace(/<[^>]+>/g, '').trim())
    .filter(b => b.length > 0 && b.length < 35);
  
  const inputMatches = html.match(/<input[^>]*>/gi) || [];
  const hasForm = /<form/i.test(html);
  const headingMatches = html.match(/<h[1-3][^>]*>(.*?)<\/h[1-3]>/gi) || [];
  const headingText = headingMatches.length > 0 && headingMatches[0] ? headingMatches[0].replace(/<[^>]+>/g, '').trim() : '';

  const interactiveCount = buttonMatches.length + inputMatches.length;
  const hasPrimaryButton = buttonLabels.some(l => 
    /bắt đầu|tiếp tục|gửi|lưu|xác nhận|tạo|start|submit|save|create|generate/i.test(l)
  );

  // 5-Second Test Evaluation
  const passed5Sec = headingText.length > 5 && hasPrimaryButton;
  const fiveSecondTest = {
    passed: passed5Sec,
    comprehensionSummary: passed5Sec
      ? `Người dùng hiểu được mục đích của "${screenTitle}" trong 3 giây nhờ tiêu đề "${headingText.slice(0, 30)}" và nút hành động rõ rệt.`
      : `Người dùng mất hơn 6 giây vì màn hình thiếu một lời kêu gọi hành động (Call To Action) nổi bật nhất.`,
    focalPointDetected: hasPrimaryButton 
      ? `Nút hành động chính: "${buttonLabels[0] || 'Bắt đầu'}"`
      : 'Không có điểm neo thị giác tập trung (mắt người dùng bị phân tán).'
  };

  // JTBD Path Efficiency
  const estimatedClicks = interactiveCount <= 2 ? 1 : interactiveCount <= 5 ? 2 : 4;
  const cognitiveLoad = Math.max(25, Math.min(90, interactiveCount * 12 + (buttonLabels.length > 4 ? 20 : 0) + (hasForm ? 8 : 0)));
  const clarityScore = passed5Sec ? 85 : 55;

  // Personas Walkthroughs
  const personaHuy: SyntheticPersonaJourney = {
    personaName: 'Huy (Người dùng di động bận rộn)',
    personaRole: 'Mobile First - Cần kết quả ngay lập tức',
    avatarIcon: 'zap',
    patienceLevel: 'low',
    techLiteracy: 'intermediate',
    firstImpressionQuote: passed5Sec 
      ? `Mở ra thấy ngay nút "${buttonLabels[0] || 'Làm ngay'}", bấm cái là hiểu luồng đi!`
      : 'Màn hình hơi nhiều chữ, lướt 5 giây chưa thấy nút bấm chính ở đâu.',
    taskGoal: `Hoàn tất tác vụ nhanh trên màn hình "${screenTitle}"`,
    taskCompletionStatus: passed5Sec ? 'completed_smoothly' : 'completed_with_friction',
    frictionPointsEncountered: passed5Sec 
      ? [] 
      : ['Thiếu nút hành động nổi bật ngay trên tầm mắt (Above-the-fold)'],
    verdictQuote: passed5Sec 
      ? 'Giao diện nhanh gọn, không bắt tôi phải đọc quá nhiều.' 
      : 'Nếu không thấy ngay việc cần làm, tôi sẽ thoát app sau 10 giây.'
  };

  const personaLan: SyntheticPersonaJourney = {
    personaName: 'Cô Lan (Người dùng ngoại đạo công nghệ)',
    personaRole: 'Non-Tech - Cần ngôn từ đời thường',
    avatarIcon: 'users',
    patienceLevel: 'high',
    techLiteracy: 'novice',
    firstImpressionQuote: lowerHtml.includes('api') || lowerHtml.includes('token') || lowerHtml.includes('json')
      ? 'Trông có mấy từ tiếng Anh chuyên ngành hơi sợ bấm nhầm.'
      : 'Bố cục nhìn sáng sủa, các ô nhập liệu rõ ràng dễ hiểu.',
    taskGoal: 'Nhập thông tin và nhận kết quả mà không sợ làm hỏng dữ liệu',
    taskCompletionStatus: (lowerHtml.includes('api') || lowerHtml.includes('token')) 
      ? 'completed_with_friction' 
      : 'completed_smoothly',
    frictionPointsEncountered: (lowerHtml.includes('api') || lowerHtml.includes('token'))
      ? ['Xuất hiện thuật ngữ kỹ thuật khó hiểu với người lớn tuổi']
      : ['Cần thêm thông báo xác nhận thành công sau khi nhấn nút'],
    verdictQuote: 'Giá như có thêm một câu hướng dẫn ngắn "Bước 1: Hãy bấm vào đây" thì tôi yên tâm hơn.'
  };

  const personaAlex: SyntheticPersonaJourney = {
    personaName: 'Alex (Chuyên viên vận hành & Power User)',
    personaRole: 'Ưu tiên phím tắt và tốc độ xử lý hàng loạt',
    avatarIcon: 'shield',
    patienceLevel: 'moderate',
    techLiteracy: 'expert',
    firstImpressionQuote: 'Bố cục cân đối. Muốn kiểm tra xem có hỗ trợ phím Enter để submit nhanh không.',
    taskGoal: 'Thực thi lệnh với số lần click chuột ít nhất',
    taskCompletionStatus: interactiveCount > 0 ? 'completed_smoothly' : 'completed_with_friction',
    frictionPointsEncountered: interactiveCount === 0 
      ? ['Màn hình mang tính trình chiếu tĩnh, thiếu các phím tắt thao tác nhanh']
      : [],
    verdictQuote: 'Cần đảm bảo hỗ trợ phím Enter để submit và phím Tab chuyển focus mượt mà.'
  };

  // Overall Usability Score
  const overallUsabilityScore = Math.round(
    (passed5Sec ? 35 : 15) +
    (interactiveCount >= 2 ? 30 : interactiveCount * 12) +
    (cognitiveLoad < 60 ? 25 : 10) +
    (buttonLabels.length > 0 ? 10 : 0)
  );

  let verdictLabel = 'Khá dễ sử dụng';
  let frictionLevel: 'minimal' | 'moderate' | 'high_friction' = 'minimal';

  if (overallUsabilityScore >= 80) {
    verdictLabel = 'Trực quan & Dễ dùng xuất sắc';
    frictionLevel = 'minimal';
  } else if (overallUsabilityScore >= 60) {
    verdictLabel = 'Khá tốt (Còn một vài điểm cản trở nhẹ)';
    frictionLevel = 'moderate';
  } else {
    verdictLabel = 'Cần tinh giản luồng trải nghiệm';
    frictionLevel = 'high_friction';
  }

  const criticalFixes: string[] = [];
  if (!passed5Sec) {
    criticalFixes.push('Làm nổi bật nút Call-To-Action chính bằng màu sắc tương phản cao nhất màn hình.');
  }
  if (cognitiveLoad > 65) {
    criticalFixes.push('Giảm bớt số lượng ô nhập liệu hoặc chia nhỏ thành 2 bước (Progressive Disclosure).');
  }
  criticalFixes.push('Bổ sung phản hồi trực quan (Toast thông báo hoặc hiệu ứng đổi màu) ngay sau khi người dùng bấm thao tác.');

  return {
    overallUsabilityScore,
    verdictLabel,
    frictionLevel,
    summary: `Kiểm thử tương tác cho "${screenTitle}": Đạt ${overallUsabilityScore}/100 điểm tính dễ dùng (${verdictLabel}). ${fiveSecondTest.comprehensionSummary}`,
    fiveSecondTest,
    jtbdEfficiency: {
      estimatedClicksToComplete: estimatedClicks,
      cognitiveLoadScore: cognitiveLoad,
      clarityScore
    },
    personaWalkthroughs: [personaHuy, personaLan, personaAlex],
    criticalUsabilityFixes: criticalFixes.slice(0, 3)
  };
}
