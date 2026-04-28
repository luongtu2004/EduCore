'use client';

import {
  FileText, BookOpen, ImageIcon,
  LayoutDashboard, Globe, LogOut, ExternalLink,
  Users, User, Layers, Flag, ChevronRight, Sparkles,
  LayoutGrid, GraduationCap, Zap, MessageCircle,
  Bell, X, Phone, Mail, Settings, Ticket, MessageSquare
} from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { useSocket } from '@/lib/socket-provider';
import { useState } from 'react';
import { Map } from 'lucide-react';

const sidebarGroups = [
  {
    group: 'QUẢN TRỊ HỆ THỐNG',
    items: [
      { name: 'Tổng quan', icon: LayoutDashboard, href: '/admin' },
      { name: 'Quản trị tài khoản', icon: Users, href: '/admin/users' },
      { name: 'Cài đặt hệ thống', icon: Settings, href: '/admin/settings' },
    ]
  },
  {
    group: 'NỘI DUNG & CMS',
    items: [
      { name: 'Lộ trình học', icon: Map, href: '/admin/learning-paths' },
      { name: 'Khóa học', icon: BookOpen, href: '/admin/courses' },
      { name: 'Bài viết', icon: FileText, href: '/admin/posts' },
      { name: 'Cảm nghĩ', icon: MessageCircle, href: '/admin/testimonials' },
      { name: 'Danh mục', icon: Layers, href: '/admin/categories' },
      { name: 'Câu hỏi & Quiz', icon: GraduationCap, href: '/admin/cms/quiz' },
      { name: 'Mã giảm giá', icon: Ticket, href: '/admin/coupons' },
      { name: 'Thư viện Media', icon: ImageIcon, href: '/admin/media' },
      { name: 'Liên hệ khách hàng', icon: MessageSquare, href: '/admin/contacts' },
    ]
  },
  {
    group: 'GIAO DIỆN & TIỆN ÍCH',
    items: [
      { name: 'Banners', icon: Flag, href: '/admin/banners' },
      { name: 'FAQs', icon: Zap, href: '/admin/faqs' },
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

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { notifications, unreadCount, markAsRead, clearAll } = useSocket();
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <aside className="w-72 h-screen bg-white border-r border-gray-100 flex flex-col fixed left-0 top-0 z-40">
      {/* BRANDING */}
      <div className="p-8 pb-6">
        <div className="flex items-center justify-between">
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
              <div className="flex items-center gap-1 font-heading">
                <span className="text-xl font-black tracking-tighter text-slate-900 uppercase">Edu</span>
                <span className="text-xl font-black tracking-tighter text-emerald-600 uppercase">Core</span>
              </div>
              <span className="text-[8px] font-black text-slate-400 tracking-[0.4em] mt-1.5 uppercase opacity-80">Intelligence System</span>
            </div>
          </Link>

          {/* 🔔 BELL ICON */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative h-10 w-10 rounded-2xl bg-slate-50 hover:bg-emerald-50 flex items-center justify-center text-slate-400 hover:text-emerald-600 transition-all"
            >
              <Bell className="h-4 w-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 rounded-full flex items-center justify-center text-[9px] font-black text-white border-2 border-white animate-bounce">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {/* NOTIFICATION DROPDOWN */}
            <AnimatePresence>
              {showNotifications && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)} />
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute left-0 top-12 w-80 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-50"
                  >
                    {/* Header */}
                    <div className="flex items-center justify-between px-5 py-4 border-b border-slate-50">
                      <div>
                        <p className="text-sm font-black text-slate-900">Thông báo</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                          {unreadCount > 0 ? `${unreadCount} chưa đọc` : 'Tất cả đã đọc'}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {notifications.length > 0 && (
                          <button
                            onClick={clearAll}
                            className="text-[9px] font-black text-slate-400 hover:text-rose-500 uppercase tracking-widest transition-colors"
                          >
                            Xóa tất cả
                          </button>
                        )}
                        <button onClick={() => setShowNotifications(false)} className="text-slate-300 hover:text-slate-600">
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    {/* Notification List */}
                    <div className="max-h-80 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="py-12 text-center">
                          <Bell className="h-8 w-8 text-slate-200 mx-auto mb-3" />
                          <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Chưa có thông báo</p>
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
                              'w-full text-left px-5 py-4 border-b border-slate-50 hover:bg-slate-50 transition-all flex gap-3',
                              !n.read && 'bg-emerald-50/50'
                            )}
                          >
                            {/* Dot indicator */}
                            <div className="mt-1 shrink-0">
                              <span className={cn(
                                'h-2 w-2 rounded-full block',
                                n.read ? 'bg-slate-200' : 'bg-emerald-500 animate-pulse'
                              )} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-black text-slate-900 leading-tight">{n.title}</p>
                              <p className="text-[11px] text-slate-500 font-medium mt-0.5 leading-snug">{n.message}</p>
                              <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest mt-1.5">{timeAgo(n.createdAt)}</p>
                            </div>
                          </button>
                        ))
                      )}
                    </div>

                    {/* Footer link */}
                    {notifications.length > 0 && (
                      <Link
                        href="/admin/crm/leads"
                        onClick={() => setShowNotifications(false)}
                        className="flex items-center justify-center gap-1.5 py-3 text-[10px] font-black text-emerald-600 hover:text-emerald-700 uppercase tracking-widest transition-colors border-t border-slate-50"
                      >
                        Xem tất cả leads <ChevronRight className="h-3 w-3" />
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
        {sidebarGroups.map((group) => (
          <div key={group.group} className="space-y-3">
            {group.group && (
              <h3 className="px-5 text-[10px] font-black text-gray-300 uppercase tracking-[0.2em]">{group.group}</h3>
            )}
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
