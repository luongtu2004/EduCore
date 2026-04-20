'use client';

import { 
  Users, LayoutDashboard, ClipboardList, Calendar, 
  Briefcase, UserCheck, DollarSign, Settings,
  LogOut, ExternalLink, Search, Bell, Sparkles,
  HeartHandshake, GitBranch, CheckSquare, LayoutGrid,
  GraduationCap
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

const crmGroups = [
  { 
    group: 'KINH DOANH', 
    items: [
      { name: 'Dashboard', icon: LayoutDashboard, href: '/admin/crm' },
      { name: 'Leads (Tiềm năng)', icon: ClipboardList, href: '/admin/crm/leads' },
      { name: 'Pipeline (Phễu)', icon: GitBranch, href: '/admin/crm/pipeline' },
      { name: 'Khách hàng', icon: HeartHandshake, href: '/admin/crm/customers' },
    ]
  },
  { 
    group: 'CHĂM SÓC', 
    items: [
      { name: 'Lịch tư vấn', icon: Calendar, href: '/admin/crm/appointments' },
      { name: 'Học viên', icon: Users, href: '/admin/crm/students' },
      { name: 'Công việc', icon: CheckSquare, href: '/admin/crm/tasks' },
    ]
  },
  { 
    group: 'QUẢN TRỊ', 
    items: [
      { name: 'Nhân sự', icon: Briefcase, href: '/admin/crm/staff' },
      { name: 'Tài chính', icon: DollarSign, href: '/admin/crm/finance' },
      { name: 'Cài đặt', icon: Settings, href: '/admin/crm/settings' },
    ]
  },
];

export function CRMSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-72 shrink-0 bg-slate-950 border-r border-slate-900 flex flex-col h-screen text-slate-400">
      {/* BRANDING - DARK MODE PRESERVED */}
      <div className="p-8 pb-10">
        <Link href="/admin/crm" className="flex items-center gap-4 group">
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-tr from-emerald-600 to-cyan-400 rounded-2xl blur-sm opacity-20 group-hover:opacity-40 transition-opacity" />
            <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-emerald-600 to-emerald-400 text-white shadow-xl shadow-emerald-900/20 transition-all group-hover:scale-105 group-hover:rotate-3">
              <GraduationCap className="h-7 w-7" />
              <div className="absolute -top-1 -right-1 h-4 w-4 bg-yellow-400 rounded-full flex items-center justify-center border-2 border-slate-950 shadow-sm">
                 <Sparkles className="h-2 w-2 text-white" />
              </div>
            </div>
          </div>
          <div className="flex flex-col leading-none">
            <div className="flex items-center gap-1">
               <span className="text-xl font-black tracking-tighter text-white uppercase">Edu</span>
               <span className="text-xl font-black tracking-tighter text-emerald-500 uppercase">CRM</span>
            </div>
            <span className="text-[8px] font-black text-slate-500 tracking-[0.4em] mt-1.5 uppercase opacity-80">Intelligence System</span>
          </div>
        </Link>
      </div>

      {/* MENU GROUPS */}
      <div className="flex-1 overflow-y-auto px-4 space-y-10 pb-10 custom-scrollbar">
        {crmGroups.map((group) => (
          <div key={group.group} className="space-y-3">
            <h3 className="px-5 text-[10px] font-black text-slate-700 uppercase tracking-[0.2em]">{group.group}</h3>
            <div className="space-y-1">
              {group.items.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-4 px-5 py-3.5 rounded-2xl transition-all relative group overflow-hidden",
                      isActive 
                        ? "text-white font-bold bg-white/5" 
                        : "hover:text-white hover:bg-white/5"
                    )}
                  >
                    <item.icon className={cn(
                      "h-5 w-5 transition-colors", 
                      isActive ? "text-emerald-500" : "text-slate-600 group-hover:text-emerald-500"
                    )} />
                    <span className="text-sm tracking-tight">{item.name}</span>
                    
                    {isActive && (
                      <motion.div 
                        layoutId="crm-indicator"
                        className="absolute left-0 top-0 bottom-0 w-1.5 bg-emerald-500 rounded-r-full shadow-[2px_0_10px_rgba(16,185,129,0.5)]"
                      />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* FOOTER ACTIONS */}
      <div className="p-6 border-t border-slate-900 bg-slate-900/20 space-y-1">
         <Link href="/" className="flex items-center gap-3 px-5 py-3 rounded-xl text-slate-500 hover:text-emerald-400 hover:bg-white/5 transition-all text-xs font-bold">
            <ExternalLink className="h-4 w-4" />
            Xem Website
         </Link>
         <button className="flex items-center gap-3 px-5 py-3 w-full rounded-xl text-red-500/80 hover:bg-red-500/5 transition-all text-xs font-bold group">
            <LogOut className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            Đăng xuất
         </button>
      </div>
    </aside>
  );
}
