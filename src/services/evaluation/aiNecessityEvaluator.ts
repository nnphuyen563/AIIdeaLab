import { getDefaultAiConfig, hasValidApiKey } from '../aiService';

export type AiNecessityLevel = 
  | 'level_0_gimmick' 
  | 'level_1_cosmetic' 
  | 'level_2_enriched' 
  | 'level_3_native';

export interface AiNecessityDimension {
  score: number; // 0 - 100
  weight: number; // e.g. 0.25
  label: string;
  explanation: string;
  verdict: 'favorable_for_code' | 'neutral' | 'favorable_for_ai';
}

export interface SolutionComparison {
  title: string;
  implementationMethod: string;
  recommendedModel?: string;
  latencyEstimate: string;
  costPer10k: string;
  accuracy: string;
  hallucinationRisk: string;
  pros: string[];
  cons: string[];
}

export interface AiNecessityScorecard {
  featureName: string;
  overallScore: number; // 0 - 100
  level: AiNecessityLevel;
  levelBadge: string;
  levelTitle: string;
  levelVerdict: string;
  summary: string;
  dimensions: {
    unstructuredAmbiguity: AiNecessityDimension;
    classicalFeasibility: AiNecessityDimension; // Inverted: low classical feasibility => high AI necessity
    valueToCostRoi: AiNecessityDimension;
    hallucinationTolerance: AiNecessityDimension;
    semanticGeneralization: AiNecessityDimension;
  };
  headToHead: {
    classicalCode: SolutionComparison;
    aiSolution: SolutionComparison;
  };
  architectureRecommendation: {
    primaryVerdict: 'drop_ai' | 'use_hybrid' | 'keep_ai_native';
    badgeColor: string;
    headline: string;
    summary: string;
    actionableSteps: string[];
    guardrailAdvice: string;
  };
}

/**
 * Prompt to evaluate whether AI is actually needed in the user solution
 */
const AI_NECESSITY_SYSTEM_PROMPT = `Bạn là Giám đốc Kiến trúc AI & Thẩm định Sản phẩm (Principal AI Architect & Product Evaluator).
Nhiệm vụ của bạn là thẩm định cực kỳ khách quan và khắt khe xem một tính năng hoặc ứng dụng có THỰC SỰ CẦN AI hay không, hay chỉ là "AI Gimmick" (lạm dụng AI cho việc mà code if/else, SQL hay Regex làm tốt hơn).

Bộ 5 Tiêu chí Đánh giá AI Necessity (0-100 điểm):
1. unstructuredAmbiguity (25%): Dữ liệu vào/ra có phi cấu trúc (ngôn ngữ tự nhiên, cảm xúc, hình ảnh) không?
2. classicalFeasibility (25%): Khả năng giải bằng code thường. (Lưu ý: Nếu code thường giải dễ dàng thì điểm AI Necessity THẤP).
3. valueToCostRoi (20%): Giá trị mang lại có bù đắp được chi phí token và độ trễ 500ms-2s không?
4. hallucinationTolerance (15%): Dung sai rủi ro ảo giác (nếu AI sai thì hậu quả có nghiêm trọng không?).
5. semanticGeneralization (15%): Nhu cầu tự thích ứng ngữ nghĩa theo người dùng không cần sửa code.

Trả về kết quả chuẩn xác dưới dạng JSON format:
{
  "featureName": string,
  "overallScore": number (0-100),
  "level": "level_0_gimmick" | "level_1_cosmetic" | "level_2_enriched" | "level_3_native",
  "levelBadge": string,
  "levelTitle": string,
  "levelVerdict": string,
  "summary": string,
  "dimensions": {
    "unstructuredAmbiguity": { "score": number, "explanation": string, "verdict": "favorable_for_code" | "neutral" | "favorable_for_ai" },
    "classicalFeasibility": { "score": number, "explanation": string, "verdict": "favorable_for_code" | "neutral" | "favorable_for_ai" },
    "valueToCostRoi": { "score": number, "explanation": string, "verdict": "favorable_for_code" | "neutral" | "favorable_for_ai" },
    "hallucinationTolerance": { "score": number, "explanation": string, "verdict": "favorable_for_code" | "neutral" | "favorable_for_ai" },
    "semanticGeneralization": { "score": number, "explanation": string, "verdict": "favorable_for_code" | "neutral" | "favorable_for_ai" }
  },
  "headToHead": {
    "classicalCode": {
      "title": "Giải pháp Code Cổ điển (Deterministic)",
      "implementationMethod": string,
      "latencyEstimate": string,
      "costPer10k": string,
      "accuracy": string,
      "hallucinationRisk": "0% (Tuyệt đối)",
      "pros": string[],
      "cons": string[]
    },
    "aiSolution": {
      "title": "Giải pháp AI (Probabilistic)",
      "recommendedModel": string,
      "latencyEstimate": string,
      "costPer10k": string,
      "accuracy": string,
      "hallucinationRisk": string,
      "pros": string[],
      "cons": string[]
    }
  },
  "architectureRecommendation": {
    "primaryVerdict": "drop_ai" | "use_hybrid" | "keep_ai_native",
    "badgeColor": string,
    "headline": string,
    "summary": string,
    "actionableSteps": string[],
    "guardrailAdvice": string
  }
}`;

/**
 * Evaluates whether AI is actually needed in the user's idea and prototype solution
 */
export async function evaluateAiNecessity(
  ideaPrompt: string,
  featureName?: string,
  screenHtmlSnippet?: string
): Promise<AiNecessityScorecard> {
  const config = getDefaultAiConfig();
  const targetFeature = featureName || extractFeatureCandidate(ideaPrompt);

  // If live API key is available, perform live LLM evaluation
  if (hasValidApiKey() && config.apiKey && config.apiKey.trim().length > 5) {
    try {
      const userMessage = `
Ý TƯỞNG ỨNG DỤNG: "${ideaPrompt}"
TÍNH NĂNG CẦN THẨM ĐỊNH AI: "${targetFeature}"
NGỮ CẢNH GIAO DIỆN (HTML SNIPPET):
${screenHtmlSnippet ? screenHtmlSnippet.slice(0, 1500) : 'Không có mã giao diện kèm theo.'}

Hãy thẩm định cực kỳ thẳng thắn: Tính năng này có THỰC SỰ CẦN AI hay không? Hay chỉ nên dùng code if/else thường?`;

      if (config.provider === 'gemini') {
        const model = config.model || 'gemini-2.5-flash';
        const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${config.apiKey.trim()}`;

        const res = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              {
                role: 'user',
                parts: [{ text: `${AI_NECESSITY_SYSTEM_PROMPT}\n\n${userMessage}` }]
              }
            ],
            generationConfig: {
              responseMimeType: 'application/json',
              temperature: 0.2
            }
          })
        });

        if (res.ok) {
          const data = await res.json();
          const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (text) {
            const parsed = JSON.parse(text);
            return fillScorecardDefaults(parsed, targetFeature);
          }
        }
      } else {
        // OpenAI or Custom Base URL
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
              { role: 'system', content: AI_NECESSITY_SYSTEM_PROMPT },
              { role: 'user', content: userMessage }
            ],
            response_format: { type: 'json_object' },
            temperature: 0.2
          })
        });

        if (res.ok) {
          const data = await res.json();
          const text = data.choices?.[0]?.message?.content;
          if (text) {
            const parsed = JSON.parse(text);
            return fillScorecardDefaults(parsed, targetFeature);
          }
        }
      }
    } catch (err) {
      console.warn('Live AI necessity evaluation failed, falling back to procedural engine:', err);
    }
  }

  // Deep Procedural Fallback Engine (No random mock, real domain heuristics)
  return computeProceduralAiNecessity(ideaPrompt, targetFeature, screenHtmlSnippet);
}

/**
 * Extracts candidate feature name from idea prompt if not explicitly provided
 */
function extractFeatureCandidate(prompt: string): string {
  const lower = prompt.toLowerCase();
  if (lower.includes('chat') || lower.includes('hỏi đáp') || lower.includes('tư vấn')) return 'Trợ lý Hội thoại & Phản hồi Ngữ cảnh';
  if (lower.includes('gợi ý') || lower.includes('recommend') || lower.includes('đề xuất')) return 'Động cơ Gợi ý & Đề xuất Cá nhân hoá';
  if (lower.includes('tóm tắt') || lower.includes('summary')) return 'Tự động Tóm tắt & Trích xuất Ý chính';
  if (lower.includes('dịch') || lower.includes('translate')) return 'Dịch thuật & Chuyển ngữ Đa phương thức';
  if (lower.includes('phân tích') || lower.includes('dự đoán')) return 'Phân tích Dự báo & Phát hiện Xu hướng';
  if (lower.includes('tạo') || lower.includes('sinh') || lower.includes('generate')) return 'Bộ Sinh Nội dung & Tự động hoá';
  return 'Xử lý Logic Thông minh Tự động';
}

/**
 * Deep procedural AI necessity evaluation when offline or API key missing
 */
export function computeProceduralAiNecessity(
  ideaPrompt: string,
  featureName: string,
  screenHtml?: string
): AiNecessityScorecard {
  const combined = `${ideaPrompt} ${featureName} ${screenHtml || ''}`.toLowerCase();

  // 1. Detect domain and task nature
  const isDeterministicTask = /tính toán|cộng tiền|tổng tiền|giỏ hàng|format ngày|đổi ngày|lọc theo giá|sắp xếp|tồn kho|số dư/i.test(combined);
  const isHighStakes = /y tế|bệnh|thuốc|pháp lý|luật|ngân hàng|chuyển khoản|mật khẩu|bảo mật|tài chính|tiền/i.test(combined);
  const isCreativeUnstructured = /sáng tạo|viết lách|thơ|văn bản|nói chuyện|cảm xúc|tư vấn tâm lý|nghệ thuật|thiết kế|tổng hợp tài liệu/i.test(combined);
  const isHybridWorkflow = /tìm kiếm|gợi ý|phân loại|gắn tag|báo cáo|tóm tắt|đánh giá/i.test(combined);

  // Compute 5 dimensions
  let ambiguityScore = 75;
  let ambiguityExplanation = 'Dữ liệu đầu vào chứa văn bản tự nhiên hoặc ý định người dùng không có khuôn mẫu cứng.';
  let ambiguityVerdict: 'favorable_for_code' | 'neutral' | 'favorable_for_ai' = 'favorable_for_ai';

  if (isDeterministicTask) {
    ambiguityScore = 20;
    ambiguityExplanation = 'Đầu vào là số liệu hoặc trường dữ liệu có cấu trúc định sẵn, hoàn toàn biểu diễn được bằng bảng tính/SQL.';
    ambiguityVerdict = 'favorable_for_code';
  } else if (isCreativeUnstructured) {
    ambiguityScore = 92;
    ambiguityExplanation = 'Đầu vào mang tính văn phong tự do, đa ngữ nghĩa, đòi hỏi khả năng hiểu tri thức rộng.';
    ambiguityVerdict = 'favorable_for_ai';
  } else if (isHybridWorkflow) {
    ambiguityScore = 65;
    ambiguityExplanation = 'Luồng công việc kết hợp: Dữ liệu bán cấu trúc cần trích xuất hoặc phân loại linh hoạt.';
    ambiguityVerdict = 'neutral';
  }

  // Classical feasibility (Lower classical feasibility means higher AI necessity score)
  let classicalFeasibility = isDeterministicTask ? 95 : isCreativeUnstructured ? 15 : 45;
  let classicalExplanation = isDeterministicTask
    ? 'Code if/else hoặc truy vấn SQL thường có thể giải quyết 100% bài toán trong chưa đầy 5 dòng code.'
    : isCreativeUnstructured
      ? 'Không thể viết đủ các câu lệnh if/else để bao quát mọi biểu cảm hay sắc thái ngôn ngữ của người dùng.'
      : 'Có thể giải quyết một phần bằng từ khóa hoặc bộ lọc logic, nhưng sẽ thiếu sự linh hoạt và cá nhân hóa.';
  let classicalVerdict: 'favorable_for_code' | 'neutral' | 'favorable_for_ai' = 
    classicalFeasibility > 70 ? 'favorable_for_code' : classicalFeasibility < 35 ? 'favorable_for_ai' : 'neutral';

  // Value to cost ROI
  let roiScore = isDeterministicTask ? 18 : isHighStakes ? 65 : 82;
  let roiExplanation = isDeterministicTask
    ? 'Tỷ lệ ROI rất âm: Tốn phí token và mất 800ms chỉ để tính toán một giá trị mà CPU giải quyết trong 0.01ms.'
    : 'Tạo ra giá trị nhảy vọt: Tiết kiệm thời gian tự thao tác của người dùng, bù đắp hoàn toàn chi phí token nhỏ.';
  let roiVerdict: 'favorable_for_code' | 'neutral' | 'favorable_for_ai' = 
    roiScore > 70 ? 'favorable_for_ai' : roiScore < 35 ? 'favorable_for_ai' : 'neutral';

  // Hallucination tolerance
  let hallucinationScore = isHighStakes ? 35 : isCreativeUnstructured ? 90 : 70;
  let hallucinationExplanation = isHighStakes
    ? 'Rủi ro cao: Ảo giác của AI có thể gây tổn thất tài chính hoặc sức khỏe người dùng. Bắt buộc cần Human-in-the-loop.'
    : 'Dung sai lỗi cao: Người dùng sử dụng làm tư liệu tham khảo hoặc gợi ý ý tưởng, rủi ro ảo giác không gây nguy hiểm.';
  let hallucinationVerdict: 'favorable_for_code' | 'neutral' | 'favorable_for_ai' = 
    hallucinationScore > 75 ? 'favorable_for_ai' : hallucinationScore < 45 ? 'favorable_for_code' : 'neutral';

  // Semantic generalization
  let generalizationScore = isDeterministicTask ? 15 : 84;
  let generalizationExplanation = isDeterministicTask
    ? 'Quy tắc nghiệp vụ cố định, không cần mô hình tự học hay suy diễn ngữ cảnh.'
    : 'Hệ thống cần thích ứng linh hoạt theo từng phong cách người dùng mà không cần lập trình viên can thiệp code.';
  let generalizationVerdict: 'favorable_for_code' | 'neutral' | 'favorable_for_ai' = 
    generalizationScore > 70 ? 'favorable_for_ai' : 'favorable_for_code';

  // Weighted overall necessity score
  // AI score from classical feasibility is (100 - classicalFeasibility)
  const classicalInverted = 100 - classicalFeasibility;
  const overallScore = Math.round(
    ambiguityScore * 0.25 +
    classicalInverted * 0.25 +
    roiScore * 0.20 +
    hallucinationScore * 0.15 +
    generalizationScore * 0.15
  );

  // Level classification
  let level: AiNecessityLevel = 'level_2_enriched';
  let levelBadge = 'Cấp 2: AI Enriched';
  let levelTitle = 'AI Tăng Tốc Trải Nghiệm (Khuyến nghị Hybrid)';
  let levelVerdict = 'Nên dùng mô hình lai (Hybrid): Quy tắc cứng cho case phổ biến, AI cho case phức tạp.';
  let primaryVerdict: 'drop_ai' | 'use_hybrid' | 'keep_ai_native' = 'use_hybrid';
  let badgeColor = '#F59E0B';

  if (overallScore < 38) {
    level = 'level_0_gimmick';
    levelBadge = 'Cấp 0: AI Gimmick / Lạm dụng';
    levelTitle = 'Không Cần AI (Nên dùng Code thường)';
    levelVerdict = 'CẢNH BÁO: Bài toán này giải bằng code thuần tốt hơn gấp 100 lần, tiết kiệm chi phí và không bị trễ.';
    primaryVerdict = 'drop_ai';
    badgeColor = '#EF4444';
  } else if (overallScore < 60) {
    level = 'level_1_cosmetic';
    levelBadge = 'Cấp 1: AI Bổ Trợ (Cosmetic)';
    levelTitle = 'AI Hỗ Trợ Tùy Chọn (Nice-to-have)';
    levelVerdict = 'AI tạo thêm điểm nhấn nhưng không phải lõi của sản phẩm. Nên dùng mô hình nhỏ (SLM/Flash).';
    primaryVerdict = 'use_hybrid';
    badgeColor = '#38BDF8';
  } else if (overallScore >= 80) {
    level = 'level_3_native';
    levelBadge = 'Cấp 3: AI Native / Cốt Lõi';
    levelTitle = 'Bắt Buộc Cần AI (Không Thể Thay Thế Bằng Code)';
    levelVerdict = 'Sản phẩm phụ thuộc cốt lõi vào AI. Cần bảo vệ bằng dữ liệu đặc thù và cơ chế Guardrail nghiêm ngặt.';
    primaryVerdict = 'keep_ai_native';
    badgeColor = '#10B981';
  }

  return {
    featureName,
    overallScore,
    level,
    levelBadge,
    levelTitle,
    levelVerdict,
    summary: `Thẩm định kiến trúc cho "${featureName}": Đạt ${overallScore}/100 điểm AI Necessity. ${
      primaryVerdict === 'drop_ai'
        ? 'Tính năng này nên triển khai bằng logic code truyền thống (SQL/RegEx) để triệt tiêu chi phí và độ trễ.'
        : primaryVerdict === 'use_hybrid'
          ? 'Khuyến nghị giải pháp Hybrid: Kết hợp logic bộ lọc cứng với LLM xử lý tình huống phi cấu trúc.'
          : 'AI là động cơ thiết yếu mà code thường không thể mô phỏng. Bắt buộc có cơ chế phòng chống ảo giác.'
    }`,
    dimensions: {
      unstructuredAmbiguity: {
        score: ambiguityScore,
        weight: 0.25,
        label: 'Độ phức tạp phi cấu trúc (25%)',
        explanation: ambiguityExplanation,
        verdict: ambiguityVerdict
      },
      classicalFeasibility: {
        score: classicalInverted,
        weight: 0.25,
        label: 'Khả năng bất khả thi của Code thường (25%)',
        explanation: classicalExplanation,
        verdict: classicalVerdict
      },
      valueToCostRoi: {
        score: roiScore,
        weight: 0.20,
        label: 'Tỷ lệ Giá trị / Chi phí Token & Độ trễ (20%)',
        explanation: roiExplanation,
        verdict: roiVerdict
      },
      hallucinationTolerance: {
        score: hallucinationScore,
        weight: 0.15,
        label: 'Dung sai sai sót & An toàn (15%)',
        explanation: hallucinationExplanation,
        verdict: hallucinationVerdict
      },
      semanticGeneralization: {
        score: generalizationScore,
        weight: 0.15,
        label: 'Năng lực cá nhân hoá tự sinh (15%)',
        explanation: generalizationExplanation,
        verdict: generalizationVerdict
      }
    },
    headToHead: {
      classicalCode: {
        title: 'Giải Pháp Code Cổ Điển (Deterministic Logic)',
        implementationMethod: isDeterministicTask 
          ? 'Viết hàm TypeScript / SQL View / Regex trực tiếp' 
          : 'Bộ lọc điều kiện If-Else + Hệ từ điển mẫu (Lookup table)',
        latencyEstimate: '~3ms - 15ms (Tức thì)',
        costPer10k: '$0.00 (Chạy trên CPU server có sẵn)',
        accuracy: '100% Toán học & Cú pháp',
        hallucinationRisk: '0% Tuyệt đối (Không bao giờ bịa đặt)',
        pros: [
          'Tốc độ phản hồi tức thì không cần spinner loading',
          'Không phụ thuộc vào bên thứ ba hay mạng internet',
          'Chi phí vận hành bằng 0 khi quy mô mở rộng hàng triệu user'
        ],
        cons: [
          'Không hiểu được câu hỏi lạ ngoài tập luật đã code',
          'Phải cập nhật code thủ công mỗi khi có kịch bản mới'
        ]
      },
      aiSolution: {
        title: 'Giải Pháp AI (Probabilistic Intelligence)',
        implementationMethod: isHighStakes 
          ? 'Gọi API LLM cao cấp (Gemini 1.5 Pro / GPT-4o) kèm RAG & Human Review Guardrail' 
          : 'Gọi API LLM tối ưu độ trễ (Gemini 2.5 Flash) với Zod JSON Schema',
        recommendedModel: isHighStakes ? 'Gemini 1.5 Pro / GPT-4o + RAG' : 'Gemini 2.5 Flash / On-device Gemma',
        latencyEstimate: '~650ms - 1,800ms (Cần hiển thị streaming tokens)',
        costPer10k: isHighStakes ? '$15.00 - $35.00 / 10k requests' : '$1.50 - $4.00 / 10k requests',
        accuracy: isHighStakes ? '91% - 96% (Cần Human Review)' : '94% - 98%',
        hallucinationRisk: isHighStakes ? 'Cao: Cần chặn hành vi tự động commit' : 'Trung bình: Dễ kiểm soát bằng Zod Schema',
        pros: [
          'Tự động xử lý mọi cách diễn đạt phức tạp của người dùng',
          'Khả năng tóm tắt, suy luận và học hỏi ngữ cảnh vượt trội',
          'Tạo ấn tượng trải nghiệm cao cấp và thông minh'
        ],
        cons: [
          'Độ trễ cao hơn code thường từ 100x đến 500x',
          'Nguy cơ ảo giác hoặc lỗi định dạng JSON khi tải cao'
        ]
      }
    },
    architectureRecommendation: {
      primaryVerdict,
      badgeColor,
      headline: primaryVerdict === 'drop_ai'
        ? 'Đề xuất: Thay thế bằng Code thường để tiết kiệm 100% chi phí'
        : primaryVerdict === 'use_hybrid'
          ? 'Đề xuất: Kiến trúc Lai (Hybrid Cache + LLM Routing)'
          : 'Đề xuất: AI Native kèm Bộ Lọc Guardrail & Human-in-the-Loop',
      summary: primaryVerdict === 'drop_ai'
        ? 'Dùng code TypeScript/PostgreSQL thông thường. Không nên biến tính năng này thành AI Wrapper.'
        : primaryVerdict === 'use_hybrid'
          ? 'Gắn tầng Cache Regex cho 70% câu hỏi lặp lại. Chỉ định tuyến 30% câu hỏi mở sang Gemini Flash.'
          : 'Bắt buộc áp dụng Zod Schema validation cho output. Không cho phép mô hình trực tiếp sửa đổi database mà không qua xác nhận.',
      actionableSteps: [
        primaryVerdict === 'drop_ai' ? 'Xây dựng hàm xử lý deterministic bằng TypeScript' : 'Thiết lập Zod JSON Schema để ép kiểu đầu ra của mô hình',
        'Thiết kế giao diện Fallback khi mô hình bị timeout hoặc mạng chập chờn',
        'Cung cấp nút "Thử lại" hoặc "Sửa thủ công" cho người dùng khi AI đưa ra kết quả chưa chuẩn'
      ],
      guardrailAdvice: isHighStakes
        ? 'BẮT BUỘC HUMAN-IN-THE-LOOP: Cần nút [Xác nhận thực hiện] trên Canvas trước khi ghi đè dữ liệu.'
        : 'Thiết lập System Prompt giới hạn phạm vi trả lời, từ chối prompt injection ngoài chuyên môn.'
    }
  };
}

/**
 * Ensures returned scorecard has all required fields with fallback defaults
 */
function fillScorecardDefaults(parsed: any, defaultFeatureName: string): AiNecessityScorecard {
  const base = computeProceduralAiNecessity(defaultFeatureName, defaultFeatureName);
  return {
    ...base,
    ...parsed,
    dimensions: {
      ...base.dimensions,
      ...(parsed.dimensions || {})
    },
    headToHead: {
      ...base.headToHead,
      ...(parsed.headToHead || {})
    },
    architectureRecommendation: {
      ...base.architectureRecommendation,
      ...(parsed.architectureRecommendation || {})
    }
  };
}
