'use client';

import {
  FileText, BookOpen, Eye, MessageSquare,
  Bell, Plus, TrendingUp, TrendingDown, Clock,
  User, Newspaper, Users, Target, Hash
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';
import api from '@/lib/axios';
import Link from 'next/link';

interface DashboardStats {
  totalPosts: number;
  totalCourses: number;
  totalUsers: number;
  newLeads: number;
  totalTestimonials: number;
  activeBanners: number;
}

interface RecentPost {
  id: string;
  title: string;
  slug: string;
  categoryName: string;
  createdAt: string;
  updatedAt: string;
}

interface CategoryDist {
  name: string;
  count: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentPosts, setRecentPosts] = useState<RecentPost[]>([]);
  const [categoryDist, setCategoryDist] = useState<CategoryDist[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response: any = await api.get('/admin/stats');
        if (response.success) {
          setStats(response.data.stats);
          setRecentPosts(response.data.recentPosts);
          setCategoryDist(response.data.categoryDistribution);
        }
      } catch (error) {
        console.error('Lỗi tải dashboard:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  const statCards = stats ? [
    {
      label: 'Tổng bài viết Blog',
      value: stats.totalPosts.toString(),
      icon: Newspaper,
      color: 'text-orange-600',
      bg: 'bg-orange-50',
      href: '/admin/posts',
    },
    {
      label: 'Khóa học đào tạo',
      value: stats.totalCourses.toString().padStart(2, '0'),
      icon: BookOpen,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      href: '/admin/courses',
    },
    {
      label: 'Tổng thành viên',
      value: stats.totalUsers.toString(),
      icon: Users,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
      href: '/admin/users',
    },
    {
      label: 'Leads tiềm năng',
      value: stats.newLeads.toString(),
      icon: Target,
      color: 'text-purple-600',
      bg: 'bg-purple-50',
      href: '/admin/crm',
    },
  ] : [];

  const maxCount = Math.max(...categoryDist.map(c => c.count), 1);

  const CATEGORY_COLORS = [
    'bg-emerald-500',
    'bg-blue-500',
    'bg-orange-500',
    'bg-purple-500',
    'bg-rose-500',
    'bg-cyan-500',
  ];

  function timeAgo(dateStr: string) {
    const now = new Date();
    const date = new Date(dateStr);
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 60) return `${diffMins} phút trước`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} giờ trước`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} ngày trước`;
  }

  return (
    <div className="min-h-screen bg-slate-50/50 p-8">
      {/* TOP HEADER */}
      <div className="flex items-center justify-end mb-10">
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
        <p className="text-sm text-slate-500 mt-1 font-medium">Quản lý các bài viết và khóa học của EduCore Academy.</p>
      </div>

      {/* STATS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {isLoading ? (
          Array(4).fill(0).map((_, i) => (
            <div key={i} className="h-32 bg-white rounded-2xl border border-slate-100 animate-pulse" />
          ))
        ) : (
          statCards.map((stat) => (
            <Link
              key={stat.label}
              href={stat.href}
              className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm transition-all hover:shadow-xl group cursor-pointer block"
            >
              <div className="flex items-center justify-between mb-4">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
                <div className={cn("h-11 w-11 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110", stat.bg, stat.color)}>
                  <stat.icon className="h-5 w-5" />
                </div>
              </div>
              <div>
                <p className="text-3xl font-black text-slate-900">{stat.value}</p>
                <p className="text-[10px] text-slate-400 font-medium mt-1">Nhấp để xem chi tiết →</p>
              </div>
            </Link>
          ))
        )}
      </div>

      {/* BOTTOM SECTIONS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* RECENT BLOG POSTS */}
        <div className="lg:col-span-2 bg-white rounded-[2rem] border border-slate-100 shadow-sm p-10">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-black text-slate-900">Bài viết Blog mới nhất</h2>
            <Link
              href="/admin/posts"
              className="text-xs font-bold text-emerald-600 hover:text-emerald-700 transition-colors"
            >
              Xem tất cả →
            </Link>
          </div>

          {isLoading ? (
            <div className="space-y-6">
              {Array(4).fill(0).map((_, i) => (
                <div key={i} className="h-14 bg-slate-50 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : recentPosts.length > 0 ? (
            <div className="space-y-6">
              {recentPosts.map((post) => (
                <div key={post.id} className="flex items-center gap-5 group cursor-pointer border-b border-slate-50 pb-5 last:border-0 last:pb-0">
                  <div className="h-11 w-11 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 shrink-0 group-hover:bg-emerald-50 group-hover:text-emerald-500 transition-all">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-black text-slate-900 group-hover:text-emerald-600 transition-colors truncate">
                      {post.title}
                    </p>
                    <div className="flex items-center gap-3 mt-1.5">
                      <span className="text-[9px] font-black uppercase text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                        {post.categoryName}
                      </span>
                      <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {timeAgo(post.updatedAt || post.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-16 text-center">
              <p className="text-sm font-bold text-slate-300 uppercase tracking-widest">Chưa có bài viết nào</p>
            </div>
          )}
        </div>

        {/* CATEGORY DISTRIBUTION CHART */}
        <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-8 flex flex-col">
          <div className="mb-8">
            <h2 className="text-xl font-black text-slate-900">Phân bổ nội dung</h2>
            <p className="text-xs text-slate-400 mt-1 font-medium">Số bài viết theo danh mục</p>
          </div>

          {isLoading ? (
            <div className="flex-1 flex flex-col gap-4 justify-center">
              {Array(5).fill(0).map((_, i) => (
                <div key={i} className="h-8 bg-slate-50 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : categoryDist.length > 0 ? (
            <div className="flex-1 flex flex-col gap-4 justify-center">
              {categoryDist.map((cat, idx) => (
                <div key={cat.name} className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest truncate max-w-[140px]">{cat.name}</span>
                    <span className="text-[10px] font-black text-slate-400">{cat.count}</span>
                  </div>
                  <div className="h-2 w-full bg-slate-50 rounded-full overflow-hidden">
                    <div
                      className={cn("h-full rounded-full transition-all duration-700", CATEGORY_COLORS[idx % CATEGORY_COLORS.length])}
                      style={{ width: `${(cat.count / maxCount) * 100}%` }}
                    />
                  </div>
                </div>
              ))}

              {/* Summary badges */}
              <div className="mt-4 pt-4 border-t border-slate-50 flex flex-wrap gap-2">
                {categoryDist.map((cat, idx) => (
                  <span key={cat.name} className="flex items-center gap-1.5 text-[9px] font-bold text-slate-500">
                    <span className={cn("h-2 w-2 rounded-full", CATEGORY_COLORS[idx % CATEGORY_COLORS.length])} />
                    {cat.name}
                  </span>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center py-10 opacity-30">
              <Hash className="h-12 w-12 text-slate-300 mb-4" />
              <p className="text-[10px] font-black text-slate-300 tracking-widest uppercase">
                Chưa có dữ liệu
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
