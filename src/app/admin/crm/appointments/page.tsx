'use client';

import { useState, useEffect } from 'react';
import { 
  Calendar as CalendarIcon, Plus, ChevronLeft, ChevronRight, 
  Search, Clock, MapPin, User, MoreVertical, 
  Filter, CheckCircle2, XCircle, AlertCircle, Edit, Trash2
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
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<any>(null);
  const [viewMode, setViewMode] = useState<'list' | 'week'>('list');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
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

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      const response: any = await api.patch(`/crm/appointments/${id}`, { status });
      if (response.success) {
        setAppointments(prev => prev.map(app => app.id === id ? { ...app, status } : app));
        toast.success('Đã cập nhật trạng thái lịch hẹn');
      }
    } catch (error) {
      toast.error('Lỗi khi cập nhật trạng thái');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa lịch hẹn này?')) return;
    try {
      const response: any = await api.delete(`/crm/appointments/${id}`);
      if (response.success) {
        setAppointments(prev => prev.filter(app => app.id !== id));
        toast.success('Đã xóa lịch hẹn');
      }
    } catch (error) {
      toast.error('Lỗi khi xóa lịch hẹn');
    }
  };

  const getStatusStyle = (status: string) => {
    const config = STATUS_CONFIG[status] || STATUS_CONFIG.SCHEDULED;
    return `bg-${config.color}-500/10 text-${config.color}-400 border-${config.color}-500/20`;
  };

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    const day = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    return day === 0 ? 6 : day - 1; // Convert Sunday=0 to Monday=0
  };

  const daysInMonth = getDaysInMonth(currentMonth);
  const firstDay = getFirstDayOfMonth(currentMonth);

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const filteredAppointments = appointments.filter(app => {
    const d = new Date(app.startTime);
    const dateMatch = d.toDateString() === selectedDate.toDateString();
    const statusMatch = statusFilter === 'ALL' || app.status === statusFilter;
    return dateMatch && statusMatch;
  });

  const getStatusCount = (status: string) => {
    if (status === 'ALL') return appointments.length;
    return appointments.filter(a => a.status === status).length;
  };

  return (
    <div className="flex-1 flex flex-col h-screen bg-slate-950">
      <AppointmentModal 
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setEditingAppointment(null); }}
        onSuccess={fetchAppointments}
        leads={leads}
        appointment={editingAppointment}
      />
      {/* HEADER */}
      <div className="p-8 border-b border-slate-900 bg-slate-950/50 backdrop-blur-md sticky top-0 z-10 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tighter uppercase mb-1">Lịch hẹn tư vấn</h1>
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Quản lý thời gian và tương tác khách hàng</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-slate-900 rounded-xl p-1 border border-slate-800">
             <button onClick={() => setViewMode('list')} className={cn("px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all", viewMode === 'list' ? "text-white bg-white/5" : "text-slate-500 hover:text-slate-300")}>Danh sách</button>
             <button onClick={() => setViewMode('week')} className={cn("px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all", viewMode === 'week' ? "text-white bg-white/5" : "text-slate-500 hover:text-slate-300")}>Lịch tuần</button>
          </div>
          <Button onClick={() => { setEditingAppointment(null); setIsModalOpen(true); }} className="h-12 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-[11px] uppercase tracking-widest rounded-xl gap-2 shadow-lg shadow-emerald-900/20">
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
                   <button onClick={prevMonth} className="h-8 w-8 rounded-full hover:bg-white/5 flex items-center justify-center text-slate-400">
                      <ChevronLeft className="h-4 w-4" />
                   </button>
                   <span className="text-xs font-black text-white uppercase tracking-wider">
                     Tháng {currentMonth.getMonth() + 1}, {currentMonth.getFullYear()}
                   </span>
                   <button onClick={nextMonth} className="h-8 w-8 rounded-full hover:bg-white/5 flex items-center justify-center text-slate-400">
                      <ChevronRight className="h-4 w-4" />
                   </button>
                 </div>
                 <div className="grid grid-cols-7 gap-1 text-[9px] font-black text-slate-600 mb-2">
                    {['T2','T3','T4','T5','T6','T7','CN'].map(d => <span key={d}>{d}</span>)}
                 </div>
                 <div className="grid grid-cols-7 gap-1">
                    {Array(firstDay).fill(0).map((_, i) => <div key={`empty-${i}`} />)}
                    {Array(daysInMonth).fill(0).map((_, i) => {
                      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i + 1);
                      const isSelected = date.toDateString() === selectedDate.toDateString();
                      return (
                        <button 
                          key={i} 
                          onClick={() => setSelectedDate(date)}
                          className={cn(
                            "h-8 rounded-lg flex items-center justify-center text-[11px] font-bold transition-all",
                            isSelected ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20" : "text-slate-400 hover:bg-white/5"
                          )}
                        >
                          {i + 1}
                        </button>
                      );
                    })}
                </div>
             </div>
          </div>

        </div>

        {/* MAIN CONTENT: APPOINTMENTS LIST */}
        <div className="flex-1 bg-slate-950/50 p-8 overflow-y-auto custom-scrollbar flex flex-col">
           {/* STATUS FILTERS MOVED HERE */}
           <div className="flex flex-wrap items-center gap-1 mb-8 shrink-0 bg-slate-900/40 p-1.5 rounded-2xl border border-slate-800/50 w-fit">
              <button 
                onClick={() => setStatusFilter('ALL')} 
                className={cn(
                  "px-6 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all",
                  statusFilter === 'ALL' ? "bg-slate-800 text-white shadow-lg" : "text-slate-500 hover:text-slate-300 hover:bg-slate-800/50"
                )}
              >
                 Tất cả ({getStatusCount('ALL')})
              </button>
              {Object.entries(STATUS_CONFIG).map(([key, config]: [string, any]) => {
                const isSelected = statusFilter === key;
                return (
                  <button 
                    key={key} 
                    onClick={() => setStatusFilter(key)}
                    className={cn(
                      "flex items-center gap-2 px-6 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all",
                      isSelected ? `bg-${config.color}-500/10 text-${config.color}-400 shadow-lg shadow-${config.color}-500/5` : "text-slate-500 hover:text-slate-300 hover:bg-slate-800/50"
                    )}
                  >
                     <div className={`h-2 w-2 rounded-full bg-${config.color}-500 ${isSelected ? 'animate-pulse' : ''}`} />
                     {config.label} ({getStatusCount(key)})
                  </button>
                );
              })}
           </div>

           <div className="flex-1 relative">
             {loading ? (
               <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                  <Clock className="h-10 w-10 text-emerald-500 animate-spin" />
                  <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em]">Đang đồng bộ lịch hẹn...</p>
               </div>
           ) : viewMode === 'week' ? (
             <div className="space-y-6">
                <div className="flex items-center gap-4 mb-8">
                   <div className="h-px flex-1 bg-slate-900" />
                   <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">
                     Lịch tuần • {selectedDate.toLocaleDateString('vi-VN', { month: 'long', year: 'numeric' })}
                   </span>
                   <div className="h-px flex-1 bg-slate-900" />
                </div>
                <div className="grid grid-cols-7 gap-4">
                  {Array(7).fill(0).map((_, idx) => {
                    // Start week from Monday
                    const day = new Date(selectedDate);
                    const currentDayIndex = day.getDay() === 0 ? 6 : day.getDay() - 1;
                    day.setDate(day.getDate() - currentDayIndex + idx);
                    
                    const dayAppointments = appointments.filter(app => {
                      const d = new Date(app.startTime);
                      const dateMatch = d.toDateString() === day.toDateString();
                      const statusMatch = statusFilter === 'ALL' || app.status === statusFilter;
                      return dateMatch && statusMatch;
                    });
                    const isToday = day.toDateString() === new Date().toDateString();
                    
                    return (
                      <div key={idx} className="flex flex-col gap-3">
                        <div className={cn("text-center p-3 rounded-2xl border", isToday ? "bg-emerald-500/10 border-emerald-500/50" : "bg-slate-900/40 border-slate-800")}>
                           <p className={cn("text-[9px] font-black uppercase tracking-widest", isToday ? "text-emerald-500" : "text-slate-500")}>
                             {['T2','T3','T4','T5','T6','T7','CN'][idx]}
                           </p>
                           <p className={cn("text-xl font-black mt-1", isToday ? "text-emerald-400" : "text-slate-300")}>{day.getDate()}</p>
                        </div>
                        <div className="flex flex-col gap-2">
                           {dayAppointments.map(app => {
                             const type = TYPE_CONFIG[app.type] || TYPE_CONFIG.OTHER;
                             return (
                               <div key={app.id} onClick={() => { setEditingAppointment(app); setIsModalOpen(true); }} className="p-3 bg-slate-900 rounded-xl border border-slate-800 hover:border-slate-700 cursor-pointer transition-all group">
                                  <p className="text-[10px] font-black text-white truncate group-hover:text-emerald-400">{app.title}</p>
                                  <div className="flex items-center justify-between mt-2">
                                     <span className="text-[9px] font-bold text-slate-500">{new Date(app.startTime).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}</span>
                                     <div className={`h-2 w-2 rounded-full bg-${type.color}-500`} />
                                  </div>
                               </div>
                             );
                           })}
                           {dayAppointments.length === 0 && (
                             <div className="h-20 border border-dashed border-slate-800 rounded-xl flex items-center justify-center opacity-50">
                                <span className="text-[9px] font-black text-slate-600 uppercase">Trống</span>
                             </div>
                           )}
                        </div>
                      </div>
                    );
                  })}
                </div>
             </div>
           ) : filteredAppointments.length > 0 ? (
             <div className="space-y-8 max-w-5xl">
                <div className="flex items-center gap-4">
                   <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">
                     {selectedDate.toLocaleDateString('vi-VN', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' })}
                   </span>
                   <div className="h-px flex-1 bg-slate-800/50" />
                </div>

                <div className="space-y-4">
                   {filteredAppointments.map((app, idx) => {
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
                              <Button 
                                onClick={() => { setEditingAppointment(app); setIsModalOpen(true); }}
                                variant="ghost" 
                                title="Chỉnh sửa lịch hẹn"
                                className="h-10 w-10 rounded-full hover:bg-blue-500/10 hover:text-blue-400 text-slate-500 p-0"
                              >
                                 <Edit className="h-4 w-4" />
                              </Button>
                              {app.status !== 'COMPLETED' && (
                                <Button 
                                  onClick={() => handleUpdateStatus(app.id, 'COMPLETED')}
                                  variant="ghost" 
                                  title="Đánh dấu hoàn thành"
                                  className="h-10 w-10 rounded-full hover:bg-emerald-500/10 hover:text-emerald-400 p-0"
                                >
                                   <CheckCircle2 className="h-4 w-4" />
                                </Button>
                              )}
                              <Button 
                                onClick={() => handleDelete(app.id)}
                                variant="ghost" 
                                title="Xóa lịch hẹn"
                                className="h-10 w-10 rounded-full hover:bg-rose-500/10 hover:text-rose-400 text-slate-500 p-0"
                              >
                                 <XCircle className="h-4 w-4" />
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
    </div>
  );
}
