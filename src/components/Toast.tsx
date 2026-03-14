import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

interface ToastProps {
  message: string;
  type: 'success' | 'error';
  isVisible: boolean;
  onClose: () => void;
}

export default function Toast({ message, type, isVisible, onClose }: ToastProps) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50, x: '-50%' }}
          animate={{ opacity: 1, y: 0, x: '-50%' }}
          exit={{ opacity: 0, y: 20, x: '-50%' }}
          className={`fixed bottom-8 left-1/2 z-[100] flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl border backdrop-blur-md ${
            type === 'success' 
              ? 'bg-emerald-500/90 border-emerald-400 text-white' 
              : 'bg-red-500/90 border-red-400 text-white'
          }`}
        >
          {type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          <span className="font-bold text-sm">{message}</span>
          <button onClick={onClose} className="ml-4 p-1 hover:bg-white/20 rounded-lg transition-colors">
            <X className="w-4 h-4" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
