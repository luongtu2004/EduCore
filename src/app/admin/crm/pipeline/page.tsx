'use client';

import { useState } from 'react';
import { 
  Plus, MoreHorizontal, Phone, MessageSquare, 
  Search, Filter, ChevronRight, DollarSign,
  User, Clock, AlertCircle
} from 'lucide-react';
import { motion, Reorder } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const initialColumns = [
  { id: 'new', title: 'Mới tiếp nhận', color: 'bg-blue-500', leads: [
    { id: '1', name: 'Nguyễn Văn A', value: '5.000.000đ', time: '2h trước', staff: 'Admin' },
    { id: '2', name: 'Trần Thị B', value: '12.000.000đ', time: '5h trước', staff: 'Sale 01' },
  ]},
  { id: 'called', title: 'Đã liên hệ', color: 'bg-orange-500', leads: [
    { id: '3', name: 'Lê Văn C', value: '3.500.000đ', time: '1 ngày trước', staff: 'Sale 02' },
  ]},
  { id: 'consulted', title: 'Đã tư vấn', color: 'bg-purple-500', leads: [
    { id: '4', name: 'Phạm Thị D', value: '25.000.000đ', time: '3 giờ trước', staff: 'Admin' },
  ]},
  { id: 'closed', title: 'Đã chốt', color: 'bg-emerald-500', leads: [
    { id: '5', name: 'Hoàng Văn E', value: '45.000.000đ', time: '30 phút trước', staff: 'Sale 01' },
  ]},
];

export default function CRMPipelinePage() {
  const [columns, setColumns] = useState(initialColumns);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-400 p-8 flex flex-col overflow-hidden h-screen">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-8 shrink-0">
        <div>
           <h1 className="text-2xl font-black text-white tracking-tight uppercase">Phễu bán hàng (Pipeline)</h1>
           <p className="text-[10px] font-bold text-slate-600 mt-1 uppercase tracking-widest">Kéo thả để cập nhật trạng thái khách hàng</p>
        </div>
        <div className="flex items-center gap-4">
           <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-4 py-2">
              <DollarSign className="h-4 w-4 text-emerald-500" />
              <span className="text-xs font-black text-white">Tổng giá trị phễu: 90.500.000đ</span>
           </div>
           <Button className="h-10 rounded-xl bg-emerald-600 text-white px-5 font-black text-[10px] tracking-widest uppercase hover:bg-emerald-500 border-none gap-2">
             <Plus className="h-4 w-4" /> Thêm giao dịch
           </Button>
        </div>
      </div>

      {/* TOOLBAR */}
      <div className="flex items-center justify-between mb-8 shrink-0">
         <div className="relative group flex-1 max-w-md">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-600" />
            <input 
              type="text" 
              placeholder="Tìm theo tên khách hàng..." 
              className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-9 pr-4 text-xs focus:outline-none focus:border-emerald-500/30 transition-all text-white outline-none"
            />
         </div>
         <div className="flex items-center gap-3">
            <Button variant="ghost" className="text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-white gap-2">
               <Filter className="h-4 w-4" /> Lọc nhân viên
            </Button>
         </div>
      </div>

      {/* KANBAN BOARD */}
      <div className="flex-1 flex gap-6 overflow-x-auto pb-4 custom-scrollbar items-start">
         {columns.map((column) => (
           <div key={column.id} className="w-80 shrink-0 flex flex-col h-full bg-white/[0.02] border border-white/[0.05] rounded-[2rem] overflow-hidden">
              <div className="p-5 border-b border-white/[0.05] flex items-center justify-between bg-white/[0.01]">
                 <div className="flex items-center gap-3">
                    <div className={cn("h-2 w-2 rounded-full shadow-[0_0_8px_rgba(0,0,0,0.5)]", column.color)} />
                    <h3 className="text-[11px] font-black text-white uppercase tracking-widest">{column.title}</h3>
                    <span className="text-[10px] font-bold text-slate-600 bg-white/5 px-2 py-0.5 rounded-md">{column.leads.length}</span>
                 </div>
                 <button className="text-slate-600 hover:text-white transition-colors"><MoreHorizontal className="h-4 w-4" /></button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                 {column.leads.map((lead) => (
                   <motion.div 
                     layoutId={lead.id}
                     key={lead.id} 
                     className="bg-white/5 border border-white/10 p-5 rounded-2xl hover:bg-white/10 hover:border-white/20 transition-all group cursor-grab active:cursor-grabbing"
                   >
                      <div className="flex items-center justify-between mb-3">
                         <span className="text-[10px] font-black text-emerald-500 tracking-tight">{lead.value}</span>
                         <div className="h-6 w-6 rounded-lg bg-slate-900 border border-white/5 flex items-center justify-center text-[8px] font-black text-slate-500">
                           {lead.staff.charAt(0)}
                         </div>
                      </div>
                      <p className="text-sm font-black text-white mb-4 group-hover:text-emerald-400 transition-colors">{lead.name}</p>
                      <div className="flex items-center justify-between border-t border-white/[0.05] pt-3">
                         <div className="flex items-center gap-3">
                            <span className="text-[9px] font-bold text-slate-600 flex items-center gap-1"><Clock className="h-3 w-3" /> {lead.time}</span>
                         </div>
                         <div className="flex gap-1">
                            <button className="h-7 w-7 rounded-lg bg-white/5 flex items-center justify-center text-slate-500 hover:bg-emerald-600 hover:text-white transition-all"><Phone className="h-3 w-3" /></button>
                            <button className="h-7 w-7 rounded-lg bg-white/5 flex items-center justify-center text-slate-500 hover:bg-white/10 hover:text-white transition-all"><MoreHorizontal className="h-3 w-3" /></button>
                         </div>
                      </div>
                   </motion.div>
                 ))}
                 
                 <button className="w-full py-3 rounded-xl border border-dashed border-white/10 text-[10px] font-black text-slate-700 uppercase tracking-widest hover:border-emerald-500/30 hover:text-emerald-500 transition-all">
                    + Thêm mới
                 </button>
              </div>

              {/* COLUMN FOOTER SUMMARY */}
              <div className="p-4 bg-white/[0.01] border-t border-white/[0.05] flex items-center justify-between">
                 <p className="text-[9px] font-bold text-slate-700 uppercase tracking-widest">Tổng giá trị bước:</p>
                 <p className="text-[10px] font-black text-slate-400">
                    {column.leads.reduce((acc, lead) => acc + parseInt(lead.value.replace(/\./g, '').replace('đ', '')), 0).toLocaleString('vi-VN')}đ
                 </p>
              </div>
           </div>
         ))}
      </div>
    </div>
  );
}
