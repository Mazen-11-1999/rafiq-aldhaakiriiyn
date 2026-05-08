import React, { useState } from 'react';
import { UserProfile, OperationType } from '../types';
import { handleFirestoreError } from '../lib/firestore-errors';
import { auth, db } from '../lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { motion, AnimatePresence } from 'motion/react';
import { User, Mail, Calendar, LogOut, Shield, Bell, Globe, ChevronLeft, HelpCircle, Map, BookOpen, Award, Check, Edit2, Save, X, Music } from 'lucide-react';
import { RINGTONES } from '../constants';
import { cn } from '../lib/utils';
import { NotificationService } from '../services/notificationService';

export default function ProfileView({ userProfile, onTabChange }: { userProfile: UserProfile | null, onTabChange?: (tab: any) => void }) {
  const [isEditingName, setIsEditingName] = useState(false);
  const [newName, setNewName] = useState(userProfile?.displayName || '');
  const [isSaving, setIsSaving] = useState(false);

  const [activeSettingsTab, setActiveSettingsTab] = useState<'none' | 'notifications' | 'privacy' | 'appearance'>('none');

  if (!userProfile) return null;

  const updateSettings = async (newSettings: any) => {
    if (!auth.currentUser) return;
    
    // If enabling notifications, request permission
    if (newSettings.notifications && newSettings.notifications.enabled === true) {
      const granted = await NotificationService.requestPermission();
      if (!granted) {
        // Option: we could show a toast or message that permission was denied
        // But we'll still update the DB preference
      }
    }

    try {
      const userRef = doc(db, 'users', auth.currentUser.uid);
      const settings = userProfile.settings || {
        notifications: { enabled: true, dhikrReminders: true, retreatReminders: true },
        privacy: { publicProfile: false, shareInsights: true },
        appearance: { language: 'ar', dateFormat: 'arabic' }
      };

      const updatedSettings = { ...settings };
      for (const key in newSettings) {
        if (typeof newSettings[key] === 'object' && settings[key as keyof typeof settings]) {
          updatedSettings[key as keyof typeof settings] = {
            ...(settings[key as keyof typeof settings] as any),
            ...newSettings[key]
          };
        } else {
          (updatedSettings as any)[key] = newSettings[key];
        }
      }

      await updateDoc(userRef, {
        settings: updatedSettings
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, 'users/' + auth.currentUser.uid);
    }
  };

  const handleLogout = () => {
    auth.signOut();
  };

  const handleSaveName = async () => {
    if (!newName.trim() || newName === userProfile.displayName) {
      setIsEditingName(false);
      return;
    }

    setIsSaving(true);
    try {
      const userRef = doc(db, 'users', auth.currentUser!.uid);
      await updateDoc(userRef, {
        displayName: newName.trim()
      });
      setIsEditingName(false);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, 'users/' + auth.currentUser!.uid);
    } finally {
      setIsSaving(false);
    }
  };

  const formatDate = (date: any) => {
    if (!date) return '';
    try {
      const d = date.toDate ? date.toDate() : new Date(date);
      const dateFormat = userProfile.settings?.appearance.dateFormat ?? 'arabic';
      
      const options: Intl.DateTimeFormatOptions = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      };

      if (dateFormat === 'arabic') {
        return d.toLocaleDateString('ar-SA-u-ca-islamic-uma', options);
      }
      return d.toLocaleDateString('ar-YE', options);
    } catch (e) {
      return '';
    }
  };

  const getRank = (minutes: number) => {
    if (minutes < 60) return { title: 'مبتدئ', color: 'text-gray-500', bg: 'bg-gray-100' };
    if (minutes < 300) return { title: 'سالك', color: 'text-emerald-500', bg: 'bg-emerald-50' };
    if (minutes < 1000) return { title: 'مريد', color: 'text-blue-500', bg: 'bg-blue-50' };
    if (minutes < 5000) return { title: 'ذاكر', color: 'text-amber-500', bg: 'bg-amber-50' };
    return { title: 'عارف', color: 'text-purple-500', bg: 'bg-purple-50' };
  };

  const rank = getRank(userProfile.totalMinutes);

  return (
    <div className="p-margin-page space-y-section-gap perspective-1000 pb-20">
      <header className="space-y-2">
        <h2 className="text-3xl font-bold text-[#4e635a] font-serif">الملف الشخصي</h2>
        <p className="text-[#424845] font-medium opacity-60">إدارة حسابك وتفضيلاتك في رفيق الذاكرين</p>
      </header>

      {/* User Info Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-3d p-8 rounded-[40px] shadow-2xl relative overflow-hidden group"
      >
        <div className="absolute top-0 right-0 w-48 h-48 bg-[#4e635a]/5 rounded-bl-[120px] -z-10 transition-all group-hover:scale-110" />
        
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="relative group">
            <div className="absolute inset-0 bg-[#4e635a] rounded-[40px] blur-xl opacity-20 group-hover:opacity-40 transition-opacity" />
            <img 
              src={userProfile.photoURL} 
              alt={userProfile.displayName} 
              className="w-32 h-32 rounded-[40px] border-4 border-white shadow-2xl relative z-10 object-cover"
            />
          </div>
          
          <div className="space-y-4 text-center md:text-right flex-grow">
            <div>
              <div className="flex flex-col md:flex-row items-center justify-center md:justify-start gap-3 mb-1">
                {isEditingName ? (
                  <div className="flex items-center gap-2 w-full max-w-sm">
                    <input 
                      type="text" 
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      className="bg-white/50 backdrop-blur-md border-2 border-[#4e635a]/20 rounded-2xl px-4 py-2 text-2xl font-black text-[#1b1c1a] font-serif focus:border-[#4e635a] outline-hidden w-full transition-all"
                      autoFocus
                    />
                    <button 
                      onClick={handleSaveName}
                      disabled={isSaving}
                      className="p-3 bg-[#4e635a] text-white rounded-2xl hover:bg-[#3d4d46] transition-colors disabled:opacity-50"
                    >
                      {isSaving ? <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}><Save size={20} /></motion.div> : <Check size={20} />}
                    </button>
                    <button 
                      onClick={() => setIsEditingName(false)}
                      className="p-3 bg-red-50 text-red-500 rounded-2xl hover:bg-red-100 transition-colors"
                    >
                      <X size={20} />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-3 group/name">
                    <h3 className="text-4xl font-black text-[#1b1c1a] font-serif tracking-tight">{userProfile.displayName}</h3>
                    <button 
                      onClick={() => setIsEditingName(true)}
                      className="p-2 text-[#4e635a] opacity-0 group-hover/name:opacity-100 hover:bg-[#4e635a]/5 rounded-xl transition-all"
                    >
                      <Edit2 size={18} />
                    </button>
                    <span className={cn("px-3 py-1 rounded-full text-xs font-black uppercase tracking-tighter", rank.bg, rank.color)}>
                      {rank.title}
                    </span>
                  </div>
                )}
              </div>
              <p className="text-[#4e635a] font-bold text-lg opacity-80">{userProfile.email}</p>
            </div>
            
            <div className="flex flex-wrap justify-center md:justify-start gap-3">
              <div className="flex items-center gap-2 px-4 py-2 bg-[#4e635a]/5 rounded-2xl text-[#4e635a] font-bold text-sm">
                <Calendar size={16} />
                <span>انضم في: {formatDate(userProfile.createdAt)}</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Quick View */}
      <div className="grid grid-cols-2 gap-gutter">
        <div className="glass-3d p-6 rounded-[35px] text-center space-y-2 shadow-xl">
          <p className="text-4xl font-black text-[#4e635a] font-serif">{userProfile.totalMinutes}</p>
          <p className="text-xs font-black text-[#727875] uppercase tracking-widest">دقيقة سكينة</p>
        </div>
        <div className={cn(
          "glass-3d p-6 rounded-[35px] text-center space-y-2 shadow-xl border-t border-white/60 transition-all",
          userProfile.currentStreak > 0 && "bg-linear-to-br from-white to-orange-50/30 border-orange-200/50"
        )}>
          <p className={cn(
            "text-4xl font-black font-serif transition-all",
            userProfile.currentStreak > 0 ? "text-orange-500 scale-110 drop-shadow-[0_0_10px_rgba(249,115,22,0.2)]" : "text-[#f4dfcb]"
          )}>
            {userProfile.currentStreak}
            {userProfile.currentStreak > 0 && <span className="text-xl ml-1">🔥</span>}
          </p>
          <p className="text-xs font-black text-[#727875] uppercase tracking-widest">يوم متواصل</p>
        </div>
      </div>

      {/* Secondary Features Grid */}
      <div className="space-y-6">
        <h3 className="text-xl font-bold text-[#4e635a] mr-2">المزيد من الأدوات</h3>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          <FeatureCard 
            icon={<HelpCircle size={24} />} 
            label="الاختبارات" 
            description="اختبر معلوماتك" 
            color="bg-amber-50" 
            textColor="text-amber-600"
            onClick={() => onTabChange?.('quiz')}
          />
          <FeatureCard 
            icon={<Map size={24} />} 
            label="المسيرة" 
            description="تاريخ التنقل" 
            color="bg-blue-50" 
            textColor="text-blue-600"
            onClick={() => onTabChange?.('history')}
          />
          <FeatureCard 
            icon={<BookOpen size={24} />} 
            label="المذكرات" 
            description="خواطر إيمانية" 
            color="bg-emerald-50" 
            textColor="text-emerald-600"
            onClick={() => onTabChange?.('journal')}
          />
        </div>
      </div>

      {/* Achievements Section */}
      <div className="space-y-6">
        <h3 className="text-xl font-bold text-[#4e635a] mr-2">محطات الإنجاز</h3>
        <div className="space-y-4">
           <AchievementItemMini 
             title="نور الإقبال"
             description="إتمام أول جلسة وجلائك للقلب"
             achieved={userProfile.totalMinutes > 0}
           />
           <AchievementItemMini 
             title="غيث السكينة"
             description="تجاوز 100 دقيقة من الاتصال الروحي"
             achieved={userProfile.totalMinutes >= 100}
           />
           <AchievementItemMini 
             title="الذاكر الثابت"
             description="الموافقة على ورد يومي لمدة 7 أيام متتالية"
             achieved={userProfile.currentStreak >= 7}
           />
        </div>
      </div>

      {/* Settings Sections */}
      <div className="space-y-6">
        <div className="flex items-center justify-between px-2">
          <h3 className="text-xl font-bold text-[#4e635a]">الإعدادات والتفضيلات</h3>
          {activeSettingsTab !== 'none' && (
            <button 
              onClick={() => setActiveSettingsTab('none')}
              className="text-sm font-bold text-[#4e635a] bg-[#4e635a]/5 px-3 py-1 rounded-full"
            >
              عودة
            </button>
          )}
        </div>
        
        <div className="glass-3d rounded-[40px] p-4 shadow-xl space-y-2 overflow-hidden min-h-[100px]">
          <AnimatePresence mode="wait">
            {activeSettingsTab === 'none' ? (
              <motion.div 
                key="main-settings"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-2"
              >
                <SettingsItem 
                  icon={<Bell size={20} />} 
                  label="الإشعارات والتنبيهات" 
                  description="إدارة التذكير بالذكر والخلوة" 
                  onClick={() => setActiveSettingsTab('notifications')}
                />
                <SettingsItem 
                  icon={<Shield size={20} />} 
                  label="الخصوصية والأمان" 
                  description="إدارة الوصول والبيانات الشخصية" 
                  onClick={() => setActiveSettingsTab('privacy')}
                />
                <SettingsItem 
                  icon={<Globe size={20} />} 
                  label="اللغة والتنسيق" 
                  description="تغيير لغة التطبيق وتنسيق التاريخ" 
                  onClick={() => setActiveSettingsTab('appearance')}
                />
              </motion.div>
            ) : activeSettingsTab === 'notifications' ? (
              <motion.div 
                key="notifications-settings"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="p-4 space-y-4"
              >
                <Toggle 
                  label="تفعيل الإشعارات العامة" 
                  enabled={userProfile.settings?.notifications.enabled ?? true} 
                  onChange={(val: boolean) => updateSettings({ notifications: { enabled: val } })}
                />
                <Toggle 
                  label="تنبيهات أذكار الصباح والمساء" 
                  enabled={userProfile.settings?.notifications.dhikrReminders ?? true} 
                  onChange={(val: boolean) => updateSettings({ notifications: { dhikrReminders: val } })}
                />
                <Toggle 
                  label="تنبيهات مواقيت الصلاة (منبه)" 
                  enabled={userProfile.settings?.notifications.prayerTimes ?? true} 
                  onChange={(val: boolean) => updateSettings({ notifications: { prayerTimes: val } })}
                />
                
                <div className="flex flex-col gap-2 pt-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#4e635a] mb-1">
                    <Music size={14} />
                    <span>نغمة المنبه</span>
                  </div>
                  <select 
                    value={userProfile.settings?.notifications.ringtone || 'official-prayer'}
                    onChange={(e) => updateSettings({ notifications: { ringtone: e.target.value } })}
                    className="w-full bg-white/5 border border-[#4e635a]/20 rounded-xl p-3 text-sm font-bold text-[#1b1c1a] focus:ring-2 focus:ring-[#4e635a]/50 outline-none appearance-none"
                  >
                    {RINGTONES.map(r => (
                      <option key={r.id} value={r.id}>{r.name}</option>
                    ))}
                  </select>
                </div>

                <button 
                  onClick={() => {
                    window.dispatchEvent(new CustomEvent('test-prayer-alarm'));
                  }}
                  className="w-full py-3 px-4 rounded-xl bg-[#4e635a]/5 text-[#4e635a] font-bold text-xs hover:bg-[#4e635a]/10 transition-all flex items-center justify-center gap-2 border border-[#4e635a]/10"
                >
                  <Bell size={14} />
                  <span>اختبار صوت المنبه والرسائل</span>
                </button>
                <Toggle 
                  label="تذكير بجلست الخلوة اليومية" 
                  enabled={userProfile.settings?.notifications.retreatReminders ?? true} 
                  onChange={(val: boolean) => updateSettings({ notifications: { retreatReminders: val } })}
                />
              </motion.div>
            ) : activeSettingsTab === 'privacy' ? (
              <motion.div 
                key="privacy-settings"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="p-4 space-y-4"
              >
                <Toggle 
                  label="الملف الشخصي مرئي للعامة" 
                  enabled={userProfile.settings?.privacy.publicProfile ?? false} 
                  onChange={(val: boolean) => updateSettings({ privacy: { publicProfile: val } })}
                />
                <Toggle 
                  label="مشاركة إحصائيات الإنجاز" 
                  enabled={userProfile.settings?.privacy.shareInsights ?? true} 
                  onChange={(val: boolean) => updateSettings({ privacy: { shareInsights: val } })}
                />
                <div className="p-4 bg-red-50 text-red-600 rounded-2xl text-center font-bold cursor-pointer hover:bg-red-100 transition-colors">
                  حذف كافة البيانات الشخصية
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="appearance-settings"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="p-4 space-y-6"
              >
                <div className="space-y-3">
                  <p className="text-sm font-bold text-[#727875] mr-2">لغة التطبيق</p>
                  <div className="flex gap-2">
                    {['ar', 'en'].map((lang) => (
                      <button 
                        key={lang}
                        onClick={() => updateSettings({ appearance: { ...userProfile.settings?.appearance, language: lang as any } })}
                        className={cn(
                          "flex-1 py-3 rounded-2xl font-bold transition-all",
                          (userProfile.settings?.appearance.language ?? 'ar') === lang 
                            ? "bg-[#4e635a] text-white shadow-lg" 
                            : "bg-[#4e635a]/5 text-[#4e635a]"
                        )}
                      >
                        {lang === 'ar' ? 'العربية' : 'English'}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-3">
                  <p className="text-sm font-bold text-[#727875] mr-2">تنسيق التاريخ</p>
                  <div className="flex gap-2">
                    {['arabic', 'western'].map((format) => (
                      <button 
                        key={format}
                        onClick={() => updateSettings({ appearance: { ...userProfile.settings?.appearance, dateFormat: format as any } })}
                        className={cn(
                          "flex-1 py-3 rounded-2xl font-bold transition-all",
                          (userProfile.settings?.appearance.dateFormat ?? 'arabic') === format 
                            ? "bg-[#4e635a] text-white shadow-lg" 
                            : "bg-[#4e635a]/5 text-[#4e635a]"
                        )}
                      >
                        {format === 'arabic' ? 'هجري/عربي' : 'ميلادي'}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        <div className="glass-3d rounded-[40px] p-4 shadow-xl space-y-2 overflow-hidden">
          <motion.button 
            whileHover={{ x: -10, backgroundColor: 'rgba(239, 68, 68, 0.05)' }}
            onClick={handleLogout}
            className="w-full flex items-center justify-between p-6 rounded-3xl transition-all group"
          >
            <div className="flex items-center gap-5">
              <div className="w-12 h-12 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center shadow-sm">
                <LogOut size={22} />
              </div>
              <div className="text-right">
                <p className="font-bold text-lg text-red-600">تسجيل الخروج</p>
                <p className="text-sm text-red-400 font-medium">نراكم على خير قريباً</p>
              </div>
            </div>
            <ChevronLeft size={20} className="text-red-200 group-hover:text-red-400 transition-colors" />
          </motion.button>
        </div>
      </div>

      {/* Design Accent */}
      <div className="py-12 flex justify-center">
        <div className="w-24 h-1 bg-[#4e635a]/10 rounded-full" />
      </div>
    </div>
  );
}

function SettingsItem({ icon, label, description, onClick }: { icon: React.ReactNode, label: string, description: string, onClick?: () => void }) {
  return (
    <motion.button 
      whileHover={{ x: -10, backgroundColor: 'rgba(78, 99, 90, 0.03)' }}
      onClick={onClick}
      className="w-full flex items-center justify-between p-6 rounded-3xl transition-all group"
    >
      <div className="flex items-center gap-5">
        <div className="w-12 h-12 bg-[#4e635a]/5 text-[#4e635a] rounded-2xl flex items-center justify-center shadow-sm group-hover:bg-[#4e635a] group-hover:text-white transition-all">
          {icon}
        </div>
        <div className="text-right">
          <p className="font-bold text-lg text-[#1b1c1a]">{label}</p>
          <p className="text-sm text-[#727875] font-medium">{description}</p>
        </div>
      </div>
      <ChevronLeft size={20} className="text-[#4e635a]/20 group-hover:text-[#4e635a] transition-colors" />
    </motion.button>
  );
}

function Toggle({ enabled, onChange, label }: any) {
  return (
    <button 
      onClick={() => onChange(!enabled)}
      className="flex items-center justify-between w-full p-4 hover:bg-black/5 rounded-2xl transition-colors group cursor-pointer"
    >
      <span className="font-bold text-[#1b1c1a]">{label}</span>
      <div className={cn(
        "w-12 h-6 rounded-full p-1 transition-colors duration-300 flex items-center",
        enabled ? "bg-[#4e635a]" : "bg-gray-300"
      )}>
        <motion.div 
          animate={{ x: enabled ? 24 : 0 }}
          className="w-4 h-4 bg-white rounded-full shadow-sm" 
        />
      </div>
    </button>
  );
}

function FeatureCard({ icon, label, description, color, textColor, onClick }: any) {
  return (
    <motion.button 
      whileHover={{ y: -5, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="glass-3d p-6 rounded-[35px] text-right space-y-4 shadow-xl border border-white/50"
    >
      <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center", color, textColor)}>
        {icon}
      </div>
      <div>
        <p className="font-black text-lg text-[#1b1c1a] font-serif leading-tight">{label}</p>
        <p className="text-xs text-[#727875] font-medium">{description}</p>
      </div>
    </motion.button>
  );
}

function AchievementItemMini({ title, description, achieved }: { title: string, description: string, achieved: boolean }) {
  return (
    <div className={cn(
      "p-5 rounded-[30px] flex items-center gap-5 transition-all",
      achieved ? "glass-3d shadow-lg" : "bg-[#efeeeb]/40 opacity-50 grayscale"
    )}>
      <div className={cn(
        "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0",
        achieved ? "bg-[#d1e8dd] text-[#4e635a]" : "bg-[#e4e2df] text-[#727875]"
      )}>
        {achieved ? <Award size={22} /> : <Calendar size={22} />}
      </div>
      <div className="flex-grow">
        <h4 className="font-bold text-lg text-[#1b1c1a] font-serif">{title}</h4>
        <p className="text-xs text-[#727875] font-medium">{description}</p>
      </div>
      {achieved && <Check className="text-[#4e635a]" size={18} />}
    </div>
  );
}
