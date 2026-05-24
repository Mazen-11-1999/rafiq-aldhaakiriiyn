import React, { useState, useEffect } from 'react';
import { UserProfile, OperationType } from '../types';
import { handleFirestoreError } from '../lib/firestore-errors';
import { auth, db } from '../lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, Mail, Calendar, LogOut, Shield, Bell, Globe, ChevronLeft, 
  HelpCircle, Map, BookOpen, Award, Check, Edit2, Save, X, Music, 
  Target, RefreshCw, Moon, Sun, Download, FileText, Loader2,
  Flame, Sparkles, Coins, Trash2, Heart, HeartHandshake, EyeOff, Plus, RotateCcw, ShieldCheck, ShieldAlert,
  Compass
} from 'lucide-react';
import { RINGTONES } from '../constants';
import { cn } from '../lib/utils';
import { NotificationService } from '../services/notificationService';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { collection, query, getDocs, orderBy } from 'firebase/firestore';
import { getLatestAssessment, saveEthicsCommitment } from '../services/recordService';

export default function ProfileView({ userProfile, onTabChange }: { userProfile: UserProfile | null, onTabChange?: (tab: any) => void }) {
  const [isEditingName, setIsEditingName] = useState(false);
  const [newName, setNewName] = useState(userProfile?.displayName || '');
  const [isSaving, setIsSaving] = useState(false);

  const [activeSettingsTab, setActiveSettingsTab] = useState<'none' | 'notifications' | 'privacy' | 'appearance' | 'location' | 'demographics'>('none');
  const [isUpdatingLocation, setIsUpdatingLocation] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  // --- Dynamic Spiritual Ranks, Challenges, & Pacts Native State ---
  const [assessment, setAssessment] = useState<any>(null);
  const [loadingAssessment, setLoadingAssessment] = useState(true);

  // Challenges States
  const [qatDays, setQatDays] = useState<number>(() => {
    return Number(localStorage.getItem('sanad_challenge_qat_days') || '4');
  });
  const [noorDays, setNoorDays] = useState<number>(() => {
    return Number(localStorage.getItem('sanad_challenge_noor_days') || '2');
  });

  // Debts States
  interface Debt {
    id: string;
    name: string;
    amount: number;
    urgency: 'high' | 'medium' | 'low';
    paid: boolean;
  }
  const [debts, setDebts] = useState<Debt[]>(() => {
    try {
      const stored = localStorage.getItem('sanad_challenge_debts');
      if (stored) return JSON.parse(stored);
    } catch (e) {}
    return []; // Start empty by default as requested to make it fully dynamic!
  });
  const [showAddDebtForm, setShowAddDebtForm] = useState(false);
  const [newDebtName, setNewDebtName] = useState('');
  const [newDebtAmount, setNewDebtAmount] = useState('');
  const [newDebtUrgency, setNewDebtUrgency] = useState<'high' | 'medium' | 'low'>('high');

  // Pacts States (طهارة العين / طهارة السر)
  interface Pact {
    id: string;
    title: string;
    status: 'not_vowed' | 'active' | 'broken';
    days: number;
  }
  const [pacts, setPacts] = useState<Pact[]>(() => {
    try {
      const stored = localStorage.getItem('sanad_pacts_states');
      if (stored) return JSON.parse(stored);
    } catch (e) {}
    return [
      { id: 'tazkiyah-gaze', title: 'ميثاق طهارة العين وغض البصر', status: 'not_vowed', days: 0 },
      { id: 'tazkiyah-heart', title: 'ميثاق طهارة السر والمفسدات الرقمية', status: 'not_vowed', days: 0 }
    ];
  });

  // Sanad's Behavioral Agreements
  interface Agreement {
    id: string;
    text: string;
    completed: boolean;
  }
  const [agreements, setAgreements] = useState<Agreement[]>(() => {
    try {
      const stored = localStorage.getItem('sanad_agreements_states');
      if (stored) return JSON.parse(stored);
    } catch (e) {}
    return [
      { id: 'rule-48h', text: 'قاعدة الـ 48 ساعة للتأني ومقاطعة الشراء الكمالي والمظاهر', completed: true },
      { id: 'fajr-dhikr', text: 'الاستغفار الكثيف والسكينة (100 مرة) في خلوة الفجر', completed: false },
      { id: 'no-screens-midnight', text: 'إغلاق الشاشات تماماً بعد منتصف الليل لحماية نفسك', completed: false },
      { id: 'kinship-call', text: 'الاتصال برحم أو صديق قديم بنية التقرب دون مصلحة مادية', completed: true }
    ];
  });

  const [agreementToast, setAgreementToast] = useState<string | null>(null);

  // Effects to persist states to localStorage
  useEffect(() => {
    async function fetchLatest() {
      try {
        const res = await getLatestAssessment();
        setAssessment(res);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingAssessment(false);
      }
    }
    fetchLatest();

    const handleUpdate = () => {
      fetchLatest();
    };
    window.addEventListener('assessment-updated', handleUpdate);
    return () => {
      window.removeEventListener('assessment-updated', handleUpdate);
    };
  }, []);

  useEffect(() => {
    localStorage.setItem('sanad_challenge_qat_days', qatDays.toString());
  }, [qatDays]);

  useEffect(() => {
    localStorage.setItem('sanad_challenge_noor_days', noorDays.toString());
  }, [noorDays]);

  useEffect(() => {
    localStorage.setItem('sanad_challenge_debts', JSON.stringify(debts));
  }, [debts]);

  useEffect(() => {
    localStorage.setItem('sanad_pacts_states', JSON.stringify(pacts));
  }, [pacts]);

  useEffect(() => {
    localStorage.setItem('sanad_agreements_states', JSON.stringify(agreements));
  }, [agreements]);

  if (!userProfile) return null;

  const isFemale = userProfile.demographics?.gender === 'female';

  const getSpiritualMaqam = () => {
    const hasBrokenPact = pacts.some(p => p.status === 'broken');
    const hasActivePact = pacts.some(p => p.status === 'active');
    const totalMins = userProfile.totalMinutes || 0;
    const currentStreak = userProfile.currentStreak || 0;

    if (hasBrokenPact) {
      return isFemale ? 'مقام النهوض والترميم الطاهر' : 'مقام النهوض والترميم الشريف';
    }
    
    if (!hasActivePact && currentStreak === 0 && totalMins === 0) {
      return isFemale ? 'مقام اليقظة والعودة الصادقة' : 'مقام اليقظة والعودة';
    }

    return isFemale ? 'مقام الثبات وصيانة العهد الشريف' : 'مقام الثبات وصيانة العهد';
  };

  const spiritualMaqam = getSpiritualMaqam();

  const exportDataAsPDF = async () => {
    if (!auth.currentUser) return;
    setIsExporting(true);
    
    try {
      const reflectionsRef = collection(db, 'users', auth.currentUser.uid, 'reflections');
      const q = query(reflectionsRef, orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      const reflections = snapshot.docs.map(doc => doc.data());

      const doc = new jsPDF({
        orientation: 'p',
        unit: 'mm',
        format: 'a4'
      });

      const exportContainer = document.createElement('div');
      exportContainer.style.position = 'absolute';
      exportContainer.style.left = '-9999px';
      exportContainer.style.width = '800px';
      exportContainer.style.padding = '40px';
      exportContainer.style.backgroundColor = '#ffffff';
      exportContainer.style.direction = 'rtl';
      
      exportContainer.innerHTML = `
        <div style="text-align: center; margin-bottom: 40px; border-bottom: 2px solid #4e635a; padding-bottom: 20px;">
          <h1 style="color: #4e635a; font-size: 28px; margin-bottom: 10px;">رحلة النور - تقرير البصيرة</h1>
          <p style="color: #727875; margin: 5px 0;">الاسم: ${userProfile.displayName}</p>
          <p style="color: #727875; margin: 5px 0;">التاريخ: ${new Date().toLocaleDateString('ar-SA')}</p>
        </div>
        <div style="margin-bottom: 30px;">
          <h2 style="color: #4e635a; border-right: 4px solid #d4a373; padding-right: 14px; margin-bottom: 15px;">إحصائيات الرحلة</h2>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
            <p>إجمالي الجلسات: <strong>${userProfile.totalSessions}</strong></p>
            <p>دقائق الذكر: <strong>${userProfile.dhikrMinutes || 0}</strong></p>
            <p>دقائق الخلوة: <strong>${userProfile.retreatMinutes || 0}</strong></p>
            <p>سجل المذكرات: <strong>${reflections.length}</strong></p>
          </div>
        </div>
        <div style="margin-top: 20px;">
          <h2 style="color: #4e635a; border-right: 4px solid #d4a373; padding-right: 14px; margin-bottom: 20px;">سجل المذكرات والتأملات</h2>
          ${reflections.length > 0 ? reflections.map((r: any) => `
            <div style="margin-bottom: 25px; padding: 20px; background-color: #fbf9f6; border-radius: 15px; border-right: 4px solid #4e635a;">
              <p style="font-size: 16px; line-height: 1.8; margin-bottom: 10px; color: #1b1c1a;">${r.text}</p>
              <div style="text-align: left; font-size: 11px; color: #999;">
                ${r.createdAt?.toDate ? r.createdAt.toDate().toLocaleString('ar-SA') : ''}
              </div>
            </div>
          `).join('') : '<p style="text-align: center; color: #999; padding: 40px;">لا يوجد مذكرات بعد في رحلتك.</p>'}
        </div>
        <div style="margin-top: 50px; text-align: center; font-size: 12px; color: #727875; border-top: 1px solid #eee; padding-top: 20px;">
          تم توليد هذا التقرير كذكرى روحية بواسطة تطبيق سندك
        </div>
      `;

      document.body.appendChild(exportContainer);
      const canvas = await html2canvas(exportContainer, { 
        scale: 2,
        useCORS: true,
        allowTaint: true
      });
      const imgData = canvas.toDataURL('image/png');
      const imgProps = doc.getImageProperties(imgData);
      const pdfWidth = doc.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      
      doc.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      doc.save(`Rafeeq_Journey_${userProfile.displayName}.pdf`);
      document.body.removeChild(exportContainer);

    } catch (error) {
      console.error("Export error:", error);
      alert("عذراً، حدث خطأ أثناء تصدير البيانات.");
    } finally {
      setIsExporting(false);
    }
  };

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

  const updateDemographics = async (fields: { gender?: 'male' | 'female', maritalStatus?: 'single' | 'married', job?: 'student' | 'employed' | 'unemployed' | 'business' }) => {
    if (!auth.currentUser) return;
    try {
      const userRef = doc(db, 'users', auth.currentUser.uid);
      const demographics = userProfile.demographics || {
        gender: 'male',
        maritalStatus: 'single',
        job: 'student'
      };
      await updateDoc(userRef, {
        demographics: {
          ...demographics,
          ...fields
        }
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

  return (
    <div className="p-margin-page space-y-section-gap perspective-1000 pb-20">
      <header className="space-y-2">
        <h2 className="text-3xl font-bold text-[#4e635a] font-serif">الملف الشخصي</h2>
        <p className="text-[#424845] font-medium opacity-60">إدارة حسابك وتفضيلاتك في سندك</p>
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
                  <div className="flex flex-col items-center md:items-start gap-2">
                    <div className="flex items-center gap-3 group/name">
                      <h3 className="text-4xl font-black text-[#1b1c1a] font-serif tracking-tight">{userProfile.displayName}</h3>
                      <button 
                        onClick={() => setIsEditingName(true)}
                        className="p-2 text-[#4e635a] opacity-0 group-hover/name:opacity-100 hover:bg-[#4e635a]/5 rounded-xl transition-all"
                      >
                        <Edit2 size={18} />
                      </button>
                    </div>

                    {/* Dynamic Spiritual Maqam Display */}
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-amber-500/10 to-emerald-500/10 border border-amber-500/15 rounded-xl text-amber-950 font-serif font-black text-xs md:text-sm shadow-xs mb-1">
                      <Sparkles size={14} className="text-amber-500 animate-pulse" />
                      <span>مقام السلوك الحالي:</span>
                      <span className="text-emerald-800 font-bold underline decoration-wavy decoration-amber-500">{spiritualMaqam}</span>
                    </div>
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
        <div className="glass-3d p-6 rounded-[35px] text-center space-y-2 shadow-xl flex flex-col justify-center">
          <p className="text-xl md:text-2xl font-black text-[#4e635a] font-serif leading-none">
            {(() => {
              const totalMins = userProfile.totalMinutes || 0;
              const hours = Math.floor(totalMins / 60);
              const mins = totalMins % 60;
              if (hours > 0) {
                const hourWord = hours === 1 ? 'ساعة' : hours === 2 ? 'ساعتين' : hours >= 3 && hours <= 10 ? 'ساعات' : 'ساعة';
                const hourFormatted = hours === 1 || hours === 2 ? hourWord : `${hours} ${hourWord}`;
                
                if (mins > 0) {
                  const minWord = mins === 1 ? 'دقيقة' : mins === 2 ? 'دقيقتين' : mins >= 3 && mins <= 10 ? 'دقائق' : 'دقيقة';
                  const minFormatted = mins === 1 || mins === 2 ? minWord : `${mins} ${minWord}`;
                  return `${hourFormatted} و ${minFormatted}`;
                }
                return hourFormatted;
              } else {
                const minWord = mins === 1 ? 'دقيقة' : mins === 2 ? 'دقيقتين' : mins >= 3 && mins <= 10 ? 'دقائق' : 'دقيقة';
                const minFormatted = mins === 0 ? '0 دقيقة' : (mins === 1 || mins === 2 ? minWord : `${mins} ${minWord}`);
                return minFormatted;
              }
            })()}
          </p>
          <p className="text-xs font-black text-[#727875] uppercase tracking-widest leading-none pt-1">من السكينة وعزل الحواس</p>
        </div>
        <div className={cn(
          "glass-3d p-6 rounded-[35px] text-center space-y-2 shadow-xl border-t border-white/60 transition-all flex flex-col justify-center",
          userProfile.currentStreak > 0 && "bg-linear-to-br from-white to-orange-50/30 border-orange-200/50"
        )}>
          <p className={cn(
            "text-4xl font-black font-serif transition-all leading-none",
            userProfile.currentStreak > 0 ? "text-orange-500 scale-110 drop-shadow-[0_0_10px_rgba(249,115,22,0.2)]" : "text-[#f4dfcb]"
          )}>
            {userProfile.currentStreak}
            {userProfile.currentStreak > 0 && <span className="text-xl ml-1">🔥</span>}
          </p>
          <p className="text-xs font-black text-[#727875] uppercase tracking-widest leading-none pt-1">يوم متواصل</p>
        </div>
      </div>

      {/* 📜 شريط التحول الشريف - رسالة من أخ كبير ورفيق ناصح (Honorable Transformation ribbon) */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="relative overflow-hidden p-8 rounded-[40px] bg-linear-to-br from-slate-950 via-[#151c19] to-emerald-950 text-white border-2 border-amber-500/25 shadow-2xl space-y-6 text-right"
      >
        {/* Decorative ambient elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center gap-4 border-b border-white/10 pb-4">
          <div className="w-12 h-12 bg-amber-500/20 text-amber-400 rounded-2xl flex items-center justify-center border border-amber-500/30">
            <Sparkles size={24} className="animate-pulse text-amber-400" />
          </div>
          <div>
            <h3 className="text-2xl font-black font-serif text-amber-300">شريط التحول الشريف</h3>
            <p className="text-xs text-slate-400 font-bold">رسالة حيّة وتوجيه تربوي متغيّر يقرأ واقعك وجهادك اليومي</p>
          </div>
        </div>

        <div className="space-y-4 font-serif text-sm md:text-base leading-relaxed text-slate-200">
          <p className="text-lg font-black text-amber-100">
            {isFemale ? "أختي الفاضلة المصونة" : "يا صاحبي الشريف الأبي"} <span className="underline decoration-amber-500 decoration-wavy font-serif text-xl text-yellow-300 font-black">{userProfile.displayName}</span>، {isFemale ? "رعاكِ الله" : "رعاكَ الله"} وسدد همتك..
          </p>
          
          <div className="border-r-3 border-amber-500/40 pr-5 py-2 space-y-3 font-serif">
            {(() => {
              const elements: string[] = [];

              // 1. Debts analysis
              const paidDebts = debts.filter(d => d.paid);
              const activeDebts = debts.filter(d => !d.paid);
              if (paidDebts.length > 0) {
                const paidNames = paidDebts.map(d => `${d.name}`).join(' و');
                elements.push(isFemale
                  ? `بفضل الله وفائكِ طاهر؛ لقد سددتِ لـ ${paidNames} ذمتكِ المالية بكل نبل وعفة، لتتحرري تماماً من أوهام المظاهر والديون ليكون عهدكِ نقياً والحمد لله.`
                  : `بفضل الله وفائكَ طاهر؛ لقد سددتَ لـ ${paidNames} ذمتكَ المالية بكل مروءة ونبل، لتتحرر تماماً من وهن المظاهر والالتزامات العبثية بظهر مفرود.`
                );
              } else if (activeDebts.length > 0) {
                elements.push(isFemale
                  ? `أما بخصوص شؤون المعاملات المبرمة في وقفة صدق، فقد قمتِ بحصر التزاماتكِ المالية وترتيب سداد ذمتكِ، لتسعي بنضج وعفة لحفظ كرامتكِ وحقوق العباد غيباً دون هروب.`
                  : `أما بخصوص شؤون المعاملات المبرمة في وقفة صدق، فقد قمتَ بحصر التزاماتكَ المالية وترتيب سداد ذمتكَ، لتسعى برجولة وشجاعة لمواجهة الدائنين وحفظ حقوق العباد غيباً بفخر.`
                );
              } else {
                elements.push(isFemale
                  ? `والحمد لله، صنتِ يدكِ وحياءكِ من ذل السؤال ومجاراة المظاهر التافهة، مستغنية برزق الله الحلال والبركة فيه.`
                  : `والحمد لله، صنتَ يدكَ وجيبكَ من ذل السؤال والتكلف لإرضاء الناس والمظاهر الكاذبة، مستغنياً عزيزاً برزق ربك الحلال.`
                );
              }

              // 2. Noor Days & Qat Days
              if (qatDays > 0) {
                elements.push(isFemale
                  ? `صمدتِ في تحدي نقاء الروح متجاوزة تشتت النفس ومناهضةً عوائق الشغف ومضيعات الساعات خلف البثوث ومفسدات الوعي لـ ${qatDays} أيام متتالية متحررة بكرامة.`
                  : `صمدتَ شجاعاً بظهر مفرود لـ ${qatDays} أيام متتالية في تحدي نقاء اليوم، متحرراً من غمار سموم القات والفتور والتبذير الذي يوهن سعي الرجال الصادقين.`
                );
              }
              if (noorDays > 0) {
                elements.push(isFemale
                  ? `وحميتِ بصيرتكِ وخلوتكِ في خلوة النور لـ ${noorDays} ليالٍ طاهرة، عازلةً حواسكِ عن سرقة الشاشات السامة وصخب السوشيال ميديا بعد منتصف الليل.`
                  : `وحميتَ وعيكَ وبصيرتكَ في خلوة النور لـ ${noorDays} ليالٍ طاهرة، معافى من استعباد شاشات الهواتف ومتابعة التوافه بعد منتصف الليل لتظفر بسكينة نومك ونور فجرك.`
                );
              }

              // 3. Pacts state
              const gazePact = pacts.find(p => p.id === 'tazkiyah-gaze');
              const heartPact = pacts.find(p => p.id === 'tazkiyah-heart');
              
              const gazeActive = gazePact?.status === 'active';
              const heartActive = heartPact?.status === 'active';
              const gazeBroken = gazePact?.status === 'broken';
              const heartBroken = heartPact?.status === 'broken';

              if (gazeActive && gazePact) {
                elements.push(isFemale
                  ? `وحظيتِ بنقاء الحواس بالوفاء بميثاق طهارة العين وغض البصر منذ ${gazePact.days} أيام صيانةً لحيائكِ وعقدكِ الشريف مع ربكِ وبصيرتكِ المتقدة.`
                  : `وحظيتَ بنقاء الجوارح في الوفاء بميثاق طهارة العين وغض البصر منذ ${gazePact.days} أيام، حامياً نظراتكَ من السقوط وصائناً لعين طهرك ونخوتكَ الشهمة.`
                );
              }
              if (heartActive && heartPact) {
                elements.push(isFemale
                  ? `وتلتزمين بنبل بميثاق طهارة السر لمنع المفسدات الرقمية وحراسة قلبكِ سراً لترتقي في مراتب العفة الطاهرة.`
                  : `وتلتزم بصدق وشهامة بميثاق طهارة السر لإفراغ قلبكَ من المفسدات وحسابات الغواية، حارساً لصدركَ في جوف الغيب وكأنك من أنبياء الله المخلصين صفاءً ونوراً.`
                );
              }

              if (gazeBroken || heartBroken) {
                elements.push(isFemale
                  ? `وإن مالت النفس أو تعثر خطاكِ في المدارج، فإن صدقكِ في الاعتراف والنهوض الآن هو التاج الذي يزين حياءكِ؛ والباب لترميم العهود لا يغلق أبداً.`
                  : `وإن كبت بكَ فرس الالتزام أو تعثرت خطاك في المدارج، فنهوضكَ فوراً للترميم وتجديد ميثاقك الآن هو الشاهد على مروءتك وعزيمتك الشهمة في طلب الطهر ونقاء الوعي.`
                );
              }

              // 4. Time of purification
              const totalMins = userProfile.totalMinutes || 0;
              if (totalMins > 0) {
                const hours = Math.floor(totalMins / 60);
                const mins = totalMins % 60;
                let timeText = '';
                if (hours > 0) {
                  timeText += `${hours} ${hours === 1 ? 'ساعة' : hours === 2 ? 'ساعتين' : 'ساعات'}`;
                  if (mins > 0) {
                    timeText += ` و ${mins} ${mins === 1 ? 'دقيقة' : mins === 2 ? 'دقيقتين' : 'دقائق'}`;
                  }
                } else {
                  timeText += `${mins} ${mins === 1 ? 'دقيقة' : mins === 2 ? 'دقيقتين' : 'دقائق'}`;
                }
                elements.push(isFemale
                  ? `وقد وهبتِ لروحكِ مساحة من النقاء بلغت ${timeText} من السكينة وعزل الحواس، مطهرةً مسمعكِ بذكر الله وعبر الأنبياء بدلاً من التشتت الضائع.`
                  : `وقد منحتَ روحكَ مساحة من الصفاء بلغت ${timeText} من السكينة وعزل الحواس، مغذياً سمعكَ وقلبكَ بقصص الأنبياء وسكينة المعرفة مقتدياً بسيرهم العطرة ليكون يومك متصلاً بربك.`
                );
              }

              // 5. Blind spot assessment details
              if (assessment) {
                elements.push(isFemale
                  ? `وبكل شجاعة، واجهتِ مرآة ذاتكِ عبر مبادرة وقفة صدق، وكشفتِ بقعتكِ العمياء لتعملي بوعي على رتق الثغرات وتطبيق علاج سند العملي لسد مداخل الغفلة بظهر مفرود وفكر ناضج.`
                  : `وبكل رجولة ونخوة، واجهتَ ذاتكَ دون تبرير في وقفة صدق الصارمة، لتتعرف على البقعة العمياء وتسير على خطى الأنبياء والرجال العظماء في سد الثلمة وتفكيك الذئب الذي يسرق الساعات.`
                );
              } else {
                elements.push(isFemale
                  ? `وندعوكِ برفق ومحبة الصادقين أن تبادري الآن بخوض وقفة صدق الصارمة والإجابة على الأسئلة الـ 21 لتكتشفي مواطن البقعة العمياء قبل مباغتة الغفلة والفتور.`
                  : `وندعوكَ بشهامة الصديق الناصح أن تبادر الآن لتبدأ وقفة صدق الصارمة وتفكك البقعة العمياء بصدق، فما خاب من وزن نفسه بميزان الوقار واليقظة وسد الثغر قبل التسلل.`
                );
              }

              return elements.map((txt, idx) => (
                <p key={idx} className="font-serif leading-relaxed text-sm text-slate-200 flex items-start gap-1">
                  <span className="text-amber-400 select-none shrink-0">✦</span>
                  <span>{txt}</span>
                </p>
              ));
            })()}
          </div>
          
          <div className="pt-4 border-t border-white/10 text-xs md:text-sm font-black text-amber-400 font-serif leading-relaxed">
            🌿 {isFemale 
              ? "\"يا رفيقتي، مقامكِ اليوم هو مقام الثبات وصيانة العهد الشريف. صِلِي حبال وصلكِ بربكِ وتجاوزي كدر النفس؛ لتخرجي لواقع الحياة بحياء وعفة مقتدية بأمهات المؤمنين وعزيمة الصالحات الطاهرات.\""
              : "\"يا صاحبي، مقامك اليوم هو مقام الثبات وصيانة العهد الشريف. صلْ حبال وصلك بربك وتجاوز كدر النفس؛ لتخرج لواقع الحياة بظهر مفرود مقتدياً بالأنبياء وعزيمة الصالحين الطاهرين.\""
            }
          </div>
        </div>
      </motion.div>

      {/* =========================================================================
          NATIVE SPIRITUAL SECTIONS (CHALLENGES, PACTS, BLIND SPOT, COVENANTS) 
          ========================================================================= */}

      {/* 2️⃣ أختام "مواثيق الشرف" المبرمة (Tazkiyah Pact Seals) */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="glass-3d p-8 rounded-[40px] shadow-2xl border-2 border-zinc-500/10 space-y-6 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-24 h-24 bg-[#4e635a]/5 rounded-bl-[60px]" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#4e635a]/10 text-[#4e635a] rounded-2xl flex items-center justify-center">
              <ShieldCheck size={26} className="text-[#4e635a]" />
            </div>
            <div>
              <h3 className="text-2xl font-black text-[#1b1c1a] font-serif">أختام ومواثيق الشرف الموثقة</h3>
              <p className="text-xs text-[#727875] font-bold">مواثيق التزكية سراً بينك وبين جوارحك؛ يتوهج الختم ذهبياً طالما وفيت، وينطفئ رماداً إن خدشت في الطريق حتى تجدد توبتك بكرامة</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
          {pacts.map((p) => {
            const isVowed = p.status === 'active';
            const isBroken = p.status === 'broken';
            const isNotVowed = p.status === 'not_vowed';

            return (
              <div 
                key={p.id}
                className={cn(
                  "p-6 rounded-[35px] border-2 transition-all relative flex flex-col justify-between overflow-hidden",
                  isVowed && "bg-amber-50/70 border-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.08)]",
                  isBroken && "bg-neutral-100/90 border-[#727875]/30 grayscale text-[#727875]",
                  isNotVowed && "bg-white border-dashed border-[#4e635a]/20"
                )}
              >
                {/* Visual Seal Emblem Overlay */}
                <div className="absolute -top-6 -left-6 opacity-5 select-none pointer-events-none text-9xl">
                  {isBroken ? "🕳️" : "🎖️"}
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className={cn(
                      "px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-tight",
                      isVowed && "bg-amber-500/20 text-amber-800 animate-pulse",
                      isBroken && "bg-[#efeeeb] text-neutral-600",
                      isNotVowed && "bg-[#4e635a]/5 text-[#4e635a]"
                    )}>
                      {isVowed && `✦ ميثاق فعّال وناصع (${p.days} أيام)`}
                      {isBroken && "🔒 العهد مخدوش (توبة في المدارج)"}
                      {isNotVowed && "المبايعة والعهد سري"}
                    </span>
                    
                    {/* Golden / Charcoal Glowing Wax Seal Element */}
                    <div className={cn(
                      "w-12 h-12 rounded-full flex items-center justify-center text-lg font-serif transition-all shrink-0",
                      isVowed && "bg-amber-500 text-white shadow-[0_0_15px_rgba(245,158,11,0.5)] border-2 border-white animate-pulse",
                      isBroken && "bg-neutral-300 text-neutral-600 border-2 border-dashed border-neutral-400",
                      isNotVowed && "bg-gray-100 text-gray-400 border-2 border-dotted border-gray-300"
                    )}>
                      {isVowed ? "🥇" : isBroken ? "💨" : "🛡️"}
                    </div>
                  </div>

                  <h4 className="text-xl font-black font-serif text-[#1b1c1a]">{p.title}</h4>
                  
                  <div className="p-4 rounded-2xl bg-black/5 text-xs text-slate-700 dark:text-slate-800 font-bold leading-relaxed space-y-1">
                    {p.id === 'tazkiyah-gaze' ? (
                      <p>"ميثاق طهارة العين وغض البصر هو قطع النظر لسرقة الشهوات وحظر مفسدات الوعي الرقمية تماماً وصيانة ملامحك الطاهرة بنور ربك."</p>
                    ) : (
                      <p>"ميثاق طهارة الخلوة والسر هو السعي لإصلاح ما تبطن وتطهير أسرارك الرقمية من حسابات معطلة أو تمرير عاصٍ في دياجير الليل."</p>
                    )}
                  </div>
                </div>

                {/* Seal Action Controls */}
                <div className="mt-6 pt-4 border-t border-[#efeeeb] space-y-4">
                  {isVowed && (
                    <div className="space-y-2">
                      <p className="text-xs font-bold text-amber-800 text-center leading-relaxed font-serif">
                        🎖️ "عهدك ميثاقه نور جوارحك وصحة قلبك وعزتك أمام الفتن"
                      </p>
                      <button
                        onClick={() => {
                          const updated = pacts.map(it => it.id === p.id ? { ...it, status: 'broken' } : it);
                          setPacts(updated as any);
                        }}
                        className="w-full py-3 bg-[#e53e3e]/10 text-red-700 hover:bg-[#e53e3e]/20 rounded-2xl font-black text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <Flame size={14} className="animate-pulse" />
                        عثرتُ في المدارج واعترفت بالخدش لـ "سند" سراً 🔒
                      </button>
                    </div>
                  )}

                  {isBroken && (
                    <div className="space-y-3">
                      <p className="text-xs font-bold text-[#727875] leading-relaxed text-right">
                        🖤 "لا تبتئس يا صاحبي، سقوطك ما هو إلا كبوة فارس والباب مفتوح للتوبة والاستغفار؛ 'التائب من الذنب كمن لا ذنب له'."
                      </p>
                      <button
                        onClick={() => {
                          const updated = pacts.map(it => it.id === p.id ? { ...it, status: 'active', days: 1 } : it);
                          setPacts(updated as any);
                        }}
                        className="w-full py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-2xl font-black text-xs transition-colors shadow-md flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <RotateCcw size={14} />
                        طلب تجديد العهد والنهوض مجدداً بقوة 🌅
                      </button>
                    </div>
                  )}

                  {isNotVowed && (
                    <button
                      onClick={() => {
                        const updated = pacts.map(it => it.id === p.id ? { ...it, status: 'active', days: 1 } : it);
                        setPacts(updated as any);
                      }}
                      className="w-full py-3 bg-[#4e635a] hover:bg-[#3d4d46] text-white rounded-2xl font-black text-xs transition-colors shadow-md flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Check size={14} />
                      إبرام ميثاق الشرف والالتزام سراً الآن
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* 3️⃣ لوحة "تحديات الأمانة وشرف النفس" النشطة (Behavioral Challenges Tracker) */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="glass-3d p-8 rounded-[40px] shadow-2xl border-2 border-indigo-500/10 space-y-6 relative overflow-hidden text-right"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-bl-[100px] -z-10" />
         <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-500/10 text-indigo-600 rounded-2xl flex items-center justify-center">
              <Target size={26} className="animate-spin-slow" />
            </div>
            <div>
              <h3 className="text-2xl font-black text-[#1b1c1a] font-serif">تحديات الأمانة وشرف النفس النشطة</h3>
              <p className="text-xs text-[#727875] font-bold">لوحة عملية لمواجهة السلوكيات والديون وساعات الالتزام المتفق عليها مع "سند"</p>
            </div>
          </div>
          {debts.length === 0 && !showAddDebtForm && (
            <button
              onClick={() => setShowAddDebtForm(true)}
              className="px-4 py-2 bg-amber-500/15 hover:bg-amber-500/25 text-amber-900 border border-amber-500/20 text-xs font-black rounded-2xl transition-all cursor-pointer inline-flex items-center gap-2 self-start md:self-auto"
            >
              <Coins size={14} className="text-amber-700 animate-bounce" />
              تفعيل تحدي الديون بكرامة 🪙
            </button>
          )}
        </div>

        <div className={cn(
          "grid grid-cols-1 gap-6 pt-2",
          (debts.length > 0 || showAddDebtForm) ? "lg:grid-cols-3" : "lg:grid-cols-2"
        )}>
          {/* Card A: نقاء اليوم - بدون قات أو مفسدات */}
          <div className="p-6 rounded-[35px] bg-white border border-[#4e635a]/10 flex flex-col justify-between shadow-xs">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="w-10 h-10 bg-emerald-500/10 text-emerald-600 rounded-xl flex items-center justify-center">
                  <Flame size={20} className="animate-pulse" />
                </span>
                <span className="text-[10px] uppercase font-black text-emerald-800">تحدي نقاء اليوم</span>
              </div>
              <h4 className="text-xl font-serif font-black text-emerald-950">مناهضة عوائق الشغف والقات والمنشطات الملهية</h4>
              
              <div className="bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100 text-center font-bold">
                <p className="text-sm text-emerald-900 leading-relaxed font-serif">
                  🌱 "أتممتُ <span className="text-emerald-600 font-serif text-lg font-black">{qatDays}</span> أيام بظهر مفرود وجيب نقي متحرر!"
                </p>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-dashed border-[#efeeeb] space-y-2">
              <button
                onClick={() => setQatDays(qatDays + 1)}
                className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-black text-xs transition-all shadow-md active:scale-95 cursor-pointer"
              >
                + تسجيل يوم نقي إضافي بفضل الله
              </button>
              <button
                onClick={() => setQatDays(0)}
                className="w-full py-2 text-[10px] font-black text-[#727875] hover:text-red-500 transition-colors"
              >
                إعادة ضبط العداد لشحذ الهمة
              </button>
            </div>
          </div>

          {/* Card B: الجيب الشريف - بلا ديون تافهة */}
          {(debts.length > 0 || showAddDebtForm) && (
            <div className="p-6 rounded-[35px] bg-white border border-[#4e635a]/10 flex flex-col justify-between shadow-xs lg:col-span-1">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="w-10 h-10 bg-amber-500/10 text-amber-600 rounded-xl flex items-center justify-center">
                    <Coins size={20} />
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase font-black text-amber-800">الجيب الشريف</span>
                    {debts.length === 0 && (
                      <button 
                        onClick={() => setShowAddDebtForm(false)}
                        className="text-gray-400 hover:text-red-500 transition-colors p-1 cursor-pointer"
                        title="إخفاء التحدي"
                      >
                        <X size={14} />
                      </button>
                    )}
                  </div>
                </div>
                <h4 className="text-sm md:text-md lg:text-lg font-serif font-black text-amber-950">ديوني الملتزَم بسدادها بكرامة</h4>
                
                {/* Debt list display */}
                <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1 no-scrollbar">
                  {debts.length === 0 ? (
                    <p className="text-center py-6 text-[10px] font-bold text-gray-400 italic">سجل التزاماتك بالأسفل للبدء</p>
                  ) : debts.map((item) => (
                    <div 
                      key={item.id}
                      className={cn(
                        "p-3 rounded-xl border flex items-center justify-between text-xs transition-all",
                        item.paid 
                          ? "bg-slate-50 border-[#efeeeb] opacity-60" 
                          : "bg-amber-50/50 border-amber-200/50"
                      )}
                    >
                      <div className="min-w-0 flex-1">
                        <p className={cn("font-bold text-[#1b1c1a] truncate", item.paid && "line-through")}>
                          {item.name}
                        </p>
                        <p className="text-[10px] font-black text-amber-800">
                          المبلغ: {item.amount.toLocaleString()} ر.ي
                        </p>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        {!item.paid ? (
                          <button
                            onClick={() => {
                              const updated = debts.map(it => it.id === item.id ? { ...it, paid: true } : it);
                              setDebts(updated);
                            }}
                            className="px-2.5 py-1 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-[9px] font-black cursor-pointer shadow-xs whitespace-nowrap animate-pulse"
                          >
                            سددت!
                          </button>
                        ) : (
                          <span className="text-emerald-600 font-bold text-[10px]">مُسدَد ✓</span>
                        )}
                        <button
                          onClick={() => {
                            const updated = debts.filter(it => it.id !== item.id);
                            setDebts(updated);
                          }}
                          className="p-1 hover:bg-red-50 text-red-400 hover:text-red-600 rounded-lg transition-colors cursor-pointer"
                          title="حذف الدين"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add debt form */}
                <div className="pt-2">
                  <p className="text-[10px] font-black text-[#727875] mb-2">إضافة دين لتحدي السداد بكرامة:</p>
                  <div className="space-y-1">
                    <input 
                      type="text" 
                      placeholder="اسم الدائن (الأكثر حاجة سداً)"
                      value={newDebtName}
                      onChange={e => setNewDebtName(e.target.value)}
                      className="w-full text-xs p-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white outline-hidden"
                    />
                    <div className="flex gap-1">
                      <input 
                        type="number" 
                        placeholder="المبلغ (ر.ي)"
                        value={newDebtAmount}
                        onChange={e => setNewDebtAmount(e.target.value)}
                        className="w-2/3 text-xs p-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white outline-hidden"
                      />
                      <button
                        onClick={() => {
                          if (!newDebtName.trim() || !newDebtAmount.trim()) return;
                          const d: Debt = {
                            id: Date.now().toString(),
                            name: newDebtName.trim(),
                            amount: Number(newDebtAmount),
                            urgency: 'high',
                            paid: false
                          };
                          setDebts([...debts, d]);
                          setNewDebtName('');
                          setNewDebtAmount('');
                        }}
                        className="w-1/3 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-black p-2 cursor-pointer shadow-xs"
                      >
                        أضف
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Card C: خلوة النور */}
          <div className="p-6 rounded-[35px] bg-white border border-[#4e635a]/10 flex flex-col justify-between shadow-xs">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="w-10 h-10 bg-indigo-500/10 text-indigo-600 rounded-xl flex items-center justify-center">
                  <Moon size={20} />
                </span>
                <span className="text-[10px] uppercase font-black text-indigo-800">خلوة النور</span>
              </div>
              <h4 className="text-xl font-serif font-black text-indigo-950">مقاومة استعباد الشاشات وحماية عين السر</h4>
              
              <div className="bg-indigo-50/50 p-4 rounded-2xl border border-indigo-100 text-center font-bold">
                <p className="text-sm text-indigo-900 leading-relaxed font-serif">
                  🌌 "حققتُ <span className="text-indigo-600 font-serif text-lg font-black">{noorDays}</span> ليالٍ طاهرة من العفة والعزيمة والنوم الصحي غيباً!"
                </p>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-dashed border-[#efeeeb] space-y-2">
              <button
                onClick={() => setNoorDays(noorDays + 1)}
                className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black text-xs transition-all shadow-md active:scale-95 cursor-pointer"
              >
                + ليلة طاهرة من خلوة عفتنا
              </button>
              <button
                onClick={() => setNoorDays(0)}
                className="w-full py-2 text-[10px] font-black text-[#727875] hover:text-red-500 transition-colors"
              >
                إعادة ضبط العداد لشحذ الهمة
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* 4️⃣ تفكيك البقعة العمياء عبر وقفة صدق (The Blind-Spot Analysis Window) */}
      {assessment && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-3d p-8 rounded-[40px] shadow-2xl border-2 border-slate-500/10 space-y-6 relative overflow-hidden text-right"
        >
          <div className="absolute top-0 left-0 w-32 h-32 bg-slate-100 rounded-br-[100px] -z-10" />
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center">
              <Compass size={26} className="animate-spin-slow text-yellow-400" />
            </div>
            <div>
              <h3 className="text-2xl font-black text-slate-900 font-serif">وقفة صدق وتفكيك البقعة العمياء</h3>
              <p className="text-xs text-[#727875] font-bold">بميزان وحزم وحب؛ تفكيك الذئب الذي يباغت وعيك وسلوكه وعلاجه العملي المخصص</p>
            </div>
          </div>

          {loadingAssessment ? (
            <div className="py-8 flex justify-center items-center gap-2">
              <Loader2 className="animate-spin text-[#4e635a]" size={24} />
              <span className="font-bold text-xs text-[#727875]">جاري تجميع نتائج وقفة صدق...</span>
            </div>
          ) : (() => {
            // Find weakest category
            const categoriesMap: Record<string, string> = {
              intent: 'إخلاص النية وبواعث السمعة والرياء',
              ethics: 'صدق المعاملة والوفاء بالعهود المالية وحقوق العباد',
              consistency: 'منهج المواظبة والفتور والواقع والعمل الفردي',
              ego: 'سلامة النفس والغرور الروحي وتفضيل الذات',
              knowledge: 'العمل بالعلم وتطبيق المواعظ بدلاً من جمع الردود'
            };

            const recommendationsMap: Record<string, string> = {
              intent: 'قم بأداء عبادة سرية بالكامل اليوم لا تشاركها مع أي مخلوق إنساني. ركعتان بالخلوة أو مساعدة محتاج سراً لتبني إخلاصاً نقياً.',
              ethics: 'سند يوصيك بالبدء الفوري بترتيب الديون؛ اكتب قائمة بدائن غيباً، تواصل مع من تستطيع معتذراً باللين، وسدد ما تيسر مع حفظ كرامتك وتجنب السلف المظهر الزائل.',
              consistency: 'اختر طاعة هينة جداً (كورد استغفار 100 مرة) وابكِ على الالتزام بها كفرض ثابت لا ترخص فيه يوماً لتكسر الفتور.',
              ego: 'جالس البسطاء طويلاً اليوم أو تفقد والديّك بقبلة رأس بوقار وتذلل، واعلم أن عاصياً يئنّ نادماً قد يسبقك في المنازل غيباً.',
              knowledge: 'توقف تماماً عن تتبع المواعظ والمقاطع اليوم وغداً؛ والتزم فوراً بتطبيق خُلُق واحد أو مبادرة بر حقيقية في خلوتك لترقية علمك.'
            };

            const scores = assessment.scores || {};
            let weakestCategory = 'intent';
            let minScore = 999;
            
            Object.keys(scores).forEach(key => {
              if (scores[key] < minScore) {
                minScore = scores[key];
                weakestCategory = key;
              }
            });

            return (
              <div className="bg-slate-950 p-6 rounded-[35px] text-white space-y-6 relative overflow-hidden border border-slate-800">
                <div className="space-y-2">
                  <span className="inline-flex px-3 py-1 bg-red-500/10 text-red-400 border border-red-500/20 rounded-xl text-[10px] font-black">
                    ⚠️ كشف البقعة العمياء والثغرة الفعالة
                  </span>
                  <p className="text-xl font-serif font-black leading-relaxed">
                    {isFemale 
                      ? `"يا رفيقتي العفيفة، انتبهي.. تشير نتيجتكِ بتقرير وقفة صدق الأخيرة إلى ثغرة حقيقية وحرجة في فئة: "`
                      : `"يا صاحبي الشريف، انتبه.. تشير نتيجتكَ بتقرير وقفة صدق الأخيرة إلى ثغرة حقيقية وحرجة في فئة: "`
                    }
                    <span className="text-yellow-400">{categoriesMap[weakestCategory] || weakestCategory}</span>."
                  </p>
                  <p className="text-xs text-slate-400 font-bold leading-relaxed">
                    {isFemale
                      ? `ذئب المعصية وضعف الهمة يأتيكِ من هنا دائماً ويتسلل لسرقة همتكِ وعزيمتكِ؛ لذا وجهي بصيرتكِ باليقظة وتسلّحي بالعلاج المندرج لتكون نفسكِ شريفة.`
                      : `ذئب المعصية وضعف الهمة يأتيكَ من هنا دائماً ويتسلل لسرقة همتكَ وعزيمتكَ؛ لذا وجه بصيرتكَ باليقظة وتسلّح بالعلاج وسد الثغرة بظهر مفرود ووقار.`
                    }
                  </p>
                </div>

                <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-3">
                  <p className="text-xs font-black text-yellow-400">💡 توجيه "سند" العلاجي اليوم لترقيتك وسد الثغر:</p>
                  <p className="text-sm font-medium leading-relaxed font-serif text-slate-200">
                    {recommendationsMap[weakestCategory] || 'الاجتهاد في صلاة النوافل وصون طهارة السر اليوم.'}
                  </p>
                </div>

                <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-900">
                  <p className="text-[10px] font-black text-amber-500 font-serif leading-relaxed">
                    "تجاوز البقعة العمياء يحتاج للصدق المجرّد والوقوف المتيقظ بوجه النفس؛ بادر بالتطبيق رعاك الله."
                  </p>
                  <button
                    onClick={() => alert(isFemale ? "طوبى لصدقكِ العفيف! تم تدوين وجهتكِ لسد هذا الثغر بوقار وعزيمة 🛡️" : "طوبى لصدقكَ الشريف! تم تدوين وجهتكَ لسد هذا الثغر بنخوة ونبل بظهر مفرود 🛡️")}
                    className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-slate-950 rounded-xl text-[11px] font-black transition-colors shrink-0 shadow-md cursor-pointer"
                  >
                    عاهدتُ الله على سد الثغر والتطبيق اليوم!
                  </button>
                </div>
              </div>
            );
          })()}
        </motion.div>
      )}

      {/* 5️⃣ سجل "مواثيق وعهود سند السلوكية" (My Agreements with Sanad) */}
      <motion.div 
        id="sanad-daily-covenant-section"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="glass-3d p-8 rounded-[40px] shadow-2xl border-2 border-[#4e635a]/10 space-y-6 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#4e635a]/5 rounded-bl-[100px] -z-10" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#4e635a]/10 text-[#4e635a] rounded-2xl flex items-center justify-center">
              <HeartHandshake size={26} className="text-[#4e635a] animate-pulse" />
            </div>
            <div>
              <h3 className="text-2xl font-black text-[#1b1c1a] font-serif">سجل ومواثيق عهود سند السلوكية</h3>
              <p className="text-xs text-[#727875] font-bold">اتفاقات وممارسات سلوكية صاغها رفيقك (سند) لتنفيذها اليوم؛ بادر بتوطين همتك</p>
            </div>
          </div>
        </div>

        <div className="space-y-4 pt-2">
          {agreements.map((ag) => (
            <div 
              key={ag.id}
              className={cn(
                "p-5 rounded-3xl border-2 transition-all flex items-center justify-between gap-4",
                ag.completed 
                  ? "bg-[#d1e8dd]/20 border-emerald-500/20 text-[#1b1c1a]" 
                  : "bg-white border-[#4e635a]/5 hover:border-[#4e635a]/25 text-[#727875]"
              )}
            >
              <div className="flex items-center gap-4 text-right">
                <button
                  onClick={() => {
                    const nextCompletedState = !ag.completed;
                    const updated = agreements.map(it => it.id === ag.id ? { ...it, completed: nextCompletedState } : it);
                    setAgreements(updated);

                    if (nextCompletedState) {
                      setAgreementToast(`طوبى لك يا بطل! خلوتك اليوم نور وبراءتك عزّ ولا فخر في عهد الوفاء.`);
                      setTimeout(() => {
                        setAgreementToast(null);
                      }, 5000);
                    }
                  }}
                  className={cn(
                    "w-8 h-8 rounded-xl flex items-center justify-center transition-all cursor-pointer shadow-xs",
                    ag.completed 
                      ? "bg-emerald-500 text-white" 
                      : "bg-[#4e635a]/5 border-2 border-[#4e635a]/10 text-transparent"
                  )}
                >
                  <Check size={18} />
                </button>
                <div>
                  <p className={cn("text-sm md:text-base font-serif font-black", ag.completed ? "text-emerald-950 font-bold" : "text-[#1b1c1a] opacity-80")}>
                    {ag.text}
                  </p>
                </div>
              </div>
              <span className={cn(
                "px-3 py-1 text-[10px] font-black rounded-lg whitespace-nowrap",
                ag.completed ? "bg-emerald-500/20 text-emerald-800" : "bg-gray-100 text-[#727875]"
              )}>
                {ag.completed ? "تم بحمد الله" : "قيد التنفيذ اليوم"}
              </span>
            </div>
          ))}
        </div>

        {/* Dynamic Toast feedback inline to prevent ugly jumps */}
        <AnimatePresence>
          {agreementToast && (
            <motion.div
              initial={{ opacity: 0, height: 0, scale: 0.95 }}
              animate={{ opacity: 1, height: 'auto', scale: 1 }}
              exit={{ opacity: 0, height: 0, scale: 0.95 }}
              className="bg-emerald-600 p-4 rounded-2xl text-white font-serif font-black text-sm text-center shadow-lg border border-emerald-500"
            >
              🎉 {agreementToast}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

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
                <SettingsItem 
                  icon={<Target size={20} />} 
                  label="الموقع الجغرافي" 
                  description="دقة مواقيت الصلاة حسب مدينتك" 
                  onClick={() => setActiveSettingsTab('location')}
                />
                <SettingsItem 
                  icon={<User size={20} />} 
                  label="هوية وسياق الرفيق سند" 
                  description="تخصيص ردود وتوجيهات سند حسب حالتك الاجتماعية والعملية" 
                  onClick={() => setActiveSettingsTab('demographics')}
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
                  label="تنبيهات مواقيت الصلاة (منبه)" 
                  enabled={userProfile.settings?.notifications.prayerTimes ?? true} 
                  onChange={(val: boolean) => updateSettings({ notifications: { prayerTimes: val } })}
                />
                
                  <div className="flex flex-col gap-3 pt-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs font-bold text-[#4e635a]">
                        <Music size={14} />
                        <span>نغمة المنبه</span>
                      </div>
                      <button 
                        onClick={() => {
                          const ringtone = RINGTONES.find(r => r.id === (userProfile.settings?.notifications.ringtone || 'official-prayer'));
                          if (ringtone) {
                             const audio = new Audio(ringtone.url);
                             audio.volume = 0.5;
                             audio.play();
                             setTimeout(() => audio.pause(), 5000);
                          }
                        }}
                        className="text-[10px] font-black text-blue-600 hover:underline"
                      >
                        استماع سريع
                      </button>
                    </div>
                    <select 
                      value={userProfile.settings?.notifications.ringtone || 'official-prayer'}
                      onChange={(e) => {
                        const newId = e.target.value;
                        updateSettings({ notifications: { ringtone: newId } });
                        // Voice preview
                        const ringtone = RINGTONES.find(r => r.id === newId);
                        if (ringtone) {
                          const audio = new Audio(ringtone.url);
                          audio.volume = 0.4;
                          audio.play();
                          setTimeout(() => audio.pause(), 3000); // 3 sec preview
                        }
                      }}
                      className="w-full bg-white/5 border border-[#4e635a]/20 rounded-xl p-3 text-sm font-bold text-[#1b1c1a] focus:ring-2 focus:ring-[#4e635a]/50 outline-none appearance-none"
                    >
                      {RINGTONES.map(r => (
                        <option key={r.id} value={r.id}>{r.name}</option>
                      ))}
                    </select>
                  </div>

                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      window.dispatchEvent(new CustomEvent('test-prayer-alarm', { 
                        detail: { ringtoneId: userProfile.settings?.notifications.ringtone } 
                      }));
                    }}
                    className="w-full py-4 px-4 rounded-2xl bg-[#4e635a] text-white font-black text-xs shadow-lg shadow-[#4e635a]/20 flex items-center justify-center gap-3 border border-white/10"
                  >
                    <Bell size={18} className="animate-bounce" />
                    <span>تجربة المنبه بالشكل الكامل</span>
                  </motion.button>
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
                
                <div className="space-y-4 pt-4 border-t border-[#4e635a]/10">
                   <motion.button 
                     whileTap={{ scale: 0.95 }}
                     onClick={exportDataAsPDF}
                     disabled={isExporting}
                     className="w-full p-4 glass-3d rounded-2xl flex items-center gap-4 text-right hover:bg-white/40 transition-all disabled:opacity-50"
                   >
                     <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center shadow-inner">
                       {isExporting ? <Loader2 size={20} className="animate-spin" /> : <Download size={20} />}
                     </div>
                     <div>
                       <p className="font-bold text-[#1b1c1a]">تصدير سجل الرحلة (PDF)</p>
                       <p className="text-[10px] text-[#727875] font-bold">تحميل مذكراتك وإحصائياتك كتقرير روحي</p>
                     </div>
                   </motion.button>

                   <div className="p-4 bg-red-50 text-red-600 rounded-2xl text-center font-bold cursor-pointer hover:bg-red-100 transition-colors">
                     حذف كافة البيانات الشخصية
                   </div>
                </div>
              </motion.div>
            ) : activeSettingsTab === 'appearance' ? (
              <motion.div 
                key="appearance-settings"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="p-4 space-y-6"
              >
                <div className="flex items-center justify-between p-4 glass-3d rounded-2xl">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#4e635a]/10 text-[#4e635a] rounded-xl flex items-center justify-center">
                        {userProfile.settings?.appearance?.darkMode ? <Moon size={20} /> : <Sun size={20} />}
                      </div>
                      <div>
                        <p className="font-bold text-[#1b1c1a]">الوضع الليلي</p>
                        <p className="text-[10px] text-[#727875] font-bold">مريح للعين في صلاة الليل والفجر</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => updateSettings({ appearance: { ...userProfile.settings?.appearance, darkMode: !userProfile.settings?.appearance?.darkMode } })}
                      className={cn(
                        "w-14 h-8 rounded-full p-1 transition-colors duration-300",
                        userProfile.settings?.appearance?.darkMode ? "bg-emerald-600" : "bg-[#e4e2df]"
                      )}
                    >
                      <motion.div 
                        animate={{ x: userProfile.settings?.appearance?.darkMode ? 24 : 0 }}
                        className="w-6 h-6 bg-white rounded-full shadow-sm"
                      />
                    </button>
                </div>

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
            ) : activeSettingsTab === 'location' ? (
              <motion.div 
                key="location-settings"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="p-4 space-y-6"
              >
                <div className="glass-3d p-6 rounded-3xl bg-[#4e635a]/5 border border-[#4e635a]/10 space-y-4">
                   <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-[#4e635a] text-white rounded-2xl flex items-center justify-center shadow-lg">
                        <Target size={24} />
                      </div>
                      <div>
                        <p className="font-black text-[#1b1c1a]">موقعك الحالي</p>
                        <p className="text-xs text-[#727875] font-bold">للحصول على مواقيت صلاة دقيقة</p>
                      </div>
                   </div>

                   <div className="p-4 bg-white/60 backdrop-blur-md rounded-2xl border border-white/40 space-y-2">
                      <div className="flex justify-between text-xs font-bold text-[#4e635a]">
                        <span>خط العرض:</span>
                        <span>{userProfile.coords?.lat?.toFixed(4) || 'غير محدد'}</span>
                      </div>
                      <div className="flex justify-between text-xs font-bold text-[#4e635a]">
                        <span>خط الطول:</span>
                        <span>{userProfile.coords?.lng?.toFixed(4) || 'غير محدد'}</span>
                      </div>
                   </div>

                   <motion.button 
                     whileTap={{ scale: 0.95 }}
                     onClick={() => {
                        setIsUpdatingLocation(true);
                        window.dispatchEvent(new CustomEvent('request-location-update'));
                        setTimeout(() => setIsUpdatingLocation(false), 2000);
                     }}
                     disabled={isUpdatingLocation}
                     className="w-full py-4 bg-[#4e635a] text-white rounded-2xl font-black text-sm flex items-center justify-center gap-3 shadow-lg shadow-[#4e635a]/20 disabled:opacity-50"
                   >
                     <RefreshCw size={20} className={cn(isUpdatingLocation && "animate-spin")} />
                     <span>{isUpdatingLocation ? 'جاري التحديث...' : 'تحديث الموقع الآن'}</span>
                   </motion.button>
                </div>

                <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100">
                   <p className="text-xs font-bold text-amber-700 leading-relaxed">
                     سيتم استخدام موقعك الجغرافي فقط لحساب مواقيت الصلاة بدقة حسب مدينتك الحالية. لا يتم مشاركة موقعك مع أي طرف ثالث.
                   </p>
                </div>
              </motion.div>
            ) : activeSettingsTab === 'demographics' ? (
              <motion.div 
                key="demographics-settings"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="p-4 space-y-6"
              >
                {(() => {
                  const demo = userProfile.demographics || { gender: 'male', maritalStatus: 'single', job: 'student' };
                  return (
                    <div className="space-y-6">
                      <div className="bg-[#4e635a]/5 p-5 rounded-[32px] border border-[#4e635a]/10 text-center space-y-1.5">
                        <span className="text-xs font-black text-[#4e635a] uppercase tracking-widest block">وعي رفيقك "سند"</span>
                        <p className="text-xs text-[#1b1c1a]/80 font-medium leading-relaxed">
                          هذه البيانات تُشكّل فقه سند ونبرة خطابه العملية معك لإعطائك توجيهات واقعية تناسب وضعك تماماً.
                        </p>
                      </div>

                      {/* Gender Selection */}
                      <div className="space-y-3">
                        <label className="text-sm font-black text-[#4e635a] mr-2 block">الجنس</label>
                        <div className="grid grid-cols-2 gap-3">
                          {[
                            { id: 'male', label: 'شاب / رجل' },
                            { id: 'female', label: 'فتاة / امرأة' }
                          ].map(item => (
                            <button
                              key={item.id}
                              onClick={() => updateDemographics({ gender: item.id as any })}
                              className={cn(
                                "py-4 rounded-2xl font-bold transition-all text-sm flex items-center justify-center gap-2 cursor-pointer",
                                demo.gender === item.id 
                                  ? "bg-[#4e635a] text-white shadow-lg shadow-[#4e635a]/20" 
                                  : "bg-[#4e635a]/5 text-[#4e635a]"
                              )}
                            >
                              <span>{item.label}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Marital Status */}
                      <div className="space-y-3">
                        <label className="text-sm font-black text-[#4e635a] mr-2 block">الحالة الاجتماعية</label>
                        <div className="grid grid-cols-2 gap-3">
                          {[
                            { id: 'single', label: 'أعزب / عازب' },
                            { id: 'married', label: 'متزوج' }
                          ].map(item => (
                            <button
                              key={item.id}
                              onClick={() => updateDemographics({ maritalStatus: item.id as any })}
                              className={cn(
                                "py-4 rounded-2xl font-bold transition-all text-sm flex items-center justify-center gap-2 cursor-pointer",
                                demo.maritalStatus === item.id 
                                  ? "bg-[#4e635a] text-white shadow-lg shadow-[#4e635a]/20" 
                                  : "bg-[#4e635a]/5 text-[#4e635a]"
                              )}
                            >
                              <span>{item.label}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Job Status */}
                      <div className="space-y-3">
                        <label className="text-sm font-black text-[#4e635a] mr-2 block">الحالة المهنية / العملية</label>
                        <div className="grid grid-cols-2 gap-3">
                          {[
                            { id: 'student', label: 'طالب / يدرس' },
                            { id: 'employed', label: 'موظف' },
                            { id: 'unemployed', label: 'باحث عن عمل' },
                            { id: 'business', label: 'عمل خاص / مستقل' }
                          ].map(item => (
                            <button
                              key={item.id}
                              onClick={() => updateDemographics({ job: item.id as any })}
                              className={cn(
                                "py-4 rounded-2xl font-bold transition-all text-xs flex items-center justify-center gap-2 cursor-pointer",
                                demo.job === item.id 
                                  ? "bg-[#4e635a] text-white shadow-lg shadow-[#4e635a]/20" 
                                  : "bg-[#4e635a]/5 text-[#4e635a]"
                              )}
                            >
                              <span>{item.label}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </motion.div>
            ) : (
              <div className="p-8 text-center text-[#727875] font-bold">
                اختر قسماً من الإعدادات أعلاه
              </div>
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
