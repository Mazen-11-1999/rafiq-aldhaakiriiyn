import React from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';
import { motion, AnimatePresence } from 'motion/react';
import { RefreshCw, X } from 'lucide-react';

const PWAPrompt: React.FC = () => {
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      console.log('SW Registered: ' + r);
    },
    onRegisterError(error) {
      console.log('SW registration error', error);
    },
  });

  const close = () => {
    setOfflineReady(false);
    setNeedRefresh(false);
  };

  return (
    <AnimatePresence>
      {(offlineReady || needRefresh) && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-20 left-4 right-4 md:left-auto md:right-8 md:w-80 z-[100]"
        >
          <div className="bg-[#1b1c1a] text-white p-4 rounded-2xl shadow-2xl border border-white/10 backdrop-blur-md">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-bold text-sm">
                {offlineReady ? 'التطبيق جاهز للعمل بدون انترنت' : 'تحديث جديد متوفر!'}
              </h3>
              <button onClick={close} className="p-1 hover:bg-white/10 rounded-full transition-colors">
                <X size={16} />
              </button>
            </div>
            <p className="text-xs text-white/70 mb-4">
              {offlineReady 
                ? 'يمكنك الآن تصفح الأناشيد والتحديات حتى في حال انقطاع الشبكة.'
                : 'هناك ميزات وأناشيد جديدة بانتظارك. اضغط لتحديث التطبيق الآن.'}
            </p>
            {needRefresh && (
              <button
                onClick={() => updateServiceWorker(true)}
                className="w-full py-2 bg-[#4e635a] hover:bg-[#3d4d46] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all"
              >
                <RefreshCw size={14} />
                تحديث الآن
              </button>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PWAPrompt;
