'use client';

import { 
  FileText, BookOpen, Eye, MessageSquare, 
  Search, Bell, Plus, MoreHorizontal,
  TrendingUp, TrendingDown, Clock, User,
  LayoutDashboard, Newspaper, Image as ImageIcon
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';
import api from '@/lib/axios';

export default function AdminDashboard() {
  const stats = [
    { label: 'Tổng bài viết Blog', value: '10', icon: Newspaper, change: '+2', isUp: true, color: 'text-orange-600', bg: 'bg-orange-50' },
    { label: 'Khóa học đào tạo', value: '06', icon: BookOpen, change: '0%', isUp: true, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Tổng lượt xem', value: '1.2k', icon: Eye, change: '+12%', isUp: true, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Bình luận mới', value: '24', icon: MessageSquare, change: '-5%', isUp: false, color: 'text-purple-600', bg: 'bg-purple-50' },
  ];

  const recentPosts = [
    { title: 'Lộ trình học IELTS cho người mất gốc', category: 'IELTS', date: '2 giờ trước', views: '145' },
    { title: '5 Mẹo luyện nghe hiệu quả tại nhà', category: 'Tips', date: '5 giờ trước', views: '89' },
    { title: 'Review chi tiết khóa học IELTS Intensive', category: 'Review', date: '1 ngày trước', views: '230' },
    { title: 'Tầm quan trọng của tiếng Anh công sở', category: 'Business', date: '2 ngày trước', views: '112' },
  ];

  return (
    <div className="min-h-screen bg-slate-50/50 p-8">
      {/* TOP HEADER */}
      <div className="flex items-center justify-between mb-10">
        <div className="relative w-96">
          <Search className="absolute left-4 top-3 h-4 w-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Tìm kiếm bài viết, khóa học..." 
            className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
          />
        </div>
        <div className="flex items-center gap-6">
          <button className="relative p-2 text-slate-400 hover:text-slate-600 transition-colors">
            <Bell className="h-5 w-5" />
            <span className="absolute top-2 right-2 h-2 w-2 bg-red-500 rounded-full border-2 border-white"></span>
          </button>
          
          <Button variant="outline" className="hidden lg:flex items-center gap-2 border-emerald-200 text-emerald-700 bg-emerald-50/50 hover:bg-emerald-100 rounded-xl px-4 h-10 font-bold text-xs text-emerald-600">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            CMS ACTIVE
          </Button>

          <div className="flex items-center gap-3 border-l pl-6">
             <div className="text-right">
                <p className="text-sm font-black text-slate-900 leading-none">EduCore Admin</p>
                <p className="text-[10px] font-medium text-slate-400 mt-1 uppercase tracking-tighter">Quản trị nội dung</p>
             </div>
             <div className="h-11 w-11 rounded-full bg-slate-900 flex items-center justify-center text-white shadow-lg ring-2 ring-white">
                <User className="h-5 w-5" />
             </div>
          </div>
        </div>
      </div>

      {/* TITLES */}
      <div className="mb-10">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Tổng quan CMS</h1>
        <p className="text-sm text-slate-500 mt-1 font-medium italic">Quản lý các bài viết và khóa học của EduCore Academy.</p>
      </div>

      {/* STATS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm transition-all hover:shadow-xl group cursor-pointer">
             <div className="flex items-center justify-between mb-4">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
                <div className={cn("h-11 w-11 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110", stat.bg, stat.color)}>
                   <stat.icon className="h-5 w-5" />
                </div>
             </div>
             <div>
                <p className="text-3xl font-black text-slate-900">{stat.value}</p>
                <div className="flex items-center gap-1 mt-1">
                   {stat.isUp ? <TrendingUp className="h-3.5 w-3.5 text-emerald-500" /> : <TrendingDown className="h-3.5 w-3.5 text-red-500" />}
                   <span className={cn("text-xs font-bold", stat.isUp ? "text-emerald-500" : "text-red-500")}>
                     {stat.change} <span className="text-slate-400 font-medium">so với tháng trước</span>
                   </span>
                </div>
             </div>
          </div>
        ))}
      </div>

      {/* BOTTOM SECTIONS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* RECENT BLOG POSTS */}
        <div className="lg:col-span-2 bg-white rounded-[2rem] border border-slate-100 shadow-sm p-10">
           <div className="flex items-center justify-between mb-10">
              <h2 className="text-xl font-black text-slate-900">Bài viết Blog mới nhất</h2>
              <button className="text-slate-400 hover:text-slate-600 transition-colors"><Plus className="h-5 w-5" /></button>
           </div>
           <div className="space-y-8">
              {recentPosts.map((post, i) => (
                <div key={i} className="flex items-center gap-6 group cursor-pointer border-b border-slate-50 pb-6 last:border-0 last:pb-0">
                   <div className="h-12 w-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 shrink-0 group-hover:bg-emerald-50 group-hover:text-emerald-500 transition-all">
                      <FileText className="h-6 w-6" />
                   </div>
                   <div className="flex-1">
                      <p className="text-base font-black text-slate-900 group-hover:text-emerald-600 transition-colors">
                        {post.title}
                      </p>
                      <div className="flex items-center gap-4 mt-2">
                         <span className="text-[10px] font-black uppercase text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">{post.category}</span>
                         <span className="text-xs text-slate-400 font-medium flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {post.date}</span>
                         <span className="text-xs text-slate-400 font-medium flex items-center gap-1"><Eye className="h-3.5 w-3.5" /> {post.views} lượt xem</span>
                      </div>
                   </div>
                </div>
              ))}
           </div>
        </div>

        {/* CMS DISTRIBUTION */}
        <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-10 flex flex-col items-center justify-center text-center">
           <div className="w-full text-left self-start mb-8">
              <h2 className="text-xl font-black text-slate-900">Phân bổ nội dung</h2>
              <p className="text-xs text-slate-400 mt-1 font-medium">Tỷ lệ bài viết theo danh mục</p>
           </div>
           <div className="flex-1 flex flex-col items-center justify-center py-20 opacity-30">
              <div className="h-44 w-44 rounded-full border-[12px] border-slate-50 border-t-emerald-500 animate-spin-slow mb-6" />
              <p className="text-[10px] font-black text-slate-300 italic tracking-widest uppercase">
                Đang xử lý dữ liệu CMS...
              </p>
           </div>
        </div>
      </div>
    </div>
  );
}
