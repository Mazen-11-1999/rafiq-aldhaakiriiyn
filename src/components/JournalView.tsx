import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, Send, CheckCircle2, History, Sparkles, Feather, Trash2 } from 'lucide-react';
import { db, auth } from '../lib/firebase';
import { collection, query, where, orderBy, onSnapshot, addDoc, serverTimestamp, deleteDoc, doc } from 'firebase/firestore';
import { handleFirestoreError } from '../lib/firestore-errors';
import { OperationType } from '../types';

import { UserProfile } from '../types';

interface ReflectionEntry {
  id: string;
  text: string;
  createdAt: any;
  userId: string;
}

export default function JournalView({ userProfile }: { userProfile: UserProfile | null }) {
  const [reflection, setReflection] = useState('');
  const [notes, setNotes] = useState<ReflectionEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const reflectionsRef = collection(db, 'users', user.uid, 'reflections');
    const q = query(reflectionsRef, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const entries = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as ReflectionEntry[];
      setNotes(entries);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, `users/${user.uid}/reflections`);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const [showEthicGuard, setShowEthicGuard] = useState(false);

  const addReflection = async () => {
    if (!reflection.trim()) return;
    setShowEthicGuard(true);
  };

  const confirmAddReflection = async () => {
    const user = auth.currentUser;
    if (!user) return;

    try {
      const reflectionsRef = collection(db, 'users', user.uid, 'reflections');
      await addDoc(reflectionsRef, {
        userId: user.uid,
        text: reflection,
        createdAt: serverTimestamp()
      });
      setReflection('');
      setShowEthicGuard(false);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `users/${user.uid}/reflections`);
    }
  };

  const deleteReflection = async (id: string) => {
    const user = auth.currentUser;
    if (!user) return;

    try {
      const docRef = doc(db, 'users', user.uid, 'reflections', id);
      await deleteDoc(docRef);
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `users/${user.uid}/reflections/${id}`);
    }
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return '';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const dateFormat = userProfile?.settings?.appearance.dateFormat ?? 'arabic';
    
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };

    try {
      if (dateFormat === 'arabic') {
        return date.toLocaleDateString('ar-SA-u-ca-islamic-uma', options);
      }
      return date.toLocaleDateString('ar-YE', options);
    } catch (e) {
      return date.toLocaleString('ar-SA');
    }
  };

  return (
    <div className="p-margin-page space-y-section-gap pb-12">
      <header className="space-y-4">
        <h2 className="text-3xl font-bold text-[#4e635a] font-serif">مذكرات النور</h2>
        <p className="text-[#655d51] font-medium opacity-80">سجل لحظات امتنانك وتأملاتك اليومية لتكون لك نور في دربك .</p>
      </header>

      {/* Writing Area */}
      <section className="bg-white/60 backdrop-blur-sm p-8 rounded-[40px] border border-white shadow-sm space-y-6">
        <div className="flex items-center gap-3 text-[#4e635a]">
            <div className="p-2 bg-[#d1e8dd] rounded-xl">
              <Feather size={20} />
            </div>
            <h3 className="font-bold text-lg">بماذا يهمس قلبك الآن؟</h3>
        </div>
        
        <div className="relative">
            <textarea
                value={reflection}
                onChange={(e) => setReflection(e.target.value)}
                placeholder="اكتب هنا ما يمتن له قلبك، أو تأملاً في آية، أو شعوراً ترغب في تدوينه..."
                className="w-full bg-[#fbf9f6]/80 rounded-[32px] p-6 text-lg text-[#4e635a] placeholder:text-[#4e635a]/30 border-none focus:ring-2 focus:ring-[#4e635a]/20 min-h-[160px] transition-all scrollbar-hide"
            />
            <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={addReflection}
                disabled={!reflection.trim()}
                className="absolute left-4 bottom-4 w-14 h-14 bg-[#4e635a] text-white rounded-2xl flex items-center justify-center shadow-2xl shadow-[#4e635a]/20 transform active:scale-90 transition-all disabled:opacity-30"
            >
                <Send size={24} className="translate-x-[-2px] translate-y-[2px]" />
            </motion.button>
        </div>
      </section>

      <AnimatePresence>
        {showEthicGuard && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-[40px] p-8 max-w-sm w-full shadow-2xl text-center space-y-6"
            >
              <div className="w-16 h-16 bg-[#4e635a]/10 text-[#4e635a] rounded-full flex items-center justify-center mx-auto">
                <Sparkles size={32} />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-[#1b1c1a] font-serif">أثر بصمتك</h3>
                <p className="text-[#655d51] text-sm leading-relaxed">
                  تذكر أن كل كلمة تكتبها هي شهادة لك أو عليك. هل تعتقد أن ما كتبتَه يرضي رب العالمين وينفعك في آخرتك؟
                </p>
              </div>
              <div className="flex flex-col gap-3">
                <button 
                  onClick={confirmAddReflection}
                  className="w-full py-4 bg-[#4e635a] text-white rounded-2xl font-bold shadow-lg shadow-[#4e635a]/20 active:scale-95 transition-all"
                >
                  نعم، انشر الخير
                </button>
                <button 
                  onClick={() => setShowEthicGuard(false)}
                  className="w-full py-4 bg-[#fbf9f6] text-[#4e635a] rounded-2xl font-bold active:scale-95 transition-all"
                >
                  أريد مراجعة قولي
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* History Area */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-[#4e635a]/60">
                <History size={18} />
                <h3 className="font-bold uppercase tracking-widest text-xs">سجل التأملات</h3>
            </div>
            <span className="text-[10px] font-bold text-[#4e635a]/30 bg-[#4e635a]/5 px-3 py-1 rounded-full">{notes.length} تدوينات</span>
        </div>

        <div className="space-y-4">
            <AnimatePresence>
                {loading ? (
                    <div className="flex justify-center py-12">
                      <div className="w-8 h-8 border-4 border-[#4e635a]/20 border-t-[#4e635a] rounded-full animate-spin" />
                    </div>
                ) : notes.length === 0 ? (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-20 bg-white/20 rounded-[40px] border border-dashed border-[#e4e2df]"
                    >
                        <BookOpen size={48} className="mx-auto text-[#e4e2df] mb-4" />
                        <p className="text-[#655d51]/50 font-medium italic">صفحاتك لا تزال بيضاء.. ابدأ بالتدوين</p>
                    </motion.div>
                ) : (
                    notes.map((note) => (
                        <motion.div 
                            key={note.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white/80 p-6 rounded-[32px] border border-white shadow-sm flex gap-4 group/note hover:shadow-md transition-all"
                        >
                            <div className="shrink-0 mt-1">
                              <div className="w-10 h-10 rounded-2xl bg-[#d1e8dd] flex items-center justify-center text-[#4e635a]">
                                <Sparkles size={20} />
                              </div>
                            </div>
                            <div className="flex-1 space-y-2">
                                <p className="text-[#1b1c1a] font-serif leading-relaxed text-lg">{note.text}</p>
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2 text-[#4e635a]/40 text-xs font-bold">
                                     <CheckCircle2 size={12} />
                                     <span>{formatDate(note.createdAt)}</span>
                                  </div>
                                  <button 
                                    onClick={() => deleteReflection(note.id)}
                                    className="opacity-0 group-hover/note:opacity-100 p-2 text-red-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                  >
                                    <Trash2 size={16} />
                                  </button>
                                </div>
                            </div>
                        </motion.div>
                    ))
                )}
            </AnimatePresence>
        </div>
      </section>
    </div>
  );
}
