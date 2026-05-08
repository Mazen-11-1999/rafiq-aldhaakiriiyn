import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Map as MapIcon, Flag, Users, Heart, Target, ChevronRight, Swords, Shield, ScrollText, LayoutList, LocateFixed, ArrowRight, Compass, Youtube } from 'lucide-react';
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
      companionRole: 'الزوجة الصالحة التي ثبّتت قلب النبي ﷺ وكانت أول من آمن.',
      description: 'أول لقاء مع الوحي الأمين جبريل عليه السلام وبداية بزوغ فجر الإسلام.',
      story: 'كان النبي ﷺ يتعبد في غار حراء، فنزل عليه جبريل بكلمة "اقرأ"، فكانت الانطلاقة الكبرى لأعظم رسالة في التاريخ.',
      manhaj: 'التفكر والخلوة الصادقة مع الله هي أساس الاستعداد لتلقي النور واليقين.',
      icon: <ScrollText className="text-white" />,
      color: '#4e635a',
      phaseName: 'رحلة التأسيس',
      phaseColor: '#EAB308',
      imageUrl: 'https://i.ytimg.com/vi/fNbzxGCZU98/maxresdefault.jpg'
    },
    {
      id: 'arqam',
      year: 'قبل الهجرة بـ 12 سنة',
      title: 'دار الأرقم - مدرسة الإسلام الأولى',
      location: 'جبل الصفا، مكة المكرمة',
      coordinates: [21.4225, 39.8272],
      companion: 'الأرقم بن أبي الأرقم رضي الله عنه',
      companionRole: 'الصحابي الشاب الذي وهب منزله ليكون أول مركز للتعليم والتربية في الإسلام.',
      description: 'المقر السري الأول الذي اجتمع فيه النبي ﷺ بأصحابه الأوائل لتعليمهم قيم الوحي وبناء جيل العقيدة.',
      story: 'كانت دار الأرقم هي "الجامعة الصغرى" التي تخرج فيها كبار الصحابة مثل عمر بن الخطاب وحمزة بن عبد المطلب، بعيداً عن أذى قريش.',
      manhaj: 'بناء الأفراد وتزكية النفوس هو اللبنة الأولى في بناء أي حضارة عظيمة. العلم والتربية يأتيان دائماً قبل التمكين والمواجهة.',
      icon: <Users className="text-white" />,
      color: '#4e635a',
      phaseName: 'رحلة التأسيس',
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
      companionRole: 'العشيرة المؤمنة والوفية التي صمدت مع النبي ﷺ في وجه الحصار الجائر.',
      description: 'ثلاث سنوات من الجوع والعزلة في شعب أبي طالب، حيث أكل الصحابة أوراق الشجر ثباتاً على الحق.',
      story: 'تعاهدت قريش على قطع كل صلة وبناء وصناعة مع بني هاشم، فحبسوهم في الشعب، فما وهنوا وما استكانوا حتى أرسل الله "الأرضة" لتأكل صحيفة الظلم.',
      manhaj: 'اليقين لا يتزلزل بالجوع أو الحصار؛ فالمؤمن يعلم أن الرزاق هو الله، وأن بعد كل ضيقٍ مخرجاً ومنحة.',
      icon: <Shield className="text-white" />,
      color: '#4e635a',
      phaseName: 'رحلة التأسيس',
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
      companionRole: 'الرفيق الوفي الذي قال فيه النبي: لا تحزن إن الله معنا.',
      description: 'المحطة الفاصلة في رحلة الهجرة، حيث تجلى فيها صدق الصحبة وعظمة التوكل.',
      story: 'مكث النبي ﷺ وصاحبه في الغار ثلاثة أيام، والعدو من فوقهم، لكن عناية الله كانت تحرسهم.',
      manhaj: 'الأخذ بالأسباب مع كامل اليقين بالله. الرفيق الصالح هو الجدار الذي تستند إليه في المحن.',
      icon: <Compass className="text-white" />,
      color: '#4e635a',
      phaseName: 'رحلة التأسيس',
      phaseColor: '#EAB308',
      imageUrl: 'https://static.arrajol.com/styles/800x533_webp/public/2019/08/17/275121-1.%D8%BA%D8%A7%D8%B1%20%D8%AB%D9%88%D8%B1..%20%D8%B4%D8%A7%D9%87%D8%AF%20%D8%B9%D9%8A%D8%A7%D9%86%20%D9%8A%D8%B1%D9%88%D9%8A%20%D9%82%D8%B5%D8%A9%20%D8%AD%D9%85%D8%A7%D9%8A%D8%A9%20%D8%A7%D9%84%D8%B1%D8%B3%D9%88%D9%84%20%D8%A7%D9%84%D9%83%D8%B1%D9%8A%D9%85%20%D9%85%D9%86%20%D9%83%D9%81%D8%A7%D8%B1%20%D9%82%D8%B1%D9%8A%D8%B4%20%D8%A3%D8%AB%D9%86%D8%A7%D8%A1%20%D8%A7%D9%84%D9%87%D8%AC%D8%B1%D8%A9%20%D8%A7%D9%84%D9%86%D8%A8%D9%88%D9%8A%D8%A9.jpg.webp',
      videos: [
        {
          url: 'https://youtu.be/q7E-ohDYFKk?si=JFaWpDaYgvAPSk7F',
          title: 'رسم طريق الهجرة من مكة إلى المدينة',
          subtitle: 'الهجرة النبوية - الجزء الأول'
        },
        {
          url: 'https://youtu.be/-ukOioS5Lx0?si=Z9zwvzt9UhNsFEnK',
          title: 'مشاهدة الانطلاق من مكة ودخول الغار',
          subtitle: 'الهجرة النبوية - الجزء الثاني'
        }
      ]
    },
    {
      id: 'hijra',
      year: '1 هـ',
      title: 'الهجرة النبوية الشريفة',
      location: 'المدينة المنورة',
      coordinates: [24.4672, 39.6108],
      companion: 'أبو بكر الصديق رضي الله عنه',
      companionRole: 'الرفيق في الغار والسند المخلص في أصعب اللحظات.',
      description: 'استقبال الأنصار للنبي ﷺ في المدينة المنورة وبداية تأسيس الدولة الإسلامية الأولى.',
      story: 'ترك النبي ﷺ مكة مهاجراً مع صاحبه الصديق، مضحين بكل شيء من أجل العقيدة. كان التحول من مرحلة "الدعوة" إلى مرحلة "الدولة".',
      manhaj: 'التخطيط الدقيق مع التوكل المطلق. اختيار "الصاحب" الذي يعينك هو أساس النجاح.',
      icon: <Flag className="text-white" />,
      color: '#EAB308',
      phaseName: 'رحلة التأسيس',
      phaseColor: '#EAB308',
      imageUrl: 'https://www.darelfatwa.gov.lb/wp-content/uploads/2018/02/%D8%A7%D9%84%D9%87%D8%AC%D8%B1%D8%A9-%D8%A7%D9%84%D9%86%D8%A8%D9%88%D9%8A%D8%A9.jpg',
      videos: [
        {
          url: 'https://youtu.be/0xzsL29iID4?si=WV3RH2a3n8mXCO64',
          title: 'شاهد أحداث غار ثور وانطلاق الركب',
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
      companionRole: 'الصحابي الذي تشرف باستضافة النبي ﷺ في منزله حتى بُني المسجد وحجراته.',
      description: 'أول بيت لله في المدينة، لم يكن للصلاة فقط، بل كان برلماناً، وجامعةً، ومركزاً لإدارة شؤون الدولة والناس.',
      story: 'بركت ناقة النبي ﷺ في هذا الموضع، فاشتراه وبنى فيه المسجد، وكان النبي ﷺ يحمل اللبن مع أصحابه تشجيعاً لهم في مشهد يجسد التواضع والعمل الجماعي.',
      manhaj: 'المسجد هو القلب النابض للمجتمع المسلم. الاتصال بالله يسبق ويرافق كل نشاط اجتماعي أو سياسي؛ فهو مركز التربية والقيادة.',
      icon: <Heart className="text-white" />,
      color: '#EAB308',
      phaseName: 'رحلة التأسيس',
      phaseColor: '#EAB308',
      imageUrl: 'https://news.files.bbci.co.uk/include/extra/shorthand/assets/arabic/kiufqMQsEv/assets/OhxZGHUc2p/a-view-of-the-mosque-2560x1253.jpeg'
    },
    {
      id: 'badr',
      year: '2 هـ',
      title: 'غزوة بدر الكبرى',
      location: 'بدر',
      coordinates: [23.7744, 38.7903],
      companion: 'الحباب بن المنذر رضي الله عنه',
      companionRole: 'صاحب الرأي والمشورة في اختيار الموقع العسكري الاستراتيجي.',
      description: 'المواجهة الكبرى الأولى وانتصار القلة المؤمنة على الكثرة المشركة بفضل الله.',
      story: 'انتصار القلة المؤمنة على الكثرة الباغية. كانت أول مواجهة كبرى للحق ضد الباطل، حيث تجلى فيها تأييد الله.',
      manhaj: 'قيمة "المشورة" واليقين بالله. الحقيقة لا تقاس بالعدد بل بالإيمان وقوة الاستعداد.',
      icon: <Swords className="text-white" />,
      color: '#EF4444',
      phaseName: 'مرحلة الدفاع',
      phaseColor: '#EF4444',
      imageUrl: 'https://www.elmwatin.com/UploadCache/libfiles/90/2/800x450o/995.jpg'
    },
    {
      id: 'uhud',
      year: '3 هـ',
      title: 'غزوة أحد',
      location: 'جبل أحد',
      coordinates: [24.5028, 39.6133],
      companion: 'مصعب بن عمير رضي الله عنه',
      companionRole: 'حامل لواء المهاجرين الذي ثبت في أحلك الظروف حتى الاستشهاد.',
      description: 'دروس عظيمة في عاقبة مخالفة الأوامر القيادية وأهمية الانضباط.',
      story: 'درس عظيم في الصبر والثبات. تحول النصر إلى ابتلاء ليعلم الصحابة والأمة دروساً في الانضباط.',
      manhaj: 'النجاح يتطلب الالتزام المطلق بالخطة، والاستفادة من الفشل لتحقيق نجاحات قادمة.',
      icon: <Shield className="text-white" />,
      color: '#EF4444',
      phaseName: 'مرحلة الدفاع',
      phaseColor: '#EF4444',
      imageUrl: 'https://awkafonline.gov.eg/web/image/blog.post/10086/image_content_thumbnail'
    },
    {
      id: 'khandaq',
      year: '5 هـ',
      title: 'غزوة الخندق',
      location: 'شمال المدينة',
      coordinates: [24.4844, 39.6023],
      companion: 'سلمان الفارسي رضي الله عنه',
      companionRole: 'صاحب الفكرة الإبداعية (حفر الخندق) التي غيرت مجرى الحروب العربية.',
      description: 'اجتماع الأحزاب لمحاصرة المدينة، وتجلي الإبداع والعمل الجماعي في مواجهة الأزمة.',
      story: 'اجتمعت قوى الشرك لاستئصال الإيمان، فكان الحل إبداعياً بصناعة عائق مادي واستراتيجي حمى المدينة.',
      manhaj: 'التفكير خارج الصندوق ودمج الخبرات العالمية. المؤمن يجب أن يكون مبتكراً.',
      icon: <Target className="text-white" />,
      color: '#EF4444',
      phaseName: 'مرحلة الدفاع',
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
      location: 'الحديبية',
      coordinates: [21.4394, 39.6053],
      companion: 'عثمان بن عفان رضي الله عنه',
      companionRole: 'السفير الذي أرسله النبي لمفاوضة قريش بذكاء وهدوء وحكمة.',
      description: 'معاهدة السلام التي مهدت لفتح مكة وأظهرت حكمة القيادة النبوية.',
      story: 'معاهدة بدت في ظاهرها شروطاً قاسية، لكنها كانت فتحاً أعظم أتاح نشر الإسلام بالكلمة والحكمة.',
      manhaj: 'فقه الأولويات وتقديم المصالح العامة. التراجع التكتيكي أحياناً هو طريق النصر الاستراتيجي.',
      icon: <ScrollText className="text-white" />,
      color: '#10B981',
      phaseName: 'مرحلة الفتح',
      phaseColor: '#10B981',
      imageUrl: 'https://i.ytimg.com/vi/6Azx_K8Bz64/hqdefault.jpg'
    },
    {
      id: 'khaybar',
      year: '7 هـ',
      title: 'غزوة خيبر',
      location: 'خيبر',
      coordinates: [25.6194, 39.2908],
      companion: 'علي بن أبي طالب رضي الله عنه',
      companionRole: 'البطل الذي فتح الله على يديه حصون التحريض والفتنة.',
      description: 'القضاء على مراكز المؤامرات وتأمين أركان الدولة الناشئة بشجاعة فائقة.',
      story: 'مواجهة معاقل الفتنة. تجلت فيها شجاعة علي رضي الله عنه واليقين بنصر الله بعد صبر.',
      manhaj: 'الحزم في مواجهة الخطر والثقة بالقيادة. النجاح يتطلب بناء الفرد القوي الأمين.',
      icon: <Swords className="text-white" />,
      color: '#10B981',
      phaseName: 'مرحلة الفتح',
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
      companionRole: 'الذي صعد الكعبة ليعلن انتصار التوحيد وكرامة الإنسان.',
      description: 'العودة الظافرة إلى مكة بغير قتال وإعلان مبدأ العفو والتسامح الأكبر.',
      story: 'دخول مكة فاتحين متواضعين، وإعلان النبي ﷺ: "اذهبوا فأنتم الطلقاء". انتصار الأخلاق والقيم.',
      manhaj: 'العفو عند المقدرة. القوة الحقيقية في تغيير القلوب لا في الانتقام الجسدي.',
      icon: <Heart className="text-white" />,
      color: '#10B981',
      phaseName: 'مرحلة الفتح',
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
      companionRole: 'الذي نادى في الناس ليعيدهم إلى الثبات خلف قيادتهم وقت الشدة.',
      description: 'درس في الثبات وعدم الاغترار بالكثرة وأهمية الارتباط الروحي بالله في السراء والضراء.',
      story: 'أُعجب المسلمون بكثرتهم في البداية، لكنهم تعلموا أن النصر يكمن في الثبات واليقين واللجوء لله.',
      manhaj: 'التواضع المستمر لله وعدم الاغترار بالأسباب المادية وحدها مهما بلغت قوتك.',
      icon: <Shield className="text-white" />,
      color: '#10B981',
      phaseName: 'مرحلة الفتح',
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
      icon: <Swords className="text-white" />,
      color: '#3B82F6',
      phaseName: 'مرحلة التمام',
      phaseColor: '#3B82F6',
      imageUrl: 'https://i2.wp.com/imgs.photo/yt_0JUuRHKo_5o.webp'
    },
    {
      id: 'widaa',
      year: '10 هـ',
      title: 'بصمة الوداع والميثاق الأخير',
      location: 'صعيد عرفات',
      coordinates: [21.3547, 39.9841],
      companion: 'جميع الصحابة رضي الله عنهم',
      companionRole: 'الجيل الفريد الذي تسلم الأمانة ليبلغها للعالم أجمع.',
      description: 'إرساء القواعد النهائية لحقوق الإنسان والعدل وإكمال أعظم رسالة في التاريخ.',
      story: 'خطبة الوداع التي وضعت الدستور الإنساني الأكمل، معلنةً المساواة وحرمة الدماء والأعراض.',
      manhaj: 'الوضوح والشمولية. الإسلام منهج حياة متكامل يحمي الضعيف ويعدل بين الجميع بكرامة.',
      icon: <ScrollText className="text-white" />,
      color: '#3B82F6',
      phaseName: 'مرحلة التمام',
      phaseColor: '#3B82F6',
      imageUrl: 'https://modo3.com/thumbs/fit630x300/12595/1441547637/%D8%AE%D8%B7%D8%A8%D8%A9_%D8%A7%D9%84%D9%88%D8%AF%D8%A7%D8%B9.jpg'
    }
  ], []);

  const mapCenter: [number, number] = selectedEvent ? selectedEvent.coordinates : [24.4672, 39.6108];

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
            <h2 className="text-4xl font-bold text-[#4e635a] font-serif tracking-tight">الأطوار النبوية</h2>
          </motion.div>
          <p className="text-[#655d51] font-medium text-lg max-w-xl text-right leading-relaxed opacity-90">
            اكتشف المسار المكاني الحقيقي لرحلة المنهج النبوي عبر تضاريس الجزيرة العربية، من طور التأسيس وصولاً إلى كمال المنهج.
          </p>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row gap-4 items-end self-end"
        >
          <div className="flex flex-wrap gap-2 items-center justify-end">
            <a
              href="https://youtube.com/playlist?list=PLebiqPvxbGTa24tSS1SFJP1W9HU_7KZyz&si=hHoxtHIS1gduJXzE"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-red-600/10 hover:bg-red-600/20 text-red-700 border border-red-600/20 transition-all font-bold text-xs group"
            >
              <Youtube size={18} className="group-hover:scale-110 transition-transform" />
              <span>المسلسل (ج1)</span>
            </a>
            <a
              href="https://youtube.com/playlist?list=PLebiqPvxbGTaeA16rM85JbGzlBx6Z9BF_&si=wTkwguSstvuctMnd"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-red-600/10 hover:bg-red-600/20 text-red-700 border border-red-600/20 transition-all font-bold text-xs group"
            >
              <Youtube size={18} className="group-hover:scale-110 transition-transform" />
              <span>المسلسل (ج2)</span>
            </a>
          </div>

          <div className="flex bg-white/40 backdrop-blur-xl p-1.5 rounded-2xl border border-white/60 shadow-xl">
             <button 
              onClick={() => setViewMode('list')}
              className={cn(
                "flex items-center gap-2 px-6 py-3 rounded-xl transition-all duration-300 font-bold text-sm",
                viewMode === 'list' ? "bg-[#4e635a] text-white shadow-xl scale-105" : "text-[#4e635a] hover:bg-white/40"
              )}
             >
               <LayoutList size={18} />
               <span>عرض البطاقات</span>
             </button>
             <button 
              onClick={() => setViewMode('map')}
              className={cn(
                "flex items-center gap-2 px-6 py-3 rounded-xl transition-all duration-300 font-bold text-sm",
                viewMode === 'map' ? "bg-[#4e635a] text-white shadow-xl scale-105" : "text-[#4e635a] hover:bg-white/40"
              )}
             >
               <LocateFixed size={18} />
               <span>الخريطة الجغرافية</span>
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
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                onClick={() => setSelectedEvent(event)}
                className="group relative h-[450px] rounded-[40px] overflow-hidden bg-white shadow-2xl border-4 border-white transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <img 
                  src={`${event.imageUrl}?auto=format&fit=crop&q=80&w=600`} 
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                  alt="" 
                  loading="lazy"
                  onError={handleImageError}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1b1c1a]/95 via-[#1b1c1a]/40 to-transparent" />
                
                <div className="absolute top-6 right-6 flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/20">
                   <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center text-[#4e635a] text-[12px] font-black mr-1 shadow-md">
                     {index + 1}
                   </div>
                   <div className="w-2 h-2 rounded-full" style={{ backgroundColor: event.phaseColor }} />
                   <span className="text-white text-[10px] font-bold tracking-widest">{event.phaseName}</span>
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-8 text-right space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-white/60 text-xs font-bold tracking-widest">{event.year}</span>
                    <div className="p-3 bg-white/20 backdrop-blur-md rounded-2xl border border-white/20 text-white">
                      {event.icon}
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-white font-serif leading-tight">{event.title}</h3>
                  <p className="text-white/80 text-sm font-medium leading-relaxed line-clamp-2">{event.description}</p>
                  <div className="pt-4 flex items-center gap-2 justify-end text-white font-bold text-xs group-hover:gap-4 transition-all">
                    <span>استكشف البصمة</span>
                    <ArrowRight size={16} />
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
                          عرض التوصيف الحقيقي <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>

            {/* Interactive Timeline Sidebar Overlay */}
            <div className="absolute top-8 left-8 z-[1000] space-y-4 max-w-[280px]">
              <div className="bg-white/80 backdrop-blur-2xl text-[#4e635a] p-6 rounded-[32px] shadow-2xl border border-white/60">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#4e635a] animate-pulse" />
                  <span className="text-[10px] font-black uppercase tracking-widest opacity-60">التحول المنهجي</span>
                </div>
                <p className="text-lg font-bold font-serif leading-snug">تتبع التطور الجغرافي للدعوة الإسلامية</p>
                <div className="mt-4 pt-4 border-t border-[#4e635a]/10 grid grid-cols-2 gap-3">
                  {[{ name: 'تأسيس', color: '#EAB308' }, { name: 'دفاع', color: '#EF4444' }, { name: 'فتح', color: '#10B981' }, { name: 'إتمام', color: '#3B82F6' }].map((p, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
                      <span className="text-[9px] font-bold text-[#4e635a]/70">{p.name}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <button 
                onClick={handleNextEvent}
                className="w-full bg-[#4e635a] hover:bg-[#3d4d46] text-white p-5 rounded-[28px] shadow-2xl flex items-center justify-between font-bold group transition-all transform active:scale-95"
              >
                <span className="text-sm">انتقل للحدث التالي</span>
                <div className="bg-white/20 p-2 rounded-xl group-hover:bg-white/30 transition-colors">
                  <ArrowRight size={18} />
                </div>
              </button>
            </div>

            {/* Horizontal Navigator for Quick Access */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-3 overflow-x-auto px-8 py-4 w-full max-w-[85%] no-scrollbar z-[1000]">
              {events.map((event) => (
                <button
                  key={event.id}
                  onClick={() => setSelectedEvent(event)}
                  className={cn(
                    "whitespace-nowrap px-6 py-3 rounded-2xl font-bold text-xs shadow-2xl transition-all duration-500 transform",
                    selectedEvent?.id === event.id 
                      ? "bg-white text-[#4e635a] scale-110 shadow-[0_20px_40px_-10px_rgba(255,255,255,0.4)]" 
                      : "bg-[#4e635a]/80 backdrop-blur-xl text-white/90 opacity-70 hover:opacity-100 hover:scale-105"
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
            className="fixed inset-0 z-[2000] bg-[#0c1a13]/95 backdrop-blur-2xl flex items-center justify-center p-4 lg:p-16"
            onClick={() => setSelectedEvent(null)}
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 40 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 40 }}
              className="bg-[#fbf9f6] w-full max-w-6xl rounded-[64px] overflow-hidden shadow-[0_64px_128px_-24px_rgba(0,0,0,0.5)] flex flex-col lg:flex-row max-h-[85vh] border border-white/20"
              onClick={e => e.stopPropagation()}
            >
              {/* Cinematic Visual Side */}
              <div className="lg:w-1/2 h-72 lg:h-auto relative overflow-hidden bg-black/10">
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
                <div className="absolute inset-0 bg-gradient-to-t from-[#0c1a13] via-[#0c1a13]/20 to-transparent lg:bg-gradient-to-l" />
                
                <div className="absolute bottom-12 right-12 text-white space-y-4 text-right max-w-md">
                   <motion.div 
                    initial={{ x: 20, opacity: 0 }} 
                    animate={{ x: 0, opacity: 1 }} 
                    transition={{ delay: 0.3 }}
                    className="flex justify-end items-center gap-3"
                   >
                     <span className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#4e635a] text-sm font-black shadow-lg">
                       {events.findIndex(e => e.id === selectedEvent.id) + 1}
                     </span>
                     <span className="text-[12px] font-black px-4 py-2 bg-white/20 backdrop-blur-xl rounded-full uppercase tracking-[0.2em] border border-white/20" style={{ boxShadow: `0 0 20px ${selectedEvent.phaseColor}44` }}>
                       {selectedEvent.phaseName}
                     </span>
                   </motion.div>
                   <h3 className="text-5xl lg:text-6xl font-bold font-serif leading-tight drop-shadow-2xl">{selectedEvent.title}</h3>
                   <div className="flex items-center gap-3 justify-end text-xl text-white/80 font-serif italic">
                      <p>{selectedEvent.location}</p>
                      <div className="w-1.5 h-1.5 rounded-full bg-white/40" />
                      <p>{selectedEvent.year}</p>
                   </div>
                </div>
              </div>

              {/* Contextual Narrative Side */}
              <div className="flex-1 p-10 lg:p-16 space-y-10 overflow-y-auto custom-scrollbar">
                <div className="flex justify-between items-center">
                   <button 
                    onClick={() => setSelectedEvent(null)} 
                    className="w-14 h-14 rounded-full bg-black/5 hover:bg-black/10 flex items-center justify-center text-[#4e635a] transition-all hover:scale-110 active:scale-90"
                   >
                    <ChevronRight size={32} />
                   </button>
                   <div className="p-5 bg-white rounded-3xl shadow-xl shadow-black/5 text-[#4e635a] border border-white">
                    {selectedEvent.icon}
                   </div>
                </div>

                <div className="space-y-10">
                  <div className="bg-white/80 p-8 rounded-[40px] border border-white shadow-xl text-right relative group overflow-hidden">
                     <div className="absolute top-0 right-0 p-6 opacity-[0.03] group-hover:scale-150 transition-transform duration-1000">
                        <MapIcon size={200} />
                     </div>
                     <p className="text-2xl text-[#1b1c1a] font-serif leading-relaxed italic relative z-10">"{selectedEvent.description}"</p>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-8">
                    <section className="bg-[#d1e8dd]/30 p-8 rounded-[40px] border border-white space-y-4 text-right">
                      <div className="flex items-center gap-3 justify-end text-[#4e635a] opacity-60">
                        <h4 className="font-black text-[10px] uppercase tracking-widest">الشخصية المصاحبة</h4>
                        <Users size={20} />
                      </div>
                      <p className="font-bold text-[#4e635a] text-xl leading-tight">{selectedEvent.companion}</p>
                      <p className="text-sm text-[#4e635a]/80 leading-relaxed font-medium">{selectedEvent.companionRole}</p>
                    </section>

                    <section className="bg-white p-8 rounded-[40px] border border-black/5 space-y-4 text-right shadow-xl shadow-black/5">
                      <div className="flex items-center gap-3 justify-end text-[#716252] opacity-60">
                        <h4 className="font-black text-[10px] uppercase tracking-widest">توصيف الموقف</h4>
                        <ScrollText size={20} />
                      </div>
                      <p className="text-sm text-[#716252] leading-relaxed font-medium">{selectedEvent.story}</p>
                    </section>
                  </div>

                  <section className="bg-[#4e635a] p-10 rounded-[48px] text-white shadow-2xl relative overflow-hidden text-right group">
                     <div className="absolute top-0 left-0 p-8 opacity-[0.07] group-hover:rotate-12 transition-transform duration-700"><Target size={180} /></div>
                     <div className="relative z-10 space-y-6">
                       <h4 className="font-black text-[10px] tracking-[0.3em] uppercase opacity-50 border-b border-white/10 pb-4">المسار العملي المنهجي</h4>
                       <p className="text-2xl font-bold leading-relaxed font-serif">{selectedEvent.manhaj}</p>
                     </div>
                  </section>

                  {selectedEvent.videos && selectedEvent.videos.map((video, idx) => (
                    <motion.a
                      key={idx}
                      href={video.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center justify-between p-8 bg-red-600 hover:bg-red-700 text-white rounded-[40px] shadow-xl shadow-red-600/20 transition-all group overflow-hidden relative mb-4"
                    >
                       <div className="absolute top-0 left-0 p-6 opacity-10 group-hover:scale-125 transition-transform duration-700">
                         <Youtube size={100} />
                       </div>
                       <ArrowRight className="rotate-180" size={32} />
                       <div className="text-right relative z-10">
                         <div className="flex items-center gap-2 justify-end mb-1">
                           <span className="text-[10px] font-black uppercase tracking-widest opacity-70">عرض مرئي توضيحي</span>
                           <Youtube size={16} />
                         </div>
                         <p className="text-xl font-bold font-serif">{video.title || 'مشاهدة الشرح المرئي'}</p>
                         {video.subtitle && <p className="text-sm opacity-80 mt-1">{video.subtitle}</p>}
                       </div>
                    </motion.a>
                  ))}
                </div>

                <div className="flex gap-6 pt-6">
                  <button onClick={() => setSelectedEvent(null)} className="flex-1 bg-white border-2 border-black/5 text-[#4e635a] py-6 rounded-[32px] font-bold text-lg hover:bg-black/5 transition-all shadow-xl shadow-black/5">العودة للخريطة</button>
                  <button onClick={handleNextEvent} className="flex-1 bg-[#4e635a] text-white py-6 rounded-[32px] font-bold text-lg flex items-center justify-center gap-3 hover:shadow-[0_20px_40px_-10px_rgba(78,99,90,0.5)] transition-all transform hover:-translate-y-1">انتقل للحدث التالي <ArrowRight size={24} /></button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
