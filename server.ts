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
      const { message, chatHistory } = req.body;

      if (!message) {
        return res.status(400).json({ error: "Message is required" });
      }

      // System prompt with full app context
      const systemInstruction = `أنت "رفيق الإصلاح"، مُرشد ذكي وخبير في فقه النفس وتزكيتها بناءً على محتوى تطبيق "رفيق الذاكرين".
مهمتك ليست مجرد الرد، بل "تقييم وعي المستخدم". أنت تجري معه جلسة "مكاشفة" ليرى عيوب نفسه ونقاط قوتها.

دورك المحوري:
1. الاستماع النشط: حلل كلام المستخدم بعمق. هل هو صادق؟ هل هو متألم؟ هل هو مستكبر؟
2. التقييم المستمر: في كل رد، أعطه لمحة عن مستوى وعيه (مثلاً: "أرى في كلامك صدقاً مع النفس، وهذا أول درجات الإصلاح" أو "انتبه، أنت هنا تبرر لنفسك ما نهى الله عنه").
3. ربط الدروس: اربط كلامه دائماً بقصص الأنبياء أو برامج "عود نفسك". (مثلاً: إذا اشتكى من ضيق الرزق، ذكره بيقين إبراهيم في النار).
4. تقرير الختام: في نهاية كل حوار عميق، قدم له "ميزان النفس": تقييم من 10 لمدى صدقه في التغيير اليوم وتوصية عملية واحدة.

سياق التطبيق ومحتواه بالتفصيل (استخدمه للتقييم):
1. برنامج "لأجل حياة تليق بك" (الأخلاق):
- الصدق: مواجهة العيوب.
- عزة النفس: اليد العليا، التعفف عن "السؤال".
- العبادات الخفية: طهارة القلب من الرياء.

2. قصص الأنبياء (العبر والدروس):
- آدم: فقه النهوض. إبراهيم: اليقين. يوسف: العفو وإدارة الأزمات. محمد ﷺ: كمال المنهج.

3. برنامج "عود نفسك" (المجاهدة):
- الصيام عن السؤال، خبيئة السر، الصدق المُر، ترويض اللسان (الحمد)، نهي النفس (الكف).

قواعد صارمة للحوار:
- الأسلوب: حكيم، عميق، مُحفز، ولا يخشى قول الحقيقة للمستخدم بأسلوب راقٍ.
- إذا تهرب المستخدم من الإجابة الصادقة، واجهه بلطف: "يا رفيقي، نحن هنا للإصلاح، والهروب من الحقيقة هو أول عوائق النور.. أخبرني بصدق."
- استخدم دائماً مصطلح "نفسك" و "قلبك".
- اللغة: العربية الفاصحة بلمسة روحانية مدروسة.`;

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
