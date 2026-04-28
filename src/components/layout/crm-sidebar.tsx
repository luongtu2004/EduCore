'use client';

import {
  Users, User, LayoutDashboard, ClipboardList, Calendar,
  Briefcase, DollarSign, Settings,
  LogOut, ExternalLink, Bell, Sparkles,
  HeartHandshake, GitBranch, CheckSquare, LayoutGrid,
  GraduationCap, ChevronRight, X, CreditCard
} from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { useSocket } from '@/lib/socket-provider';
import { useState } from 'react';

const crmGroups = [
  {
    group: 'KINH DOANH',
    items: [
      { name: 'Dashboard', icon: LayoutDashboard, href: '/admin/crm' },
      { name: 'Khách hàng tiềm năng', icon: ClipboardList, href: '/admin/crm/leads' },
      { name: 'Lịch hẹn (Calendar)', icon: Calendar, href: '/admin/crm/appointments' },
      { name: 'Pipeline (Phễu)', icon: GitBranch, href: '/admin/crm/pipeline' },
      { name: 'Đơn hàng (Orders)', icon: CreditCard, href: '/admin/crm/orders' },
      { name: 'Học viên (Students)', icon: GraduationCap, href: '/admin/crm/students' },
      { name: 'Tin nhắn tư vấn', icon: HeartHandshake, href: '/admin/crm/contacts' },
    ]
  },
  {
    group: 'PHÂN TÍCH',
    items: [
      { name: 'Báo cáo & Thống kê', icon: CheckSquare, href: '/admin/crm/reports' },
    ]
  },
  {
    group: 'QUẢN TRỊ',
    items: [
      { name: 'Nhân sự & Staff', icon: Briefcase, href: '/admin/crm/staff' },
    ]
  },
];

function timeAgo(date: Date) {
  const diff = Date.now() - new Date(date).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'Vừa xong';
  if (m < 60) return `${m} phút trước`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} giờ trước`;
  return `${Math.floor(h / 24)} ngày trước`;
}

export function CRMSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { notifications, unreadCount, markAsRead, clearAll } = useSocket();
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <aside className="w-72 shrink-0 bg-slate-950 border-r border-slate-900 flex flex-col h-screen text-slate-400">
      {/* BRANDING */}
      <div className="p-8 pb-10">
        <div className="flex items-center justify-between">
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
              <div className="flex items-center gap-1 font-heading">
                <span className="text-xl font-black tracking-tighter text-white uppercase">Edu</span>
                <span className="text-xl font-black tracking-tighter text-emerald-500 uppercase">CRM</span>
              </div>
              <span className="text-[8px] font-black text-slate-500 tracking-[0.4em] mt-1.5 uppercase opacity-80">Intelligence System</span>
            </div>
          </Link>

          {/* 🔔 BELL ICON — dark mode */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative h-10 w-10 rounded-2xl bg-white/5 hover:bg-emerald-500/10 flex items-center justify-center text-slate-500 hover:text-emerald-400 transition-all"
            >
              <Bell className="h-4 w-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 rounded-full flex items-center justify-center text-[9px] font-black text-white border-2 border-slate-950 animate-bounce">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {/* NOTIFICATION DROPDOWN — dark theme */}
            <AnimatePresence>
              {showNotifications && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)} />
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute left-0 top-12 w-80 bg-slate-900 rounded-2xl shadow-2xl border border-white/10 overflow-hidden z-50"
                  >
                    {/* Header */}
                    <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
                      <div>
                        <p className="text-sm font-black text-white">Thông báo</p>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">
                          {unreadCount > 0 ? `${unreadCount} chưa đọc` : 'Tất cả đã đọc'}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {notifications.length > 0 && (
                          <button
                            onClick={clearAll}
                            className="text-[9px] font-black text-slate-600 hover:text-rose-400 uppercase tracking-widest transition-colors"
                          >
                            Xóa tất cả
                          </button>
                        )}
                        <button onClick={() => setShowNotifications(false)} className="text-slate-600 hover:text-slate-300">
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    {/* List */}
                    <div className="max-h-80 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="py-12 text-center">
                          <Bell className="h-8 w-8 text-slate-700 mx-auto mb-3" />
                          <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Chưa có thông báo</p>
                        </div>
                      ) : (
                        notifications.map((n) => (
                          <button
                            key={n.id}
                            onClick={() => {
                              markAsRead(n.id);
                              setShowNotifications(false);
                              if (n.leadId) {
                                router.push(`/admin/crm/leads/${n.leadId}`);
                              } else {
                                router.push('/admin/crm/leads');
                              }
                            }}
                            className={cn(
                              'w-full text-left px-5 py-4 border-b border-white/5 hover:bg-white/5 transition-all flex gap-3',
                              !n.read && 'bg-emerald-500/5'
                            )}
                          >
                            <div className="mt-1 shrink-0">
                              <span className={cn(
                                'h-2 w-2 rounded-full block',
                                n.read ? 'bg-slate-700' : 'bg-emerald-500 animate-pulse'
                              )} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-black text-white leading-tight">{n.title}</p>
                              <p className="text-[11px] text-slate-400 font-medium mt-0.5 leading-snug">{n.message}</p>
                              {n.paymentMethod === 'TRANSFER' && (
                                <span className="text-[9px] font-black text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded mt-1 inline-block">✅ Đã chuyển khoản</span>
                              )}
                              <p className="text-[9px] font-bold text-slate-600 uppercase tracking-widest mt-1.5">{timeAgo(n.createdAt)}</p>
                            </div>
                          </button>
                        ))
                      )}
                    </div>

                    {/* Footer */}
                    {notifications.length > 0 && (
                      <Link
                        href="/admin/crm/leads"
                        onClick={() => setShowNotifications(false)}
                        className="flex items-center justify-center gap-1.5 py-3 text-[10px] font-black text-emerald-500 hover:text-emerald-400 uppercase tracking-widest transition-colors border-t border-white/5"
                      >
                        Xem tất cả khách hàng <ChevronRight className="h-3 w-3" />
                      </Link>
                    )}
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>
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

      {/* FOOTER */}
      <div className="p-6 border-t border-slate-900 bg-slate-900/20 space-y-1">
        <Link href="/admin" className="flex items-center gap-3 px-5 py-3 rounded-xl text-slate-500 hover:text-slate-300 hover:bg-white/5 transition-all text-xs font-bold">
          <LayoutGrid className="h-4 w-4" />
          Về trang CMS
        </Link>
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
