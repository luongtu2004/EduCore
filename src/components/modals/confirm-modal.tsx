'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'info';
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = 'Xác nhận hành động',
  message,
  confirmText = 'Xác nhận',
  cancelText = 'Hủy',
  type = 'danger'
}: ConfirmModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="bg-white rounded-[2rem] w-full max-w-md overflow-hidden shadow-2xl"
          >
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <div className={`h-14 w-14 rounded-2xl flex items-center justify-center ${
                  type === 'danger' ? 'bg-red-50 text-red-500' : 
                  type === 'warning' ? 'bg-amber-50 text-amber-500' : 
                  'bg-emerald-50 text-emerald-500'
                }`}>
                  <AlertTriangle className="h-7 w-7" />
                </div>
                <button 
                  onClick={onClose}
                  className="p-2 rounded-full hover:bg-slate-50 text-slate-400 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <h3 className="text-2xl font-black text-slate-900 mb-3 tracking-tight uppercase italic leading-none">{title}</h3>
              <p className="text-slate-500 font-medium leading-relaxed">{message}</p>
            </div>

            <div className="p-8 bg-slate-50/50 border-t border-slate-100 flex gap-3">
              <Button
                variant="outline"
                onClick={onClose}
                className="flex-1 h-12 rounded-xl font-bold text-[11px] uppercase tracking-widest border-slate-200 hover:bg-white transition-all"
              >
                {cancelText}
              </Button>
              <Button
                onClick={() => {
                  onConfirm();
                  onClose();
                }}
                className={`flex-1 h-12 rounded-xl font-bold text-[11px] uppercase tracking-widest text-white shadow-lg transition-all ${
                  type === 'danger' ? 'bg-red-500 hover:bg-red-600 shadow-red-200' :
                  type === 'warning' ? 'bg-amber-500 hover:bg-amber-600 shadow-amber-200' :
                  'bg-emerald-500 hover:bg-emerald-600 shadow-emerald-200'
                }`}
              >
                {confirmText}
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
