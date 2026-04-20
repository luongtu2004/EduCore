'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  ArrowLeft, Phone, Mail, Clock, Sparkles, 
  BookOpen, Target, Zap, Loader2, CheckCircle2,
  Calendar, User, MessageSquare, Award, Brain
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import api from '@/lib/axios';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';

export default function LeadDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [lead, setLead] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchLead = async () => {
    try {
      const response: any = await api.get(`/crm/leads/${id}`);
      if (response.success) {
        setLead(response.data);
      }
    } catch (error) {
      console.error('Lỗi khi tải chi tiết lead:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLead();
  }, [id]);

  const updateStatus = async (status: string) => {
    try {
      await api.patch(`/crm/leads/${id}/status`, { status });
      toast.success(`Đã cập nhật trạng thái: ${status}`);
      fetchLead();
    } catch (error) {
      toast.error('Lỗi khi cập nhật trạng thái.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center gap-4">
        <Loader2 className="h-10 w-10 text-emerald-500 animate-spin" />
        <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Đang đồng bộ dữ liệu học viên...</p>
      </div>
    );
  }

  if (!lead) return <div>Không tìm thấy dữ liệu</div>;

  return (
    <div className="min-h-screen bg-slate-900 p-8 font-sans antialiased">
      {/* HEADER */}
      <div className="max-w-6xl mx-auto mb-12 flex items-center justify-between">
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-3 text-slate-500 hover:text-white transition-all group"
        >
          <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-white transition-all">
            <ArrowLeft className="h-5 w-5" />
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest">Quay lại danh sách</span>
        </button>

        <div className="flex gap-3">
           <Button 
             onClick={() => updateStatus('IN_PROGRESS')}
             className="h-12 rounded-xl bg-emerald-600 text-white px-8 font-black text-xs border-none shadow-lg shadow-emerald-900/20"
           >
              GỌI ĐIỆN TƯ VẤN <Phone className="ml-2 h-4 w-4" />
           </Button>
           <Button 
             onClick={() => updateStatus('ENROLLED')}
             variant="outline" className="h-12 rounded-xl border-white/10 bg-white/5 text-slate-400 font-black text-xs uppercase tracking-widest"
           >
              XỬ LÝ THÀNH HỌC VIÊN
           </Button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* LEFT COL: INFO */}
         <div className="lg:col-span-1 space-y-8">
            <div className="bg-white/[0.03] border border-white/5 rounded-[2.5rem] p-8">
               <div className="flex flex-col items-center text-center mb-8">
                  <div className="h-24 w-24 rounded-3xl bg-gradient-to-tr from-emerald-600 to-emerald-400 flex items-center justify-center text-white text-3xl font-black mb-4 shadow-2xl shadow-emerald-900/20">
                    {lead.fullName?.charAt(0)}
                  </div>
                  <h2 className="text-2xl font-black text-white tracking-tighter uppercase">{lead.fullName}</h2>
                  <span className="px-3 py-1 bg-emerald-500/10 text-emerald-500 rounded-full text-[10px] font-black uppercase tracking-widest mt-2 border border-emerald-500/20">
                    {lead.status}
                  </span>
               </div>

               <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 group hover:bg-white/10 transition-all">
                     <Phone className="h-5 w-5 text-slate-500 group-hover:text-emerald-500" />
                     <div>
                        <p className="text-[8px] font-black text-slate-600 uppercase tracking-widest">Điện thoại</p>
                        <p className="text-sm font-bold text-slate-200">{lead.phone}</p>
                     </div>
                  </div>
                  <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 group hover:bg-white/10 transition-all">
                     <Mail className="h-5 w-5 text-slate-500 group-hover:text-emerald-500" />
                     <div>
                        <p className="text-[8px] font-black text-slate-600 uppercase tracking-widest">Email</p>
                        <p className="text-sm font-bold text-slate-200">{lead.email || 'Chưa cập nhật'}</p>
                     </div>
                  </div>
                  <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 group hover:bg-white/10 transition-all">
                     <Calendar className="h-5 w-5 text-slate-500 group-hover:text-emerald-500" />
                     <div>
                        <p className="text-[8px] font-black text-slate-600 uppercase tracking-widest">Ngày đăng ký</p>
                        <p className="text-sm font-bold text-slate-200">{new Date(lead.createdAt).toLocaleDateString('vi-VN')}</p>
                     </div>
                  </div>
                  <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 group hover:bg-white/10 transition-all">
                     <Zap className="h-5 w-5 text-slate-500 group-hover:text-emerald-500" />
                     <div>
                        <p className="text-[8px] font-black text-slate-600 uppercase tracking-widest">Nguồn đăng ký</p>
                        <p className="text-sm font-bold text-slate-200 uppercase">{lead.source}</p>
                     </div>
                  </div>
               </div>
            </div>
         </div>

         {/* RIGHT COL: ANALYSIS & ACTIVITIES */}
         <div className="lg:col-span-2 space-y-8">
            {/* QUIZ RESULT PANEL */}
            {lead.quizResult ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-gradient-to-br from-emerald-950/40 to-slate-900 border border-emerald-500/20 rounded-[2.5rem] p-10 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-8 opacity-10">
                   <Brain className="h-32 w-32 text-emerald-500" />
                </div>
                
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-6">
                     <div className="h-10 w-10 rounded-xl bg-emerald-500 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
                        <Award className="h-6 w-6" />
                     </div>
                     <div>
                        <h3 className="text-xl font-black text-white tracking-tighter uppercase italic">Kết quả phân tích AI</h3>
                        <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Dữ liệu từ Placement Test</p>
                     </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                     <div className="bg-white/5 border border-white/5 rounded-3xl p-6">
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Trình độ ước tính</p>
                        <p className="text-3xl font-black text-emerald-500 tracking-tighter uppercase leading-tight">
                           {lead.quizResult.level}
                        </p>
                     </div>
                     <div className="bg-white/5 border border-white/5 rounded-3xl p-6">
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Tổng điểm hệ thống</p>
                        <p className="text-3xl font-black text-white tracking-tighter uppercase leading-tight">
                           {lead.quizResult.score} / 40
                        </p>
                     </div>
                  </div>

                  <div className="bg-slate-950/50 rounded-3xl p-6 border border-white/5">
                     <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <MessageSquare className="h-3.5 w-3.5" /> Ghi chú phân tích
                     </p>
                     <p className="text-sm font-bold text-slate-300 leading-relaxed italic">
                        "{lead.note}"
                     </p>
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="bg-white/[0.03] border border-dashed border-white/10 rounded-[2.5rem] p-12 text-center">
                 <Target className="h-12 w-12 text-slate-700 mx-auto mb-4" />
                 <p className="text-sm font-black text-slate-600 uppercase tracking-widest">Học viên chưa thực hiện bài Test AI</p>
              </div>
            )}

            {/* ACTIVITY LOG */}
            <div className="space-y-4">
               <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.3em] px-4">Nhật ký xử lý</h3>
               <div className="space-y-3">
                  {lead.activityLogs?.map((log: any, idx: number) => (
                    <div key={idx} className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 flex items-start gap-4">
                       <div className="h-8 w-8 rounded-lg bg-white/5 flex items-center justify-center text-slate-500">
                          <Clock className="h-4 w-4" />
                       </div>
                       <div>
                          <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-1">
                             {new Date(log.createdAt).toLocaleString('vi-VN')}
                          </p>
                          <p className="text-sm font-bold text-slate-200">{log.content}</p>
                          <span className="text-[10px] font-black text-emerald-500 uppercase mt-2 inline-block">Trạng thái: {log.type}</span>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
