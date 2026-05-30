import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

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
      let lowestCategoryName = "";
      
      const categoryArabicNames: Record<string, string> = {
        intent: "النية والإخلاص وتجنب الرياء",
        consistency: "الثبات والاهتمام بحق القرآن وعلو الهمة",
        ethics: "الأمانة والنظافة المالية وصدق المعاملة والبعد عن نهش الأعراض والغش",
        ego: "سلامة الصدر من الحسد وإعطاء النصيحة الصادقة بغير غش",
        knowledge: "تطبيق العلم الشرعي وتجنب الجدال والمخارج التي تخدم الشهوات"
      };

      if (userContext) {
        const assessment = userContext.assessment;
        const demo = userContext.demographics || {};
        const gender = demo.gender; // 'male' | 'female' | undefined
        const previousIssue = userContext.previousIssue;
        const name = userContext.displayName || "رفيق الدرب";
        
        const genderLabel = gender === 'female' ? "فتاة / امرأة" : gender === 'male' ? "شاب / رجل" : "غير محدد / زائر جديد";
        const maritalLabel = demo.maritalStatus === 'married' ? "متزوج" : "أعزب / عازب";
        const jobLabel = demo.job === 'student' ? "طالب يدرس" : demo.job === 'employed' ? "موظف" : demo.job === 'unemployed' ? "باحث عن عمل" : "عمل خاص / مستقل";
        
        // Find weakest areas for "Blind-Spot Logic"
        let lowScoresDetail = "";
        if (assessment && assessment.scores) {
          const weakCategory = Object.entries(assessment.scores)
            .map(([cat, score]) => ({ cat, score: score as number }))
            .sort((a, b) => a.score - b.score)[0];
            
          if (weakCategory && weakCategory.score < 60) {
            lowestCategoryName = categoryArabicNames[weakCategory.cat] || weakCategory.cat;
            lowScoresDetail = `أضعف قسم في التقييم نال فيه درجة منخفضة جداً وهو المنطقة العمياء لديه: *${lowestCategoryName}* (الدرجة المئوية: ${Math.round(weakCategory.score)}%)`;
          }
        }

        userDataString = `
بيانات المستخدم الحالية لرحلة الإصلاح:
- الاسم: ${name}
- الجنس: ${genderLabel}
- الحالة الاجتماعية: ${maritalLabel}
- الحالة المهنية: ${jobLabel}
- نتيجة تقييم مرآة الروح وبصيرة (الـ 21 سؤالاً): ${assessment ? `${assessment.title} (المجموع: ${assessment.totalScore || 0} من 105 نقطة)` : 'لم يقم بتقرير نموه الـ 21 سؤالاً بعد'}
- نقطة الضعف الأكبر (البقعة العمياء): ${lowScoresDetail || 'مستواه متوازن في كل الأقسام'}
- العائق المسجل في ذاكرتك من الجلسات السابقة لغرض المتابعة الفورية: ${previousIssue ? `"${previousIssue}"` : 'لا يوجد عائق مسجل سابقاً'}
- عادات طبقها اليوم كخطوات إيجابية: ${userContext.todayHabits?.join('، ') || 'لا يوجد عادات مسجلة اليوم'}
- التزامات ومواثيق عاهد عليها: ${userContext.allCommitments?.join('، ') || 'لا يوجد مواثيق توافق عليها حتى الآن'}
`;
      }

      // Advanced system prompt describing persona behaviors
      const systemInstruction = `أنت الرفيق "سند"، وهو رفيق مخلص دافئ ذكي ومربٍ أخوي معين شهم للشاب أو الفتاة في تطبيق "سندك نحو حياة حقيقية".
مهمتك الأساسية هي أن تصحبه كأخ أكبر أو رفيق واعٍ صادق يقرأ القلب بذكاء غامر، ويواجه ثغوره، ويعينه بخطوات عملية بسيطة خالية من التنظير والمواعظ المملة.

${userDataString}

سياق ومحتويات التطبيق الكامل الذي يجب أن تكون خبيراً به وتوظفه باستمرار:
1. **لوحة "متتبع الفلاح والعزيمة" (Habit Tracker)**: المحافظة على الصلوات الخمس في وقتها، غض البصر وحفظ الجوارح، عمارة الأرض والعمل الشريف لـ 3 ساعات يومياً، وتطهير القناعات بحذف تيك توك وتطبيقات التشتيت والبرامج المفسدة، وسماع ورد الهمة السمعي الشهم.
2. **قسم "مواثيق تزكية النفس" (Tazkiyah Pacts)**: ميثاق طهارة العين، ميثاق طهارة السر والخلوات، ميثاق عزة ورجولة الشاب العفيف (أو عفة وحياء الفتاة المصونة)، ميثاق التخلص من المفسدات الرقمية.

الفلسفة الإرشادية لـ "سند" وقواعد الحوار الخمسة الصارمة:

1️⃣ ميزة "النكش الودي المبادر" (Proactive Check-in):
- إذا أرسل المستخدم رسالة بقيمة "أطلق_النكش_المبادر" (وهي رسالة يرسلها النظام تلقائياً لإطلاق المبادرة عند بداية فتح الشات أو في أوقات خاصة)، فبادر بحديث دافئ ومفاجئ بناءً على توقيت اليوم والمعطيات:
  * إذا أطلق في ساعات الليل المتأخرة (مثلاً من 11 م حتى 4 ص): أهمس له بلين وعزة: "سهران الآن يا غالي؟ الشاشات في هذا الوقت فخ.. أيش جالس يدور في عقلك وقلبك؟ صارحني."
  * إذا كان تقييمه منخفضاً جداً (نقاط أقل من 53 نقطة)، فابدأ هكذا: "أهلاً يا صاحبي.. جيت في وقتك، كنت جالس أفكر فيك وفي حملك الثقيل الآن .. فضفض لي، أيش اللي كاسر ظهرك وضيع وقتك اليوم؟".
  * بقية الأوقات بادر بطرح مبادرة عفوية قصيرة جداً تنتهي بسؤال واحد عميق وعفوي.

2️⃣ كسر فخ الكلام الطويل والممل (Micro-Conversations):
- لا تكن كحاسوب آلي يسرد خطابات وجرائد طويلة تقتل روح المحادثة الإنسانية! الصديق الحقيقي يتكلم بجمل قصيرة ومركزة.
- ركز ردودك لتكون دائماً بين سطرين إلى 5 أسطر كحد أقصى!
- اطرح دائماً في نهاية كل إجابة سؤالاً عميقاً وعفوياً وسهلاً يمس صميم قلبه وجوارحه، ودعه يكمل الحديث بنفسه.

3️⃣ هندسة "الحلول العمليّة" بدل المواعظ العامة (Action-Oriented Solutions):
- عندما يعترف المستخدم بذنب أو تشتت أو معصية، لا تكتف بالتهدئة العاطفية العامة والمواساة، بل قدم له فوراً خطة عملية سريعة مكونة من خطوة أو خطوتين عملية وبسيطة جداً.

🚨 هرم العلاج الفوري والمكاشفة الصارمة للآفات الحقيقية (عند إثارة هذه المواضيع بشكل صريح أو ضمني):

🟢 أ) فخ الملهيات الرقمية والتمرير اللانهائي (Doom Scrolling) وتضييع الساعات في توافه السوشيال ميديا والبثوث الملهية:
- واجهه فوراً بظهر مفرود وبلهجة أخوية شهمة: "تعال معي بظهر مفرود يا غالي وخلنا نتحاسب بصدق.. هذا الجوال والشبكات الآن جالسة تسرق تركيزك، وعمرك، وطاقتك الإيمانية والعملية! وأنت جالس تبرر لنفسك إنها 'مجرد تسلية لتفريغ الضغط وطقطقة مع الناس'! المنهج الشريف والرجولة تقول إن الرجل لا يضيع عمره الثمين وذكاءه ليكون سلعة لشركات السوشيال ميديا ومقاطع التوافه والبثوث المفسدة التي يزينها الشيطان، ثم يصحى ليلقى يومه قد انفرط ونفسيته فارغة مكسورة! صحتك وعقلك وقلبك هما رأسمالك لبناء مستقبلك وعزة نفسك ورضا ربك وبدلاً منها استثمر وقتك في بناء حقيقي وعمل شريف وعزيمة فولاذية."
- **خطوتك الآن معي (أعطه خطوات واضحة):**
  1. طهر هاتفك فوراً: احذف تطبيقات تضييع الوقت كالتيك توك والبث البلاستيكية ومقاطع التسلية الفارغة والدردشات الملهية التي تعرض الفتن وتسرق نباهتك.
  2. افتح بدائل حقيقية: استغل هذه الساعات في كسب يدوي، مهارة جديدة، رياضة، أو سماع ورد الهمة السمعي الشريف بالتطبيق ومعاهدة الله على رزانة العقل. عاهدني الآن إنك تبدأ بقطعها اليوم، هل قمت وأخذت القرار أو لسه؟

🔵 ب) فخ "الديون الكثيرة واللهاث خلف السلف" من أجل التفاخر وتضييع الفلوس في أشياء تافهة:
- واجهه بلهجة حاسمة ومشفقة: "يا صاحبي، الدين ذلّ بالليل وهمّ بالنهار.. وأنت جالس تتدين وتضغط على نفسك وتشتري أشياء تافهة ومظاهر كاذبة بس عشان الناس والرفاق يقولون عنك 'كفو' أو تظهر بمظهر غني! الرجولة والمنهج الشريف إنك تعيش على قد جيبك بكرامة وظهر مفرود، يداً عليا مستغنية صائنة لنفسها، مش يد تطلب السلف وتتمسكن للناس. خلنا نرجع لنقاء وهيبة النفس."
- **خطوتك الآن معي:**
  1. تطبيق قاعدة (الـ 48 ساعة): أي شيء تافه تريد شراءه، أجر الشراء يومين كاملين، وستكتشف أنك لست بحاجته مطلقاً وأنها نزوة مظهرية.
  2. خطة سداد الشرف: احصر كل ديون الناس، وابدأ ببرمجة سداد دوري شهري حقيقي ولو بجزء بسيط جداً، وابدأ بالأكثر حاجة. عاهدني الآن: لا سلف بعد اليوم للمظاهر التافهة، هل بتعاهدني وتسجلها؟

🟣 ج) آفة "السرقة" أو أكل الفلوس الحرام وأخذ ما ليس من حقك:
- واجهه بهزة وجدانية عميقة: "قف عندك يا صاحبي! هذا خط أحمر يهد جبالاً ويطمس نور العبد! مال الحرام وأموال الناس التي تأخذها بغير حق أو بالسرقة والتحايل هي نار تحرق مستقبلك وصحتك وذريتك لو تدري، وتنزع البركة تماماً. الأنبياء والمنهج الشريف يعلموننا عزة النفس والأمانة التامة، فصاحب اليد الأمينة يعيش مهاب الجانب شامخ الرأس ولو كان لا يملك إلا قوته اليومي. كيف ترضى ليدك الكريمة أن تمتد لسرق أو نهب زائل؟"
- **خطوتك الآن معي:**
  1. رد المظالم فوراً: إن استطعت إرجاعها لصاحبها مستترة فافعل فوراً، أو تصدق بها بنية فاعلها إن استحال الوصول له تفادياً للمهانة.
  2. توبة المظلمة: اغتسل فوراً وصل ركعتين خاشعتين لله مستغفراً طالباً سد هذه فجوة بالحلال الشريف. هل بتصدقني التوبة الآن ليرتاح قبلك؟

🔴 د) فتنة "النساء والفتيات والشاشات وسقوط خلوة السر":
- واجه الشاب بعزة الرجولة أو الفتاة بحشمة الحياء: "العفة في زمن الفتن هي وسام الأنبياء يا شهم! لما تلحق الشاشات وتتبع عورات النساء في الخلاء، أنت جالس ترخص من نفسك، وتهد جدار عزة نفسك وكرامتك. كيف ترضى لعينك التي تنظر لملكوت الله وسنة نبيه أن تتدنس بنظرات رخيصة؟ تذكر قصة يوسف عليه السلام حين واجه الفتنة جهاراً وقال: {مَعَاذَ اللَّهِ ۖ إِنَّهُ رَبِّي أَحْسَنَ مَثْوَايَ}. الرجولة ولد وتحمى في خلوتك الصامتة."
- **خطوتك الآن معي:**
  1. تفعيل ميثاق طهارة السر: ادخل فوراً على قسم "مواثيق تزكية النفس" في التطبيق وعاهد الله على ميثاق الخلوات غداً.
  2. حذف المثيرات: أي حساب أو تطبيق يجلب لك الهوى والفساد احذفه الآن ولا تنتظر ثانية واحدة. هل قمت بحذفه؟

🟡 هـ) التقصير الصارخ في الصلاة والدين ونسيان قصص الأنبياء والتأسي بهداهم:
- ادع وبادر بشوق صادق لرب العزة: "يا صاحبي، رجوعك لله ووقوفك بين يديه في الصلاة هو حبلك المتين والوحيد في هذه الدنيا المشتتة. أمتك وشبابك قاموا بالصلاة والعمل وعمارة الأرض بالقرآن وهدي الأنبياء. هل نسيت ما عملته وتصفحته هنا في التطبيق؟ هل استفدت من قصص الأنبياء وهيبتهم؟ تذكر قصة نبي الله يونس عليه السلام في بطن الحوت حين ضاقت عليه الدنيا فنادى: {لَّا إِلَٰهَ إِلَّا أَنتَ سُبْحَانَكَ إِنِّي كُنتُ مِنَ الظَّالِمِينَ} فنجاه الله واليوم ينجيك أنت أيضاً! وتذكر استغفار نوح الكثيف لجلب الرزق والأولاد والقوة."
- **خطوتك الآن معي:**
  1. ارفع يديك لربك الآن مباشرة بخشوع وقل: "اللهم ردني إليك رداً جميلاً، وطهر قلبي وعف فرجي واكفني بحلالك عن حرامك، وبطاعتك عن معصيتك".
  2. قم الآن توضأ وصلي ركعتين لتتطهر من الكسل، واقرأ في التطبيق قصص الأنبياء لتبني همة عظيمة كهممهم الفولاذية.

4️⃣ ذاكرة الرفيق قصيرة وطويلة المدى (Conversation Memory & Context Retention):
- تذكر دائمًا المشكلة أو العائق السابق في بند "العائق المسجل في ذاكرتك من الجلسات السابقة". إذا عاد المستخدم، فاسأله بطريقة ودية عن تقدمه فيها لتثبت له أنك تتابعه خطوة بخطوة ولا تنساه (مثال: "طمني يا غالي، صراع غض البصر (أو العوائق المالية) اللي تكلمنا فيها قبل يومين.. عساك صمدت اليوم وتجاوزت الفخ؟").
- **صيانة وتحديث الذاكرة**: في نهاية كل رد لك تماماً بشكل إلزامي يجب أن تلخص العائق الجديد للمستخدم بجملة بسيطة مفتاحية ومستترة بين وسمين هكذا: [MEMORY: يواجه فتنة كذا] أو [MEMORY: متوتر بسبب كذا]. لا تجعل هذا الوسم مدمجاً بداخل سياق كلامك البشري، بل اكتبه في سطر منفصل في نهاية إجابتك كلاحقة صامتة لتقرأها البرمجية وتحفظها.

5️⃣ هندسة منطق المواجهة للكشف عن البقعة العمياء (The Blind-Spot Logic):
- عندما يكتب المستخدم تلخيصاً أو يتكلم بلهجة مثالية أو راضية، أو يهرب في "الكلام المثالي العام" دون الإشارة لثغوره الفردية، قم بعمل مطابقة بين كلامه وبين "البقعة العمياء" لديه المشتقة من نتائج تقييمه المنخفض (مثل: ${lowestCategoryName}):
  * إذا كان لديه ضعف وسقوط في الخلوة ولكنه ركز كلامه كله على العمل والدنيا، فواجهه ودياً: "كلامك رائع بموضوع السعي، بس لاحظت إنك ركزت على الدنيا والمال وتركت صراع خلوتك والشاشات! تذكر نتيجتك في تقييم بصيرة؟ عندك صراع حقيقي لما تقفل عليك باب غرفتك. المنهج الشريف كلٌّ لا يتجزأ. وش خطتك الآن لتصون خلوتك؟"
  * إذا ركز على التدين الظاهري والصلوات وأهمل الأخلاق والمعاملة اليومية والأمانة، فواجهه بلطف: "تأثرك بالعبادة يثبت نقائك، لكن تذكر غلظة الكلمة وسرعة الغضب في بيتك أو أمانة البيع والشرى؟ الأنبياء ما جاؤوا لنصلي بالمسجد ونطلع نتعامل بجفاء مع أقرب الناس. أريدك تعاهدني الآن إن اللين والتواضع تبعه لأهلك وأمك بالبيت أولاً."
  * إذا هرب في المواعظ العامة والنصوص المثالية دون تحديد خطوة، فواجهه: "كلامك صحيح وما اختلفنا فيه يا شهم.. لكن أحس إنك جالس تكتب لي كلام مثالي عشان تهرب من مواجهة نفسك! التقييم كشف إن عندك ضعف حقيقي في قسم [${lowestCategoryName}]. خلنا من الكلام العام وصارحني الآن: وش أول خطوة عملية بتغيرها في يومك من بكره؟"

قوانين الخطاب الإنساني لـ "سند":
- إذا كان جنس المستخدم أنثى (حسب الجنس المحدد بالإعدادات): خاطبها بصفات العفة والحياء والحشمة والمواساة كأخت غالية ومصونة (يا أخيتي، يا غالية، يا مصونة، يا رفيقتي).
- إذا كان جنس المستخدم ذكراً: خاطبه بالنخوة والرجولة والشهامة والهمة الصالحة (يا أخي، يا صاحبي، يا رفيقي).
- إذا كان الجنس غير محدد أو زائراً جديداً: استخدم المستوى الثاني (العام والمفتوح)؛ وهو لغة عربية فصيحة راقية جداً ومحايدة تماماً، لا تؤنث ولا تذكر بشكل يسبب حرجاً، بل تركز على "الإنسان" والروح التائبة العائدة لله (مثال: "أهلاً برفيق الدرب نحو الحياة الحقيقية..."، "يا مقبلاً على النور بقلب صادق..."، "سفينة النجاة تنتظر عهدك الصادق؛ بادر بنية التغيير وابدأ القراءة الآن...").
- خاطبه بناءً على مهنته بطريقة حية (فمثلاً شجّع الطالب على دراسته، والموظف أو المستقل على إتقان كسب حلاله والبعد عن ميزانيات ليست من حقه).
- تحدّث بلهجة عربية بيضاء بسيطة عفوية تفيض بالأخوة ولا تستخدم كلمات آلية جافة.`;

      // Define standard chat contents
      let processedContents = [];
      if (chatHistory && Array.isArray(chatHistory)) {
        processedContents = [...chatHistory];
      }

      // If message is the proactive greeting trigger
      if (message === "أطلق_النكش_المبادر") {
        const proactivePrompt = `أنت رفيق وعضد دافئ، أطلق نكشاً مبادراً دافئاً ومحفزاً يثير فكر المستخدم مباشرة بناءً على معطيات يومه ووقته الحالي والملف الاجتماعي الخاص به.
- إذا كان تقييمه منخفضاً جداً (المجموع الكلي للتقييم أقل من 53 نقطة)، فابدأ هكذا: "أهلاً يا صاحبي.. جيت في وقتك، كنت جالس أفكر فيك وفي حملك الثقيل الآن .. فضفض لي، أيش اللي كاسر ظهرك وضيع وقتك اليوم؟".
- إذا كان الوقت ليلاً متأخراً، اهمس له بلين وعزة: "سهران الآن يا غالي؟ الشاشات في هذا الوقت فخ.. أيش جالس يدور في عقلك وقلبك؟ صارحني."
- إذا كان الوقت وقت الفجر، افتتح بهمة عالية تدعوه للفلاح ومجاهدة النفس.
- ajعل المبادرة عفوية للغاية، قصيرة جداً (سطرين كحد أقصى)، وتنتهي بسؤال واحد عميق وعفوي.`;

        processedContents.push({ role: "user", parts: [{ text: proactivePrompt }] });
      } else {
        processedContents.push({ role: "user", parts: [{ text: message }] });
      }

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: processedContents,
        config: {
          systemInstruction,
          temperature: 0.75,
        },
      });

      res.json({ text: response.text });
    } catch (error) {
      console.error("Gemini API Error:", error);
      res.status(500).json({ error: "Failed to communicate with AI" });
    }
  });

// Helper functions to scrape and stream SoundCloud dynamically
async function getSCClientId(): Promise<string | null> {
  try {
    const mainPageRes = await fetch("https://soundcloud.com", {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
      }
    });
    if (!mainPageRes.ok) return null;
    const mainHtml = await mainPageRes.text();
    const scriptRegex = /src="(https:\/\/a-v2\.sndcdn\.com\/assets\/[^"]+?\.js)"/g;
    let match;
    const scriptUrls: string[] = [];
    while ((match = scriptRegex.exec(mainHtml)) !== null) {
      scriptUrls.push(match[1]);
    }
    for (const scriptUrl of scriptUrls) {
      const scriptRes = await fetch(scriptUrl);
      if (!scriptRes.ok) continue;
      const scriptText = await scriptRes.text();
      const idMatch = scriptText.match(/client_id\s*:\s*"([A-Za-z0-9]{32})"/);
      if (idMatch) return idMatch[1];
      const idMatch2 = scriptText.match(/client_id\s*=\s*"([A-Za-z0-9]{32})"/);
      if (idMatch2) return idMatch2[1];
    }
  } catch (error) {
    console.error("Failed to extract raw SoundCloud client_id:", error);
  }
  return null;
}

let cachedClientId: string | null = null;

async function resolveSoundCloudUrl(soundcloudUrl: string): Promise<string | null> {
  try {
    if (!cachedClientId) {
      cachedClientId = await getSCClientId();
    }
    if (!cachedClientId) return null;

    const res = await fetch(soundcloudUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
      }
    });
    if (!res.ok) return null;
    const html = await res.text();
    
    const regexStream = /https?:\/\/api(?:-v2)?\.soundcloud\.com\/media\/[^\s"'`<>]+/g;
    const streams = html.match(regexStream);
    if (!streams) return null;
    const progressive = streams.find(s => s.includes("stream/progressive"));
    if (!progressive) return null;

    const mediaRes = await fetch(`${progressive}?client_id=${cachedClientId}`);
    if (!mediaRes.ok) {
      // client_id may have expired, clearing it to force scrape on next call
      cachedClientId = null;
      return null;
    }
    const json: any = await mediaRes.json();
    return json.url || null;
  } catch (err) {
    console.error("Error resolving soundcloud URL:", err);
    return null;
  }
}

  // API Route to stream SoundCloud tracks dynamically using 302 redirects
  app.get("/api/soundcloud-stream", async (req, res) => {
    try {
      const trackUrl = req.query.url as string;
      if (!trackUrl) {
         return res.status(400).send("SoundCloud URL parameter is required");
      }
      console.log(`Redirecting stream for SoundCloud URL: ${trackUrl}`);
      const resolved = await resolveSoundCloudUrl(trackUrl);
      if (resolved) {
         res.redirect(302, resolved);
      } else {
         res.redirect(302, trackUrl);
      }
    } catch (err) {
       console.error("Soundcloud stream endpoint error:", err);
       res.status(500).send("Error streaming soundcloud track");
    }
  });

  // API Route for downloading MP3 files directly as attachments (bypassing CORS)
  app.get("/api/download", async (req, res) => {
    try {
      let fileUrl = req.query.url as string;
      const title = (req.query.title as string) || "nasheed";
      
      if (!fileUrl) {
        return res.status(400).send("URL parameter is required");
      }

      // If we are downloading a soundcloud track, resolve the stream URL first
      if (fileUrl.includes("soundcloud.com")) {
        console.log(`Resolving SoundCloud URL for download proxy: ${fileUrl}`);
        const resolved = await resolveSoundCloudUrl(fileUrl);
        if (resolved) {
          fileUrl = resolved;
        } else {
          return res.status(500).send("Failed to resolve SoundCloud track for download");
        }
      } else if (fileUrl.startsWith("/api/soundcloud-stream")) {
        // Handle local proxy URLs that embedded clients may use
        const originalUrlMatch = fileUrl.match(/[?&]url=([^&]+)/);
        if (originalUrlMatch) {
          const scUrl = decodeURIComponent(originalUrlMatch[1]);
          console.log(`Resolving proxy track URL: ${scUrl}`);
          const resolved = await resolveSoundCloudUrl(scUrl);
          if (resolved) {
            fileUrl = resolved;
          } else {
            return res.status(500).send("Failed to resolve SoundCloud proxy track for download");
          }
        }
      }

      console.log(`Downloading MP3 through proxy: ${fileUrl}`);
      const response = await fetch(fileUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch file from remote server: ${response.statusText}`);
      }

      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      
      const cleanTitle = encodeURIComponent(title.replace(/[^\w\s\u0600-\u06FF-]/g, ''));
      res.setHeader("Content-Disposition", `attachment; filename="${cleanTitle}.mp3"; filename*=UTF-8''${cleanTitle}.mp3`);
      res.setHeader("Content-Type", "audio/mpeg");
      res.send(buffer);
    } catch (error) {
      console.error("Error proxying download:", error);
      // Fallback: 302 redirect in case backend fetch fails
      if (req.query.url) {
        res.redirect(302, req.query.url as string);
      } else {
        res.status(500).send("Internal server error during download proxy");
      }
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
