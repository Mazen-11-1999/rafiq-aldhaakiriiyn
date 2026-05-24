import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Map as MapIcon, Flag, Users, Heart, Target, ChevronRight, Swords, Shield, ScrollText, LayoutList, LocateFixed, ArrowRight, Compass, Youtube, Sparkles, BookOpen, HelpCircle, UserCheck, Quote, GraduationCap } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, useMap, ZoomControl, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { cn } from '../lib/utils';

// Fix for Leaflet default icon issues in React
const DefaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

const createPulseIcon = (isSelected: boolean, color: string, index: number) => {
  return L.divIcon({
    className: 'custom-pulse-icon',
    html: `<div class="relative flex items-center justify-center">
             <div class="absolute w-12 h-12 rounded-full ${isSelected ? 'animate-ping' : ''}" style="background-color: ${color}33"></div>
             <div class="w-8 h-8 rounded-full border-4 border-white shadow-2xl transition-all duration-700 ease-out ${isSelected ? 'scale-125' : 'scale-100'} flex items-center justify-center overflow-hidden" style="background-color: ${color}">
               <span class="text-[10px] font-black text-white leading-none">${index}</span>
             </div>
           </div>`,
    iconSize: [48, 48],
    iconAnchor: [24, 24],
  });
};

interface TimelineEvent {
  id: string;
  year: string;
  title: string;
  location: string;
  coordinates: [number, number];
  companion: string;
  companionRole: string;
  story: string;
  manhaj: string;
  reflectionQuestion: string;
  icon: React.ReactNode;
  color: string;
  description: string;
  phaseName: string;
  phaseColor: string;
  imageUrl: string;
  videos?: {
    url: string;
    title: string;
    subtitle?: string;
  }[];
}

function MapController({ center, zoom }: { center: [number, number], zoom?: number }) {
  const map = useMap();
  React.useEffect(() => {
    map.setView(center, zoom || map.getZoom(), {
      animate: true,
      duration: 1.2
    });
  }, [center, zoom, map]);
  return null;
}

export default function HistoryMapView() {
  const [selectedEvent, setSelectedEvent] = useState<TimelineEvent | null>(null);
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');

  const events: TimelineEvent[] = React.useMemo(() => [
    {
      id: 'nubuwwah',
      year: 'قبل الهجرة بـ 13 سنة',
      title: 'بدء الوحي - غار حراء',
      location: 'جبل النور، مكة المكرمة',
      coordinates: [21.4572, 39.8592],
      companion: 'خديجة بنت خويلد رضي الله عنها',
      companionRole: 'الزوجة الصالحة التي ثبتت قلب النبي ﷺ وكانت أول من آمن به.',
      description: 'أول لقاء مع الوحي الأمين جبريل عليه السلام، وبداية بزوغ فجر الإسلام. كان النبي ﷺ ينعزل في الغار متأملاً، فنزل عليه جبريل بكلمة "اقرأ"، فكانت الانطلاقة الكبرى لأعظم رسالة في التاريخ.',
      story: 'أول لقاء مع الوحي الأمين جبريل عليه السلام، وبداية بزوغ فجر الإسلام. كان النبي ﷺ ينعزل في الغار متأملاً، فنزل عليه جبريل بكلمة "اقرأ"، فكانت الانطلاقة الكبرى لأعظم رسالة في التاريخ.',
      manhaj: 'يا غالي، لكي يصفو عقلك وتستقبل نور الهداية، تحتاج بين فترة وأخرى إلى (خلوتك الصادقة) لتراجع نفسك بعيداً عن صخب الشاشات وتفاهات البشر.',
      reflectionQuestion: 'لو كنت مكان الشاب الأول الذي يسمع نداء الحق وسط مجتمع كله عادات سيئة، هل كنت ستملك الشجاعة لترك "الماشين مع الموجة" وتتبع دينك بصدق مهما كلفك ذلك؟',
      icon: <ScrollText className="text-white" />,
      color: '#4e635a',
      phaseName: 'مرحلة الصبر والبدايات 🔶',
      phaseColor: '#EAB308',
      imageUrl: 'https://i.ytimg.com/vi/fNbzxGCZU98/maxresdefault.jpg',
      videos: [
        {
          url: 'https://youtu.be/b93KArM0OCI?si=SfR5BxxMtcqn4TcP',
          title: 'نداء السكينة والوحي الأول',
          subtitle: 'من برنامج سواعد الإخاء'
        },
        {
          url: 'https://youtu.be/fjKS8wf3pjQ?si=x4YjjeRhFquoQjXP',
          title: 'أصعب أيام الإسلام',
          subtitle: 'وقفات مع السيرة النبوية'
        },
        {
          url: 'https://youtu.be/r-i7DjKT8eQ?si=ePCQQC94aGzmIFay',
          title: 'عمر وحمزة يسلمان',
          subtitle: 'قوة الحق وعزة الإسلام'
        },
        {
          url: 'https://youtu.be/h6yacv9hECw?si=aqJCFJYKK0SdMKvn',
          title: 'معجزة الإسراء والمعراج',
          subtitle: 'رحلة الصعد والسكينة'
        }
      ]
    },
    {
      id: 'arqam',
      year: 'قبل الهجرة بـ 12 سنة',
      title: 'دار الأرقم - مدرسة الإسلام الأولى',
      location: 'جبل الصفا، مكة المكرمة',
      coordinates: [21.4225, 39.8272],
      companion: 'الأرقم بن أبي الأرقم رضي الله عنه',
      companionRole: 'الصحابي الشاب الذي وهب بيته مجاناً ليكون أول مركز يتعلم فيه الشباب أصول دينهم.',
      description: 'المقر السري الأول الذي اجتمع فيه النبي ﷺ بأصحابه الأوائل لتعليمهم قيم الوحي وبناء جيل العقيدة.',
      story: 'المقر السري الأول الذي اجتمع فيه النبي ﷺ بأصحابه الأوائل لتعليمهم قيم الوحي وبناء جيل العقيدة.',
      manhaj: 'بناء نفسك وتطهير قلبك من العادات السيئة والاتكالية هو خطوتك الأولى قبل أي نجاح في حياتك. الوعي والتربية في الخفاء يصنعان الرجال في العلن.',
      reflectionQuestion: 'هل تفتح قلبك ووقتك لتبني وتدعم غيرك وتدلهم على الخير، أم أن كل اهتمامك وتفكيرك منصب على مصلحتك ومتعتك الشخصية فقط؟',
      icon: <Users className="text-white" />,
      color: '#4e635a',
      phaseName: 'مرحلة الصبر والبدايات 🔶',
      phaseColor: '#EAB308',
      imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTvxk_0ySObw_cf1OMp69h5UUdfxZI45RVGiQ&s'
    },
    {
      id: 'shiab',
      year: 'قبل الهجرة بـ 6 سنوات',
      title: 'شعب أبي طالب - محنة الحصار',
      location: 'مكة المكرمة',
      coordinates: [21.4244, 39.8311],
      companion: 'بنو هاشم وبنو المطلب',
      companionRole: 'الأهل والعشيرة الوفية التي صمدت مع النبي ﷺ في وجه الحصار الجائر.',
      description: 'ثلاث سنوات كاملة من الجوع القاتل في شعب أبي طالب، حيث قطع المشركون عنهم الطعام حتى أكل الصحابة أوراق الشجر ثباتاً على مبادئهم، وما استكانوا حتى أرسل الله "الأرضة" لتأكل صحيفة الظلم.',
      story: 'ثلاث سنوات كاملة من الجوع القاتل في شعب أبي طالب، حيث قطع المشركون عنهم الطعام حتى أكل الصحابة أوراق الشجر ثباتاً على مبادئهم، وما استكانوا حتى أرسل الله "الأرضة" لتأكل صحيفة الظلم.',
      manhaj: 'اليقين لا يتزلزل بالجوع أو ضيق الحال. المؤمن يعلم أن الرزاق هو الله، وأن عاقبة الصبر والتعفف هي الفرج والبركة دائماً.',
      reflectionQuestion: 'في أوقات ضيق الرزق أو الميزانية، هل تبيع مبادئك أو تزنق نفسك بالسلف الحرام من أجل كماليات ومظاهر عابرة، أم تثق في الله وتصبر وتتعفف حتى يبطل الله ضيق حالك؟',
      icon: <Shield className="text-white" />,
      color: '#4e635a',
      phaseName: 'مرحلة الصبر والبدايات 🔶',
      phaseColor: '#EAB308',
      imageUrl: 'https://i.ytimg.com/vi/8gW7rVf1DOg/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLBhT3i2K4AivUHzqGETUjFaTIgC1Q'
    },
    {
      id: 'thawr',
      year: '1 هـ',
      title: 'خلوة الصديق - غار ثور',
      location: 'جبل ثور، مكة المكرمة',
      coordinates: [21.3653, 39.8453],
      companion: 'أبو بكر الصديق رضي الله عنه',
      companionRole: 'الرفيق الوفي والسند المخلص الذي فدى النبي ﷺ بنفسه وماله.',
      description: 'المحطة الفاصلة في رحلة الهجرة، حيث مكث النبي وصاحبه في الغار ثلاثة أيام كاملة، والعدو يقف فوق رؤوسهم يبحث عنهم، فبكى الصديق خوفاً على النبي، فثبته الحبيب بكلمة تهز الجبال: "لا تحزن إن الله معنا".',
      story: 'المحطة الفاصلة في رحلة الهجرة، حيث مكث النبي وصاحبه في الغار ثلاثة أيام كاملة، والعدو يقف فوق رؤوسهم يبحث عنهم، فبكى الصديق خوفاً على النبي، فثبته الحبيب بكلمة تهز الجبال: "لا تحزن إن الله معنا".',
      manhaj: 'خطط لحياتك واعمل بكل الأسباب المادية الممكنة، لكن علّق قلبك ويقينك بالله وحده. واحرص على اختيار الرفيق الصالح الذي يكون لك سنداً في المحن.',
      reflectionQuestion: 'من هو صديقك المقرب الأن ؟ هل هو رفيق شاشة ولعب يضيع عمرك، أم هو سند حقيقي إذا التفت إليه في ضيقك ذكّرك بالله وقال لك بصدق: لا تحزن؟',
      icon: <Compass className="text-white" />,
      color: '#4e635a',
      phaseName: 'مرحلة الصبر والبدايات 🔶',
      phaseColor: '#EAB308',
      imageUrl: 'https://static.arrajol.com/styles/800x533_webp/public/2019/08/17/275121-1.%D8%BA%D8%A7%D8%B1%20%D8%AB%D9%88%D8%B1..%20%D8%B4%D8%A7%D9%87%D8%AF%20%D8%B9%D9%8A%D8%A7%D9%86%20%D9%8A%D8%B1%D9%88%D9%8A%20%D9%82%D8%B5%D8%A9%20%D8%AD%D9%85%D8%A7%D9%8A%D8%A9%20%D8%A7%D9%84%D8%B1%D8%B3%D9%88%D9%84%20%D8%A7%D9%84%D9%83%D8%B1%D9%8A%D9%85%20%D9%85%D9%86%20%D9%83%D9%81%D8%A7%D8%B1%20%D9%82%D8%B1%D9%8A%D8%B4%20%D8%A3%D8%AB%D9%86%D8%A7%D8%A1%20%D8%A7%D9%84%D9%87%D8%AC%D8%B1%D8%A9%20%D8%A7%D9%84%D9%86%D8%A8%D9%88%D9%8A%D8%A9.jpg.webp',
      videos: [
        {
          url: 'https://youtu.be/q7E-ohDYFKk?si=JFaWpDaYgvAPSk7F',
          title: 'رسم طريق الهجرة - الجزء الأول',
          subtitle: 'الهجرة النبوية - الجزء الأول'
        },
        {
          url: 'https://youtu.be/-ukOioS5Lx0?si=Z9zwvzt9UhNsFEnK',
          title: 'رسم طريق الهجرة - الجزء الثاني',
          subtitle: 'الهجرة النبوية - الجزء الثاني'
        }
      ]
    },
    {
      id: 'hijra',
      year: '1 هـ',
      title: 'الهجرة النبوية الشريفة',
      location: 'الطريق إلى المدينة المنورة',
      coordinates: [24.4672, 39.6108],
      companion: 'أبو بكر الصديق رضي الله عنه',
      companionRole: 'صاحب الركب والرفيق في أصعب دروب الصحراء.',
      description: 'ترك النبي ﷺ موطنه مكة مهاجراً مضحياً بكل شيء من أجل حماية الدين وبناء أمة جديدة. كانت الرحلة تحولاً تاريخياً من مرحلة الضعف إلى مرحلة بناء الدولة القوية المستقلة في المدينة المنورة. "استقبال الأنصار للنبي ﷺ في المدينة المنورة وبداية تأسيس الدولة الإسلامية الأولى."',
      story: 'ترك النبي ﷺ موطنه مكة مهاجراً مضحياً بكل شيء من أجل حماية الدين وبناء أمة جديدة. كانت الرحلة تحولاً تاريخياً من مرحلة الضعف إلى مرحلة بناء الدولة القوية المستقلة في المدينة المنورة. "استقبال الأنصار للنبي ﷺ في المدينة المنورة وبداية تأسيس الدولة الإسلامية الأولى."',
      manhaj: 'إذا أردت أن تتغير وتنجح، يجب أن "تهاجر" وتترك العادات السيئة، وأماكن اللهو، وتجمعات الغفلة. التخطيط الدقيق والتوكل هما سلاحك لتبدأ صفحة جديدة.',
      reflectionQuestion: 'هل تملك الشجاعة اليوم لتهجر ذنباً واحداً أو عادة تسرق وقتك وأمانتك لوجه الله، وتثق أن الله سيعوضك بحياة أفضل وأطهر؟',
      icon: <Flag className="text-white" />,
      color: '#EAB308',
      phaseName: 'مرحلة الصبر والبدايات 🔶',
      phaseColor: '#EAB308',
      imageUrl: 'https://www.darelfatwa.gov.lb/wp-content/uploads/2018/02/%D8%A7%D9%84%D9%87%D8%AC%D8%B1%D8%A9-%D8%A7%D9%84%D9%86%D8%A8%D9%88%D9%8A%D8%A9.jpg',
      videos: [
        {
          url: 'https://youtu.be/0xzsL29iID4?si=WV3RH2a3n8mXCO64',
          title: 'أحداث الغار وانطلاق الركب',
          subtitle: 'رسم طريق الهجرة - الجزء الثالث'
        }
      ]
    },
    {
      id: 'nabawi_mosque',
      year: '1 هـ',
      title: 'مسجد النبي ﷺ - مركز الأمة',
      location: 'المدينة المنورة',
      coordinates: [24.4672, 39.6108],
      companion: 'أبو أيوب الأنصاري رضي الله عنه',
      companionRole: 'الصحابي الذي فتح بيته بفرح لاستضافة النبي ﷺ حتى بُني المسجد.',
      description: 'أول بيت لله يؤسس في المدينة؛ لم يكن مجرد مكان للصلاة، بل كان جامعة يتعلمون فيها، ومركزاً لترتيب شؤون حياتهم ومعاشهم. وكان النبي ﷺ يحمل اللبن والحجارة بيديه الشريفتين مع أصحابه يشاركهم التعب والعرق.',
      story: 'أول بيت لله يؤسس في المدينة؛ لم يكن مجرد مكان للصلاة، بل كان جامعة يتعلمون فيها، ومركزاً لترتيب شؤون حياتهم ومعاشهم. وكان النبي ﷺ يحمل اللبن والحجارة بيديه الشريفتين مع أصحابه يشاركهم التعب والعرق.',
      manhaj: 'صلاتك واتصالك بالخالق هي القلب النابض ليومك وعملك. والرجولة الحقيقية هي التواضع والنزول لميدان العمل والجد كيد عليا تنتج ولا تتكل على غيرها.',
      reflectionQuestion: 'حين يرى الناس ذكاءك وقوتك، هل يجدون فيك شاباً متواضعاً يبني ويعمل بيده، أم يجدون شخصاً اتكالياً يتكبر على العمل وينتظر من يخدمه؟',
      icon: <Heart className="text-white" />,
      color: '#EAB308',
      phaseName: 'مرحلة الصبر والبدايات 🔶',
      phaseColor: '#EAB308',
      imageUrl: 'https://news.files.bbci.co.uk/include/extra/shorthand/assets/arabic/kiufqMQsEv/assets/OhxZGHUc2p/a-view-of-the-mosque-2560x1253.jpeg'
    },
    {
      id: 'badr',
      year: '2 هـ',
      title: 'غزوة بدر الكبرى',
      location: 'بئر بدر',
      coordinates: [23.7744, 38.7903],
      companion: 'الحباب بن المنذر رضي الله عنه',
      companionRole: 'صاحب الفكرة والاستشارة الذكية في اختيار الموقع العسكري المناسب.',
      description: 'المواجهة الكبرى الأولى في الإسلام، حيث التقت القلة المؤمنة (313 رجلاً) بجيش الكفر الضخم، فاستغاث النبي بربه وتضرع، فأنزل الله النصر والتأييد بالملائكة ليعلمنا أن الحق ينتصر باليقين لا بالكثرة.',
      story: 'المواجهة الكبرى الأولى في الإسلام، حيث التقت القلة المؤمنة (313 رجلاً) بجيش الكفر الضخم، فاستغاث النبي بربه وتضرع، فأنزل الله النصر والتأييد بالملائكة ليعلمنا أن الحق ينتصر باليقين لا بالكثرة.',
      manhaj: 'لا تقيس قوتك بظروفك المادية الحالية ولا بقلة ما تملك. إذا تسلحت بالصدق مع الله وأخذت بأسباب العلم والجهد، سيهزم الله أمامك أعتى التحديات والمخاوف.',
      reflectionQuestion: 'هل تقف متمسكاً بدينك وأمانتك حتى لو كنت (وحدك) بين أصحابك، أم تضعف وتجاري الباطل والخطأ لتكسب رضاهم؟',
      icon: <Swords className="text-white" />,
      color: '#EF4444',
      phaseName: 'مرحلة الثبات والمواجهة 🔴',
      phaseColor: '#EF4444',
      imageUrl: 'https://www.elmwatin.com/UploadCache/libfiles/90/2/800x450o/995.jpg'
    },
    {
      id: 'uhud',
      year: '3 هـ',
      title: 'غزوة أحد',
      location: 'جبل أحد، المدينة المنورة',
      coordinates: [24.5028, 39.6133],
      companion: 'مصعب بن عمير رضي الله عنه',
      companionRole: 'حامل لواء المسلمين الشاب الذي ثبت يذود عن النبي ﷺ حتى استشهد.',
      description: 'درس قاسي وعظيم في عاقبة طمع النفس ومخالفة أمر النبي ﷺ. حين ترك الرماة مواقعهم فوق الجبل من أجل جمع الغنائم والمكاسب السريعة، انقلب النصر إلى هزيمة وابتلاء شديد مات فيه خيرة الصحابة.',
      story: 'درس قاسي وعظيم في عاقبة طمع النفس ومخالفة أمر النبي ﷺ. حين ترك الرماة مواقعهم فوق الجبل من أجل جمع الغنائم والمكاسب السريعة، انقلب النصر إلى هزيمة وابتلاء شديد مات فيه خيرة الصحابة.',
      manhaj: 'النجاح والثبات يتطلبان الالتزام التام بالقيم والعهود. تذكر دائماً أن الالتفاف وراء المكاسب السريعة الرديئة (كالكذب في الأمانة أو أخذ أموال الناس بالباطل) يكسر حياتك ويمحق بركتها.',
      reflectionQuestion: 'كم مرة نزلت من جبل مبادئك وعهودك الأخلاقية التي قطعتها مع الله لأجل مصلحة دنيوية تافهة أو مبلغ مالي رخيص، ثم ذقت مرارة الخسارة وضيق الصدر؟',
      icon: <Shield className="text-white" />,
      color: '#EF4444',
      phaseName: 'مرحلة الثبات والمواجهة 🔴',
      phaseColor: '#EF4444',
      imageUrl: 'https://awkafonline.gov.eg/web/image/blog.post/10086/image_content_thumbnail'
    },
    {
      id: 'khandaq',
      year: '5 هـ',
      title: 'غزوة الخندق',
      location: 'شمال المدينة المنورة',
      coordinates: [24.4844, 39.6023],
      companion: 'سلمان الفارسي رضي الله عنه',
      companionRole: 'صاحب الفكرة المبتكرة والإبداعية بحفر الخندق لحماية المدينة.',
      description: 'تحالفت كل قبائل الشرك وحاصرت المدينة في برد شديد وجوع، فكان الحل فكرة عبقرية خارج الصندوق اقترحها سلمان ونفذها الصحابة بالعمل الجماعي والصبر، حتى أرسل الله الريح الشديدة التي قلعت خيام الأحزاب وشتتت شملهم.',
      story: 'تحالفت كل قبائل الشرك وحاصرت المدينة في برد شديد وجوع، فكان الحل فكرة عبقرية خارج الصندوق اقترحها سلمان ونفذها الصحابة بالعمل الجماعي والصبر، حتى أرسل الله الريح الشديدة التي قلعت خيام الأحزاب وشتتت شملهم.',
      manhaj: 'المؤمن لا يقف عاجزاً أمام الأزمات؛ بل يفكر بذكاء، ويستعين بخبرات الآخرين، ويبتكر حلولاً لمشاكله دون أن يشتكي أو يتواكل على الناس. سيطر على عقلك وتفكيرك باشياء تفيدك.',
      reflectionQuestion: 'حين تواجهك مشكلة صعبة في ميزانيتك أو دراستك، هل تشغل وقتك بالشكوى والتذمر وإحراج أهلك، أم تشغل عقلك بالبحث عن فكرة إبداعية وسعي ينجيك ؟',
      icon: <Target className="text-white" />,
      color: '#EF4444',
      phaseName: 'مرحلة الثبات والمواجهة 🔴',
      phaseColor: '#EF4444',
      imageUrl: 'https://i.ytimg.com/vi/l0iGPZKXvPs/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLBkWJRxaPkN46J60OffCOU62tldRg',
      videos: [
        {
          url: 'https://youtu.be/l0iGPZKXvPs?si=t5GoZBG948LOUDwG',
          title: 'غزوة الخندق بالخرائط من عين المكان',
          subtitle: 'شاهد تحديد مكان الخندق وكيف تمت الغزوة'
        }
      ]
    },
    {
      id: 'hudaybiyyah',
      year: '6 هـ',
      title: 'صلح الحديبية',
      location: 'منطقة الحديبية',
      coordinates: [21.4394, 39.6053],
      companion: 'عثمان بن عفان رضي الله عنه',
      companionRole: 'السفير الحكيم والمفاوض الذكي الذي أرسله النبي لقريش بهدوء وثبات.',
      description: 'معاهدة سلام بدت في ظاهرها لبعض الصحابة بشروط قاسية، لكن النبي ﷺ قبلها بنور الوعي والحكمة، فكانت فتحاً عظيماً أتاح للمسلمين نشر الدين بالكلمة والحوار والأخلاق حتى دخل الناس في دين الله أفواجاً.',
      story: 'معاهدة سلام بدت في ظاهرها لبعض الصحابة بشروط قاسية، لكن النبي ﷺ قبلها بنور الوعي والحكمة، فكانت فتحاً عظيماً أتاح للمسلمين نشر الدين بالكلمة والحوار والأخلاق حتى دخل الناس في دين الله أفواجاً.',
      manhaj: 'فقه الأولويات وإدارة الغضب هما علامة نضجك ورجولتك. التراجع خطوة إلى الوراء بحكمة وهدوء، أفضل بكثير من اندفاع أعمى يدمر مستقبلك وعلاقاتك.',
      reflectionQuestion: 'في نقاشاتك ومشاكلك اليومية، هل تندفع وراء عنادك وغضبك لتجرح الناس وتثبت أنك المسيطر، أم تملك الحكمة والهدوء وتستصغر بعض الاشياء التي قد تواجهك ولتصون وقارك؟',
      icon: <ScrollText className="text-white" />,
      color: '#10B981',
      phaseName: 'مرحلة النصر والتمكين 🟢',
      phaseColor: '#10B981',
      imageUrl: 'https://i.ytimg.com/vi/6Azx_K8Bz64/hqdefault.jpg'
    },
    {
      id: 'khaybar',
      year: '7 هـ',
      title: 'غزوة خيبر',
      location: 'حصون خيبر',
      coordinates: [25.6194, 39.2908],
      companion: 'علي بن أبي طالب رضي الله عنه',
      companionRole: 'البطل الشجاع الذي سلمه النبي ﷺ الراية وفتح الله على يديه الحصون.',
      description: 'مواجهة حاسمة مع معاقل المؤامرات والتحريض وبث الفتن ضد المسلمين. حوصرت الحصون طويلاً، حتى ظهرت شجاعة علي رضي الله عنه وصدق الصحابة، فتساقطت القلاع واحدة تلو الأخرى وتأمنت حدود الدولة.',
      story: 'مواجهة حاسمة مع معاقل المؤامرات والتحريض وبث الفتن ضد المسلمين. حوصرت الحصون طويلاً، حتى ظهرت شجاعة علي رضي الله عنه وصدق الصحابة، فتساقطت القلاع واحدة تلو الأخرى وتأمنت حدود الدولة.',
      manhaj: 'الفتن والمغريات ووساوس الشيطان الخفية هي حصون تحاصرك؛ وتحتاج منك إلى قلب شجاع وحزم تام لتقطع دابر العادات السيئة من جذورها ولا تترك لها مكاناً in حياتك.',
      reflectionQuestion: 'هل تملك القوة والأمانة لتواجه فخاخ الشيطان في نفسك وتهدم حصون الكسل والاتكالية، أم تترك نفسك أسيراً مستهلكاً خلف الشاشات؟',
      icon: <Swords className="text-white" />,
      color: '#10B981',
      phaseName: 'مرحلة النصر والتمكين 🟢',
      phaseColor: '#10B981',
      imageUrl: 'https://i.ytimg.com/vi/ep37zhBZVBg/maxresdefault.jpg'
    },
    {
      id: 'fath_makkah',
      year: '8 هـ',
      title: 'فتح مكة',
      location: 'مكة المكرمة',
      coordinates: [21.4225, 39.8262],
      companion: 'بلال بن رباح رضي الله عنه',
      companionRole: 'الصحابي الذي كان يعذب في البداية، وصعد اليوم فوق ظهر الكعبة ليعلن عزة التوحيد وكرامة الإنسان.',
      description: 'العودة الظافرة الكبرى إلى مكة؛ دخلها النبي ﷺ وهو خافض رأسه فوق ناقته تواضعاً لله لا متكبراً ولا شامتاً، وحين ملك رقاب من آذوه وطردوه، قال لهم بقمة النبل والرحمة البشرية: "اذهبوا فأنتم الطلقاء"، لينتصر خلق الإسلام العظيم وتتغير قلوبهم للأبد.',
      story: 'العودة الظافرة الكبرى إلى مكة؛ دخلها النبي ﷺ وهو خافض رأسه فوق ناقته تواضعاً لله لا متكبراً ولا شامتاً، وحين ملك رقاب من آذوه وطردوه، قال لهم بقمة النبل والرحمة البشرية: "اذهبوا فأنتم الطلقاء"، لينتصر خلق الإسلام العظيم وتتغير قلوبهم للأبد.',
      manhaj: 'القوة الحقيقية ليست في الانتقام والتشفي والتكبر؛ بل في العفو والترفع وقت المقدرة. عندما يعطيك الله علماً أو مالاً أو منزلة، لا تنظر للناس من فوق بل كن لهم سنداً وملاذاً.',
      reflectionQuestion: 'حين تكون على حق وتملك القدرة لتجرح شخصاً أخطأ في حقك أو قصر، هل تختار التعالي والتشفي لتظهر أنك الأقوى، أم تختار الرفق والستر لتمس قلبه وتنقذه وان لا تتلوث في لعبة الشيطان ؟',
      icon: <Heart className="text-white" />,
      color: '#10B981',
      phaseName: 'مرحلة النصر والتمكين 🟢',
      phaseColor: '#10B981',
      imageUrl: 'https://img.youm7.com/large/202005131113421342.jpg'
    },
    {
      id: 'hunayn',
      year: '8 هـ',
      title: 'غزوة حنين',
      location: 'وادي حنين',
      coordinates: [21.3283, 40.2317],
      companion: 'العباس بن عبد المطلب رضي الله عنه',
      companionRole: 'عم النبي الذي نادى بصوته الشجاع ليعيد الناس للثبات خلف قيادتهم وقت الشدة.',
      description: 'درس بليغ في عدم الاغترار بالقوة المادية. في البداية، أعجب بعض المسلمين بكثرتهم وقالوا: لن نهزم اليوم من قلة، فباغتهم العدو وتراجعوا، حتى تجلى ثبات النبي ﷺ والتجاؤه لله تضرعاً، فعلمهم وعلمنا الأمة أن النصر والبركة يأتيان من الله وحده لا بالعدد والمظاهر.',
      story: 'درس بليغ في عدم الاغترار بالقوة المادية. في البداية، أعجب بعض المسلمين بكثرتهم وقالوا: لن نهزم اليوم من قلة، فباغتهم العدو وتراجعوا، حتى تجلى ثبات النبي ﷺ والتجاؤه لله تضرعاً، فعلمهم وعلمنا الأمة أن النصر والبركة يأتيان من الله وحده لا بالعدد والمظاهر.',
      manhaj: 'مهما بلغت درجتك من الذكاء، المهارة، أو قوة البنية، لا تغتر بنفسك ولا تتكبر. التواضع المستمر والاعتراف بفضل الله ونعمه المستورة عليك هو سر استمرار توفيقك في الحياة.',
      reflectionQuestion: 'حين تحقق إنجازاً في دراستك أو عملك، هل يمتلئ قلبك بالغرور والرياء الاجتماعي لتتباهى أمام الناس، أم تسكت وتخفي عملك وتحمد الله وتنسب الفضل والبركة له وحده؟',
      icon: <Shield className="text-white" />,
      color: '#10B981',
      phaseName: 'مرحلة النصر والتمكين 🟢',
      phaseColor: '#10B981',
      imageUrl: 'https://i.ytimg.com/vi/Yhv9HgSKsDI/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLDggy6V2vgYRXAw-6kYjB-PuTYnxw'
    },
    {
      id: 'tabuk',
      year: '9 هـ',
      title: 'غزوة تبوك',
      location: 'تبوك',
      coordinates: [28.3835, 36.5662],
      companion: 'عثمان بن عفان رضي الله عنه',
      companionRole: 'المؤمن الجواد الذي جهز جيش العسرة من خالص ماله.',
      description: 'الخروج في وقت الشدة والحر لإثبات الصدق والانتماء ومواجهة القوى العظمى.',
      story: 'المواجهة الكبرى لبسط الهيبة، خرج فيها المسلمون في "عسرة" ليثبتوا صدق إيمانهم وجهادهم.',
      manhaj: 'السخاء وقت الشدة هو الميزان الحقيقي. التضحية بالمال والجهد ميزان الانتماء الصادق.',
      reflectionQuestion: 'في أوقات ضيق الرزق أو الميزانية، هل تبيع مبادئك أو تزنق نفسك بالسلف الحرام من أجل كماليات ومظاهر عابرة، أم تثق في الله وتصبر وتتعفف حتى يبطل الله ضيق حالك؟',
      icon: <Swords className="text-white" />,
      color: '#3B82F6',
      phaseName: 'مرحلة التمام',
      phaseColor: '#3B82F6',
      imageUrl: 'https://i2.wp.com/imgs.photo/yt_0JUuRHKo_5o.webp'
    },
    {
      id: 'widaa',
      year: '10 هـ',
      title: 'بصمة الوداع والميثاق الأخير (حجة الوداع)',
      location: 'صعيد عرفات، مكة المكرمة',
      coordinates: [21.3547, 39.9841],
      companion: 'جميع الصحابة رضي الله عنهم',
      companionRole: 'الجيل الفريد المستأمن الذي تسلم دستور الإسلام ليبلغه للعالم أجمع بصدق وأمانة.',
      description: 'خطبة الوداع العظيمة التي وضع فيها النبي ﷺ الدستور الإنساني الأكمل؛ أعلن حرمة الدماء، والأموال، والأعراض، وأكد على كرامة الإنسان والعدل، وأوصى بالنساء خيراً، ثم سأل جموع الناس بقلب مشفق: "ألا هل بلغت؟"، فبكت القلوب وأعلنت الأمانة.',
      story: 'خطبة الوداع العظيمة التي وضع فيها النبي ﷺ الدستور الإنساني الأكمل؛ أعلن حرمة الدماء، والأموال، والأعراض، وأكد على كرامة الإنسان والعدل، وأوصى بالنساء خيراً، ثم سأل جموع الناس بقلب مشفق: "ألا هل بلغت؟"، فبكت القلوب وأعلنت الأمانة.',
      manhaj: 'الإسلام ليس مجرد طقوس معزولة، بل هو أمانة شاملة في تعاملك المالي، وصدق كلمتك، وحفظك لحقوق من حولك. صيانة أمانتك في أصغر التفاصيل والقرش قبل الدينار هي ميزان وقارك الحقيقي عند الله وعند الناس.',
      reflectionQuestion: 'النبي ﷺ ترك لنا الأمانة كاملة؛ فهل أنت الان تصون هذه الأمانة في يومك وصلاتك ونظافة ذمتك المالية،والدنيوية ، أم جعلت الأمانة عبئاً وراء ظهرك وضعت في زحمة الغفلة وصخب العالم؟',
      icon: <ScrollText className="text-white" />,
      color: '#3B82F6',
      phaseName: 'مرحلة الوفاء والميثاق الأخير 🔵',
      phaseColor: '#3B82F6',
      imageUrl: 'https://modo3.com/thumbs/fit630x300/12595/1441547637/%D8%AE%D8%B7%D8%A8%D8%A9_%D8%A7%D9%84%D9%88%D8%AF%D8%A7%D8%B9.jpg'
    }
  ], []);

  const mapCenter: [number, number] = selectedEvent ? selectedEvent.coordinates : [24.4672, 39.6108];

  React.useEffect(() => {
    if (selectedEvent) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [selectedEvent]);

  const handleNextEvent = () => {
    if (!selectedEvent) {
      setSelectedEvent(events[0]);
      return;
    }
    const currentIndex = events.findIndex(e => e.id === selectedEvent.id);
    if (currentIndex < events.length - 1) {
      setSelectedEvent(events[currentIndex + 1]);
    } else {
      setSelectedEvent(events[0]);
    }
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = 'https://images.unsplash.com/photo-1566311853108-9dfba5196561?auto=format&fit=crop&q=80&w=1200';
  };

  return (
    <div className="p-margin-page space-y-8 pb-32">
      <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 pt-4">
        <div className="space-y-3">
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <div className="p-3 bg-[#4e635a] rounded-2xl text-white shadow-lg shadow-[#4e635a]/20">
              <MapIcon size={24} />
            </div>
            <h2 className="text-4xl font-bold text-[#4e635a] font-serif tracking-tight">على خطى الحبيب ﷺ</h2>
          </motion.div>
          <p className="text-[#655d51] font-medium text-lg max-w-xl text-right leading-relaxed opacity-90">
            امشِ خلف نبيك وحبيبك ﷺ خطوة بخطوة عبر خريطة وجدانية تفاعلية، تشقّ بها مسارات السيرة والوعي لتتخذه سنداً وقدوة في مجاهدة نفسك وبناء عهدك.
          </p>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row gap-3 items-end self-end w-full sm:w-auto"
        >
          <div className="flex flex-wrap gap-1.5 items-center justify-end w-full sm:w-auto">
            <a
              href="https://youtube.com/playlist?list=PLebiqPvxbGTa24tSS1SFJP1W9HU_7KZyz&si=hHoxtHIS1gduJXzE"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-red-600/10 hover:bg-red-600/20 text-red-700 border border-red-600/20 transition-all font-bold text-[11px] sm:text-xs group"
            >
              <Youtube size={16} className="group-hover:scale-110 transition-transform" />
              <span>المسلسل (ج1)</span>
            </a>
            <a
              href="https://youtube.com/playlist?list=PLebiqPvxbGTaeA16rM85JbGzlBx6Z9BF_&si=wTkwguSstvuctMnd"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-red-600/10 hover:bg-red-600/20 text-red-700 border border-red-600/20 transition-all font-bold text-[11px] sm:text-xs group"
            >
              <Youtube size={16} className="group-hover:scale-110 transition-transform" />
              <span>المسلسل (ج2)</span>
            </a>
          </div>

          <div className="flex bg-white/40 backdrop-blur-xl p-1 rounded-xl sm:rounded-2xl border border-white/60 shadow-xl w-full sm:w-auto overflow-hidden">
             <button 
              onClick={() => setViewMode('list')}
              className={cn(
                "flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-2 sm:px-5 sm:py-2.5 rounded-lg sm:rounded-xl transition-all duration-300 font-bold text-xs sm:text-sm",
                viewMode === 'list' ? "bg-[#4e635a] text-white shadow-md" : "text-[#4e635a] hover:bg-white/40"
              )}
             >
               <LayoutList size={16} />
               <span>القصص</span>
             </button>
             <button 
              onClick={() => setViewMode('map')}
              className={cn(
                "flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-2 sm:px-5 sm:py-2.5 rounded-lg sm:rounded-xl transition-all duration-300 font-bold text-xs sm:text-sm",
                viewMode === 'map' ? "bg-[#4e635a] text-white shadow-md" : "text-[#4e635a] hover:bg-white/40"
              )}
             >
               <LocateFixed size={16} />
               <span>الخريطة</span>
             </button>
          </div>
        </motion.div>
      </header>

      <AnimatePresence mode="wait">
        {viewMode === 'list' ? (
          <motion.div 
            key="list-view"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8"
          >
            {events.map((event, index) => (
              <motion.button
                key={event.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05, duration: 0.6 }}
                onClick={() => setSelectedEvent(event)}
                                className="group relative h-[380px] sm:h-[450px] lg:h-[480px] rounded-[28px] sm:rounded-[40px] overflow-hidden bg-white shadow-[0_20px_40px_-15px_rgba(0,0,0,0.12)] border-2 sm:border-4 border-white transition-all hover:scale-[1.02] hover:shadow-[0_32px_64px_-16px_rgba(78,99,90,0.25)] duration-500 text-right"
              >
                <img 
                  src={`${event.imageUrl}?auto=format&fit=crop&q=80&w=600`} 
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1s] group-hover:scale-110" 
                  alt="" 
                  loading="lazy"
                  onError={handleImageError}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent transition-opacity duration-500 group-hover:from-black" />
                
                {/* دلالة المحطة والترتيب */}
                <div className="absolute top-4 right-4 sm:top-6 sm:right-6 flex items-center gap-2 bg-black/40 backdrop-blur-xl px-3 py-1.5 sm:px-4 sm:py-2 rounded-full border border-white/20 shadow-lg">
                   <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-white flex items-center justify-center text-[#4e635a] text-[10px] sm:text-[11px] font-black mr-1 shadow-md">
                     {index + 1}
                   </div>
                   <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full" style={{ backgroundColor: event.phaseColor }} />
                   <span className="text-white text-[9px] sm:text-[10px] font-bold tracking-wider">{event.phaseName}</span>
                </div>

                {/* التفاصيل في أسفل البطاقة */}
                <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-8 text-right space-y-2.5 sm:space-y-4">
                  <div className="flex justify-between items-center border-b border-white/10 pb-2 sm:pb-3">
                    <span className="text-[#a7c5b6] text-[10px] sm:text-xs font-extrabold tracking-widest bg-[#4e635a]/30 border border-emerald-500/20 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full">{event.year}</span>
                    <div className="p-2 sm:p-3 bg-white/20 backdrop-blur-xl rounded-xl sm:rounded-2xl border border-white/20 text-white transition-transform duration-500 group-hover:rotate-12 group-hover:scale-110">
                      {event.icon}
                    </div>
                  </div>
                  
                  <div className="relative space-y-1 sm:space-y-2">
                    <h3 className="text-lg sm:text-2xl font-black text-white font-serif leading-tight drop-shadow-sm transition-colors duration-300 group-hover:text-amber-100">{event.title}</h3>
                    
                    {/* التموضع الجغرافي وصاحب المحطة كإشارة سريعة */}
                    <div className="flex flex-wrap gap-1.5 justify-end text-[10px] sm:text-[11px] font-bold text-white/70">
                      <span className="bg-emerald-950/60 border border-emerald-500/20 px-2 py-0.5 rounded-full">{event.location}</span>
                      <span className="bg-amber-950/60 border border-amber-500/20 px-2 py-0.5 rounded-full">صاحب المحطة: {event.companion.split(' ')[0]}</span>
                    </div>

                    <p className="text-white/80 text-[11px] sm:text-xs font-semibold leading-relaxed line-clamp-2 pt-0.5">{event.description}</p>
                  </div>

                  <div className="pt-1.5 flex items-center gap-1.5 justify-end text-white font-bold text-xs group-hover:gap-3 transition-all">
                    <span>عيش القصة بقلبك</span>
                    <ArrowRight size={14} className="text-emerald-400 group-hover:translate-x-[-3px] transition-transform" />
                  </div>
                </div>
              </motion.button>
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="map-view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative h-[700px] rounded-[56px] overflow-hidden border-[12px] border-white shadow-[0_32px_64px_-12px_rgba(0,0,0,0.3)] z-0"
          >
            <MapContainer center={mapCenter} zoom={7} className="w-full h-full" zoomControl={false}>
              <TileLayer
                url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                attribution='&copy; Esri'
              />
              <MapController center={mapCenter} zoom={selectedEvent ? 10 : 7} />
              <ZoomControl position="topleft" />

              {/* Enhanced Flow Paths */}
              {events.slice(0, -1).map((event, idx) => (
                <Polyline 
                  key={`path-${idx}`}
                  positions={[event.coordinates, events[idx+1].coordinates]}
                  color={event.phaseColor}
                  weight={5}
                  opacity={0.9}
                  dashArray="1, 15"
                  lineCap="round"
                />
              ))}
              
              {events.map((event, index) => (
                <Marker 
                  key={event.id} 
                  position={event.coordinates}
                  icon={createPulseIcon(selectedEvent?.id === event.id, event.color, index + 1)}
                  eventHandlers={{ click: () => setSelectedEvent(event) }}
                >
                  <Popup className="custom-popup" closeButton={false}>
                    <div className="text-right p-0 overflow-hidden rounded-3xl w-60 shadow-2xl bg-white">
                      <img 
                        src={`${event.imageUrl}?auto=format&fit=crop&q=80&w=400`} 
                        className="w-full h-32 object-cover" 
                        alt="" 
                        loading="lazy"
                        onError={handleImageError}
                      />
                      <div className="p-5 space-y-3">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <span className="w-6 h-6 rounded-full bg-[#4e635a] text-white flex items-center justify-center text-[10px] font-black">{index + 1}</span>
                            <span className="text-[10px] font-bold text-[#8da399] tracking-widest">{event.year}</span>
                          </div>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: `${event.phaseColor}22`, color: event.phaseColor }}>{event.phaseName}</span>
                        </div>
                        <h4 className="font-bold text-[#4e635a] font-serif m-0 text-base leading-snug">{event.title}</h4>
                        <button 
                          className="w-full bg-[#4e635a] hover:bg-[#3d4d46] text-white py-3 rounded-2xl font-bold text-xs transition-all flex items-center justify-center gap-2 group active:scale-95" 
                          onClick={() => setSelectedEvent(event)}
                        >
                          عيش القصة بقلبك <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>

            {/* Interactive Timeline Sidebar Overlay */}
            <div className="absolute top-3 left-3 md:top-8 md:left-8 z-[1000] space-y-2 md:space-y-4 max-w-[200px] sm:max-w-[260px] md:max-w-[280px]">
              <div className="hidden sm:block bg-white/85 backdrop-blur-2xl text-[#4e635a] p-4 md:p-6 rounded-2xl md:rounded-[32px] shadow-xl border border-white/60">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <div className="w-2 h-2 rounded-full bg-[#4e635a] animate-pulse" />
                  <span className="text-[9px] font-black uppercase tracking-widest opacity-60">التحول المنهجي</span>
                </div>
                <p className="text-xs md:text-lg font-bold font-serif leading-snug">تتبع التطور الجغرافي للدعوة الإسلامية</p>
                <div className="mt-3 pt-3 border-t border-[#4e635a]/10 grid grid-cols-2 gap-2">
                  {[{ name: 'تأسيس', color: '#EAB308' }, { name: 'دفاع', color: '#EF4444' }, { name: 'فتح', color: '#10B981' }, { name: 'إتمام', color: '#3B82F6' }].map((p, i) => (
                    <div key={i} className="flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: p.color }} />
                      <span className="text-[9px] font-bold text-[#4e635a]/70">{p.name}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <button 
                onClick={handleNextEvent}
                className="w-full bg-[#4e635a]/95 backdrop-blur hover:bg-[#3d4d46] text-white p-2.5 sm:p-3.5 md:p-5 rounded-xl sm:rounded-2xl md:rounded-[28px] shadow-xl flex items-center justify-between font-bold group transition-all transform active:scale-95"
              >
                <span className="text-[10px] sm:text-xs md:text-sm">انتقل للحدث التالي</span>
                <div className="bg-white/20 p-1 sm:p-1.5 md:p-2 rounded-lg sm:rounded-xl group-hover:bg-white/30 transition-colors">
                  <ArrowRight size={14} />
                </div>
              </button>
            </div>

            {/* Horizontal Navigator for Quick Access */}
            <div className="absolute bottom-3 md:bottom-10 left-1/2 -translate-x-1/2 flex gap-2 overflow-x-auto px-4 py-2 w-full max-w-[95%] md:max-w-[85%] no-scrollbar z-[1000]">
              {events.map((event) => (
                <button
                  key={event.id}
                  onClick={() => setSelectedEvent(event)}
                  className={cn(
                    "whitespace-nowrap px-4 py-2 md:px-6 md:py-3 rounded-xl md:rounded-2xl font-bold text-[10px] sm:text-xs shadow-xl transition-all duration-500 transform",
                    selectedEvent?.id === event.id 
                      ? "bg-white text-[#4e635a] scale-105 md:scale-110 shadow-[0_12px_24px_-8px_rgba(255,255,255,0.4)]" 
                      : "bg-[#4e635a]/85 backdrop-blur-xl text-white/95 opacity-80 hover:opacity-100 hover:scale-102"
                  )}
                >
                  {event.title}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedEvent && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[2000] bg-[#0c1a13]/95 backdrop-blur-2xl flex items-center justify-center p-2 sm:p-4 md:p-10 lg:p-16"
            onClick={() => setSelectedEvent(null)}
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 40 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 40 }}
              className="bg-[#fbf9f6] w-full max-w-6xl rounded-[32px] md:rounded-[48px] lg:rounded-[64px] overflow-hidden shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] flex flex-col lg:flex-row max-h-[92vh] lg:max-h-[85vh] border border-white/20"
              onClick={e => e.stopPropagation()}
            >
              {/* Cinematic Visual Side */}
              <div className="lg:w-1/2 h-44 sm:h-64 lg:h-auto relative overflow-hidden bg-black/10 flex-shrink-0">
                <motion.img 
                  initial={{ scale: 1.1, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  src={`${selectedEvent.imageUrl}?auto=format&fit=crop&q=80&w=1200`} 
                  className="w-full h-full object-cover" 
                  alt="" 
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  onError={handleImageError}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0e1d14] via-[#0e1d14]/30 to-transparent lg:bg-gradient-to-l" />
                
                <div className="absolute bottom-4 right-4 sm:bottom-8 sm:right-8 lg:bottom-12 lg:right-12 text-white space-y-2 lg:space-y-4 text-right max-w-md">
                   <motion.div 
                    initial={{ x: 20, opacity: 0 }} 
                    animate={{ x: 0, opacity: 1 }} 
                    transition={{ delay: 0.3 }}
                    className="flex justify-end items-center gap-2"
                   >
                     <span className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-white flex items-center justify-center text-[#4e635a] text-xs sm:text-sm font-black shadow-lg">
                       {events.findIndex(e => e.id === selectedEvent.id) + 1}
                     </span>
                     <span className="text-[9px] sm:text-[11px] font-black px-2.5 py-1 sm:px-4 sm:py-2 bg-white/20 backdrop-blur-xl rounded-full uppercase tracking-wider border border-white/20" style={{ boxShadow: `0 0 20px ${selectedEvent.phaseColor}44` }}>
                       {selectedEvent.phaseName}
                     </span>
                   </motion.div>
                   <h3 className="text-xl sm:text-3xl lg:text-5xl font-bold font-serif leading-tight drop-shadow-2xl">{selectedEvent.title}</h3>
                   <div className="flex items-center gap-2 justify-end text-xs sm:text-lg text-white/85 font-serif italic">
                      <p>{selectedEvent.location}</p>
                      <div className="w-1 h-1 rounded-full bg-white/40" />
                      <p>{selectedEvent.year}</p>
                   </div>
                </div>
              </div>

              {/* Contextual Narrative Side */}
              <div 
                key={selectedEvent.id}
                className="flex-1 p-5 sm:p-8 lg:p-14 space-y-6 lg:space-y-10 overflow-y-auto custom-scrollbar"
              >
                <div className="flex justify-between items-center pb-2 border-b border-black/5">
                   <button 
                    onClick={() => setSelectedEvent(null)} 
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/5 hover:bg-black/10 flex items-center justify-center text-[#4e635a] transition-all hover:scale-105 active:scale-95"
                    title="إغلاق"
                   >
                    <ChevronRight size={24} />
                   </button>
                   <div className="p-3 sm:p-4 bg-white rounded-2xl sm:rounded-3xl shadow-md text-[#4e635a] border border-white/80">
                    {React.cloneElement(selectedEvent.icon, { size: 20 })}
                   </div>
                </div>

                <div className="space-y-6 sm:space-y-8">
                  {/* الموقف التاريخي */}
                  <div className="bg-white p-5 sm:p-8 rounded-3xl border border-emerald-500/10 shadow-lg text-right relative group overflow-hidden">
                     <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:scale-110 transition-transform duration-[1.2s]">
                        <Quote size={120} className="text-emerald-950" />
                     </div>
                     <div className="flex items-center gap-1.5 justify-end text-emerald-800 opacity-60 mb-1.5">
                       <span className="text-[9px] font-black uppercase tracking-widest">توصيف الموقف التاريخي</span>
                       <BookOpen size={14} />
                     </div>
                     <p className="text-base sm:text-xl lg:text-2xl text-[#1b1c1a] font-serif leading-relaxed italic relative z-10 font-bold">"{selectedEvent.description}"</p>
                  </div>

                  {/* تفاصيل الشخصية والقصة */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    {/* صاحب المحطة والشخصية المصاحبة */}
                    <section className="bg-gradient-to-br from-[#f5f8f6] to-[#ebf1ee] p-5 sm:p-8 rounded-3xl border border-emerald-500/10 space-y-4 text-right shadow hover:shadow-md transition-shadow relative overflow-hidden group">
                      <div className="absolute -bottom-10 -left-10 p-4 opacity-[0.02] group-hover:rotate-6 transition-transform duration-700">
                        <GraduationCap size={120} />
                      </div>
                      <div className="flex items-center gap-2.5 justify-end text-[#4e635a] opacity-85 border-b border-[#4e635a]/10 pb-2">
                        <span className="text-xs font-black tracking-wide">صاحب المحطة / الشخصية المصاحبة</span>
                        <UserCheck size={18} className="text-emerald-600" />
                      </div>
                      <div className="space-y-1 relative z-10">
                        <p className="font-extrabold text-[#1c3026] text-lg sm:text-xl leading-snug font-serif">{selectedEvent.companion}</p>
                        <p className="text-xs sm:text-sm text-[#4e635a]/90 leading-relaxed font-semibold">{selectedEvent.companionRole}</p>
                      </div>
                    </section>

                    {/* عيش القصة بقلبك */}
                    <section className="bg-white p-5 sm:p-8 rounded-3xl border border-black/5 space-y-4 text-right shadow hover:shadow-md transition-all relative overflow-hidden group">
                      <div className="absolute -bottom-10 -left-10 p-4 opacity-[0.02] group-hover:rotate-6 transition-transform duration-700">
                        <ScrollText size={120} />
                      </div>
                      <div className="flex items-center gap-2.5 justify-end text-amber-800 opacity-85 border-b border-amber-900/5 pb-2">
                        <span className="text-xs font-black tracking-wide">عيش القصة بقلبك</span>
                        <ScrollText size={18} className="text-amber-700" />
                      </div>
                      <p className="text-xs sm:text-sm text-[#5c4d3c] leading-relaxed font-medium font-serif relative z-10">{selectedEvent.story}</p>
                    </section>
                  </div>

                  {/* ماستتعلمه في يومك */}
                  <section className="bg-gradient-to-br from-[#122319] via-[#1a2f23] to-[#0d1c13] p-6 sm:p-10 rounded-[32px] sm:rounded-[40px] text-white shadow-xl relative overflow-hidden text-right group border border-emerald-500/15">
                     <div className="absolute top-0 left-0 p-8 opacity-[0.04] group-hover:scale-105 transition-all duration-1000"><Target size={160} className="text-emerald-400" /></div>
                     <div className="relative z-10 space-y-4 sm:space-y-6">
                       <div className="border-b border-white/10 pb-3 flex flex-col items-end gap-1">
                         <div className="flex items-center gap-2 text-emerald-300 font-extrabold text-sm tracking-wide">
                           <span>ماستتعلمه في يومك</span>
                           <Target size={16} className="text-emerald-400" />
                         </div>
                         <span className="text-[10px] font-bold tracking-wider text-emerald-400/70 uppercase">المنهج العملي الشريف والواقع الحقيقي لمسار حياتك</span>
                       </div>
                       <p className="text-lg sm:text-2xl font-bold leading-relaxed font-serif text-[#eef6f1] drop-shadow-sm">{selectedEvent.manhaj}</p>
                     </div>
                  </section>

                  {/* أيقظ نفسك (سؤال لك) */}
                  <section className="bg-gradient-to-br from-[#fffdfa] via-[#fefbf6] to-[#fcf6eb] p-6 sm:p-10 rounded-[32px] sm:rounded-[40px] text-amber-950 shadow-xl border border-amber-200/40 relative overflow-hidden text-right group">
                      <div className="absolute -bottom-16 -left-16 p-8 opacity-[0.03] group-hover:scale-110 transition-all duration-1000"><HelpCircle size={180} className="text-amber-900" /></div>
                      <div className="relative z-10 space-y-4 sm:space-y-6">
                        <div className="border-b border-amber-200/50 pb-3 flex flex-col items-end gap-1">
                          <div className="flex items-center gap-2 text-amber-900 font-extrabold text-sm tracking-wide">
                            <span>أيقظ نفسك</span>
                            <Sparkles size={16} className="text-amber-600 animate-pulse" />
                          </div>
                          <span className="text-[10px] font-bold tracking-wider text-amber-700/80 uppercase">سـؤال لـك لتقف بصدق مـع نـفـسـك</span>
                        </div>
                        <p className="text-lg sm:text-2xl font-bold leading-relaxed font-serif italic text-amber-950/95 drop-shadow-sm bg-gradient-to-br from-amber-900/5 to-transparent p-4 sm:p-6 rounded-2xl border border-amber-100/40">
                          {selectedEvent.reflectionQuestion ? `"${selectedEvent.reflectionQuestion}"` : "كيف يمكننا تطبيق هذا المنهج في يومنا هذا؟"}
                        </p>
                      </div>
                   </section>

                  {selectedEvent.videos && selectedEvent.videos.map((video, idx) => (
                    <motion.a
                      key={idx}
                      href={video.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center justify-between p-5 sm:p-8 bg-red-600 hover:bg-red-700 text-white rounded-3xl sm:rounded-[40px] shadow-lg shadow-red-600/10 transition-all group overflow-hidden relative mb-4"
                    >
                       <div className="absolute top-0 left-0 p-4 opacity-10 group-hover:scale-110 transition-transform duration-700">
                         <Youtube size={80} />
                       </div>
                       <ArrowRight className="rotate-180" size={24} />
                       <div className="text-right relative z-10">
                         <div className="flex items-center gap-1.5 justify-end mb-1">
                           <span className="text-[9px] font-black uppercase tracking-widest opacity-70">عرض مرئي توضيحي</span>
                           <Youtube size={14} />
                         </div>
                         <p className="text-base sm:text-xl font-bold font-serif">{video.title || 'مشاهدة الشرح المرئي'}</p>
                         {video.subtitle && <p className="text-xs sm:text-sm opacity-85 mt-0.5">{video.subtitle}</p>}
                       </div>
                    </motion.a>
                  ))}
                </div>

                {/* أزرار التنقل السفلية المصغرة للهواتف */}
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 border-t border-black/5">
                  <button 
                    onClick={() => setSelectedEvent(null)} 
                    className="flex-1 bg-white border border-black/10 text-[#4e635a] py-3.5 sm:py-4 rounded-xl sm:rounded-2xl font-bold text-xs sm:text-sm hover:bg-black/5 transition-all shadow-md"
                  >
                    العودة للخريطة
                  </button>
                  <button 
                    onClick={handleNextEvent} 
                    className="flex-1 bg-[#4e635a] text-white py-3.5 sm:py-4 rounded-xl sm:rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 hover:bg-[#3d4d46] hover:shadow-lg transition-all"
                  >
                    انتقل للحدث التالي <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      
      {/* بصمة المنهج الشريف (رسالة الوداع واليقظة) */}
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="max-w-5xl mx-auto mt-24 relative overflow-hidden rounded-[48px] bg-gradient-to-br from-[#121f18] to-[#07100b] border border-emerald-500/20 shadow-2xl p-10 lg:p-16 text-right text-white text-right"
      >
        <div className="absolute top-0 left-0 p-8 opacity-[0.03] pointer-events-none">
          <Compass size={350} className="animate-spin-slow" />
        </div>
        
        <div className="relative z-10 space-y-8">
          <div className="flex flex-col items-center justify-center text-center space-y-4">
            <div className="p-4 bg-emerald-500/10 rounded-full border border-emerald-500/20 text-emerald-400">
              <Sparkles size={36} className="animate-pulse" />
            </div>
            <h3 className="text-3xl lg:text-4xl font-serif font-black tracking-wide text-amber-100 drop-shadow-md">
              بصمة المنهج الشريف
            </h3>
            <span className="text-[#89a896] font-bold text-xs uppercase tracking-[0.2em] border-b border-[#89a896]/20 pb-2">
              رسالة الوداع واليقظة لكل تائه وغافل
            </span>
          </div>

          <div className="space-y-6 text-lg lg:text-xl font-serif text-[#d9e6de] leading-relaxed max-w-4xl mx-auto">
            <p className="font-bold text-[#e6f4ed] text-center lg:text-right border-r-4 border-emerald-500 pr-4">
              "يا صديقي ، الأنبياء والرسل لم يأتوا ليرحلوا وتتحول سيرتهم إلى مجرد قصص وحكايات نتسلى بها في وقت فراغنا، أو مشاهد نتابعها في الشاشات ثم نعود لغفلتنا.
            </p>
            
            <p className="leading-loose">
              الأنبياء جاؤوا بمنهج ديني حقيقي وعملي؛ جاؤوا ليعلموك <span className="text-amber-200 font-bold">(لماذا أنت عائش؟)</span> وكيف تسير في هذه الدنيا بظهر مفرود ووقار، يداً عليا مستغنية تعتمد على السعي الحلال، وتبتعد عن ذل الدَّيْن ومظاهر الدنيا الكاذبة. هذا هو المنهج الشريف الذي لا نرضى بتلويثه أو تسطيحه؛ إنها رسالة واضحة تلزمك بأن تواجه نفسك بصدق، وتطبق أمر الله ونواهيه في تفاصيل يومك، وفي مالك، وأمانتك، وصلاتك.
            </p>

            <p className="font-medium text-[#c4d9cd] border-t border-white/5 pt-6 text-left lg:text-right">
              السيرة هي مرآتك الحقيقية لتعرف أين يقف قلبك الآن.. فلا تكن مجرد مشاهد عابر، بل كن مسافراً يترك أثراً طيباً يرضي الله."
            </p>
          </div>
        </div>
      </motion.div>

<style dangerouslySetInnerHTML={{ __html: `
        .leaflet-container { background-color: #0c1a13 !important; }
        .custom-popup .leaflet-popup-content-wrapper { border-radius: 36px; padding: 0; overflow: hidden; box-shadow: 0 40px 80px -15px rgba(0, 0, 0, 0.4); border: 2px solid white; }
        .custom-popup .leaflet-popup-content { margin: 0; width: 240px !important; }
        .custom-popup .leaflet-popup-tip { display: none; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #4e635a22; border-radius: 10px; }
        .leaflet-tile-pane { filter: contrast(1.1) brightness(0.9) saturate(1.2); }
      `}} />
    </div>
  );
}
