'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronRight, User, LayoutDashboard,
  LogOut, Briefcase, Sparkles, MessageCircle,
  Home, BookOpen, Map, FileText, GraduationCap
} from 'lucide-react';
import { useState, useEffect } from 'react';

const navLinks = [
  { title: 'Trang chủ', href: '/', icon: Home },
  { title: 'Khóa học', href: '/courses', icon: BookOpen },
  { title: 'Lộ trình', href: '/learning-path', icon: Map },
  { title: 'Blog', href: '/blog', icon: FileText },
];

export function PublicHeader() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 z-50 w-full transition-all duration-300 ${isScrolled
        ? 'bg-white/80 backdrop-blur-md border-b border-gray-100 py-3 shadow-sm'
        : 'bg-transparent py-5'
        }`}
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <nav className="flex items-center justify-between">
          {/* LOGO */}
          <Link href="/" className="flex items-center gap-3 group relative z-10">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-tr from-emerald-600 to-cyan-400 rounded-xl blur-sm opacity-20 group-hover:opacity-40 transition-opacity" />
              <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-600 to-emerald-400 text-white shadow-lg shadow-emerald-100 transition-all group-hover:scale-105 group-hover:rotate-3">
                <GraduationCap className="h-6 w-6" />
                <div className="absolute -top-0.5 -right-0.5 h-3.5 w-3.5 bg-yellow-400 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                   <Sparkles className="h-1.5 w-1.5 text-white" />
                </div>
              </div>
            </div>
            <div className="flex flex-col leading-none">
              <div className="flex items-center gap-1">
                 <span className="text-lg font-black tracking-tighter text-slate-900 uppercase leading-none">Edu</span>
                 <span className="text-lg font-black tracking-tighter text-emerald-600 uppercase leading-none">Core</span>
              </div>
              <span className="text-[7px] font-black text-slate-400 tracking-[0.3em] mt-1.5 uppercase opacity-80">Intelligence System</span>
            </div>
          </Link>

          {/* NAV LINKS WITH ICONS */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.title}
                href={link.href}
                className="relative flex items-center gap-2 text-sm font-bold text-gray-500 transition-all hover:text-black group px-2 py-1"
              >
                <link.icon className="h-4 w-4 text-gray-400 group-hover:text-emerald-500 transition-colors" />
                {link.title}
                <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-emerald-600 transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </div>

          {/* ACTIONS SECTION */}
          <div className="flex items-center gap-4">

            <Link href="/contact" className="hidden lg:block">
              <Button
                className="h-10 rounded-full bg-gradient-to-r from-emerald-500 to-green-600 px-6 text-xs font-black text-white shadow-lg shadow-emerald-200 transition-all hover:scale-105 active:scale-95 gap-2 border-none"
              >
                <MessageCircle className="h-4 w-4" />
                TƯ VẤN NGAY
              </Button>
            </Link>

            {isLoggedIn ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-900 text-white shadow-lg transition-all hover:scale-110 active:scale-95 ring-2 ring-white"
                >
                  <User className="h-5 w-5" />
                </button>

                <AnimatePresence>
                  {isProfileOpen && (
                    <>
                      <div className="fixed inset-0" onClick={() => setIsProfileOpen(false)} />
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 mt-3 w-64 origin-top-right rounded-2xl bg-white p-2 shadow-2xl ring-1 ring-black/5 z-50 overflow-hidden"
                      >
                        <div className="px-4 py-4 bg-gray-50/50 border-b border-gray-100 mb-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Sparkles className="h-3 w-3 text-emerald-500" />
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Admin Account</p>
                          </div>
                          <p className="text-sm font-black text-black">EduCore Management</p>
                        </div>

                        <div className="p-1 space-y-0.5">
                          <Link href="/admin" className="flex items-center gap-3 px-3 py-2.5 text-sm font-bold text-gray-600 hover:bg-emerald-50 hover:text-emerald-700 rounded-xl transition-all group">
                            <LayoutDashboard className="h-4 w-4 text-gray-400 group-hover:text-emerald-500" />
                            Quản trị (CMS)
                          </Link>
                          <Link href="/admin/crm" className="flex items-center gap-3 px-3 py-2.5 text-sm font-bold text-gray-600 hover:bg-blue-50 hover:text-blue-700 rounded-xl transition-all group">
                            <Briefcase className="h-4 w-4 text-gray-400 group-hover:text-blue-500" />
                            Hệ thống CRM
                          </Link>
                          <Link href="/profile" className="flex items-center gap-3 px-3 py-2.5 text-sm font-bold text-gray-600 hover:bg-purple-50 hover:text-purple-700 rounded-xl transition-all group">
                            <User className="h-4 w-4 text-gray-400 group-hover:text-purple-500" />
                            Xem Profile
                          </Link>
                        </div>

                        <div className="mt-1 p-1 border-t border-gray-100">
                          <button className="flex w-full items-center gap-3 px-3 py-2.5 text-sm font-bold text-red-500 hover:bg-red-50 rounded-xl transition-all text-left">
                            <LogOut className="h-4 w-4" />
                            Đăng xuất
                          </button>
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link href="/login">
                <Button className="h-10 rounded-xl bg-black px-6 text-xs font-black text-white shadow-lg transition-all hover:scale-105">
                  ĐĂNG NHẬP
                </Button>
              </Link>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
