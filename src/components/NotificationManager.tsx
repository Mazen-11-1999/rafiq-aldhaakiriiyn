import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bell, BellOff, X } from 'lucide-react';
import { PrayerService } from '../services/prayerService';
import PrayerAlarmOverlay from './PrayerAlarmOverlay';

interface NotificationManagerProps {
  enabled: boolean;
  prayerEnabled?: boolean;
  coords: { lat: number, lng: number } | null;
  userProfile: any;
}

export default function NotificationManager({ enabled, prayerEnabled = false, coords, userProfile }: NotificationManagerProps) {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [showPrompt, setShowPrompt] = useState(false);
  const [alarmData, setAlarmData] = useState<{ name: string, message: string } | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setPermission(Notification.permission);
      if (Notification.permission === 'default' && enabled) {
        const timer = setTimeout(() => setShowPrompt(true), 5000);
        return () => clearTimeout(timer);
      }
    }
  }, [enabled]);

  const requestPermission = async () => {
    if ('Notification' in window) {
      const result = await Notification.requestPermission();
      setPermission(result);
      setShowPrompt(false);
      
      if (result === 'granted') {
        new Notification('تم تفعيل التنبيهات', {
          body: 'ستصلك تذكيرات أذكار الصباح والمساء ومواقيت الصلاة بإذن الله.',
          icon: '/compass.png'
        });
      }
    }
  };

  useEffect(() => {
    const handleTestAlarm = () => {
      setAlarmData({
        name: "الفجر (تجريبي)",
        message: PrayerService.getPrayerMessage('fajr')
      });
    };

    window.addEventListener('test-prayer-alarm', handleTestAlarm);
    return () => window.removeEventListener('test-prayer-alarm', handleTestAlarm);
  }, [userProfile]);

  useEffect(() => {
    if (!enabled) return;

    const checkNotifications = () => {
      const now = new Date();
      
      // Standard Reminders
      const optionsStr: Intl.DateTimeFormatOptions = {
        timeZone: 'Asia/Aden',
        hour: 'numeric', minute: 'numeric', hour12: false
      };
      const yemenTimeStr = new Intl.DateTimeFormat('en-US', optionsStr).format(now);
      const [hour, minute] = yemenTimeStr.split(':').map(Number);

      if (permission === 'granted') {
        // Morning Adhkar: 6:00 AM
        if (hour === 6 && minute >= 0 && minute <= 5) {
          showLocalNotification('أذكار الصباح', 'حان وقت أذكار الصباح.. "ألا بذكر الله تطمئن القلوب"');
        }

        // Daily Inspiration: 10:00 AM
        if (hour === 10 && minute >= 0 && minute <= 5) {
          showLocalNotification('إلهام اليوم', 'لديك رسالة قلبية جديدة في سند.. تفقدها الآن');
        }

        // Evening Adhkar: 5:00 PM (17:00)
        if (hour === 17 && minute >= 0 && minute <= 5) {
          showLocalNotification('أذكار المساء', 'حان وقت أذكار المساء.. "فاذكروني أذكركم"');
        }
      }

      // Prayer Times (If enabled and coordinates exist)
      if (prayerEnabled && coords) {
        const prayers = PrayerService.getPrayerTimes(coords.lat, coords.lng);
        const prayerKeys = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];
        
        prayerKeys.forEach(key => {
          const prayerTime = (prayers as any)[key];
          if (prayerTime) {
            const diff = Math.abs(now.getTime() - prayerTime.getTime());
            // Trigger if within 30 seconds of the prayer time
            if (diff < 30000) {
              triggerAlarm(key);
            }
          }
        });
      }
    };

    const triggerAlarm = (key: string) => {
      const lastAlarmed = localStorage.getItem(`last_alarm_${key}`);
      const todayString = new Date().toDateString();

      if (lastAlarmed !== todayString) {
        setAlarmData({
          name: PrayerService.getPrayerNameAr(key),
          message: PrayerService.getPrayerMessage(key)
        });
        localStorage.setItem(`last_alarm_${key}`, todayString);
      }
    };

    const showLocalNotification = (title: string, body: string) => {
      const lastNotified = localStorage.getItem(`last_notified_${title}`);
      const todayString = new Date().toDateString();
      
      if (lastNotified !== todayString) {
        if (permission === 'granted') {
          new Notification(title, {
            body,
            icon: '/compass.png',
            tag: title
          });
        }
        localStorage.setItem(`last_notified_${title}`, todayString);
      }
    };

    const interval = setInterval(checkNotifications, 30000); // Check every 30 seconds for accuracy
    return () => clearInterval(interval);
  }, [enabled, permission, prayerEnabled, coords]);

  return (
    <>
      <PrayerAlarmOverlay 
        isOpen={!!alarmData}
        prayerName={alarmData?.name || ''}
        message={alarmData?.message || ''}
        onClose={() => setAlarmData(null)}
        selectedRingtoneId={userProfile?.settings?.notifications.ringtone}
      />
      
      <AnimatePresence>
        {showPrompt && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed bottom-32 left-1/2 -translate-x-1/2 z-[100] w-[90%] max-w-sm"
          >
            <div className="glass-3d p-6 rounded-[30px] border-2 border-[#4e635a]/20 shadow-2xl flex flex-col items-center text-center gap-4">
              <div className="w-16 h-16 bg-[#4e635a]/10 rounded-full flex items-center justify-center text-[#4e635a]">
                <Bell size={32} />
              </div>
              <div>
                <p className="text-xl font-black text-[#1b1c1a] font-serif">تفعيل الإشعارات</p>
                <p className="text-sm text-[#727875] font-bold mt-1">هل تود استقبال تنبيهات أذكار الصباح والمساء ومواقيت الصلاة؟</p>
              </div>
              <div className="flex gap-2 w-full">
                <button 
                  onClick={requestPermission}
                  className="flex-1 bg-[#4e635a] text-white py-3 rounded-2xl font-black text-sm hover:bg-[#3d4d46] transition-colors"
                >
                  تفعيل الآن
                </button>
                <button 
                  onClick={() => setShowPrompt(false)}
                  className="px-6 bg-[#4e635a]/5 text-[#4e635a] py-3 rounded-2xl font-black text-sm hover:bg-[#4e635a]/10 transition-colors"
                >
                  ليس الآن
                </button>
              </div>
              <button 
                onClick={() => setShowPrompt(false)}
                className="absolute top-4 right-4 text-[#727875]"
              >
                <X size={20} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
