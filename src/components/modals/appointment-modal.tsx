'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Clock, User, FileText, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import api from '@/lib/axios';
import { toast } from 'react-hot-toast';

interface AppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  leads?: any[];
}

export function AppointmentModal({ isOpen, onClose, onSuccess, leads = [] }: AppointmentModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    leadId: '',
    date: '',
    time: '',
    type: 'CONSULTATION',
    notes: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const startTime = new Date(`${formData.date}T${formData.time}`);
      const endTime = new Date(startTime.getTime() + 60 * 60 * 1000); // Default 1 hour

      const payload = {
        title: formData.title,
        leadId: formData.leadId,
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        type: formData.type,
        notes: formData.notes,
        status: 'SCHEDULED'
      };

      const response: any = await api.post('/crm/appointments', payload);
      if (response.success) {
        toast.success('Đặt lịch hẹn thành công');
        onSuccess();
        onClose();
        setFormData({ title: '', leadId: '', date: '', time: '', type: 'CONSULTATION', notes: '' });
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-lg bg-slate-900 border border-slate-800 shadow-2xl rounded-3xl overflow-hidden flex flex-col"
          >
            <div className="p-6 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black text-white uppercase italic">Đặt lịch hẹn</h2>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Lên lịch tư vấn cho khách hàng</p>
              </div>
              <button onClick={onClose} className="h-8 w-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white transition-colors">
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto max-h-[70vh]">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Tiêu đề lịch hẹn</label>
                <div className="relative">
                  <FileText className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                  <input required
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    type="text" placeholder="VD: Tư vấn khóa học Tiếng Anh"
                    className="w-full h-12 bg-slate-950 border border-slate-800 rounded-xl pl-11 pr-4 text-sm font-bold text-white focus:border-emerald-500 transition-colors outline-none"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Khách hàng</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                  <select required
                    value={formData.leadId}
                    onChange={(e) => setFormData({...formData, leadId: e.target.value})}
                    className="w-full h-12 bg-slate-950 border border-slate-800 rounded-xl pl-11 pr-4 text-sm font-bold text-white focus:border-emerald-500 transition-colors outline-none appearance-none"
                  >
                    <option value="" disabled>Chọn khách hàng...</option>
                    {leads.map(lead => (
                      <option key={lead.id} value={lead.id}>{lead.fullName} ({lead.phone})</option>
                    ))}
                    {leads.length === 0 && <option value="test-id">Demo Lead (Nguyễn Văn A)</option>}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Ngày hẹn</label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                    <input required
                      value={formData.date}
                      onChange={(e) => setFormData({...formData, date: e.target.value})}
                      type="date"
                      className="w-full h-12 bg-slate-950 border border-slate-800 rounded-xl pl-11 pr-4 text-sm font-bold text-white focus:border-emerald-500 transition-colors outline-none"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Giờ bắt đầu</label>
                  <div className="relative">
                    <Clock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                    <input required
                      value={formData.time}
                      onChange={(e) => setFormData({...formData, time: e.target.value})}
                      type="time"
                      className="w-full h-12 bg-slate-950 border border-slate-800 rounded-xl pl-11 pr-4 text-sm font-bold text-white focus:border-emerald-500 transition-colors outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Loại hình</label>
                <div className="grid grid-cols-2 gap-2">
                  {['CONSULTATION', 'TRIAL_LEARNING'].map(type => (
                    <button type="button" key={type}
                      onClick={() => setFormData({...formData, type})}
                      className={cn(
                        "h-10 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all",
                        formData.type === type ? "bg-emerald-500/10 border-emerald-500 text-emerald-400" : "bg-slate-950 border-slate-800 text-slate-500"
                      )}
                    >
                      {type === 'CONSULTATION' ? 'Tư vấn' : 'Học thử'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Ghi chú</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  rows={3}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-sm font-bold text-white focus:border-emerald-500 transition-colors outline-none resize-none"
                  placeholder="Thêm ghi chú cuộc hẹn..."
                />
              </div>

              <Button type="submit" disabled={loading}
                className="w-full h-14 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-[11px] uppercase tracking-widest rounded-xl mt-2"
              >
                {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Xác nhận tạo'}
              </Button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
