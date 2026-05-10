import { Wrench, Hammer, Sun, Heart, RefreshCw, Ship, Target, MessageCircle } from 'lucide-react';

export interface PropheticHabit {
  id: string;
  prophet: string;
  title: string;
  description: string;
  modernApplication: string;
  type: 'action' | 'reflection' | 'gratitude' | 'toba';
  iconName: string;
  color: string;
}

export const propheticHabits: PropheticHabit[] = [
  {
    id: 'habit-dawood',
    prophet: 'داوود عليه السلام',
    title: 'خلق الإتقان والعمل',
    description: 'كان يأكل من كسب يده ويصنع الدروع.',
    modernApplication: 'هل أنتجت شيئاً بجهدك الخاص اليوم؟ (كود، رسم، طبخة، فكرة، كتابة، أو حتى ترتيب مادي؟)',
    type: 'action',
    iconName: 'Wrench',
    color: '#4e635a'
  },
  {
    id: 'habit-suliman',
    prophet: 'سليمان عليه السلام',
    title: 'خلق شكر النعمة',
    description: 'كان يرى الفضل لله وحده رغم ملكه العظيم.',
    modernApplication: 'سجل ٣ نعم حدثت لك اليوم وقل بقلبك: "هذا من فضل ربي ليبلوني أأشكر أم أكفر".',
    type: 'gratitude',
    iconName: 'Sun',
    color: '#8B735B'
  },
  {
    id: 'habit-ayoub',
    prophet: 'أيوب عليه السلام',
    title: 'خلق تحويل الألم إلى عبادة',
    description: 'صبر بلا شكوى للبشر، بل نداء لله وحده.',
    modernApplication: 'هل مررت بضيق أو تعب اليوم؟ كيف حولته إلى "مناجاة" بدلاً من "شكوى"؟',
    type: 'reflection',
    iconName: 'Heart',
    color: '#4A2D2D'
  },
  {
    id: 'habit-yousuf',
    prophet: 'يوسف عليه السلام',
    title: 'خلق السمو عن الإساءة',
    description: 'عفا عن إخوته في قمة قوته وتمكينه.',
    modernApplication: 'هل تعرضت لموقف مزعج اليوم وتجاوزت عنه بقلب نقي؟ (لا تثريب عليكم اليوم).',
    type: 'action',
    iconName: 'RefreshCw',
    color: '#2C3E50'
  },
  {
    id: 'habit-adam',
    prophet: 'آدم عليه السلام',
    title: 'خلق سرعة الرجوع',
    description: 'الاعتراف بالخطأ والعودة السريعة لله.',
    modernApplication: 'هل ارتكبت خطأ اليوم (في حق نفسك أو غيرك) وبادرت بالاعتذار والتوبة فوراً؟',
    type: 'toba',
    iconName: 'RefreshCw',
    color: '#2d3a35'
  },
  {
    id: 'habit-noah',
    prophet: 'نوح عليه السلام',
    title: 'خلق الاستمرارية اليقينية',
    description: 'صناعة السفينة في الصحراء رغم سخرية الناس.',
    modernApplication: 'هل أنجزت خطوة في مشروعك (أو هدفك البعيد) اليوم رغم عدم ظهور نتائج فورية؟',
    type: 'action',
    iconName: 'Ship',
    color: '#1a3a3a'
  },
  {
    id: 'habit-younus',
    prophet: 'يونس عليه السلام',
    title: 'خلق الذكر في الضيق',
    description: 'التسبيح الذي فك قيد الحوت.',
    modernApplication: 'هل كان لك نصيب من "لا إله إلا أنت سبحانك" في لحظة ضيق أو انشغال اليوم؟',
    type: 'reflection',
    iconName: 'MessageCircle',
    color: '#1e293b'
  }
];
