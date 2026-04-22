'use client';

import {
   TrendingUp, Users, ClipboardList, Calendar,
   Sparkles, DollarSign, ArrowUpRight,
   Target, Zap, Activity, UserPlus, Phone, MessageSquare,
   Eye, CheckSquare, Clock, MoreVertical, User,
   Loader2, Home, ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';
import api from '@/lib/axios';
import Link from 'next/link';

export default function CRMDashboard() {
   const [leads, setLeads] = useState<any[]>([]);
   const [loading, setLoading] = useState(true);

   const crmStats = [
      { label: 'Doanh thu tháng', value: '450.2M', icon: DollarSign, color: 'text-emerald-500', bg: 'bg-emerald-500/10', change: '+24%' },
      { label: 'Leads mới', value: leads.length.toString(), icon: Target, color: 'text-blue-500', bg: 'bg-blue-500/10', change: '+12%' },
      { label: 'Học viên', value: '86', icon: UserPlus, color: 'text-purple-500', bg: 'bg-purple-500/10', change: '+8%' },
      { label: 'Tỷ lệ chốt', value: '64%', icon: Zap, color: 'text-orange-500', bg: 'bg-orange-500/10', change: '+5%' },
   ];

   const dailyTasks = [
      { title: 'Gọi lại cho khách hàng mới', time: '09:30', type: 'Call', status: 'Pending' },
      { title: 'Tư vấn lộ trình IELTS', time: '14:00', type: 'Meeting', status: 'Pending' },
      { title: 'Gửi báo giá khóa học', time: '16:00', type: 'Task', status: 'Done' },
   ];

   useEffect(() => {
      const fetchLatestLeads = async () => {
         try {
            const response: any = await api.get('/crm/leads');
            if (response.success) {
               // Lấy 5 leads mới nhất
               setLeads(response.data.slice(0, 5));
            }
         } catch (error) {
            console.error('Lỗi khi tải leads:', error);
         } finally {
            setLoading(false);
         }
      };
      fetchLatestLeads();
   }, []);

   return (
      <div className="min-h-screen bg-slate-900 text-slate-400 p-8">
         {/* BREADCRUMBS */}
         <nav className="flex items-center gap-2 mb-6 text-[10px] font-black uppercase tracking-widest text-slate-600">
            <Link href="/admin" className="hover:text-emerald-500 transition-colors flex items-center gap-1.5">
               <Home className="h-3 w-3" /> Dashboard
            </Link>
            <ChevronRight className="h-3 w-3 opacity-30" />
            <span className="text-white">Hệ thống CRM</span>
         </nav>

         {/* HEADER */}
         <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
            <div className="flex items-center gap-4">
               <div className="h-10 w-2.5 bg-emerald-500 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.3)]" />
               <div>
                  <h1 className="text-2xl font-black text-white tracking-tight uppercase leading-none">Bảng điều khiển kinh doanh</h1>
                  <div className="flex items-center gap-3 mt-2">
                     <span className="flex items-center gap-1.5 text-[9px] font-black text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 uppercase tracking-widest">
                        <Activity className="h-3 w-3" /> Hệ thống Online
                     </span>
                     <p className="text-[11px] font-bold text-slate-500 tracking-tight">Chào buổi sáng, Admin. Hệ thống CRM đã sẵn sàng.</p>
                  </div>
               </div>
         </div>
         </div>

         {/* STATS */}
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
            {crmStats.map((stat) => (
               <div key={stat.label} className="bg-slate-950/50 border border-white/5 p-5 rounded-2xl hover:bg-slate-950 transition-all flex flex-col justify-between h-32 group">
                  <div className="flex items-center justify-between">
                     <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110", stat.bg, stat.color)}>
                        <stat.icon className="h-5 w-5" />
                     </div>
                     <span className="text-[10px] font-black text-emerald-500 tracking-tighter bg-emerald-500/10 px-1.5 py-0.5 rounded">{stat.change}</span>
                  </div>
                  <div>
                     <p className="text-2xl font-black text-white leading-none">{stat.value}</p>
                     <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest mt-2">{stat.label}</p>
                  </div>
               </div>
            ))}
         </div>

         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
               {/* LEADS LIST - REAL DATA */}
               <div className="bg-slate-950/50 border border-white/5 rounded-[2rem] p-8 min-h-[400px]">
                  <div className="flex items-center justify-between mb-8">
                     <div>
                        <h2 className="text-lg font-black text-white uppercase tracking-tight">Leads mới nhất</h2>
                        <p className="text-[10px] text-slate-600 font-bold uppercase mt-1">Dữ liệu thời gian thực từ Database</p>
                     </div>
                     <Button variant="ghost" className="text-[10px] font-black text-emerald-500 uppercase tracking-widest hover:bg-emerald-500/10 px-4">Xem tất cả</Button>
                  </div>

                  <div className="space-y-3">
                     {loading ? (
                        <div className="flex flex-col items-center justify-center py-20 gap-4 opacity-30">
                           <Loader2 className="h-10 w-10 animate-spin" />
                           <p className="text-xs font-black uppercase tracking-[0.2em]">Đang đồng bộ dữ liệu...</p>
                        </div>
                     ) : leads.length > 0 ? (
                        leads.map((lead, i) => (
                           <motion.div
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: i * 0.1 }}
                              key={lead.id}
                              className="flex items-center justify-between p-4 rounded-2xl bg-slate-900/50 border border-transparent hover:bg-slate-950 hover:border-white/5 transition-all group relative"
                           >
                              <div className="flex items-center gap-4">
                                 <div className="h-10 w-10 rounded-xl bg-slate-950 border border-white/5 flex items-center justify-center text-slate-600 font-black text-xs uppercase group-hover:text-emerald-500 transition-all shrink-0">
                                    {lead.fullName?.split(' ').pop()?.charAt(0)}
                                 </div>
                                 <div className="min-w-0">
                                    <div className="flex items-center gap-2">
                                       <p className="text-sm font-black text-white truncate">{lead.fullName}</p>
                                       <span className={cn(
                                          "px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-widest border",
                                          lead.status === 'Hot' ? "bg-red-500/10 text-red-500 border-red-500/20" : lead.status === 'Warm' ? "bg-orange-500/10 text-orange-500 border-orange-500/20" : "bg-blue-500/10 text-blue-500 border-blue-500/20"
                                       )}>
                                          {lead.status || 'Mới'}
                                       </span>
                                    </div>
                                    <div className="flex items-center gap-3 mt-1.5 text-[10px] font-bold">
                                       <span className="text-emerald-500 flex items-center gap-1"><Phone className="h-3 w-3" /> {lead.phone}</span>
                                       <span className="text-slate-600 flex items-center gap-1 border-l border-white/10 pl-3"><User className="h-3 w-3" /> {lead.staff || 'Chưa nhận'}</span>
                                       <span className="text-slate-600 flex items-center gap-1 border-l border-white/10 pl-3"><Clock className="h-3 w-3" /> {new Date(lead.createdAt).toLocaleDateString('vi-VN')}</span>
                                    </div>
                                 </div>
                              </div>

                              <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0">
                                 <Button size="icon" className="h-8 w-8 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-900/20"><Phone className="h-3.5 w-3.5" /></Button>
                                 <Button size="icon" className="h-8 w-8 rounded-lg bg-slate-900 border border-white/10 hover:bg-slate-800 text-slate-400"><MessageSquare className="h-3.5 w-3.5" /></Button>
                              </div>
                           </motion.div>
                        ))
                     ) : (
                        <div className="flex flex-col items-center justify-center py-20 gap-4 opacity-20">
                           <ClipboardList className="h-12 w-12" />
                           <p className="text-sm font-black uppercase tracking-[0.2em]">Chưa có khách hàng đăng ký</p>
                        </div>
                     )}
                  </div>
               </div>

               {/* CHART */}
               <div className="bg-slate-950/50 border border-white/5 rounded-[2rem] p-8">
                  <div className="flex items-center justify-between mb-8">
                     <h2 className="text-lg font-black text-white uppercase tracking-tight">Thống kê Leads</h2>
                     <div className="text-[9px] font-black text-slate-600 uppercase tracking-widest flex gap-4">
                        <span className="flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Website</span>
                        <span className="flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-blue-500" /> Landing Page</span>
                     </div>
                  </div>
                  <div className="h-44 w-full flex items-end justify-between gap-3 px-2">
                     {[45, 60, 30, 80, 55, 90, 70, 40, 85, 100, 65, 50].map((h, i) => (
                        <div key={i} className="flex-1 bg-slate-900 rounded-t-sm relative group hover:bg-emerald-500 transition-all" style={{ height: `${h}%` }}>
                        </div>
                     ))}
                  </div>
               </div>
            </div>

            <div className="flex flex-col gap-6">
               {/* TASKS */}
               <div className="bg-slate-950/50 border border-white/5 rounded-[2rem] p-8 flex-1">
                  <div className="flex items-center justify-between mb-8">
                     <h2 className="text-lg font-black text-white uppercase tracking-tight">Việc hôm nay</h2>
                     <div className="h-8 w-8 rounded-xl bg-white/5 flex items-center justify-center">
                        <CheckSquare className="h-4 w-4 text-emerald-500" />
                     </div>
                  </div>
                  <div className="space-y-6">
                     {dailyTasks.map((task, i) => (
                        <div key={i} className="flex gap-4 relative">
                           <div className="flex flex-col items-center shrink-0">
                              <div className={cn("h-2 w-2 rounded-full mt-1.5 border border-slate-900 shadow-sm", task.status === 'Done' ? "bg-emerald-500 shadow-emerald-500/50" : "bg-slate-700")} />
                              {i !== dailyTasks.length - 1 && <div className="flex-1 w-[1px] bg-white/5 my-1" />}
                           </div>
                           <div className="pb-4">
                              <p className={cn("text-xs font-black transition-colors", task.status === 'Done' ? "text-slate-600 line-through" : "text-white")}>{task.title}</p>
                              <div className="flex items-center gap-3 mt-1.5">
                                 <span className="text-[10px] font-bold text-slate-600 flex items-center gap-1"><Clock className="h-3 w-3" /> {task.time}</span>
                                 <span className="text-[9px] font-black uppercase text-slate-500 bg-white/5 px-2 py-0.5 rounded tracking-widest">{task.type}</span>
                              </div>
                           </div>
                        </div>
                     ))}
                  </div>
                  <Button className="w-full mt-4 bg-white/5 hover:bg-white/10 text-slate-500 font-black text-[9px] tracking-widest uppercase py-5 rounded-xl border border-white/5 transition-all">
                     Thêm công việc
                  </Button>
               </div>

               {/* GOAL CARD */}
               <div className="bg-emerald-600 rounded-[2rem] p-8 text-white shadow-2xl shadow-emerald-900/20 relative overflow-hidden group shrink-0">
                  <div className="absolute -right-6 -top-6 h-24 w-24 bg-white/10 rounded-full blur-2xl group-hover:scale-125 transition-transform duration-700" />
                  <div className="relative z-10">
                     <p className="text-[9px] font-black uppercase tracking-widest opacity-80 mb-2">Mục tiêu doanh thu</p>
                     <h3 className="text-xl font-black mb-6 italic tracking-tight text-white">2.000.000.000đ</h3>
                     <div className="h-1.5 w-full bg-black/20 rounded-full overflow-hidden mb-3">
                        <div className="h-full bg-white w-3/4 rounded-full" />
                     </div>
                     <p className="text-[10px] font-bold opacity-80">Đạt 75% • Còn 5 ngày về đích</p>
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
}
