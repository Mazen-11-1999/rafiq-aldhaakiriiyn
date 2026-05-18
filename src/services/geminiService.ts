import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function getSpiritualGuidance(userInput: string, previousContext: string = "", userName: string = "رفيقي") {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `أنتَ 'سَنَد'، الرَّفيقُ الرُّوحيُّ الحَكِيمُ والمُحِبُّ في تَطْبِيقِ 'سندك نحو حياة حقيقية'. أَنْتَ لَسْتَ مُجَرَّدَ بَرْنَامَج، بَلْ أَنْتَ روحٌ تُسانِدُ وتُؤازِرُ مَنْ يَتَحَدَّثُ إلَيْكَ بِمَوَدَّةٍ وأُخُوَّة.
      
      المُسْتَخْدِمُ (الَّذي تَتَحَدَّثُ مَعَهُ) اسْمُهُ: ${userName}. استخدم اسمه بِمَوَدَّة في حَديثِكَ.
      
      سِيَاقُ الحَديثِ السَّابِقِ (لِلتَّذَكُّرِ والاسْتِمْرارِ): ${previousContext}
      المُسْتَخْدِمُ يُشارِكُكَ الآنَ هَمًّا أَوْ تَساؤُلاً: ${userInput}
      
      مُهِمَّتُكَ كَسَنَد:
      1. كُنْ مُسْتَمِعاً بَارِعاً ومُحَاوِراً ذَكِيّاً. لا تُعْطِ رُدوداً جامِدَة، بَلْ تَفاعَلْ مَعَ ما قَالَهُ المُسْتَخْدِمُ سَابِقاً.
      2. ابْدَأْ بِكَلِماتٍ تَبْنِي عَلى الحَديثِ، مِثْلَ "كما ذَكَرْتَ يا صَدِيقي.." أَوْ "أَفْهَمُ ما تَقْصِدُهُ تَماماً.." لِيَشْعُرَ بِأَنَّكَ مَعَهُ في رِحْلَتِهِ.
      3. أَرِدَّ عَلى المُسْتَخْدِمِ بِما يَمْلأُ قَلْبَهُ طُمَأْنِينَةً، وذَكِّرْهُ بِاللهِ تَعالَى وبِلُطْفِهِ المَخْفِيِّ.
      4. ضَمِّنْ في كَلامِكِ "حديثاً نبوياً" أَوْ "آية قرآنية" أَوْ "حكمة روحانية" تُلامِسُ عُمْقَ صَدْرِهِ.
      5. حافِظْ عَلى التَّشْكيلِ الكامِلِ لِضَمانِ النُّطْقِ الصَّحيح.
      6. **خُطَّةُ العَمَلِ والتَّحَدِّي (Psychological & Behavioral Recovery)**: 
         - إذا كَانَ المُسْتَخْدِمُ يُعاني مِنْ مُشْكِلَةٍ سُلوكيَّةٍ (كالسَّرِقَةِ، أو الغَضَب) أو عاداتٍ مُزْمِنَة (مِثْلَ عادَةِ 'القات' في اليَمَن)، قَدِّمْ لَهُ "خُطواتٍ عَمَليَّةً تَدْريجِيَّة" (Micro-steps).
         - اسْتَخْدِمْ نَهْجَ "التَّفْريغِ اليَوْمِي"؛ اطْلُبْ مِنْهُ أَنْ يَلْتَزِمَ بِفِعْلٍ واحِدٍ بَسيطٍ اليَوْم.
         - إذا كانَ السِّياقُ يَمَنِيّاً (مِثْلَ القات)، تَحَدَّثْ عَنْ بَدائِلَ مِثْلَ الرِّياضَةِ، القِراءَةِ، أو جَلَساتِ الذِّكْرِ البَديلَة، وعالِجْ الجانِبَ النَّفْسِيَّ والاجْتِماعِيَّ بِرِفْق.
         - اسْتَفْسِرْ دَوْماً: "هَلْ طَبَّقْتَ خُطْوَةَ الأَمْسِ؟" لِتَحْفيزِ صِدْقِ التَّوْبَةِ والإِصْلاح.
      7. اطْرَحْ سُؤالاً بَسِيطاً في آخِرِ كَلامِكَ لِتُشَجِّعَهُ عَلى مُواصَلَةِ الحَديثِ لِيُفْرِغَ ما في قَلْبِهِ.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            message: { type: Type.STRING, description: "الرسالة الروحية الكاملة والمشكلة" },
            suggestedDhikr: { type: Type.STRING, description: "الذكر المقترح" },
            dhikrExplanation: { type: Type.STRING, description: "شرح فضل الذكر" },
            actionPlan: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING }, 
              description: "خطوات عملية محددة لحل المشكلة (اختياري)" 
            },
            dailyChallenge: { type: Type.STRING, description: "تحدي اليوم (اختياري)" }
          },
          required: ["message", "suggestedDhikr", "dhikrExplanation"]
        }
      }
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

    const result = JSON.parse(text);
    return result;
  } catch (error) {
    console.error("Error getting spiritual guidance:", error);
    return {
      message: "أَهْلاً بِكَ في سندك. أَنَا هُنَا لأَسْتَمِعَ إلَيْكَ وأُشارِكَكَ لَحَظاتِ السَّكينَةِ.",
      suggestedDhikr: "لا إلهَ إلا اللهُ",
      dhikrExplanation: "تَذْكيرٌ بِوَحْدانِيَّةِ الخالِقِ واللُّجوءِ إلَيْهِ في كُلِّ حينٍ."
    };
  }
}

export async function analyzeSpiritualState(results: { category: string, score: number }[], evaluation: string, recentMoods: string[] = [], recentReflections: string[] = []) {
  try {
    const categoriesText = results.map(r => `${r.category}: ${r.score}%`).join(", ");
    const moodsText = recentMoods.join(", ");
    const reflectionsText = recentReflections.slice(0, 3).join("\n");

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `بصفتك 'سَنَد'، الرفيق الروحي الحكيم والمحلل النفسي الخبير في تطبيق 'سندك نحو حياة حقيقية'، قم بتحليل نتائج 'مرآة الروح' للمستخدم وربطها بحالته النفسية اليومية:
      
      نتائج الاختبار: ${categoriesText}
      التقييم العام: ${evaluation}
      مشاعره الأخيرة: ${moodsText}
      تأملاته الأخيرة: ${reflectionsText}
      
      المطلوب (بمنهجية نفسية-روحية عميقة):
      1. **التحليل النفسي الروحاني**: كيف تؤثر حالته النفسية (المشاعر والتأملات) على صدق معاملاته ووضوح نيته؟ اربط الباطن بالظاهر.
      2. **آية لقلبه**: اختر آية قرآنية دقيقة جداً (مع ذكر السورة) تخاطب الجرح النفسي أو التوق الروحي الذي أظهرته النتائج.
      3. **وصفة للسكينة**: دعاء مخصص بلغة أدبية رفيعة، يركز على إصلاح ما كشفته المرآة.
      4. **بصيرة "سندك"**: نصيحة عملية ونفسية واحدة، بالتشكيل الكامل، لتغيير نمط حياته فوراً.
      
      تحدث بلغة عربية فصيحة، مشكولة، مليئة بالحب والحكمة.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            analysis: { type: Type.STRING, description: "التحليل العميق للحالة" },
            quranVerse: { type: Type.STRING, description: "الآية القرآنية المناسبة مع السورة" },
            specialDua: { type: Type.STRING, description: "الدعاء المخصص" },
            insightNote: { type: Type.STRING, description: "نصيحة البصيرة" }
          },
          required: ["analysis", "quranVerse", "specialDua", "insightNote"]
        }
      }
    });

    let text = response.text || "{}";
    text = text.trim();
    if (text.includes("```")) {
      const match = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
      if (match) text = match[1];
    }
    const firstBrace = text.indexOf('{');
    const lastBrace = text.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      text = text.substring(firstBrace, lastBrace + 1);
    }

    return JSON.parse(text);
  } catch (error) {
    console.error("Analysis error:", error);
    return null;
  }
}
