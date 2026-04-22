'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, User, Phone, Mail, Sparkles, CheckCircle2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import api from '@/lib/axios';
import { toast } from 'react-hot-toast';

interface ConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
  courseName?: string;
}

export function ConsultationModal({ isOpen, onClose, courseName }: ConsultationModalProps) {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response: any = await api.post('/crm/leads/public', {
        fullName: formData.fullName,
        phone: formData.phone,
        email: formData.email,
        source: 'WEBSITE',
        note: courseName ? `Quan tâm khóa học: ${courseName}` : 'Website - Đăng ký tư vấn',
      });

      if (response.success) {
        setIsSubmitted(true);
      }
    } catch (error) {
      console.error('Error submitting consultation:', error);
      toast.error('Có lỗi xảy ra, vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-lg bg-white rounded-[2.5rem] shadow-2xl overflow-hidden"
          >
            <button
              onClick={onClose}
              className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-900 transition-colors z-10"
            >
              <X className="h-6 w-6" />
            </button>

            {!isSubmitted ? (
              <div className="p-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-10 w-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight uppercase">Đăng ký tư vấn</h2>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Nhận lộ trình cá nhân hóa ngay</p>
                  </div>
                </div>

                {courseName && (
                  <div className="mb-8 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Khóa học quan tâm</p>
                    <p className="text-sm font-black text-emerald-600 uppercase">{courseName}</p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="relative">
                    <User className="absolute left-4 top-4 h-5 w-5 text-slate-400" />
                    <input
                      required
                      type="text"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      placeholder="Họ và tên của bạn"
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold focus:outline-none focus:border-emerald-500/50 transition-all outline-none"
                    />
                  </div>
                  <div className="relative">
                    <Phone className="absolute left-4 top-4 h-5 w-5 text-slate-400" />
                    <input
                      required
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="Số điện thoại liên hệ"
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold focus:outline-none focus:border-emerald-500/50 transition-all outline-none"
                    />
                  </div>
                  <div className="relative">
                    <Mail className="absolute left-4 top-4 h-5 w-5 text-slate-400" />
                    <input
                      required
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="Địa chỉ Email"
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold focus:outline-none focus:border-emerald-500/50 transition-all outline-none"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs tracking-[0.2em] uppercase py-7 rounded-2xl shadow-xl shadow-emerald-100 transition-all mt-4 gap-3 border-none disabled:opacity-50"
                  >
                    {loading ? (
                      <>ĐANG GỬI... <Loader2 className="h-4 w-4 animate-spin" /></>
                    ) : (
                      <>GỬI YÊU CẦU NGAY <Send className="h-4 w-4" /></>
                    )}
                  </Button>
                </form>

                <p className="text-[10px] text-center text-slate-400 font-bold mt-8 uppercase tracking-widest">
                  Cam kết bảo mật thông tin tuyệt đối
                </p>
              </div>
            ) : (
              <div className="p-16 text-center">
                <div className="h-20 w-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce">
                  <CheckCircle2 className="h-10 w-10" />
                </div>
                <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase mb-4">Gửi thành công!</h2>
                <p className="text-slate-500 font-bold leading-relaxed mb-10">
                  Cảm ơn bạn đã tin tưởng EduCore. Đội ngũ chuyên gia của chúng tôi sẽ liên hệ tư vấn cho bạn trong vòng 24h tới.
                </p>
                <Button
                  onClick={() => {
                    setIsSubmitted(false);
                    setFormData({ fullName: '', phone: '', email: '' });
                    onClose();
                  }}
                  className="bg-slate-900 hover:bg-slate-800 text-white font-black text-[10px] tracking-widest uppercase px-10 py-6 rounded-2xl border-none"
                >
                  ĐÓNG CỬA SỔ
                </Button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
