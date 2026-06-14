
export const RINGTONES = [
  { 
    id: 'official-prayer', 
    name: 'الأذان الرسمي للتطبيق (تلقائي)', 
    url: 'https://audio.islamweb.net/audio/download.php?audioid=206930'
  },
  { 
    id: 'adhan-assabile-82e70e', 
    name: 'أذان الحرم المكي الشريف', 
    url: 'https://media.assabile.com/assabile/adhan_3435370/82e70e435a79.mp3'
  },
  { 
    id: 'adhan-vocal-1', 
    name: 'أذان ندي وعذب شجي', 
    url: 'https://media.assabile.com/assabile/adhan_3435370/495dea4f4ea5.mp3'
  },
  { 
    id: 'adhan-vocal-2', 
    name: 'أذان روحاني مؤثر خاشع', 
    url: 'https://media.assabile.com/assabile/adhan_3435370/f30b7631d625.mp3'
  },
  {
    id: 'adhan-islamweb',
    name: 'أذان إسلام ويب العذب الشجي',
    url: 'https://audio.islamweb.net/audio/download.php?audioid=425434'
  },
  {
    id: 'adhan-islamweb-428892',
    name: 'أذان خاشع ومؤثر جداً (إسلام ويب)',
    url: 'https://audio.islamweb.net/audio/download.php?audioid=428892'
  },
  {
    id: 'adhan-islamweb-432210',
    name: 'أذان مكي رائع وخاشع (إسلام ويب)',
    url: 'https://audio.islamweb.net/audio/download.php?audioid=432210'
  },
  {
    id: 'adhan-islamweb-434647',
    name: 'أذان بنبرة حزينة ومؤثرة (إسلام ويب)',
    url: 'https://audio.islamweb.net/audio/download.php?audioid=434647'
  },
  {
    id: 'adhan-islamweb-400474',
    name: 'أذان بلبل شجي خاشع (إسلام ويب)',
    url: 'https://audio.islamweb.net/audio/download.php?audioid=400474'
  },
  {
    id: 'adhan-islamweb-319938',
    name: 'أذان جميل ندي ومميز (إسلام ويب)',
    url: 'https://audio.islamweb.net/audio/download.php?audioid=319938'
  }
];

export const DEFAULT_RINGTONE = RINGTONES[0];

export interface Nasheed {
  id: string;
  title: string;
  artist: string;
  url: string;
  urls?: string[]; // Fallback URLs
  cover: string;
}

export const NASHEEDS: Nasheed[] = [
  {
    id: 'nasheed-94',
    title: 'محمد وحشنا',
    artist: 'ماهر زين',
    url: 'https://serv100.albumaty.com/songs_2020/Albumaty.Com_mahr_zyn_mhmd_(s)_whshna.mp3',
    urls: [
      'https://ia601202.us.archive.org/29/items/maher-zain-collection/Maher%20Zain%20-%20Muhammad%20Wahashna.mp3',
      'https://ia801602.us.archive.org/29/items/maher-zain-collection/Maher%20Zain%20-%20Muhammad%20Wahashna.mp3',
      'https://ia801602.us.archive.org/29/items/maher-zain-collection/Maher%20Zain%20-%20Muhammad%20Wahashna.mp3'
    ],
    cover: 'https://i1.sndcdn.com/artworks-000110795835-whurr8-t500x500.jpg'
  },
  {
    id: 'nasheed-1',
    title: 'جد بلطفك',
    artist: 'أحمد بو خاطر',
    url: 'https://www.ashefaa.com/enshad/files/Ahmed-Bukhatir/Jud.Belutfik.mp3',
    urls: [
      'https://ia801908.us.archive.org/28/items/ahmed-bukhatir-fartaqi/01%20Jod%20Belotfak.mp3',
      'https://ia801908.us.archive.org/28/items/ahmed-bukhatir-fartaqi/01%20Jod%20Belotfak.mp3'
    ],
    cover: 'https://www.ashefaa.com/enshad/files/Ahmed-Bukhatir/JudBelutfek.jpg'
  },
  {
    id: 'nasheed-2',
    title: 'سجدت لك',
    artist: 'أحمد بو خاطر',
    url: 'https://www.ashefaa.com/enshad/files/Ahmed-Bukhatir/Sejadto.mp3',
    urls: [
      'https://ia801908.us.archive.org/28/items/ahmed-bukhatir-fartaqi/03%20Sajadto%20Laka.mp3',
      'https://ia801908.us.archive.org/28/items/ahmed-bukhatir-fartaqi/03%20Sajadto%20Laka.mp3'
    ],
    cover: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSJcp335rB0FhaA4oyUufQNJZZe21o3CCyGjw&s'
  },
  {
    id: 'nasheed-3',
    title: 'يا حامل القرآن',
    artist: 'أحمد بو خاطر',
    url: 'https://www.ashefaa.com/enshad/files/monaw3at/ya_hamel.mp3',
    cover: 'https://png.pngtree.com/png-vector/20260228/ourmid/pngtree-young-muslim-boy-in-blue-attire-and-cap-reading-quran-on-png-image_18830778.webp'
  },
  {
    id: 'nasheed-4',
    title: 'مالك غير الله',
    artist: 'منوعات إيمانية',
    url: 'https://www.ashefaa.com/enshad/files/monaw3at/malk_ger-allah.mp3',
    cover: 'https://images.unsplash.com/photo-1518005020480-28564f8606e9?q=80&w=200&auto=format&fit=crop'
  },
  {
    id: 'nasheed-5',
    title: 'طيبة الخير',
    artist: 'منوعات إيمانية',
    url: 'https://www.ashefaa.com/enshad/files/monaw3at/ya-taiba-alker.mp3',
    cover: 'https://images.unsplash.com/photo-1591129841117-3adfd313e34f?q=80&w=200&auto=format&fit=crop'
  },
  {
    id: 'nasheed-6',
    title: 'يا من عصيت الله',
    artist: 'منوعات إيمانية',
    url: 'https://www.ashefaa.com/enshad/files/monaw3at/ya-man-3asayta.mp3',
    cover: 'https://images.unsplash.com/photo-1499209974431-9dac345f862e?q=80&w=200&auto=format&fit=crop'
  },
  {
    id: 'nasheed-7',
    title: 'نداء الروح',
    artist: 'منوعات',
    url: 'https://ia800904.us.archive.org/30/items/IslamicRingtones_201306/Spirit.mp3',
    cover: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=200&auto=format&fit=crop'
  },
  {
    id: 'nasheed-8',
    title: 'سدد يا ابن القسام',
    artist: 'فرقة الوعد',
    url: 'https://www.ashefaa.com/enshad/files/alw3d/Sadded.mp3',
    cover: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=200&auto=format&fit=crop'
  },
  {
    id: 'nasheed-9',
    title: 'مآسي (5)',
    artist: 'منوعات',
    url: 'https://ia800904.us.archive.org/30/items/IslamicRingtones_201306/07.mp3',
    cover: 'https://images.unsplash.com/photo-1470252649358-96957cef6f0c?q=80&w=200&auto=format&fit=crop'
  },
  {
    id: 'nasheed-10',
    title: 'مآسي (4)',
    artist: 'منوعات',
    url: 'https://ia800904.us.archive.org/30/items/IslamicRingtones_201306/08.mp3',
    cover: 'https://images.unsplash.com/photo-1502012652162-6221bab362e6?q=80&w=200&auto=format&fit=crop'
  },
  {
    id: 'nasheed-11',
    title: 'دنيا (8)',
    artist: 'منوعات',
    url: 'https://ia800904.us.archive.org/30/items/IslamicRingtones_201306/09.mp3',
    cover: 'https://images.unsplash.com/photo-1444703686981-a3abbc4d4fe3?q=80&w=200&auto=format&fit=crop'
  },
  {
    id: 'nasheed-12',
    title: 'دنيا (5)',
    artist: 'منوعات',
    url: 'https://ia800904.us.archive.org/30/items/IslamicRingtones_201306/10.mp3',
    cover: 'https://images.unsplash.com/photo-1465447142348-e9952c393450?q=80&w=200&auto=format&fit=crop'
  },
  {
    id: 'nasheed-13',
    title: 'لبيك (2)',
    artist: 'منوعات',
    url: 'https://www.ashefaa.com/enshad/files/monaw3at/labaik/02_labaik.mp3',
    cover: 'https://images.unsplash.com/photo-1542810634-71277d95dcbb?q=80&w=200&auto=format&fit=crop'
  },
  {
    id: 'nasheed-14',
    title: 'روحي فداك',
    artist: 'منوعات',
    url: 'https://www.ashefaa.com/enshad/files/monaw3at/ya_hamel.mp3',
    cover: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=200&auto=format&fit=crop'
  },
  {
    id: 'nasheed-15',
    title: 'مالك غير الله',
    artist: 'منوعات',
    url: 'https://www.ashefaa.com/enshad/files/monaw3at/malk_ger-allah.mp3',
    cover: 'https://images.unsplash.com/photo-1518005020480-28564f8606e9?q=80&w=200&auto=format&fit=crop'
  },
  {
    id: 'nasheed-16',
    title: 'بتقوى الإله',
    artist: 'منوعات',
    url: 'https://www.ashefaa.com/enshad/files/monaw3at/%D8%A8%D8%AA%D9%82%D9%88%D9%89_%D8%A7%D9%84%D8%A5%D9%84%D9%87.mp3',
    cover: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=200&auto=format&fit=crop'
  },
  {
    id: 'nasheed-17',
    title: 'يا من عصيت الله',
    artist: 'منوعات',
    url: 'https://www.ashefaa.com/enshad/files/monaw3at/ya-man-3asayta.mp3',
    cover: 'https://images.unsplash.com/photo-1499209974431-9dac345f862e?q=80&w=200&auto=format&fit=crop'
  },
  {
    id: 'nasheed-18',
    title: 'الحاسم',
    artist: 'منوعات (تركي)',
    url: 'https://www.ashefaa.com/enshad/files/Turkish/Al7asem.mp3',
    cover: 'https://images.unsplash.com/photo-1518005020480-28564f8606e9?q=80&w=200&auto=format&fit=crop'
  },
  {
    id: 'nasheed-19',
    title: 'هادم اللذات',
    artist: 'منوعات',
    url: 'https://www.ashefaa.com/enshad/files/monaw3at/Hadem-Alazat.mp3',
    cover: 'https://images.unsplash.com/photo-1470252649358-96957cef6f0c?q=80&w=200&auto=format&fit=crop'
  },
  {
    id: 'nasheed-20',
    title: 'نصر من الله',
    artist: 'منوعات (تركي)',
    url: 'https://www.ashefaa.com/enshad/files/Turkish/Naser-mina-allah.mp3',
    cover: 'https://images.unsplash.com/photo-1516062423079-7ca13cdc7f5a?q=80&w=200&auto=format&fit=crop'
  },
  {
    id: 'nasheed-21',
    title: 'باي باي',
    artist: 'منوعات (تركي)',
    url: 'https://www.ashefaa.com/enshad/files/Turkish/Bay-Bay.mp3',
    cover: 'https://images.unsplash.com/photo-1514525253344-991422c7a0c5?q=80&w=200&auto=format&fit=crop'
  },
  {
    id: 'nasheed-22',
    title: 'ها نحن',
    artist: 'منوعات (تركي)',
    url: 'https://www.ashefaa.com/enshad/files/Turkish/Ha-Nahnou.mp3',
    cover: 'https://images.unsplash.com/photo-1459749411177-042180ce673c?q=80&w=200&auto=format&fit=crop'
  },
  {
    id: 'nasheed-23',
    title: 'شهادة الإباه',
    artist: 'منوعات',
    url: 'https://www.ashefaa.com/enshad/files/jihad/%D8%B4%D9%87%D8%A7%D8%AF%D8%A9_%D8%A7%D9%84%D8%A3%D8%A8%D8%A7%D9%87.mp3',
    cover: 'https://www.ashefaa.com/enshad/files/jihad/%D8%B4%D9%87%D8%A7%D8%AF%D8%A9_%D8%A7%D9%84%D8%A3%D8%A8%D8%A7%D9%87.jpg'
  },
  {
    id: 'nasheed-24',
    title: 'لم الشمل',
    artist: 'منوعات',
    url: 'https://www.ashefaa.com/enshad/files/jihad/%D9%84%D9%85-%D8%A7%D9%84%D8%B4%D9%85%D9%84.mp3',
    cover: 'https://images.unsplash.com/photo-1526218626217-dc65a29bb444?q=80&w=200&auto=format&fit=crop'
  },
  {
    id: 'nasheed-25',
    title: 'لحن العودة',
    artist: 'فرقة الوعد',
    url: 'https://www.ashefaa.com/enshad/files/alw3d/Lahn-Alawda.mp3',
    cover: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=200&auto=format&fit=crop'
  },
  {
    id: 'nasheed-26',
    title: 'حراب الشهادة',
    artist: 'منوعات جهادية',
    url: 'https://www.ashefaa.com/enshad/files/jihad/7irab_shahada.mp3',
    cover: 'https://images.unsplash.com/photo-1493225255756-d9584f8606e9?q=80&w=200&auto=format&fit=crop'
  },
  {
    id: 'nasheed-27',
    title: 'القسامية',
    artist: 'أناشيد غزة',
    url: 'https://www.ashefaa.com/enshad/files/Gaza/alqasaamia.mp3',
    cover: 'https://images.unsplash.com/photo-1542810634-71277d95dcbb?q=80&w=200&auto=format&fit=crop'
  },
  {
    id: 'nasheed-28',
    title: 'جودي',
    artist: 'فرقة الوعد',
    url: 'https://www.ashefaa.com/enshad/files/alw3d/Joudi.mp3',
    cover: 'https://images.unsplash.com/photo-1516062423079-7ca13cdc7f5a?q=80&w=200&auto=format&fit=crop'
  },
  {
    id: 'nasheed-29',
    title: 'نفحة صحابة',
    artist: 'فرقة الوعد',
    url: 'https://www.ashefaa.com/enshad/files/alw3d/Naf7a-sa7aba.mp3',
    cover: 'https://images.unsplash.com/photo-1507615811603-347cf74e1019?q=80&w=200&auto=format&fit=crop'
  },
  {
    id: 'nasheed-30',
    title: 'ما هنتِ لا والله',
    artist: 'منوعات جهادية',
    url: 'https://www.ashefaa.com/enshad/files/jihad/%D9%85%D8%A7-%D9%87%D9%86%D8%AA%D9%8I-%D9%84%D8%A7-%D9%88%D8%A7%D9%84%D9%84%D9%87.mp3',
    cover: 'https://images.unsplash.com/photo-1499209974431-9dac345f862e?q=80&w=200&auto=format&fit=crop'
  },
  {
    id: 'nasheed-31',
    title: 'كورونا (أين المفر)',
    artist: 'منوعات حزينة',
    url: 'https://www.ashefaa.com/enshad/files/7azina/korona.mp3',
    cover: 'https://images.unsplash.com/photo-1470252649358-96957cef6f0c?q=80&w=200&auto=format&fit=crop'
  },
  {
    id: 'nasheed-32',
    title: 'مهرجان (5)',
    artist: 'منوعات',
    url: 'https://www.ashefaa.com/enshad/files/monaw3at/mhrajan-1/05_Mhrjan1.mp3',
    cover: 'https://images.unsplash.com/photo-1514525253344-991422c7a0c5?q=80&w=200&auto=format&fit=crop'
  },
  {
    id: 'nasheed-33',
    title: 'يا ملثم',
    artist: 'أناشيد غزة',
    url: 'https://www.ashefaa.com/enshad/files/Gaza/ya-multhem.mp3',
    cover: 'https://images.unsplash.com/photo-1542810634-71277d95dcbb?q=80&w=200&auto=format&fit=crop'
  },
  {
    id: 'nasheed-34',
    title: 'عشاق الشهادة',
    artist: 'منوعات',
    url: 'https://www.ashefaa.com/enshad/files/lebanon/Oshaq-Al-Shahada.mp3',
    cover: 'https://images.unsplash.com/photo-1516062423079-7ca13cdc7f5a?q=80&w=200&auto=format&fit=crop'
  },
  {
    id: 'nasheed-35',
    title: 'توبي',
    artist: 'إبراهيم العزاوي',
    url: 'https://www.ashefaa.com/enshad/files/3azawi/toubie.mp3',
    cover: 'https://images.unsplash.com/photo-1507615811603-347cf74e1019?q=80&w=200&auto=format&fit=crop'
  },
  {
    id: 'nasheed-36',
    title: 'مع الله',
    artist: 'إبراهيم العزاوي',
    url: 'https://www.ashefaa.com/enshad/files/3azawi/ma3-allah.mp3',
    cover: 'https://images.unsplash.com/photo-1499209974431-9dac345f862e?q=80&w=200&auto=format&fit=crop'
  },
  {
    id: 'nasheed-37',
    title: 'عباد الرحمن',
    artist: 'إبراهيم العزاوي',
    url: 'https://www.ashefaa.com/enshad/files/3azawi/3bad-alra7man.mp3',
    cover: 'https://images.unsplash.com/photo-1470252649358-96957cef6f0c?q=80&w=200&auto=format&fit=crop'
  },
  {
    id: 'nasheed-38',
    title: 'إلهي',
    artist: 'إبراهيم العزاوي',
    url: 'https://www.ashefaa.com/enshad/files/3azawi/ilahi.mp3',
    cover: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=200&auto=format&fit=crop'
  },
  {
    id: 'nasheed-39',
    title: 'جرد قلبك',
    artist: 'إبراهيم العزاوي',
    url: 'https://www.ashefaa.com/enshad/files/3azawi/jared-kalbak.mp3',
    cover: 'https://images.unsplash.com/photo-1518005020480-28564f8606e9?q=80&w=200&auto=format&fit=crop'
  },
  {
    id: 'nasheed-40',
    title: 'حب النبي',
    artist: 'إبراهيم العزاوي',
    url: 'https://www.ashefaa.com/enshad/files/3azawi/7ob-Alnabi.mp3',
    cover: 'https://images.unsplash.com/photo-1459749411177-042180ce673c?q=80&w=200&auto=format&fit=crop'
  },
  {
    id: 'nasheed-41',
    title: 'حار فكري',
    artist: 'إبراهيم العزاوي',
    url: 'https://www.ashefaa.com/enshad/files/3azawi/7ar-fekri.mp3',
    cover: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=200&auto=format&fit=crop'
  },
  {
    id: 'nasheed-42',
    title: 'يا كاتب الحور',
    artist: 'أبو عبد الملك',
    url: 'https://www.ashefaa.com/enshad/files/Abel-Mallek/ya-katebal7our.mp3',
    cover: 'https://images.unsplash.com/photo-1502012652162-6221bab362e6?q=80&w=200&auto=format&fit=crop'
  },
  {
    id: 'nasheed-43',
    title: 'يا طيبة (تراث)',
    artist: 'أبو عبد الملك',
    url: 'https://www.ashefaa.com/enshad/files/Abel-Mallek/770001.mp3',
    cover: 'https://images.unsplash.com/photo-1493225255756-d9584f8606e9?q=80&w=200&auto=format&fit=crop'
  },
  {
    id: 'nasheed-44',
    title: 'فرشي التراب',
    artist: 'أبو عبد الملك',
    url: 'https://www.ashefaa.com/enshad/files/Abel-Mallek/600002.mp3',
    cover: 'https://images.unsplash.com/photo-1507615811603-347cf74e1019?q=80&w=200&auto=format&fit=crop'
  },
  {
    id: 'nasheed-45',
    title: 'يا نور قلبي',
    artist: 'أيمن الحلاق',
    url: 'https://www.ashefaa.com/enshad/files/Ayman-Alhallaq/Ya-Nour-Qalbi.mp3',
    cover: 'https://images.unsplash.com/photo-1516062423079-7ca13cdc7f5a?q=80&w=200&auto=format&fit=crop'
  },
  {
    id: 'nasheed-46',
    title: 'أنا مالي',
    artist: 'أيمن الحلاق',
    url: 'https://www.ashefaa.com/enshad/files/Ayman-Alhallaq/Ana-Maly.mp3',
    cover: 'https://images.unsplash.com/photo-1502012652162-6221bab362e6?q=80&w=200&auto=format&fit=crop'
  },
  {
    id: 'nasheed-47',
    title: 'صلاة الله',
    artist: 'أيمن الحلاق',
    url: 'https://www.ashefaa.com/enshad/files/Ayman-Alhallaq/Salat-Allah.mp3',
    cover: 'https://images.unsplash.com/photo-1542810634-71277d95dcbb?q=80&w=200&auto=format&fit=crop'
  },
  {
    id: 'nasheed-48',
    title: 'صبراً',
    artist: 'أيمن الحلاق',
    url: 'https://www.ashefaa.com/enshad/files/Ayman-Alhallaq/Sabran.mp3',
    cover: 'https://images.unsplash.com/photo-1499209974431-9dac345f862e?q=80&w=200&auto=format&fit=crop'
  },
  {
    id: 'nasheed-49',
    title: 'أيها البلبل',
    artist: 'أيمن الحلاق',
    url: 'https://www.ashefaa.com/enshad/files/Ayman-Alhallaq/Ayoha-Albolbol.mp3',
    cover: 'https://images.unsplash.com/photo-1444703686981-a3abbc4d4fe3?q=80&w=200&auto=format&fit=crop'
  },
  {
    id: 'nasheed-50',
    title: 'أشتات',
    artist: 'أيمن الحلاق',
    url: 'https://www.ashefaa.com/enshad/files/Ayman-Alhallaq/Ashtat.mp3',
    cover: 'https://images.unsplash.com/photo-1507615811603-347cf74e1019?q=80&w=200&auto=format&fit=crop'
  },
  {
    id: 'nasheed-51',
    title: 'اعرف',
    artist: 'يحيى حوى',
    url: 'https://www.ashefaa.com/enshad/files/Yahya-Hawaa/e3ref.mp3',
    cover: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=200&auto=format&fit=crop'
  },
  {
    id: 'nasheed-52',
    title: 'أتيتني (You Came To Me)',
    artist: 'سامي يوسف',
    url: 'https://www.ashefaa.com/enshad/files/sami_yusuf/You-Came-To-Me.mp3',
    cover: 'https://i1.sndcdn.com/artworks-000009906912-548wa5-t500x500.jpg'
  },
  {
    id: 'nasheed-53',
    title: 'الله (Allah)',
    artist: 'سامي يوسف',
    url: 'https://www.ashefaa.com/enshad/files/sami_yusuf/allah.mp3',
    cover: 'https://i1.sndcdn.com/artworks-000009906912-548wa5-t500x500.jpg'
  },
  {
    id: 'nasheed-54',
    title: 'أسماء الله الحسنى',
    artist: 'سامي يوسف',
    url: 'https://www.ashefaa.com/enshad/files/sami_yusuf/Asmaa_Allah.mp3',
    cover: 'https://i1.sndcdn.com/artworks-000009906912-548wa5-t500x500.jpg'
  },
  {
    id: 'nasheed-55',
    title: 'أغنية العيد',
    artist: 'سامي يوسف',
    url: 'https://www.ashefaa.com/enshad/files/sami_yusuf/Eid_Song.mp3',
    cover: 'https://i1.sndcdn.com/artworks-000009906912-548wa5-t500x500.jpg'
  },
  {
    id: 'nasheed-56',
    title: 'يا مصطفى',
    artist: 'سامي يوسف',
    url: 'https://www.ashefaa.com/enshad/files/sami_yusuf/Ya-moustafa.mp3',
    cover: 'https://i1.sndcdn.com/artworks-000009906912-548wa5-t500x500.jpg'
  },
  {
    id: 'nasheed-57',
    title: 'تحية (Salutation)',
    artist: 'سامي يوسف',
    url: 'https://www.ashefaa.com/enshad/files/sami_yusuf/SALUTATION.mp3',
    cover: 'https://i1.sndcdn.com/artworks-000009906912-548wa5-t500x500.jpg'
  },
  {
    id: 'nasheed-58',
    title: 'أنشودة مختارة',
    artist: 'موسى مصطفى',
    url: 'https://www.ashefaa.com/enshad/files/Mousa-Moustafa/Ashefaa.Com-3.mp3',
    cover: 'https://images.unsplash.com/photo-1542810634-71277d95dcbb?q=80&w=200&auto=format&fit=crop'
  },
  {
    id: 'nasheed-59',
    title: 'هو الله',
    artist: 'إبراهيم العزاوي',
    url: 'https://www.ashefaa.com/enshad/files/3azawi/hwa-allah.mp3',
    cover: 'https://images.unsplash.com/photo-1499209974431-9dac345f862e?q=80&w=200&auto=format&fit=crop'
  },
  {
    id: 'nasheed-60',
    title: 'لبيك',
    artist: 'موسى مصطفى',
    url: 'https://www.ashefaa.com/enshad/files/Mousa-Moustafa/labik.mp3',
    cover: 'https://images.unsplash.com/photo-1444703686981-a3abbc4d4fe3?q=80&w=200&auto=format&fit=crop'
  },
  {
    id: 'nasheed-61',
    title: 'حوار الحجاب',
    artist: 'أيمن رمضان',
    url: 'https://www.ashefaa.com/enshad/files/ayman-ramadan/7ewar-al7ejab.mp3',
    cover: 'https://images.unsplash.com/photo-1507615811603-347cf74e1019?q=80&w=200&auto=format&fit=crop'
  },
  {
    id: 'nasheed-62',
    title: 'عنور',
    artist: 'فرقة الصعيد',
    url: 'https://www.ashefaa.com/enshad/files/Sa3idi/3anour.mp3',
    cover: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=200&auto=format&fit=crop'
  },
  {
    id: 'nasheed-63',
    title: 'هوى اليمن',
    artist: 'فرقة الصعيد',
    url: 'https://www.ashefaa.com/enshad/files/Sa3idi/hawa-alyaman.mp3',
    cover: 'https://images.unsplash.com/photo-1493225255756-d9584f8606e9?q=80&w=200&auto=format&fit=crop'
  },
  {
    id: 'nasheed-64',
    title: 'أحد أحد',
    artist: 'أبو راتب',
    url: 'https://www.ashefaa.com/enshad/files/abo-rateb/a7ad-a7ad.mp3',
    cover: 'https://www.ashefaa.com/enshad/images/msert_alkhlod.jpg'
  },
  {
    id: 'nasheed-65',
    title: 'شباب الهدى',
    artist: 'أبو راتب',
    url: 'https://www.ashefaa.com/enshad/files/abo-rateb/4/shabab-alhoda.mp3',
    cover: 'https://www.ashefaa.com/enshad/images/msert_alkhlod.jpg'
  },
  {
    id: 'nasheed-66',
    title: 'أبو راتب - مختارات 1',
    artist: 'أبو راتب',
    url: 'https://www.ashefaa.com/enshad/files/abo-rateb/11/2.mp3',
    cover: 'https://www.ashefaa.com/enshad/images/msert_alkhlod.jpg'
  },
  {
    id: 'nasheed-67',
    title: 'أبو راتب - مختارات 2',
    artist: 'أبو راتب',
    url: 'https://www.ashefaa.com/enshad/files/abo-rateb/11/5.mp3',
    cover: 'https://www.ashefaa.com/enshad/images/msert_alkhlod.jpg'
  },
  {
    id: 'nasheed-68',
    title: 'يتيم',
    artist: 'أبو راتب',
    url: 'https://www.ashefaa.com/enshad/files/abo-rateb/11/yatim.mp3',
    cover: 'https://www.ashefaa.com/enshad/images/msert_alkhlod.jpg'
  },
  {
    id: 'nasheed-69',
    title: 'أنوار الدعوة',
    artist: 'أبو راتب',
    url: 'https://www.ashefaa.com/enshad/files/abo-rateb/Anwaar-Al-dawa.mp3',
    cover: 'https://www.ashefaa.com/enshad/images/msert_alkhlod.jpg'
  },
  {
    id: 'nasheed-70',
    title: 'أعتز بإسلامي',
    artist: 'أبو راتب',
    url: 'https://www.ashefaa.com/enshad/files/abo-rateb/A3taz-bi-islami.mp3',
    cover: 'https://www.ashefaa.com/enshad/images/msert_alkhlod.jpg'
  },
  {
    id: 'nasheed-71',
    title: 'قاصد',
    artist: 'منوعات',
    url: 'https://www.ashefaa.com/enshad/files/monaw3at/Kaser/07_Kaser.mp3',
    cover: 'https://images.unsplash.com/photo-1518005020480-28564f8606e9?q=80&w=200&auto=format&fit=crop'
  },
  {
    id: 'nasheed-72',
    title: 'من عرف الله',
    artist: 'أبو راتب',
    url: 'https://www.ashefaa.com/enshad/files/abo-rateb/Man-Arafa-Allah.mp3',
    cover: 'https://www.ashefaa.com/enshad/images/msert_alkhlod.jpg'
  },
  {
    id: 'nasheed-73',
    title: 'مدين لك',
    artist: 'أبو راتب',
    url: 'https://www.ashefaa.com/enshad/files/abo-rateb/Madinun-Laka.mp3',
    cover: 'https://www.ashefaa.com/enshad/images/msert_alkhlod.jpg'
  },
  {
    id: 'nasheed-74',
    title: 'وقفت',
    artist: 'أبو راتب',
    url: 'https://www.ashefaa.com/enshad/files/abo-rateb/wakafet.mp3',
    cover: 'https://www.ashefaa.com/enshad/images/msert_alkhlod.jpg'
  },
  {
    id: 'nasheed-75',
    title: 'لنا مصعب',
    artist: 'أبو راتب',
    url: 'https://www.ashefaa.com/enshad/files/abo-rateb/lana-mosab.mp3',
    cover: 'https://www.ashefaa.com/enshad/images/msert_alkhlod.jpg'
  },
  {
    id: 'nasheed-76',
    title: 'الأيام',
    artist: 'أبو راتب',
    url: 'https://www.ashefaa.com/enshad/files/abo-rateb/Al-ayam.mp3',
    cover: 'https://www.ashefaa.com/enshad/images/msert_alkhlod.jpg'
  },
  {
    id: 'nasheed-77',
    title: 'أنشودة الشفاء',
    artist: 'الشفاء',
    url: 'https://www.ashefaa.com/enshad/files/ashefaa/Nasheed-Ashefaa.mp3',
    cover: 'https://images.unsplash.com/photo-1507615811603-347cf74e1019?q=80&w=200&auto=format&fit=crop'
  },
  {
    id: 'nasheed-78',
    title: 'رقت عيناي شوقاً',
    artist: 'ماهر زين',
    url: 'https://serv100.albumaty.com/songs_2020/Albumaty.Com_mahr_zyn_raqt_aynay_shwqa.mp3',
    urls: [
      'https://ia800100.us.archive.org/30/items/nasheed_adel/Maher%20Zain%20-%20Raqqat%20Aynaya%20Shawqan.mp3'
    ],
    cover: 'https://i1.sndcdn.com/artworks-000110795835-whurr8-t500x500.jpg'
  },
  {
    id: 'nasheed-79',
    title: 'رحمة للعالمين',
    artist: 'ماهر زين',
    url: 'https://serv100.albumaty.com/songs_2020/Albumaty.Com_mahr_zyn_rhmt_llaalmyn.mp3',
    urls: [
      'https://ia800100.us.archive.org/30/items/nasheed_adel/Maher%20Zain%20-%20Rahmatun%20Lil%27Alameen.mp3'
    ],
    cover: 'https://i1.sndcdn.com/artworks-000110795835-whurr8-t500x500.jpg'
  },
  {
    id: 'nasheed-80',
    title: 'يا نبي سلام عليك',
    artist: 'ماهر زين',
    url: 'https://serv100.albumaty.com/dl/mem/maher-zain/singles/Albumaty.Com.Maher.Zain.Ya.Nabi.Salam.Alayka.mp3',
    urls: [
      'https://ia800100.us.archive.org/30/items/nasheed_adel/Maher%20Zain%20-%20Ya%20Nabi%20Salam%20Alayka.mp3'
    ],
    cover: 'https://i1.sndcdn.com/artworks-000110795835-whurr8-t500x500.jpg'
  },
  {
    id: 'nasheed-81',
    title: 'بارك الله لكما',
    artist: 'ماهر زين',
    url: 'https://ia800100.us.archive.org/30/items/MaherZainFullAlbum_201612/Maher%20Zain%20-%20Baraka%20Allahu%20Lakuma.mp3',
    cover: 'https://i1.sndcdn.com/artworks-000110795835-whurr8-t500x500.jpg'
  },
  {
    id: 'nasheed-82',
    title: 'هو القرآن',
    artist: 'ماهر زين',
    url: 'https://ia800100.us.archive.org/30/items/MaherZainFullAlbum_201612/Maher%20Zain%20-%20Huwa%20Alquran.mp3',
    cover: 'https://i1.sndcdn.com/artworks-000110795835-whurr8-t500x500.jpg'
  },
  {
    id: 'nasheed-83',
    title: 'الصبح بدا',
    artist: 'ماهر زين',
    url: 'https://serv100.albumaty.com/dl/mem/maher-zain/singles/Albumaty.Com.Maher.Zain.Assubhu.Bada.mp3',
    urls: [
      'https://ia800100.us.archive.org/30/items/MaherZainFullAlbum_201612/Maher%20Zain%20-%20Assubhu%20Bada.mp3'
    ],
    cover: 'https://i1.sndcdn.com/artworks-000110795835-whurr8-t500x500.jpg'
  },
  {
    id: 'nasheed-84',
    title: 'أبو راتب - مختارات 3',
    artist: 'أبو راتب',
    url: 'https://www.ashefaa.com/enshad/files/abo-rateb/5/3.mp3',
    cover: 'https://www.ashefaa.com/enshad/images/msert_alkhlod.jpg'
  },
  {
    id: 'nasheed-85',
    title: 'فارس الإسلام',
    artist: 'أبو راتب',
    url: 'https://www.ashefaa.com/enshad/files/abo-rateb/fares-aleslam.mp3',
    cover: 'https://www.ashefaa.com/enshad/images/msert_alkhlod.jpg'
  },
  {
    id: 'nasheed-86',
    title: 'لا تحزن',
    artist: 'ماهر زين',
    url: 'https://serv100.albumaty.com/2024/Albumaty.Com_mahr_zyn_la_thzn.mp3',
    cover: 'https://i1.sndcdn.com/artworks-000110795835-whurr8-t500x500.jpg'
  },
  {
    id: 'nasheed-87',
    title: 'لولاك',
    artist: 'ماهر زين',
    url: 'https://ia800100.us.archive.org/30/items/MaherZainFullAlbum_201612/Maher%20Zain%20-%20Lawlaka.mp3',
    cover: 'https://i1.sndcdn.com/artworks-000110795835-whurr8-t500x500.jpg'
  },
  {
    id: 'nasheed-88',
    title: 'صلى عليك الرحمن',
    artist: 'ماهر زين',
    url: 'https://serv100.albumaty.com/song2022/Albumaty.Com_mahr_zyn_sli_alyk_alrhmn.mp3',
    cover: 'https://i1.sndcdn.com/artworks-000110795835-whurr8-t500x500.jpg'
  },
  {
    id: 'nasheed-89',
    title: 'قلبي في المدينة',
    artist: 'ماهر زين',
    url: 'https://serv100.albumaty.com/2025/Albumaty.Com_mahr_zyn_klby_fy_almdynt.mp3',
    urls: [
      'https://ia801602.us.archive.org/29/items/maher-zain-collection/Maher%20Zain%20-%20Medina.mp3',
      'https://ia601202.us.archive.org/29/items/maher-zain-collection/Maher%20Zain%20-%20Medina.mp3'
    ],
    cover: 'https://i1.sndcdn.com/artworks-000110795835-whurr8-t500x500.jpg'
  },
  {
    id: 'nasheed-90',
    title: 'سلام الله',
    artist: 'ماهر زين',
    url: 'https://serv100.albumaty.com/song2022/Albumaty.Com_mahr_zyn_slam_allh.mp3',
    cover: 'https://i1.sndcdn.com/artworks-000110795835-whurr8-t500x500.jpg'
  },
  {
    id: 'nasheed-91',
    title: 'ناس تشبه لنا',
    artist: 'ماهر زين',
    url: 'https://serv100.albumaty.com/songs_2020/Albumaty.Com_mahr_zyn_nas_tshbhlna.mp3',
    cover: 'https://i1.sndcdn.com/artworks-000110795835-whurr8-t500x500.jpg'
  },
  {
    id: 'nasheed-92',
    title: 'رحمة للعالمين (نسخة أخرى)',
    artist: 'ماهر زين',
    url: 'https://serv100.albumaty.com/songs_2020/Albumaty.Com_mahr_zyn_rhmt_llaalmyn.mp3',
    urls: [
      'https://ia800100.us.archive.org/30/items/nasheed_adel/Maher%20Zain%20-%20Rahmatun%20Lil%27Alameen.mp3',
      'https://ia601202.us.archive.org/29/items/maher-zain-collection/Maher%20Zain%20-%20Rahmatun%20Lil%27Alameen.mp3'
    ],
    cover: 'https://i1.sndcdn.com/artworks-000110795835-whurr8-t500x500.jpg'
  },
  {
    id: 'nasheed-93',
    title: 'إن شاء الله',
    artist: 'ماهر زين',
    url: 'https://serv100.albumaty.com/songs_2020/Albumaty.Com_mahr_zyn_an_shaa_allh.mp3',
    urls: [
      'https://ia800100.us.archive.org/30/items/nasheed_adel/Maher%20Zain%20-%20Insha%20Allah.mp3'
    ],
    cover: 'https://i1.sndcdn.com/artworks-000110795835-whurr8-t500x500.jpg'
  },
  {
    id: 'nasheed-95',
    title: 'رضيت بالله رباً',
    artist: 'ماهر زين',
    url: 'https://serv100.albumaty.com/songs_2020/Albumaty.Com_mahr_zyn__rdyt_ballh_rba.mp3',
    cover: 'https://i1.sndcdn.com/artworks-000110795835-whurr8-t500x500.jpg'
  },
  {
    id: 'nasheed-96',
    title: 'حب النبي',
    artist: 'ماهر زين',
    url: 'https://serv100.albumaty.com/songs_2020/Albumaty.Com_mahr_zyn_hb_alnby.mp3',
    cover: 'https://i1.sndcdn.com/artworks-000110795835-whurr8-t500x500.jpg'
  },
  {
    id: 'nasheed-97',
    title: 'نور على نور',
    artist: 'ماهر زين',
    url: 'https://serv100.albumaty.com/songs_2020/Albumaty.Com_mahr_zyn_nwr_ali_nwr.mp3',
    cover: 'https://i1.sndcdn.com/artworks-000110795835-whurr8-t500x500.jpg'
  },
  {
    id: 'nasheed-98',
    title: 'على نهجك مشيت',
    artist: 'ماهر زين',
    url: 'https://serv100.albumaty.com/dl/mem/maher-zain/singles/Albumaty.Com.Maher.Zain.Ala.Nahjik.Mashayt.mp3',
    cover: 'https://i1.sndcdn.com/artworks-000110795835-whurr8-t500x500.jpg'
  },
  {
    id: 'nasheed-99',
    title: 'هو القرآن (أخرى)',
    artist: 'ماهر زين',
    url: 'https://serv100.albumaty.com/dl/mem/maher-zain/singles/Albumaty.Com.Maher.Zain.Howa.Elquran.mp3',
    cover: 'https://i1.sndcdn.com/artworks-000110795835-whurr8-t500x500.jpg'
  },
  {
    id: 'nasheed-100',
    title: 'كن رحمة',
    artist: 'ماهر زين',
    url: 'https://serv100.albumaty.com/dl/mem/maher-zain/singles/Albumaty.Com.Maher.Zain.Kun.Rahma.mp3',
    cover: 'https://i1.sndcdn.com/artworks-000110795835-whurr8-t500x500.jpg'
  },
  {
    id: 'nasheed-150',
    title: 'أعمارنا أعمالنا',
    artist: 'ماهر زين',
    url: 'https://serv100.albumaty.com/dl/mem/maher-zain/singels/Albumaty.Com.Maher.Zain.A3marona.A3malona.mp3',
    cover: 'https://i1.sndcdn.com/artworks-000110795835-whurr8-t500x500.jpg'
  },
  {
    id: 'nasheed-101',
    title: 'مولاي',
    artist: 'ماهر زين',
    url: 'https://serv100.albumaty.com/dl/mem/maher-zain/singles/Albumaty.Com.Maher.Zain.Mawlaya.mp3',
    cover: 'https://i1.sndcdn.com/artworks-000110795835-whurr8-t500x500.jpg'
  },
  {
    id: 'nasheed-102',
    title: 'بذكر ملهمي',
    artist: 'ماهر زين',
    url: 'https://serv100.albumaty.com/dl/mem/maher-zain/albums/one/10.Bika_Molhmi.mp3',
    cover: 'https://i1.sndcdn.com/artworks-000110795835-whurr8-t500x500.jpg'
  },
  {
    id: 'nasheed-103',
    title: 'تدرون',
    artist: 'ماهر زين',
    url: 'https://serv100.albumaty.com/dl/mem/maher-zain/albums/one/08.Tadroon.mp3',
    cover: 'https://i1.sndcdn.com/artworks-000110795835-whurr8-t500x500.jpg'
  },
  {
    id: 'nasheed-104',
    title: 'جنة',
    artist: 'ماهر زين',
    url: 'https://serv100.albumaty.com/dl/mem/maher-zain/albums/one/06.Jannah.mp3',
    cover: 'https://i1.sndcdn.com/artworks-000110795835-whurr8-t500x500.jpg'
  },
  {
    id: 'nasheed-105',
    title: 'أمتي (Ummati)',
    artist: 'ماهر زين',
    url: 'https://serv100.albumaty.com/dl/mem/maher-zain/albums/one/09.Ummati.mp3',
    cover: 'https://i1.sndcdn.com/artworks-000110795835-whurr8-t500x500.jpg'
  },
  {
    id: 'nasheed-106',
    title: 'بالذكر (Bilzikr)',
    artist: 'ماهر زين',
    url: 'https://serv100.albumaty.com/dl/mem/maher-zain/albums/one/05.Bilzikr.mp3',
    cover: 'https://i1.sndcdn.com/artworks-000110795835-whurr8-t500x500.jpg'
  },
  {
    id: 'nasheed-151',
    title: 'الله يا مولانا',
    artist: 'ماهر زين',
    url: 'https://serv100.albumaty.com/dl/mem/maher-zain/albums/one/02.Allah.Ya.Moulana.mp3',
    cover: 'https://i1.sndcdn.com/artworks-000110795835-whurr8-t500x500.jpg'
  },
  {
    id: 'nasheed-107',
    title: 'الله يناديك',
    artist: 'أناشيد إسلامية',
    url: 'https://serv2.albumaty.com/2025/Albumaty.Com_anashyd_aslamyt_allh_ynadyk_shyra.mp3',
    cover: 'https://images.unsplash.com/photo-1590076202213-90d65b938f31?q=80&w=200&auto=format&fit=crop'
  },
  {
    id: 'nasheed-108',
    title: 'أشواقي',
    artist: 'عبدالله المهداوي',
    url: 'https://serv2.albumaty.com/2025/Albumaty.Com_anashyd_aslamyt_ashwaky_-_abdallh_almhdawy_.mp3',
    cover: 'https://images.unsplash.com/photo-1542810634-71277d95dcbb?q=80&w=200&auto=format&fit=crop'
  },
  {
    id: 'nasheed-109',
    title: 'أحياناً نبحر',
    artist: 'أناشيد',
    url: 'https://abd.albumaty.com/uploads/songs/06--a7yanan_nob7er(samaa_network).mp3',
    cover: 'https://images.unsplash.com/photo-1507615811603-347cf74e1019?q=80&w=200&auto=format&fit=crop'
  },
  {
    id: 'nasheed-110',
    title: 'حياة',
    artist: 'أناشيد',
    url: 'https://abd.albumaty.com/uploads/songs/02--hayah(samaa_network)_174.mp3',
    cover: 'https://images.unsplash.com/photo-1516062423079-7ca13cdc7f5a?q=80&w=200&auto=format&fit=crop'
  },
  {
    id: 'nasheed-111',
    title: 'البردة - مولاي صلي وسلم',
    artist: 'مسعود كرتس',
    url: 'https://abd.albumaty.com/files/mp3/abdwap2.Com_msawd_krts_albrdt_mwlay_sly_wslm.mp3',
    cover: 'https://www.albumaty.com/a/uploads/singers/3784-797.jpg'
  },
  {
    id: 'nasheed-112',
    title: 'بلغ العلى',
    artist: 'مسعود كرتس',
    url: 'https://abd.albumaty.com/files/mp3/abdwap2.Com_msawd_krts_blgh_alala.mp3',
    cover: 'https://www.albumaty.com/a/uploads/singers/3784-797.jpg'
  },
  {
    id: 'nasheed-113',
    title: 'صلى الله على محمد',
    artist: 'مسعود كرتس',
    url: 'https://abd.albumaty.com/files/mp3/abdwap2.Com_msawd_krts_sla_allh_ala_m7md.mp3',
    cover: 'https://www.albumaty.com/a/uploads/singers/3784-797.jpg'
  },
  {
    id: 'nasheed-114',
    title: 'أحمد يا حبيبي',
    artist: 'مسعود كرتس',
    url: 'https://abd.albumaty.com/files/mp3/abdwap2.Com_msawd_krts_a7md_ya_7byby_-_ma_malk_nwr.mp3',
    cover: 'https://www.albumaty.com/a/uploads/singers/3784-797.jpg'
  },
  {
    id: 'nasheed-115',
    title: 'يمم نحو المدينة',
    artist: 'مسعود كرتس',
    url: 'https://abd.albumaty.com/files/mp3/abdwap2.Com_msawd_krts_ymm_n7w_almdynt.mp3',
    cover: 'https://www.albumaty.com/a/uploads/singers/3784-797.jpg'
  },
  {
    id: 'nasheed-116',
    title: 'ل طه أغني',
    artist: 'مسعود كرتس',
    url: 'https://abd.albumaty.com/files/mp3/abdwap2.Com_msawd_krts_l6h_aghny.mp3',
    cover: 'https://www.albumaty.com/a/uploads/singers/3784-797.jpg'
  },
  {
    id: 'nasheed-117',
    title: 'محمداً',
    artist: 'مسعود كرتس',
    url: 'https://abd.albumaty.com/files/mp3/abdwap2.Com_msawd_krts_m7mda.mp3',
    cover: 'https://www.albumaty.com/a/uploads/singers/3784-797.jpg'
  },
  {
    id: 'nasheed-118',
    title: 'يا من يرى',
    artist: 'مسعود كرتس',
    url: 'https://abd.albumaty.com/uploads/songs/abdwap2.com_631558.mp3',
    cover: 'https://www.albumaty.com/a/uploads/singers/3784-797.jpg'
  },
  {
    id: 'nasheed-119',
    title: 'أنت رحماني',
    artist: 'مسعود كرتس',
    url: 'https://abd.albumaty.com/uploads/songs/01y49cg.mp3',
    cover: 'https://www.albumaty.com/a/uploads/singers/3784-797.jpg'
  },
  {
    id: 'nasheed-120',
    title: 'عليك',
    artist: 'مسعود كرتس',
    url: 'https://abd.albumaty.com/uploads/songs/msawd_krts_alyk.mp3',
    cover: 'https://www.albumaty.com/a/uploads/singers/3784-797.jpg'
  },
  {
    id: 'nasheed-121',
    title: 'يا الله',
    artist: 'مسعود كرتس',
    url: 'https://abd.albumaty.com/uploads/songs/msawd_krts_ya_allh_841.mp3',
    cover: 'https://www.albumaty.com/a/uploads/singers/3784-797.jpg'
  },
  {
    id: 'nasheed-136',
    title: 'نور بعبادتنا',
    artist: 'عبد القادر قوزع',
    url: 'https://download.assabile.com/mp3/nasheed/mp3s/abdulqader-qawza/abdulqader-qawza-223.mp3',
    cover: 'https://ar.assabile.com/media/person/200x256/abdulqader-qawza.png'
  },
  {
    id: 'nasheed-137',
    title: 'صلوا على أحمد',
    artist: 'عبد القادر قوزع',
    url: 'https://download.assabile.com/mp3/nasheed/mp3s/abdulqader-qawza/abdulqader-qawza-211.mp3',
    cover: 'https://ar.assabile.com/media/person/200x256/abdulqader-qawza.png'
  },
  {
    id: 'nasheed-138',
    title: 'يا رب (يا من يرى)',
    artist: 'عبد القادر قوزع',
    url: 'https://download.assabile.com/mp3/nasheed/mp3s/abdulqader-qawza/abdulqader-qawza-216.mp3',
    cover: 'https://ar.assabile.com/media/person/200x256/abdulqader-qawza.png'
  },
  {
    id: 'nasheed-139',
    title: 'يا رسول الله',
    artist: 'عبد القادر قوزع',
    url: 'https://download.assabile.com/mp3/nasheed/mp3s/abdulqader-qawza/abdulqader-qawza-209.mp3',
    cover: 'https://ar.assabile.com/media/person/200x256/abdulqader-qawza.png'
  },
  {
    id: 'nasheed-140',
    title: 'يا سر الهوى',
    artist: 'عبد القادر قوزع',
    url: 'https://download.assabile.com/mp3/nasheed/mp3s/abdulqader-qawza/abdulqader-qawza-224.mp3',
    cover: 'https://ar.assabile.com/media/person/200x256/abdulqader-qawza.png'
  },
  {
    id: 'nasheed-141',
    title: 'قف بالخضوع',
    artist: 'عبد القادر قوزع',
    url: 'https://download.assabile.com/mp3/nasheed/mp3s/abdulqader-qawza/abdulqader-qawza-208.mp3',
    cover: 'https://ar.assabile.com/media/person/200x256/abdulqader-qawza.png'
  },
  {
    id: 'nasheed-142',
    title: 'نور عيني',
    artist: 'عبد القادر قوزع',
    url: 'https://download.assabile.com/mp3/nasheed/mp3s/abdulqader-qawza/abdulqader-qawza-212.mp3',
    cover: 'https://ar.assabile.com/media/person/200x256/abdulqader-qawza.png'
  },
  {
    id: 'nasheed-143',
    title: 'إلهي',
    artist: 'عبد القادر قوزع',
    url: 'https://download.assabile.com/mp3/nasheed/mp3s/abdulqader-qawza/abdulqader-qawza-214.mp3',
    cover: 'https://ar.assabile.com/media/person/200x256/abdulqader-qawza.png'
  },
  {
    id: 'nasheed-144',
    title: 'لبيك',
    artist: 'عبد القادر قوزع',
    url: 'https://download.assabile.com/mp3/nasheed/mp3s/abdulqader-qawza/abdulqader-qawza-213.mp3',
    cover: 'https://ar.assabile.com/media/person/200x256/abdulqader-qawza.png'
  },
  {
    id: 'nasheed-145',
    title: 'قمري',
    artist: 'عبد القادر قوزع',
    url: 'https://download.assabile.com/mp3/nasheed/mp3s/abdulqader-qawza/abdulqader-qawza-218.mp3',
    cover: 'https://ar.assabile.com/media/person/200x256/abdulqader-qawza.png'
  },
  {
    id: 'nasheed-146',
    title: 'فداك',
    artist: 'عبد القادر قوزع',
    url: 'https://download.assabile.com/mp3/nasheed/mp3s/abdulqader-qawza/abdulqader-qawza-217.mp3',
    cover: 'https://ar.assabile.com/media/person/200x256/abdulqader-qawza.png'
  },
  {
    id: 'nasheed-147',
    title: 'يا من تحب',
    artist: 'عبد القادر قوزع',
    url: 'https://download.assabile.com/mp3/nasheed/mp3s/abdulqader-qawza/abdulqader-qawza-210.mp3',
    cover: 'https://ar.assabile.com/media/person/200x256/abdulqader-qawza.png'
  },
  {
    id: 'nasheed-150',
    title: 'حبيب الله',
    artist: 'عبد القادر قوزع',
    url: 'https://samaanetwork.net/Artists.2026/Abdulqader.Qawza/Habib.Allah(Samaa.Network).mp3',
    cover: 'https://play.samaanetwork.net/wp-content/uploads/edd/2026/05/habibAllahS.jpeg'
  },
  {
    id: 'nasheed-151',
    title: 'لا ريب فيه',
    artist: 'عبد القادر قوزع',
    url: 'https://server3.samaanetwork.net/05-May/La.Raiba.Feeh(Samaa.Network).mp3',
    cover: 'https://play.samaanetwork.net/wp-content/uploads/edd/2017/05/LaRaibaFeeh.jpg'
  },
  {
    id: 'nasheed-153',
    title: 'الله الله',
    artist: 'عبد القادر قوزع',
    url: 'https://server2.samaanetwork.net/for.shabab1(Percussion)/07--Allah-Allah(Samaa.Network).mp3',
    cover: 'https://play.samaanetwork.net/wp-content/uploads/edd/2016/10/4shabab.jpg'
  },
  {
    id: 'nasheed-154',
    title: 'نحمده الله',
    artist: 'عبد القادر قوزع',
    url: '/api/soundcloud-stream?url=https://soundcloud.com/qawza/nahmadu-allah',
    cover: 'https://i1.sndcdn.com/avatars-000084135253-ubagwx-t500x500.jpg'
  },
  {
    id: 'nasheed-155',
    title: 'ويبقى النور',
    artist: 'عبد القادر قوزع',
    url: '/api/soundcloud-stream?url=https://soundcloud.com/qawza/wayabqa-alnoor',
    cover: 'https://i1.sndcdn.com/artworks-czzxAqjDzjDpUZra-2n4I2g-t500x500.jpg'
  },
  {
    id: 'nasheed-148',
    title: 'هو الحب',
    artist: 'عبد الرحمن الخضر',
    url: 'https://www.ashefaa.com/enshad/files/monaw3at/%D8%B9%D8%A8%D8%AF-%D8%A7%D9%84%D8%B1%D8%AD%D9%85%D9%86-%D8%A7%D9%84%D8%AE%D8%B6%D8%B1-%D9%87%D9%88-%D8%A7%D9%84%D8%AD%D8%A8.mp3',
    cover: 'https://www.ashefaa.com/enshad/Sound-images/new1.jpg'
  },
  {
    id: 'nasheed-149',
    title: 'روحي فداك',
    artist: 'منوعات إيمانية',
    url: 'https://dl.nghmaty.com/s3/324K35UI.mp3',
    cover: 'https://www.albumaty.com/n/uploads/albums//4351-16.jpg'
  },
  {
    id: 'nasheed-152',
    title: 'السلام عليك',
    artist: 'ماهر زين',
    url: 'https://serv100.albumaty.com/dl/mem/maher-zain/singles/Albumaty.Com.Maher.Zain.Assalamu.Alayka.mp3',
    cover: 'https://i1.sndcdn.com/artworks-000110795835-whurr8-t500x500.jpg'
  },
  {
    id: 'nasheed-153',
    title: 'أنشودة إيمانية 1',
    artist: 'منوعات إيمانية',
    url: 'https://dl.nghmaty.com/s3/93sx84t2.mp3',
    cover: 'https://www.albumaty.com/n/uploads/albums//4351-16.jpg'
  },
  {
    id: 'nasheed-154',
    title: 'أنشودة إيمانية 2',
    artist: 'منوعات إيمانية',
    url: 'https://dl.nghmaty.com/s3/50v282Rn.mp3',
    cover: 'https://www.albumaty.com/n/uploads/albums//4351-16.jpg'
  },
  {
    id: 'nasheed-155',
    title: 'أنشودة إيمانية 3',
    artist: 'منوعات إيمانية',
    url: 'https://dl.nghmaty.com/s3/38Lj88GX.mp3',
    cover: 'https://www.albumaty.com/n/uploads/albums//4351-16.jpg'
  },
  {
    id: 'nasheed-156',
    title: 'أنشودة إيمانية 4',
    artist: 'منوعات إيمانية',
    url: 'https://dl.nghmaty.com/s3/55Zl39Wn.mp3',
    cover: 'https://www.albumaty.com/n/uploads/albums//4351-16.jpg'
  },
  {
    id: 'nasheed-157',
    title: 'أنشودة إيمانية 5',
    artist: 'منوعات إيمانية',
    url: 'https://dl.nghmaty.com/s3/94Xe13vn.mp3',
    cover: 'https://www.albumaty.com/n/uploads/albums//4351-16.jpg'
  },
  {
    id: 'nasheed-158',
    title: 'أنت (الحجاب)',
    artist: 'مسعود كرتس',
    url: 'https://dl.nghmaty.com/serv9/songs/Nghmaty.CoM_msawd_krts_ant_(_al7gab_).mp3',
    cover: 'https://www.albumaty.com/a/uploads/singers/3784-797.jpg'
  },
  {
    id: 'nasheed-159',
    title: 'أنشودة إيمانية 6',
    artist: 'منوعات إيمانية',
    url: 'https://dl.nghmaty.com/s3/79pH18Zt.mp3',
    cover: 'https://www.albumaty.com/n/uploads/albums//4351-16.jpg'
  },
  {
    id: 'nasheed-160',
    title: 'يا الله - النسخة الثانية',
    artist: 'مسعود كرتس',
    url: 'https://dl.nghmaty.com/serv9/songs/Nghmaty.CoM_msawd_krts_ya_allh.mp3',
    cover: 'https://www.albumaty.com/a/uploads/singers/3784-797.jpg'
  },
  {
    id: 'nasheed-161',
    title: 'Ya Nabi',
    artist: 'سامي يوسف',
    url: 'https://abd.albumaty.com/uploads/songs/SamiYusuf/2016%20-%20Barakah%20(Deluxe%20Edition)/05.%20Ya%20Nabi.mp3',
    cover: 'https://i1.sndcdn.com/artworks-000009906912-548wa5-t500x500.jpg'
  },
  {
    id: 'nasheed-162',
    title: 'Ya Hayyu Ya Qayyum',
    artist: 'سامي يوسف',
    url: 'https://abd.albumaty.com/uploads/songs/SamiYusuf/2016%20-%20Barakah%20(Deluxe%20Edition)/11.%20Ya%20Hayyu%20Ya%20Qayyum.mp3',
    cover: 'https://i1.sndcdn.com/artworks-000009906912-548wa5-t500x500.jpg'
  },
  {
    id: 'nasheed-163',
    title: 'Come See',
    artist: 'سامي يوسف',
    url: 'https://abd.albumaty.com/uploads/songs/SamiYusuf/2016%20-%20Barakah%20(Deluxe%20Edition)/06.%20Come%20See.mp3',
    cover: 'https://i1.sndcdn.com/artworks-000009906912-548wa5-t500x500.jpg'
  },
  {
    id: 'nasheed-164',
    title: 'Fiyyashiyya',
    artist: 'سامي يوسف',
    url: 'https://abd.albumaty.com/uploads/songs/SamiYusuf/2016%20-%20Barakah%20(Deluxe%20Edition)/04.%20Fiyyashiyya.mp3',
    cover: 'https://i1.sndcdn.com/artworks-000009906912-548wa5-t500x500.jpg'
  },
  {
    id: 'nasheed-165',
    title: 'Ya Rasul Allah, Pt. 2',
    artist: 'سامي يوسف',
    url: 'https://abd.albumaty.com/uploads/songs/SamiYusuf/2016%20-%20Barakah%20(Deluxe%20Edition)/03.%20Ya%20Rasul%20Allah,%20Pt.%202.mp3',
    cover: 'https://i1.sndcdn.com/artworks-000009906912-548wa5-t500x500.jpg'
  },
  {
    id: 'nasheed-166',
    title: 'Taha',
    artist: 'سامي يوسف',
    url: 'https://abd.albumaty.com/uploads/songs/SamiYusuf/2016%20-%20Barakah%20(Deluxe%20Edition)/10.%20Taha.mp3',
    cover: 'https://i1.sndcdn.com/artworks-000009906912-548wa5-t500x500.jpg'
  },
  {
    id: 'nasheed-167',
    title: 'Lovers',
    artist: 'سامي يوسف',
    url: 'https://abd.albumaty.com/uploads/songs/SamiYusuf/2016%20-%20Barakah%20(Deluxe%20Edition)/09.%20Lovers.mp3',
    cover: 'https://i1.sndcdn.com/artworks-000009906912-548wa5-t500x500.jpg'
  },
  {
    id: 'nasheed-168',
    title: 'I Only Knew Love',
    artist: 'سامي يوسف',
    url: 'https://abd.albumaty.com/uploads/songs/SamiYusuf/2016%20-%20Barakah%20(Deluxe%20Edition)/08.%20I%20Only%20Knew%20Love.mp3',
    cover: 'https://i1.sndcdn.com/artworks-000009906912-548wa5-t500x500.jpg'
  },
  {
    id: 'nasheed-169',
    title: 'Awake',
    artist: 'سامي يوسف',
    url: 'https://abd.albumaty.com/uploads/songs/SamiYusuf/2016%20-%20Barakah%20(Deluxe%20Edition)/01.%20Awake.mp3',
    cover: 'https://i1.sndcdn.com/artworks-000009906912-548wa5-t500x500.jpg'
  },
  {
    id: 'nasheed-170',
    title: 'Mast Qalandar',
    artist: 'سامي يوسف',
    url: 'https://abd.albumaty.com/uploads/songs/SamiYusuf/2016%20-%20Barakah%20(Deluxe%20Edition)/07.%20Mast%20Qalandar.mp3',
    cover: 'https://i1.sndcdn.com/artworks-000009906912-548wa5-t500x500.jpg'
  },
  {
    id: 'nasheed-171',
    title: 'Jaaneh Jaanaan',
    artist: 'سامي يوسف',
    url: 'https://abd.albumaty.com/uploads/songs/SamiYusuf/2014%20-%20The%20Centre/04.%20Jaaneh%20Jaanaan.mp3',
    cover: 'https://i1.sndcdn.com/artworks-000009906912-548wa5-t500x500.jpg'
  },
  {
    id: 'nasheed-172',
    title: 'Circle',
    artist: 'سامي يوسف',
    url: 'https://abd.albumaty.com/uploads/songs/SamiYusuf/2014%20-%20The%20Centre/01.%20Circle.mp3',
    cover: 'https://i1.sndcdn.com/artworks-000009906912-548wa5-t500x500.jpg'
  },
  {
    id: 'nasheed-173',
    title: 'Khorasan (Arabic Version)',
    artist: 'سامي يوسف',
    url: 'https://abd.albumaty.com/uploads/songs/SamiYusuf/2014%20-%20The%20Centre/05.%20Khorasan%20(Arabic%20Version)%20[Bonus%20Track].mp3',
    cover: 'https://i1.sndcdn.com/artworks-000009906912-548wa5-t500x500.jpg'
  },
  {
    id: 'nasheed-174',
    title: 'Prism',
    artist: 'سامي يوسف',
    url: 'https://abd.albumaty.com/uploads/songs/SamiYusuf/2014%20-%20The%20Centre/09.%20Prism.mp3',
    cover: 'https://i1.sndcdn.com/artworks-000009906912-548wa5-t500x500.jpg'
  },
  {
    id: 'nasheed-175',
    title: 'Pearl',
    artist: 'سامي يوسف',
    url: 'https://abd.albumaty.com/uploads/songs/SamiYusuf/2014%20-%20The%20Centre/08.%20Pearl.mp3',
    cover: 'https://i1.sndcdn.com/artworks-000009906912-548wa5-t500x500.jpg'
  },
  {
    id: 'nasheed-176',
    title: 'Wherever you are (Arabic)',
    artist: 'سامي يوسف',
    url: 'https://abd.albumaty.com/uploads/songs/SamiYusuf/2012%20-%20Saalam/13.%20Wherever%20you%20are%20[Acoustic%20-%20Arabic]%20[Bonus].mp3',
    cover: 'https://i1.sndcdn.com/artworks-000009906912-548wa5-t500x500.jpg'
  },
  {
    id: 'nasheed-177',
    title: 'Happiness',
    artist: 'سامي يوسف',
    url: 'https://abd.albumaty.com/uploads/songs/SamiYusuf/2012%20-%20Saalam/01.%20Happiness.mp3',
    cover: 'https://i1.sndcdn.com/artworks-000009906912-548wa5-t500x500.jpg'
  },
  {
    id: 'nasheed-178',
    title: 'Forgotten promises',
    artist: 'سامي يوسف',
    url: 'https://abd.albumaty.com/uploads/songs/SamiYusuf/2012%20-%20Saalam/08.%20Forgotten%20promises.mp3',
    cover: 'https://i1.sndcdn.com/artworks-000009906912-548wa5-t500x500.jpg'
  },
  {
    id: 'nasheed-179',
    title: 'Hear your call',
    artist: 'سامي يوسف',
    url: 'https://abd.albumaty.com/uploads/songs/SamiYusuf/2012%20-%20Saalam/12.%20Hear%20your%20call.mp3',
    cover: 'https://i1.sndcdn.com/artworks-000009906912-548wa5-t500x500.jpg'
  },
  {
    id: 'nasheed-180',
    title: 'Wherever You Are (Farsi)',
    artist: 'سامي يوسف',
    url: 'https://abd.albumaty.com/uploads/songs/SamiYusuf/2012%20-%20Saalam/17.%20Wherever%20You%20Are%20(Acoustic%20Farsi%20Version).mp3',
    cover: 'https://i1.sndcdn.com/artworks-000009906912-548wa5-t500x500.jpg'
  },
  {
    id: 'nasheed-181',
    title: 'Salaam',
    artist: 'سامي يوسف',
    url: 'https://abd.albumaty.com/uploads/songs/SamiYusuf/2012%20-%20Saalam/02.%20Salaam.mp3',
    cover: 'https://i1.sndcdn.com/artworks-000009906912-548wa5-t500x500.jpg'
  },
  {
    id: 'nasheed-182',
    title: 'Allahu',
    artist: 'سامي يوسف',
    url: 'https://abd.albumaty.com/uploads/songs/SamiYusuf/2003%20-%20Al-Mu\'Allim/03.%20Allahu.mp3',
    cover: 'https://i1.sndcdn.com/artworks-000009906912-548wa5-t500x500.jpg'
  },
  {
    id: 'nasheed-183',
    title: 'O Allah',
    artist: 'سامي يوسف و مسعود كرتس',
    url: 'https://abd.albumaty.com/uploads/songs/SamiYusuf/2003%20-%20Al-Mu\'Allim/10.%20Mesut%20Kurtis%20feat.%20Sami%20Yusuf%20-%20O%20Allah%20(Bonus).mp3',
    cover: 'https://i1.sndcdn.com/artworks-000009906912-548wa5-t500x500.jpg'
  },
  {
    id: 'nasheed-184',
    title: 'Ya Mustafa',
    artist: 'سامي يوسف',
    url: 'https://abd.albumaty.com/uploads/songs/SamiYusuf/2003%20-%20Al-Mu\'Allim/05.%20Ya%20Mustafa.mp3',
    cover: 'https://i1.sndcdn.com/artworks-000009906912-548wa5-t500x500.jpg'
  },
  {
    id: 'nasheed-185',
    title: 'أنشودة',
    artist: 'سامي يوسف',
    url: 'https://abd.albumaty.com/uploads/songs/abdwap2.com_18422.mp3',
    cover: 'https://i1.sndcdn.com/artworks-000009906912-548wa5-t500x500.jpg'
  },
  {
    id: 'nasheed-186',
    title: 'يا من يرى ما في الضمير ويسمع',
    artist: 'عادل القاسمي',
    url: 'https://download.assabile.com/mp3/nasheed/mp3s/adil-al-kassimi/adil-al-kassimi-738.mp3',
    cover: 'https://ar.assabile.com/media/person/200x256/adil-al-kassimi.png'
  },
  {
    id: 'nasheed-187',
    title: 'غريب',
    artist: 'عادل القاسمي',
    url: 'https://download.assabile.com/mp3/nasheed/mp3s/adil-al-kassimi/adil-al-kassimi-740.mp3',
    cover: 'https://ar.assabile.com/media/person/200x256/adil-al-kassimi.png'
  },
  {
    id: 'nasheed-188',
    title: 'يا نفس توبي',
    artist: 'عادل القاسمي',
    url: 'https://download.assabile.com/mp3/nasheed/mp3s/adil-al-kassimi/adil-al-kassimi-741.mp3',
    cover: 'https://ar.assabile.com/media/person/200x256/adil-al-kassimi.png'
  },
  {
    id: 'nasheed-189',
    title: 'بك أستجير',
    artist: 'عادل القاسمي',
    url: 'https://download.assabile.com/mp3/nasheed/mp3s/adil-al-kassimi/adil-al-kassimi-745.mp3',
    cover: 'https://ar.assabile.com/media/person/200x256/adil-al-kassimi.png'
  },
  {
    id: 'nasheed-190',
    title: 'إلهي وجئتك',
    artist: 'عادل القاسمي',
    url: 'https://download.assabile.com/mp3/nasheed/mp3s/adil-al-kassimi/adil-al-kassimi-746.mp3',
    cover: 'https://ar.assabile.com/media/person/200x256/adil-al-kassimi.png'
  },
  {
    id: 'nasheed-191',
    title: 'يا رجائي',
    artist: 'عادل القاسمي',
    url: 'https://download.assabile.com/mp3/nasheed/mp3s/adil-al-kassimi/adil-al-kassimi-749.mp3',
    cover: 'https://ar.assabile.com/media/person/200x256/adil-al-kassimi.png'
  },
  {
    id: 'nasheed-192',
    title: 'أمي',
    artist: 'عادل القاسمي',
    url: 'https://download.assabile.com/mp3/nasheed/mp3s/adil-al-kassimi/adil-al-kassimi-750.mp3',
    cover: 'https://ar.assabile.com/media/person/200x256/adil-al-kassimi.png'
  },
  {
    id: 'nasheed-193',
    title: 'رحمن يا رحمن',
    artist: 'عادل القاسمي',
    url: 'https://download.assabile.com/mp3/nasheed/mp3s/adil-al-kassimi/adil-al-kassimi-751.mp3',
    cover: 'https://ar.assabile.com/media/person/200x256/adil-al-kassimi.png'
  },
  {
    id: 'nasheed-194',
    title: 'ليس الغريب',
    artist: 'عادل القاسمي',
    url: 'https://download.assabile.com/mp3/nasheed/mp3s/adil-al-kassimi/adil-al-kassimi-752.mp3',
    cover: 'https://ar.assabile.com/media/person/200x256/adil-al-kassimi.png'
  },
  {
    id: 'nasheed-195',
    title: 'سأقبل يا خالقي من جديد',
    artist: 'عادل القاسمي',
    url: 'https://download.assabile.com/mp3/nasheed/mp3s/adil-al-kassimi/adil-al-kassimi-753.mp3',
    cover: 'https://ar.assabile.com/media/person/200x256/adil-al-kassimi.png'
  },
  {
    id: 'nasheed-196',
    title: 'فرشي التراب',
    artist: 'عادل القاسمي',
    url: 'https://download.assabile.com/mp3/nasheed/mp3s/adil-al-kassimi/adil-al-kassimi-755.mp3',
    cover: 'https://ar.assabile.com/media/person/200x256/adil-al-kassimi.png'
  },
  {
    id: 'nasheed-197',
    title: 'يا حمام المدينة سلم على نبينا',
    artist: 'نور الدين خورشيد',
    url: '/api/soundcloud-stream?url=https://soundcloud.com/jamal-merrouna/a7dvm4blt77n',
    cover: 'https://i1.sndcdn.com/artworks-000033933424-sbm2ym-t500x500.jpg'
  },
  {
    id: 'nasheed-198',
    title: 'سلام الله للهادي',
    artist: 'ترانيم',
    url: '/api/soundcloud-stream?url=https://soundcloud.com/taraneem/n0yerv90upqf',
    cover: 'https://i1.sndcdn.com/artworks-000082763535-898ucc-t500x500.jpg'
  },
  {
    id: 'nasheed-199',
    title: 'صل يا ربنا',
    artist: 'فرقة اليرموك الفنية',
    url: '/api/soundcloud-stream?url=https://soundcloud.com/fahd-asem/mp3-1',
    cover: 'https://i1.sndcdn.com/avatars-N32u5VQi7CcYmCCb-dD7beQ-t500x500.jpg'
  },
  {
    id: 'nasheed-200',
    title: 'يا عالي الشان صلِ',
    artist: 'فرقة اليرموك الفنية',
    url: '/api/soundcloud-stream?url=https://soundcloud.com/fahd-asem/mp3',
    cover: 'https://i1.sndcdn.com/avatars-N32u5VQi7CcYmCCb-dD7beQ-t500x500.jpg'
  },
  {
    id: 'nasheed-201',
    title: 'الصلاة على النبي',
    artist: 'فرقة اليرموك الفنية',
    url: '/api/soundcloud-stream?url=https://soundcloud.com/fahd-asem/mp3-4',
    cover: 'https://i1.sndcdn.com/avatars-N32u5VQi7CcYmCCb-dD7beQ-t500x500.jpg'
  },
  {
    id: 'nasheed-202',
    title: 'رب صل على النبي',
    artist: 'فرقة اليرموك الفنية',
    url: '/api/soundcloud-stream?url=https://soundcloud.com/fahd-asem/mp3-2',
    cover: 'https://i1.sndcdn.com/avatars-N32u5VQi7CcYmCCb-dD7beQ-t500x500.jpg'
  },
  {
    id: 'nasheed-203',
    title: 'الأقصى بيجري بدمي',
    artist: 'كفاح زريقي',
    url: '/api/soundcloud-stream?url=https://soundcloud.com/khalid-omar-al-bardawil/s5zqawrkroib',
    cover: 'https://i1.sndcdn.com/artworks-000090265401-w9de93-t500x500.jpg'
  },
  {
    id: 'nasheed-204',
    title: 'حيهم شباب القدس',
    artist: 'عبد الفتاح عوينات',
    url: '/api/soundcloud-stream?url=https://soundcloud.com/nesmamohammad/mnfia2u8gfw4',
    cover: 'https://i1.sndcdn.com/artworks-V68yYNbl55AyXjzB-diwtbA-t500x500.jpg'
  },
  {
    id: 'nasheed-205',
    title: 'سلم عليها',
    artist: 'عبد الفتاح عوينات',
    url: '/api/soundcloud-stream?url=https://soundcloud.com/laith-al-ramahi/y2utzlmsnd3g',
    cover: 'https://i1.sndcdn.com/artworks-000130959045-9vq3dq-t500x500.jpg'
  },
  {
    id: 'nasheed-206',
    title: 'روائع كروان المديح',
    artist: 'علي أبوالدهب الأسواني',
    url: '/api/soundcloud-stream?url=https://soundcloud.com/ahmed-esmael-369598319/m4a_128',
    cover: 'https://i1.sndcdn.com/avatars-Gvqkic6imIThz7aC-0d2Fug-t500x500.jpg'
  },
  {
    id: 'nasheed-207',
    title: 'رحماك إلهي',
    artist: 'بلابل الإيمان - سليم الوادعي',
    url: '/api/soundcloud-stream?url=https://soundcloud.com/saleemwadei/6ut25ivehkp9',
    cover: 'https://i1.sndcdn.com/artworks-gIn4ygGhGDxENJxY-3Mjufg-t500x500.jpg'
  },
  {
    id: 'nasheed-208',
    title: 'ألف صلى الله',
    artist: 'ألبوم عابر سبيل',
    url: '/api/soundcloud-stream?url=https://soundcloud.com/xda-3arabi-xda/aber-sabail-alf-sal-mp3',
    cover: 'https://i1.sndcdn.com/artworks-000285030329-uymngk-t500x500.jpg'
  },
  {
    id: 'nasheed-209',
    title: 'اصنع المعروف',
    artist: 'ألبوم عابر سبيل',
    url: '/api/soundcloud-stream?url=https://soundcloud.com/xda-3arabi-xda/aber-sabail-esnaa-e-mp3',
    cover: 'https://i1.sndcdn.com/artworks-000285033185-dx1aax-t500x500.jpg'
  },
  {
    id: 'nasheed-210',
    title: 'لا يعرف الحلو',
    artist: 'ألبوم عابر سبيل',
    url: '/api/soundcloud-stream?url=https://soundcloud.com/xda-3arabi-xda/aber-sabail-la-yare-mp3',
    cover: 'https://i1.sndcdn.com/artworks-000285032537-1k3kdf-t500x500.jpg'
  },
  {
    id: 'nasheed-211',
    title: 'يا إلهي تولنا',
    artist: 'ألبوم عابر سبيل',
    url: '/api/soundcloud-stream?url=https://soundcloud.com/xda-3arabi-xda/aber-sabail-ya-elah-mp3',
    cover: 'https://i1.sndcdn.com/artworks-000285033110-6jq57x-t500x500.jpg'
  },
  {
    id: 'nasheed-212',
    title: 'يا خفي اللطف',
    artist: 'ألبوم عابر سبيل',
    url: '/api/soundcloud-stream?url=https://soundcloud.com/xda-3arabi-xda/aber-sabail-ya-khafi-mp3',
    cover: 'https://i1.sndcdn.com/artworks-000285032849-3nj7mi-t500x500.jpg'
  },
  {
    id: 'nasheed-213',
    title: 'يا تواب',
    artist: 'ألبوم عابر سبيل',
    url: '/api/soundcloud-stream?url=https://soundcloud.com/xda-3arabi-xda/aber-sabail-ya-towab-ye-mp3',
    cover: 'https://i1.sndcdn.com/artworks-000285032717-dwqbuc-t500x500.jpg'
  },
  {
    id: 'nasheed-214',
    title: 'هزتني نسمات الليالي',
    artist: 'أداء عذب',
    url: '/api/soundcloud-stream?url=https://soundcloud.com/abderrahim-mesttileire/fscgnfqoi9lv',
    cover: 'https://i1.sndcdn.com/avatars-000079795028-w032wx-t500x500.jpg'
  },
  {
    id: 'nasheed-215',
    title: 'أخبارنا أستاذي يوماً',
    artist: 'يحيى حوى',
    url: '/api/soundcloud-stream?url=https://soundcloud.com/dodo_soliman/ckdi96hrevgh',
    cover: 'https://i1.sndcdn.com/artworks-000058926519-h2kq04-t500x500.jpg'
  }
];
