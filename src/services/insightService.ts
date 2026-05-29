import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });
const modelName = "gemini-3-flash-preview";

export interface Insight {
  coreMessage: string;
  universalLaw: string; // كيف تكون حياتك بتقدير الله وتدبيره
  modernLessons: string[];
  practicalChallenge: string;
}

export async function getTrackInsight(title: string, artist: string): Promise<Insight> {
  const prompt = `
    أنت شخص حقيقي، ناصح محب، تتحدث مع صديقك المقرب بجلسة أخوية. 
    صديقك استمع لتوّه إلى: "${title}" (أداء: ${artist}).

    المطلوب منك:
    - تحدث بلغة عربية بسيطة جداً، دافئة، وعادية (مثل كلام الناس لبعضها في النصيحة الصادقة).
    - **مهم جداً**: لا تستخدم اللهجات التي تختصر أسماء الإشارة، استخدم: "هذا الكلام"، "هذا الشيء"، "هذا القرب" بدلاً من "هالكلام" أو "هالشيء".
    - لا تستخدم لغة الرموز أو الاختصارات مثل (ﷺ) أو التشكيلات والزخارف، اجعل النص يبدو كأنه مكتوب يدوياً من شخص يحب الخير لصديقه.
    - ابتعد تماماً عن أسلوب الذكاء الاصطناعي (مثل: "بناءً على المعطيات.."، "النقاط التالية هي..").
    - ركز على "مفاهيم الأمور" و "العبرة من الحياة" وكيف يربط ما سمعه بواقعه اليومي.
    - **الجديد والمهم**: استخرج الدرس الإيماني الذي يمثل "كيف تسير الحياة بتقدير الله وتدبيره وحكمته سبحانه" من المقطع (مثلاً: من يتقِ ويصبر فإن الله لا يضيع أجر المحسنين، أو أن الفرج مع الكرب، وكيف يظهر هذا التقدير الإلهي في حياة الفرد).
    
    تذكر: لا تتصرف كآلة، تصرف كإنسان ناصح مشفق، لغتك سليمة وبسيطة في آن واحد.
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            coreMessage: { type: Type.STRING, description: "الرسالة الأساسية من القلب" },
            universalLaw: { type: Type.STRING, description: "كيف تظهر حكمة تقدير الله وتدبيره سبحانه في هذا الجانب" },
            modernLessons: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: "دروس وحكم من الواقع"
            },
            practicalChallenge: { type: Type.STRING, description: "تحدي عملي بسيط" }
          },
          required: ["coreMessage", "universalLaw", "modernLessons", "practicalChallenge"]
        }
      },
    });

    let text = response.text || "{}";
    
    // Clean up potential markdown formatting or trailing text
    text = text.trim();
    if (text.includes("```")) {
      const match = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
      if (match) text = match[1];
    }
    
    // Robust search for the JSON object if there's still trailing garbage
    const firstBrace = text.indexOf('{');
    const lastBrace = text.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      text = text.substring(firstBrace, lastBrace + 1);
    }

    return JSON.parse(text) as Insight;
  } catch (error) {
    console.error("Error generating insight:", error);
    return {
      coreMessage: "التأمل في كلام الله والذكر هو باب الهداية الأول.",
      universalLaw: "تقدير الله في 'من يذكر الله يذكره': الصدق في الرخاء يفتح لك أبواب النجاة في الشدة.",
      modernLessons: ["العمل بما نعلم هو زكاة العلم", "القصص مواقيت للتدبر وليس للتسلية", "التغيير يبدأ من الداخل"],
      practicalChallenge: "حاول أن تستخرج فكرة واحدة من هذا المقطع وتطبقها في أول موقف يواجهك اليوم."
    };
  }
}
