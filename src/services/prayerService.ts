
import { Coordinates, CalculationMethod, PrayerTimes, SunnahTimes } from 'adhan';

export interface PrayerTimeData {
  fajr: Date;
  dhuhr: Date;
  asr: Date;
  maghrib: Date;
  isha: Date;
  middleOfTheNight: Date;
  lastThirdOfTheNight: Date;
}

export class PrayerService {
  static getPrayerTimes(lat: number, lng: number): PrayerTimeData {
    const coordinates = new Coordinates(lat, lng);
    const date = new Date();
    const params = CalculationMethod.MuslimWorldLeague(); // Default, can be customized
    
    const prayerTimes = new PrayerTimes(coordinates, date, params);
    const sunnahTimes = new SunnahTimes(prayerTimes);

    return {
      fajr: prayerTimes.fajr,
      dhuhr: prayerTimes.dhuhr,
      asr: prayerTimes.asr,
      maghrib: prayerTimes.maghrib,
      isha: prayerTimes.isha,
      middleOfTheNight: sunnahTimes.middleOfTheNight,
      lastThirdOfTheNight: sunnahTimes.lastThirdOfTheNight
    };
  }

  static getPrayerNameAr(key: string): string {
    const names: Record<string, string> = {
      fajr: 'الفجر',
      dhuhr: 'الظهر',
      asr: 'العصر',
      maghrib: 'المغرب',
      isha: 'العشاء',
      middleOfTheNight: 'منتصف الليل',
      lastThirdOfTheNight: 'الثلث الأخير'
    };
    return names[key] || key;
  }

  static getPrayerMessage(key: string): string {
    const messages: Record<string, string> = {
      fajr: 'قم يا صديقي، الآن حان وقت صلاة الفجر. لا تكن كسولاً.. تقرب إلى ربك، فالصلاة خير من النوم. حافظ على صلواتك كما قال سيدنا النبي.',
      dhuhr: 'والآن حان موعد صلاة الظهر. اترك الدنيا خلفك وأقبل على خالقك.. حافظ على صلواتك كما قال سيدنا النبي.',
      asr: 'والآن حان موعد صلاة العصر. تقرب إلى ربك، وكما قال سيدنا النبي صلى الله عليه وسلم: "من صلى البردين دخل الجنة". حافظ على صلواتك.',
      maghrib: 'حان الآن وقت صلاة المغرب. تقرب إلى ربك وحافظ على صلواتك كما قال سيدنا النبي، فإنها ساعة إجابة.',
      isha: 'والآن حان موعد صلاة العشاء. حافظ على صلواتك، واجعل مسك ختام يومك سجدة لخالقك كما أوصانا نبينا الكريم.',
    };
    return messages[key] || 'حان وقت الصلاة، تقرب إلى ربك وحافظ على صلواتك كما قال سيدنا النبي.';
  }
}
