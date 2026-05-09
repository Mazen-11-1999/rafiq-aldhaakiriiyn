import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });
const modelName = "gemini-3-flash-preview";

export interface Insight {
  coreMessage: string;
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
    
    أجب بتنسيق JSON حصراً كالتالي:
    {
      "coreMessage": "كلام من القلب (ابدأ بداية طبيعية مثل: 'يا أخي العزيز..' أو 'تدري؟ هذا الموقف ذكرني بـ..') وتحدث عن لب الموضوع كإنسان يفهم الحياة.",
      "modernLessons": [
        "نصيحة بسيطة (كأنك تقول له: جرب أن تفعل كذا..)",
        "خاطرة (كأنك تقول له: انظر إلى هذا الموقف من زاوية ثانية..)",
        "توجيه (بأسلوب الصديق الحكيم)"
      ],
      "practicalChallenge": "خطوة واحدة بسيطة يفعلها الآن (مثلاً: لا تحمل في خاطرك على فلان، أو كلم والدتك)"
    }
    
    تذكر: لا تتصرف كآلة، تصرف كإنسان ناصح مشفق، لغتك سليمة وبسيطة في آن واحد.
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const text = response.text || "{}";
    // Find JSON block if Gemini adds markers
    const jsonStr = text.match(/\{[\s\S]*\}/)?.[0] || text;
    return JSON.parse(jsonStr) as Insight;
  } catch (error) {
    console.error("Error generating insight:", error);
    return {
      coreMessage: "التأمل في كلام الله والذكر هو باب الهداية الأول.",
      modernLessons: ["العمل بما نعلم هو زكاة العلم", "القصص مواقيت للتدبر وليس للتسلية", "التغيير يبدأ من الداخل"],
      practicalChallenge: "حاول أن تستخرج فكرة واحدة من هذا المقطع وتطبقها في أول موقف يواجهك اليوم."
    };
  }
}
