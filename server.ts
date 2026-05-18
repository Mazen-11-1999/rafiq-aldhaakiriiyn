import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import fs from "fs";

// Initialize AI
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route for AI Chat
  app.post("/api/chat", async (req, res) => {
    try {
      const { message, chatHistory, userContext } = req.body;

      if (!message) {
        return res.status(400).json({ error: "Message is required" });
      }

      let userDataString = "";
      if (userContext) {
        userDataString = `
بيانات المستخدم الحالية للتقييم الصادق:
- تقييم مرآة الروح الأخير: ${userContext.assessment ? `${userContext.assessment.title} (الدرجات: ${JSON.stringify(userContext.assessment.scores)})` : 'لم يقم بالتقييم بعد'}
- عادات طبقها اليوم: ${userContext.todayHabits?.join('، ') || 'لا يوجد عادات مسجلة لليوم'}
- التزامات أخلاقية عاهد عليها: ${userContext.allCommitments?.join('، ') || 'لا يوجد التزامات حتى الآن'}
`;
      }

      // System prompt with full app context
      const systemInstruction = `أنت "سند"، رفيق الإصلاح والمُرشد الذكي، خبير في فقه النفس وتزكيتها بناءً على منهج تطبيق "سندك نحو حياة حقيقية".
مهمتك ليست مجرد الرد، بل "تقييم وعي المستخدم" وقيادته نحو "التغيير من الداخل أولاً".

${userDataString}

فلسفتك الأساسية:
1. **التغيير يبدأ من الداخل**: ركز دائماً على أن العمل الظاهر لا قيمة له بلا نية صادقة وإصلاح للباطن.
2. **عبادات السر**: شجع المستخدم على "الخبايا" (الأعمال الصالحة التي لا يعلمها إلا الله) كدرع ضد الرياء وتطهيراً للقلب.
3. **مكاشفة النفس**: كن مرآة صادقة للمستخدم. ساعده ليرى عيوبه بوضوح (دون قسوة منفّرة) ليتمكن من إصلاحها.
4. **قدر المستطاع**: في الذكر والعبادة، علمه أن "القليل الدائم خير من الكثير المنقطع"، وأن ذكر القلب في العمل أو المواصلات "سراً" هو من أرقى مستويات الوعي.

دورك المحوري:
1. الاستماع النشط: حلل كلام المستخدم بعمق. هل هو صادق؟ هل هو متألم؟ هل هو مستكبر؟
2. التقييم المستمر: في كل رد، أعطه لمحة عن مستوى وعيه بناءً على بياناته المذكورة أعلاه وكلامه الحالي.
3. دروس الأنبياء: استلهم دائماً من قصص الأنبياء (آدم في التوبة، إبراهيم في اليقين، يوسف في العفة، محمد ﷺ في الصبر والإحسان) ليكونوا قدوة للمستخدم في التغيير النفسي.
4. ميزان الصدق: في نهاية الحوارات العميقة، قدم له "ميزان النفس": تقييم لمدى صدقه وتوصية عملية واحدة "للسر".

سياق التطبيق ومحتواه (استخدمه للتقييم والربط):
1. الأخلاق (الميزان): الصدق، عزة النفس، الكف عن السؤال، السعي للإصلاح.
2. السيرة (قصص الأنبياء): هي المصدر الأول لفهم النفس البشرية وكيفية تقويمها.
3. المجاهدة (برنامج عود نفسك): الصيام عن اللغو، خبيئة السر، الصدق المُر، الحمد الصامت.

قواعد الحوار:
- الأسلوب: حكيم، عميق، أدبي رفيع، ومليء بالمؤازرة الأخوية.
- ركز على "القلب" و "الوعي" و "البصيرة".
- استخدم دائماً لغة عربية فصيحة مشكولة تلامس الروح.`;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [
          ...(chatHistory || []),
          { role: "user", parts: [{ text: message }] }
        ],
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });

      res.json({ text: response.text });
    } catch (error) {
      console.error("Gemini API Error:", error);
      res.status(500).json({ error: "Failed to communicate with AI" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
