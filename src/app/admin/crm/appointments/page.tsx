'use client';

import { useState, useEffect } from 'react';
import { 
  Calendar as CalendarIcon, Plus, ChevronLeft, ChevronRight, 
  Search, Clock, MapPin, User, MoreVertical, 
  Filter, CheckCircle2, XCircle, AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import api from '@/lib/axios';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';

import { AppointmentModal } from '@/components/modals/appointment-modal';

const STATUS_CONFIG: any = {
  SCHEDULED: { label: 'Sắp tới', color: 'blue', icon: Clock },
  COMPLETED: { label: 'Hoàn thành', color: 'emerald', icon: CheckCircle2 },
  CANCELLED: { label: 'Đã hủy', color: 'slate', icon: XCircle },
  NO_SHOW: { label: 'Vắng mặt', color: 'rose', icon: AlertCircle },
};

const TYPE_CONFIG: any = {
  CONSULTATION: { label: 'Tư vấn', color: 'emerald' },
  TRIAL_LEARNING: { label: 'Học thử', color: 'blue' },
  FEEDBACK: { label: 'Góp ý', color: 'amber' },
  OTHER: { label: 'Khác', color: 'slate' },
};

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [leads, setLeads] = useState<any[]>([]);

  useEffect(() => {
    fetchAppointments();
    fetchLeads();
  }, [selectedDate]);

  const fetchLeads = async () => {
    try {
      const response: any = await api.get('/crm/leads');
      if (response.success) {
        setLeads(response.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const response: any = await api.get('/crm/appointments');
      if (response.success) {
        setAppointments(response.data);
      }
    } catch (error) {
      toast.error('Lỗi khi tải lịch hẹn');
    } finally {
      setLoading(false);
    }
  };

  const getStatusStyle = (status: string) => {
    const config = STATUS_CONFIG[status] || STATUS_CONFIG.SCHEDULED;
    return `bg-${config.color}-500/10 text-${config.color}-400 border-${config.color}-500/20`;
  };

  return (
    <div className="flex-1 flex flex-col h-screen bg-slate-950">
      <AppointmentModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchAppointments}
        leads={leads}
      />
      {/* HEADER */}
      <div className="p-8 border-b border-slate-900 bg-slate-950/50 backdrop-blur-md sticky top-0 z-10 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tighter uppercase mb-1">Lịch hẹn tư vấn</h1>
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Quản lý thời gian và tương tác khách hàng</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-slate-900 rounded-xl p-1 border border-slate-800">
             <button className="px-4 py-2 text-[10px] font-black uppercase tracking-widest text-white bg-white/5 rounded-lg">Danh sách</button>
             <button className="px-4 py-2 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-slate-300">Lịch tuần</button>
          </div>
          <Button onClick={() => setIsModalOpen(true)} className="h-12 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-[11px] uppercase tracking-widest rounded-xl gap-2 shadow-lg shadow-emerald-900/20">
            <Plus className="h-4 w-4" /> Đặt lịch mới
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden flex">
        {/* SIDEBAR: DATE PICKER & FILTERS */}
        <div className="w-80 border-r border-slate-900 p-8 space-y-10 overflow-y-auto">
          <div className="space-y-4">
             <h3 className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Chọn ngày</h3>
             <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800 text-center">
                <div className="flex items-center justify-between mb-4">
                   <button className="h-8 w-8 rounded-full hover:bg-white/5 flex items-center justify-center text-slate-400">
                      <ChevronLeft className="h-4 w-4" />
                   </button>
                   <span className="text-xs font-black text-white uppercase tracking-wider">Tháng 4, 2026</span>
                   <button className="h-8 w-8 rounded-full hover:bg-white/5 flex items-center justify-center text-slate-400">
                      <ChevronRight className="h-4 w-4" />
                   </button>
                </div>
                <div className="grid grid-cols-7 gap-1 text-[9px] font-black text-slate-600 mb-2">
                   {['T2','T3','T4','T5','T6','T7','CN'].map(d => <span key={d}>{d}</span>)}
                </div>
                <div className="grid grid-cols-7 gap-1">
                   {Array(30).fill(0).map((_, i) => (
                     <button key={i} className={cn(
                       "h-8 rounded-lg flex items-center justify-center text-[11px] font-bold transition-all",
                       i + 1 === 28 ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20" : "text-slate-400 hover:bg-white/5"
                     )}>
                       {i + 1}
                     </button>
                   ))}
                </div>
             </div>
          </div>

          <div className="space-y-4">
             <h3 className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Bộ lọc trạng thái</h3>
             <div className="space-y-2">
                {Object.entries(STATUS_CONFIG).map(([key, config]: [string, any]) => (
                  <button key={key} className="w-full flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-transparent hover:border-white/10 transition-all text-left group">
                     <div className="flex items-center gap-3">
                        <div className={`h-2 w-2 rounded-full bg-${config.color}-500`} />
                        <span className="text-xs font-bold text-slate-300 group-hover:text-white">{config.label}</span>
                     </div>
                     <span className="text-[10px] font-black text-slate-600">12</span>
                  </button>
                ))}
             </div>
          </div>
        </div>

        {/* MAIN CONTENT: APPOINTMENTS LIST */}
        <div className="flex-1 bg-slate-950/50 p-8 overflow-y-auto custom-scrollbar">
           {loading ? (
             <div className="flex flex-col items-center justify-center py-40 gap-4">
                <Clock className="h-10 w-10 text-emerald-500 animate-spin" />
                <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em]">Đang đồng bộ lịch hẹn...</p>
             </div>
           ) : appointments.length > 0 ? (
             <div className="space-y-8 max-w-4xl mx-auto">
                <div className="flex items-center gap-4">
                   <div className="h-px flex-1 bg-slate-900" />
                   <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">Hôm nay, 28 tháng 04</span>
                   <div className="h-px flex-1 bg-slate-900" />
                </div>

                <div className="space-y-4">
                   {appointments.map((app, idx) => {
                     const status = STATUS_CONFIG[app.status] || STATUS_CONFIG.SCHEDULED;
                     const type = TYPE_CONFIG[app.type] || TYPE_CONFIG.OTHER;
                     
                     return (
                        <motion.div 
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.05 }}
                          key={app.id} 
                          className="group relative bg-slate-900/40 border border-slate-900 rounded-[2rem] p-6 hover:bg-slate-900 hover:border-slate-800 transition-all flex items-center gap-8"
                        >
                           <div className="w-24 shrink-0 text-center border-r border-slate-800 pr-8">
                              <p className="text-xl font-black text-white italic">{new Date(app.startTime).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}</p>
                              <p className="text-[10px] font-bold text-slate-500 uppercase mt-1">Đến {new Date(app.endTime).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}</p>
                           </div>

                           <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-3 mb-2">
                                 <span className={cn(
                                   "px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border",
                                   getStatusStyle(app.status)
                                 )}>
                                    {status.label}
                                 </span>
                                 <span className={`text-[9px] font-black text-${type.color}-400 uppercase tracking-widest`}>
                                    • {type.label}
                                 </span>
                              </div>
                              <h3 className="text-lg font-black text-white uppercase tracking-tight truncate group-hover:text-emerald-400 transition-colors">
                                 {app.title}
                              </h3>
                              <div className="flex items-center gap-6 mt-3">
                                 <div className="flex items-center gap-2 text-[11px] font-bold text-slate-500">
                                    <User className="h-3.5 w-3.5" />
                                    <span>Khách hàng: <span className="text-slate-300">{leads.find(l => l.id === app.leadId)?.fullName || 'Không rõ'}</span></span>
                                 </div>
                                 <div className="flex items-center gap-2 text-[11px] font-bold text-slate-500">
                                    <MapPin className="h-3.5 w-3.5" />
                                    <span>Online (Google Meet)</span>
                                 </div>
                              </div>
                           </div>

                           <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Button variant="ghost" className="h-10 w-10 rounded-full hover:bg-emerald-500/10 hover:text-emerald-400 p-0">
                                 <CheckCircle2 className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" className="h-10 w-10 rounded-full hover:bg-slate-800 text-slate-500 p-0">
                                 <MoreVertical className="h-4 w-4" />
                              </Button>
                           </div>
                        </motion.div>
                     );
                   })}
                </div>
             </div>
           ) : (
             <div className="flex flex-col items-center justify-center py-40 gap-6">
                <div className="h-24 w-24 bg-slate-900 rounded-full flex items-center justify-center border border-slate-800">
                   <CalendarIcon className="h-10 w-10 text-slate-700" />
                </div>
                <div className="text-center">
                   <p className="text-sm font-black text-slate-500 uppercase tracking-widest">Không có lịch hẹn nào</p>
                   <p className="text-[10px] font-bold text-slate-600 mt-2">Hãy bắt đầu bằng cách đặt lịch tư vấn cho khách hàng của bạn.</p>
                </div>
                <Button onClick={() => setIsModalOpen(true)} className="bg-white text-black hover:bg-slate-200 font-black text-[10px] uppercase tracking-widest px-8 h-12 rounded-xl mt-4">
                   Đặt lịch ngay
                </Button>
             </div>
           )}
        </div>
      </div>
    </div>
  );
}
