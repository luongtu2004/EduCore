'use client';

import { 
  FileText, BookOpen, ImageIcon, Settings, 
  LayoutDashboard, Globe, LogOut, ExternalLink, 
  Users, Layers, Flag, ChevronRight, Sparkles,
  LayoutGrid, GraduationCap, Zap
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

const sidebarGroups = [
  { 
    group: 'QUẢN TRỊ', 
    items: [
      { name: 'Dashboard', icon: LayoutDashboard, href: '/admin' },
      { name: 'Bài viết', icon: FileText, href: '/admin/posts' },
      { name: 'Khóa học', icon: BookOpen, href: '/admin/courses' },
    ]
  },
  { 
    group: 'TÀI NGUYÊN', 
    items: [
      { name: 'Media', icon: ImageIcon, href: '/admin/media' },
      { name: 'Banners', icon: Flag, href: '/admin/banners' },
    ]
  },
  { 
    group: 'HỆ THỐNG', 
    items: [
      { name: 'Người dùng', icon: Users, href: '/admin/users' },
      { name: 'Cài đặt', icon: Settings, href: '/admin/settings' },
    ]
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-72 h-screen bg-white border-r border-gray-100 flex flex-col fixed left-0 top-0 z-40">
      {/* BRANDING - NEW PREMIUM LOGO */}
      <div className="p-8 pb-10">
        <Link href="/admin" className="flex items-center gap-4 group">
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-tr from-emerald-600 to-cyan-400 rounded-2xl blur-sm opacity-20 group-hover:opacity-40 transition-opacity" />
            <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-emerald-600 to-emerald-400 text-white shadow-xl shadow-emerald-200 transition-all group-hover:scale-105 group-hover:rotate-3">
              <GraduationCap className="h-7 w-7" />
              <div className="absolute -top-1 -right-1 h-4 w-4 bg-yellow-400 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                 <Sparkles className="h-2 w-2 text-white" />
              </div>
            </div>
          </div>
          <div className="flex flex-col leading-none">
            <div className="flex items-center gap-1">
               <span className="text-xl font-black tracking-tighter text-slate-900 uppercase">Edu</span>
               <span className="text-xl font-black tracking-tighter text-emerald-600 uppercase">Core</span>
            </div>
            <span className="text-[8px] font-black text-slate-400 tracking-[0.4em] mt-1.5 uppercase opacity-80">Intelligence System</span>
          </div>
        </Link>
      </div>

      {/* MENU GROUPS */}
      <div className="flex-1 overflow-y-auto px-4 space-y-10 pb-10 custom-scrollbar">
        {sidebarGroups.map((group) => (
          <div key={group.group} className="space-y-3">
            <h3 className="px-5 text-[10px] font-black text-gray-300 uppercase tracking-[0.2em]">{group.group}</h3>
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
                        ? "text-emerald-700 font-bold bg-emerald-50/60" 
                        : "text-slate-500 hover:text-slate-900 hover:bg-gray-50/80"
                    )}
                  >
                    <item.icon className={cn(
                      "h-5 w-5 transition-colors", 
                      isActive ? "text-emerald-600" : "text-slate-400 group-hover:text-emerald-600"
                    )} />
                    <span className="text-sm tracking-tight">{item.name}</span>
                    
                    {isActive && (
                      <motion.div 
                        layoutId="sidebar-indicator"
                        className="absolute left-0 top-0 bottom-0 w-1.5 bg-emerald-500 rounded-r-full shadow-[2px_0_10px_rgba(16,185,129,0.3)]"
                      />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* FOOTER */}
      <div className="p-6 border-t border-gray-50 bg-gray-50/30 space-y-1">
         <Link href="/admin/crm" className="flex items-center gap-3 px-5 py-3 rounded-xl text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-all text-xs font-bold group">
            <LayoutGrid className="h-4 w-4 group-hover:rotate-90 transition-transform" />
            Hệ thống CRM
         </Link>
         <Link href="/" className="flex items-center gap-3 px-5 py-3 rounded-xl text-slate-500 hover:text-emerald-600 hover:bg-white transition-all text-xs font-bold">
            <ExternalLink className="h-4 w-4" />
            Xem Website
         </Link>
         <button className="flex items-center gap-3 px-5 py-3 w-full rounded-xl text-red-500 hover:bg-red-50/50 transition-all text-xs font-bold group">
            <LogOut className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            Đăng xuất
         </button>
      </div>
    </aside>
  );
}
