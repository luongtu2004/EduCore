'use client';

import { useState, useEffect } from 'react';
import { 
  Plus, MoreHorizontal, Phone, MessageSquare, 
  Search, Filter, ChevronRight, DollarSign,
  User, Clock, AlertCircle, Home, Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import api from '@/lib/axios';
import { toast } from 'react-hot-toast';

const PIPELINE_COLUMNS = [
  { id: 'NEW', title: 'Mới đăng ký', color: 'bg-emerald-500' },
  { id: 'CONTACTED', title: 'Đã liên hệ', color: 'bg-blue-500' },
  { id: 'CONSULTING', title: 'Đang tư vấn', color: 'bg-violet-500' },
  { id: 'TRIAL_LEARNING', title: 'Học thử', color: 'bg-amber-500' },
  { id: 'WON', title: 'Đã đăng ký HV', color: 'bg-teal-500' },
  { id: 'LOST', title: 'Không tiếp cận', color: 'bg-slate-500' },
];

export default function CRMPipelinePage() {
  const [leads, setLeads] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Drag and Drop state
  const [draggedItem, setDraggedItem] = useState<any>(null);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    setIsLoading(true);
    try {
      const response: any = await api.get('/crm/leads');
      if (response.success) {
        setLeads(response.data);
      }
    } catch (error) {
      console.error('Lỗi khi tải leads:', error);
      toast.error('Không thể tải dữ liệu phễu bán hàng.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDragStart = (lead: any) => {
    setDraggedItem(lead);
    setIsDragging(true);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (statusId: string, e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (!draggedItem || draggedItem.status === statusId) return;

    // Optimistic update
    const previousLeads = [...leads];
    setLeads(leads.map(l => l.id === draggedItem.id ? { ...l, status: statusId } : l));

    try {
      const response: any = await api.patch(`/crm/leads/${draggedItem.id}/status`, {
        status: statusId,
        note: 'Cập nhật từ Pipeline'
      });
      if (response.success) {
        toast.success('Đã cập nhật trạng thái khách hàng');
      } else {
        throw new Error('API update failed');
      }
    } catch (error) {
      console.error('Lỗi khi cập nhật trạng thái:', error);
      toast.error('Lỗi khi cập nhật trạng thái');
      // Revert changes
      setLeads(previousLeads);
    }
    setDraggedItem(null);
  };

  const filteredLeads = leads.filter(lead => 
    lead.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lead.phone?.includes(searchQuery)
  );

  const getLeadsByStatus = (status: string) => {
    return filteredLeads.filter(l => (l.status || 'NEW') === status);
  };

  const totalPipelineValue = leads.reduce((acc, lead) => acc + (lead.finalPrice || 0), 0);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-400 p-8 flex flex-col overflow-hidden h-screen">
      {/* BREADCRUMBS */}
      <nav className="flex items-center gap-2 mb-6 text-[10px] font-black uppercase tracking-widest text-slate-600 shrink-0">
        <Link href="/admin" className="hover:text-emerald-500 transition-colors flex items-center gap-1.5">
          <Home className="h-3 w-3" /> Dashboard
        </Link>
        <ChevronRight className="h-3 w-3 opacity-30" />
        <Link href="/admin/crm" className="hover:text-emerald-500 transition-colors">
          CRM
        </Link>
        <ChevronRight className="h-3 w-3 opacity-30" />
        <span className="text-white">Phễu bán hàng</span>
      </nav>

      {/* HEADER */}
      <div className="flex items-center justify-between mb-8 shrink-0">
        <div className="flex items-center gap-4">
          <div className="h-10 w-2.5 bg-emerald-500 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.3)]" />
          <div>
            <h1 className="text-2xl font-black text-white tracking-tight uppercase leading-none">Phễu bán hàng (Pipeline)</h1>
            <p className="text-[10px] font-bold text-slate-600 mt-2 uppercase tracking-widest leading-none">Kéo thả để cập nhật trạng thái khách hàng</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
           <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-4 py-2">
              <DollarSign className="h-4 w-4 text-emerald-500" />
              <span className="text-xs font-black text-white">Tổng giá trị phễu: {totalPipelineValue.toLocaleString('vi-VN')}đ</span>
           </div>
           <Link href="/admin/crm/leads">
             <Button className="h-10 rounded-xl bg-emerald-600 text-white px-5 font-black text-[10px] tracking-widest uppercase hover:bg-emerald-500 border-none gap-2">
               Quản lý Khách hàng
             </Button>
           </Link>
        </div>
      </div>

      {/* TOOLBAR */}
      <div className="flex items-center gap-4 mb-8 shrink-0">
        <div className="flex-1 relative group w-full">
          <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-500 group-focus-within:text-emerald-500 transition-colors duration-300" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm theo tên hoặc số điện thoại khách hàng..."
            className="w-full h-14 pl-14 pr-5 rounded-2xl bg-slate-950/50 border border-white/5 hover:border-white/10 focus:bg-slate-950 focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 transition-all text-base text-slate-200 placeholder:text-slate-600 outline-none shadow-inner"
          />
        </div>
      </div>

      {/* KANBAN BOARD */}
      {isLoading ? (
        <div className="flex-1 flex items-center justify-center">
           <Loader2 className="h-8 w-8 text-emerald-500 animate-spin" />
        </div>
      ) : (
        <div className="flex-1 flex gap-6 overflow-x-auto pb-4 custom-scrollbar items-start">
           {PIPELINE_COLUMNS.map((column) => {
             const columnLeads = getLeadsByStatus(column.id);
             const columnValue = columnLeads.reduce((acc, lead) => acc + (lead.finalPrice || 0), 0);

             return (
               <div 
                 key={column.id} 
                 className={cn(
                   "w-[340px] shrink-0 flex flex-col h-full bg-slate-900/40 backdrop-blur-md border border-white/5 rounded-3xl overflow-hidden transition-all duration-300",
                   isDragging && "border-white/10 bg-slate-900/60 shadow-[0_0_30px_rgba(255,255,255,0.02)]"
                 )}
                 onDragOver={handleDragOver}
                 onDrop={(e) => handleDrop(column.id, e)}
               >
                  <div className="p-5 border-b border-white/5 flex items-center justify-between bg-gradient-to-b from-white/[0.03] to-transparent">
                     <div className="flex items-center gap-3">
                        <div className={cn("h-2.5 w-2.5 rounded-full shadow-[0_0_10px_rgba(0,0,0,0.5)]", column.color)} />
                        <h3 className="text-xs font-black text-white uppercase tracking-widest">{column.title}</h3>
                        <span className="text-[10px] font-black text-slate-400 bg-slate-950/50 border border-white/5 px-2.5 py-1 rounded-lg">{columnLeads.length}</span>
                     </div>
                     <button className="h-8 w-8 rounded-full flex items-center justify-center text-slate-500 hover:bg-white/5 hover:text-white transition-all"><MoreHorizontal className="h-4 w-4" /></button>
                  </div>

                  <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar min-h-[200px]">
                     <AnimatePresence>
                       {columnLeads.map((lead) => (
                         <motion.div 
                           layoutId={lead.id}
                           initial={{ opacity: 0, y: 10, scale: 0.95 }}
                           animate={{ opacity: 1, y: 0, scale: 1 }}
                           exit={{ opacity: 0, scale: 0.9 }}
                           key={lead.id} 
                           draggable
                           onDragStart={() => handleDragStart(lead)}
                           onDragEnd={() => setIsDragging(false)}
                           className={cn(
                             "bg-slate-950/80 border border-white/5 p-5 rounded-[1.25rem] transition-all group cursor-grab active:cursor-grabbing shadow-sm hover:shadow-xl hover:shadow-black/20 hover:border-white/10 relative overflow-hidden",
                             draggedItem?.id === lead.id && "opacity-50 scale-95 border-emerald-500/50"
                           )}
                         >
                            <div className="absolute top-0 left-0 w-1 h-full opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-b from-emerald-500 to-teal-500" />
                            
                            <div className="flex items-center justify-between mb-4">
                               <span className="text-[11px] font-black text-emerald-400 tracking-wider bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-md">
                                 {lead.finalPrice ? lead.finalPrice.toLocaleString('vi-VN') + 'đ' : 'CHƯA BÁO GIÁ'}
                               </span>
                               <div className="h-8 w-8 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center text-[10px] font-black text-emerald-500 uppercase shadow-inner">
                                 {lead.fullName?.split(' ').pop()?.charAt(0) || 'K'}
                               </div>
                            </div>
                            <p className="text-[15px] font-black text-white mb-2 group-hover:text-emerald-400 transition-colors leading-tight">{lead.fullName}</p>
                            
                            <div className="flex flex-wrap gap-2 mb-5">
                              <span className="text-[9px] font-black text-slate-400 bg-slate-900 border border-white/5 px-2 py-1 rounded-md uppercase tracking-widest max-w-full truncate" title={lead.courseName || 'Chưa chọn khóa'}>
                                {lead.courseName || 'CHƯA RÕ NHU CẦU'}
                              </span>
                            </div>

                            <div className="flex items-center justify-between border-t border-white/5 pt-4">
                               <div className="flex items-center gap-2 text-slate-500">
                                  <Clock className="h-3.5 w-3.5" /> 
                                  <span className="text-[10px] font-bold tracking-wider">{new Date(lead.createdAt).toLocaleDateString('vi-VN')}</span>
                               </div>
                               <div className="flex gap-1.5 opacity-60 group-hover:opacity-100 transition-opacity">
                                  <a href={`tel:${lead.phone}`} title={`Gọi ${lead.phone}`} className="h-8 w-8 rounded-full bg-slate-900 border border-white/5 flex items-center justify-center text-slate-400 hover:bg-emerald-600 hover:border-emerald-500 hover:text-white hover:shadow-[0_0_15px_rgba(16,185,129,0.4)] transition-all">
                                    <Phone className="h-3.5 w-3.5" />
                                  </a>
                                  <Link href={`/admin/crm/leads/${lead.id}`} title="Chi tiết" className="h-8 w-8 rounded-full bg-slate-900 border border-white/5 flex items-center justify-center text-slate-400 hover:bg-white/10 hover:border-white/20 hover:text-white transition-all">
                                    <MoreHorizontal className="h-3.5 w-3.5" />
                                  </Link>
                               </div>
                            </div>
                         </motion.div>
                       ))}
                     </AnimatePresence>
                  </div>

                  {/* COLUMN FOOTER SUMMARY */}
                  <div className="p-5 bg-gradient-to-t from-white/[0.03] to-transparent border-t border-white/5 flex items-center justify-between mt-auto shrink-0">
                     <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Tổng giá trị</p>
                     <p className="text-xs font-black text-emerald-500 tracking-wider">
                        {columnValue.toLocaleString('vi-VN')}đ
                     </p>
                  </div>
               </div>
             );
           })}
        </div>
      )}
    </div>
  );
}
