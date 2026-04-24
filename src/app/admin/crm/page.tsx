'use client';

import {
  TrendingUp, Users, ClipboardList, Target, Zap, Activity,
  UserPlus, Phone, Clock, CheckSquare, ArrowUpRight, ArrowDownRight,
  Home, ChevronRight, Loader2, DollarSign, BookOpen, BarChart3, MessageSquare
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';
import api from '@/lib/axios';
import Link from 'next/link';
import { useSocket } from '@/lib/socket-provider';

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  NEW:           { label: 'Mới đăng ký',    color: 'bg-emerald-500' },
  CONTACTED:     { label: 'Đã liên hệ',     color: 'bg-blue-500' },
  CONSULTING:    { label: 'Đang tư vấn',    color: 'bg-violet-500' },
  TRIAL_LEARNING:{ label: 'Học thử',        color: 'bg-amber-500' },
  WON:           { label: 'Đã đăng ký HV',  color: 'bg-teal-500' },
  LOST:          { label: 'Không tiếp cận', color: 'bg-slate-500' },
  IN_PROGRESS:   { label: 'Đang xử lý',     color: 'bg-blue-400' },
  CONVERTED:     { label: 'Đã chuyển đổi',  color: 'bg-teal-400' },
};

export default function CRMDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { socket } = useSocket();

  const fetchStats = async () => {
    try {
      const response: any = await api.get('/admin/crm-stats');
      if (response.success) setStats(response.data);
    } catch (error) {
      console.error('Lỗi khi tải CRM stats:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    if (socket) {
      socket.on('newLead', () => fetchStats());
      return () => { socket.off('newLead'); };
    }
  }, [socket]);

  const crmStats = stats ? [
    {
      label: 'Doanh thu tháng',
      value: stats.revenueThisMonth >= 1_000_000
        ? `${(stats.revenueThisMonth / 1_000_000).toFixed(1)}M`
        : stats.revenueThisMonth.toLocaleString('vi-VN'),
      icon: DollarSign, color: 'text-emerald-500', bg: 'bg-emerald-500/10',
      change: stats.revenueGrowth >= 0 ? `+${stats.revenueGrowth}%` : `${stats.revenueGrowth}%`,
      positive: stats.revenueGrowth >= 0,
    },
    {
      label: 'Leads mới tháng này',
      value: stats.newLeadsThisMonth.toString(),
      icon: Target, color: 'text-blue-500', bg: 'bg-blue-500/10',
      change: stats.leadsGrowth >= 0 ? `+${stats.leadsGrowth}%` : `${stats.leadsGrowth}%`,
      positive: stats.leadsGrowth >= 0,
    },
    {
      label: 'Học viên',
      value: stats.totalStudents.toString(),
      icon: UserPlus, color: 'text-purple-500', bg: 'bg-purple-500/10',
      change: `+${stats.newStudentsThisMonth} tháng này`,
      positive: true,
    },
    {
      label: 'Tỷ lệ chốt',
      value: `${stats.conversionRate}%`,
      icon: Zap, color: 'text-orange-500', bg: 'bg-orange-500/10',
      change: `${stats.paidOrders} đơn PAID`,
      positive: true,
    },
  ] : [
    { label: 'Doanh thu tháng', value: '—', icon: DollarSign, color: 'text-emerald-500', bg: 'bg-emerald-500/10', change: '...', positive: true },
    { label: 'Leads mới', value: '—', icon: Target, color: 'text-blue-500', bg: 'bg-blue-500/10', change: '...', positive: true },
    { label: 'Học viên', value: '—', icon: UserPlus, color: 'text-purple-500', bg: 'bg-purple-500/10', change: '...', positive: true },
    { label: 'Tỷ lệ chốt', value: '—', icon: Zap, color: 'text-orange-500', bg: 'bg-orange-500/10', change: '...', positive: true },
  ];

  // Chart max value
  const chartMax = stats?.monthlyChart
    ? Math.max(...stats.monthlyChart.map((m: any) => m.leads), 1)
    : 1;

  return (
    <div className="min-h-screen bg-slate-900 text-slate-400 p-8">
      {/* BREADCRUMBS */}
      <nav className="flex items-center gap-2 mb-6 text-[10px] font-black uppercase tracking-widest text-slate-600">
        <Link href="/admin" className="hover:text-emerald-500 transition-colors flex items-center gap-1.5">
          <Home className="h-3 w-3" /> Dashboard
        </Link>
        <ChevronRight className="h-3 w-3 opacity-30" />
        <span className="text-white">Hệ thống CRM</span>
      </nav>

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div className="flex items-center gap-4">
          <div className="h-10 w-2.5 bg-emerald-500 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.3)]" />
          <div>
            <h1 className="text-2xl font-black text-white tracking-tight uppercase leading-none">Bảng điều khiển kinh doanh</h1>
            <div className="flex items-center gap-3 mt-2">
              <span className="flex items-center gap-1.5 text-[9px] font-black text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 uppercase tracking-widest">
                <Activity className="h-3 w-3" /> Dữ liệu thực từ DB
              </span>
              <p className="text-[11px] font-bold text-slate-500 tracking-tight">
                Cập nhật: {new Date().toLocaleString('vi-VN')}
              </p>
            </div>
          </div>
        </div>
        <div className="flex gap-3">
          <Link href="/admin/crm/reports">
            <Button className="h-10 rounded-xl bg-slate-800 border border-white/5 text-slate-400 hover:text-emerald-500 hover:bg-emerald-500/10 font-black text-[10px] tracking-widest uppercase gap-2 transition-all">
              <BarChart3 className="h-4 w-4" /> Báo cáo
            </Button>
          </Link>
          <Link href="/admin/crm/leads">
            <Button className="h-10 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-[10px] tracking-widest uppercase gap-2 border-none shadow-[0_0_20px_rgba(16,185,129,0.2)] transition-all">
              <ClipboardList className="h-4 w-4" /> Xem tất cả leads
            </Button>
          </Link>
        </div>
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        {crmStats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="bg-slate-950/50 border border-white/5 p-5 rounded-2xl hover:bg-slate-950 transition-all flex flex-col justify-between h-32 group"
          >
            <div className="flex items-center justify-between">
              <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110", stat.bg, stat.color)}>
                <stat.icon className="h-5 w-5" />
              </div>
              <span className={cn(
                "text-[10px] font-black tracking-tighter px-1.5 py-0.5 rounded flex items-center gap-1",
                stat.positive ? "text-emerald-500 bg-emerald-500/10" : "text-red-500 bg-red-500/10"
              )}>
                {stat.positive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                {stat.change}
              </span>
            </div>
            <div>
              {loading ? (
                <div className="h-8 w-20 bg-white/5 rounded-lg animate-pulse" />
              ) : (
                <p className="text-2xl font-black text-white leading-none">{stat.value}</p>
              )}
              <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest mt-2">{stat.label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* RECENT LEADS */}
          <div className="bg-slate-950/50 border border-white/5 rounded-[2rem] p-8 min-h-[350px]">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-lg font-black text-white uppercase tracking-tight">Leads mới nhất</h2>
                <p className="text-[10px] text-slate-600 font-bold uppercase mt-1">Dữ liệu thời gian thực từ Database</p>
              </div>
              <Link href="/admin/crm/leads">
                <Button variant="ghost" className="text-[10px] font-black text-emerald-500 uppercase tracking-widest hover:bg-emerald-500/10 px-4">
                  Xem tất cả
                </Button>
              </Link>
            </div>

            <div className="space-y-3">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-16 gap-4 opacity-30">
                  <Loader2 className="h-10 w-10 animate-spin" />
                  <p className="text-xs font-black uppercase tracking-[0.2em]">Đang đồng bộ dữ liệu...</p>
                </div>
              ) : stats?.recentLeads?.length > 0 ? (
                stats.recentLeads.map((lead: any, i: number) => (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.07 }}
                    key={lead.id}
                    className="flex items-center justify-between p-4 rounded-2xl bg-slate-900/50 border border-transparent hover:bg-slate-950 hover:border-white/5 transition-all group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-xl bg-slate-950 border border-white/5 flex items-center justify-center text-slate-600 font-black text-xs uppercase group-hover:text-emerald-500 transition-all shrink-0">
                        {lead.fullName?.split(' ').pop()?.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-black text-white truncate">{lead.fullName}</p>
                          {lead.status && (
                            <span className="px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-widest border bg-slate-800/80 text-slate-400 border-white/5 shrink-0">
                              {STATUS_LABELS[lead.status]?.label || lead.status}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-3 mt-1.5 text-[10px] font-bold">
                          <span className="text-emerald-500 flex items-center gap-1"><Phone className="h-3 w-3" /> {lead.phone}</span>
                          {lead.courseName && (
                            <span className="text-slate-600 flex items-center gap-1 border-l border-white/10 pl-3">
                              <BookOpen className="h-3 w-3" /> {lead.courseName}
                            </span>
                          )}
                          <span className="text-slate-600 flex items-center gap-1 border-l border-white/10 pl-3">
                            <Clock className="h-3 w-3" /> {new Date(lead.createdAt).toLocaleDateString('vi-VN')}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0">
                      <a href={`tel:${lead.phone}`} className="h-8 w-8 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center shadow-lg shadow-emerald-900/20">
                        <Phone className="h-3.5 w-3.5" />
                      </a>
                      <Link href={`/admin/crm/leads/${lead.id}`} className="h-8 w-8 rounded-lg bg-slate-900 border border-white/10 hover:bg-slate-800 text-slate-400 flex items-center justify-center">
                        <ChevronRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-16 gap-4 opacity-20">
                  <ClipboardList className="h-12 w-12" />
                  <p className="text-sm font-black uppercase tracking-[0.2em]">Chưa có khách hàng đăng ký</p>
                </div>
              )}
            </div>
          </div>

          {/* MONTHLY LEADS CHART */}
          <div className="bg-slate-950/50 border border-white/5 rounded-[2rem] p-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-lg font-black text-white uppercase tracking-tight">Leads 6 tháng gần đây</h2>
              <div className="text-[9px] font-black text-slate-600 uppercase tracking-widest flex gap-4">
                <span className="flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />Số leads mới</span>
              </div>
            </div>
            {loading ? (
              <div className="h-44 flex items-center justify-center opacity-20">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : (
              <div className="h-44 w-full flex items-end justify-between gap-3 px-2">
                {(stats?.monthlyChart || []).map((m: any, i: number) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2">
                    <span className="text-[9px] font-black text-emerald-500 opacity-0 group-hover:opacity-100">{m.leads}</span>
                    <div
                      className="w-full bg-slate-900 rounded-t-sm relative group hover:bg-emerald-500 transition-all cursor-pointer"
                      style={{ height: `${Math.max(4, (m.leads / chartMax) * 100)}%` }}
                    >
                      <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-slate-800 text-emerald-400 text-[9px] font-black px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-all whitespace-nowrap">
                        {m.leads} leads
                      </div>
                    </div>
                    <span className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">{m.month}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-6">
          {/* STATUS BREAKDOWN */}
          <div className="bg-slate-950/50 border border-white/5 rounded-[2rem] p-8 flex-1">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-lg font-black text-white uppercase tracking-tight">Phân tích Status</h2>
              <div className="h-8 w-8 rounded-xl bg-white/5 flex items-center justify-center">
                <BarChart3 className="h-4 w-4 text-emerald-500" />
              </div>
            </div>
            {loading ? (
              <div className="space-y-3">
                {[1,2,3,4].map(i => <div key={i} className="h-8 bg-white/5 rounded-lg animate-pulse" />)}
              </div>
            ) : (
              <div className="space-y-3">
                {(stats?.statusBreakdown || []).slice(0, 6).map((s: any) => {
                  const cfg = STATUS_LABELS[s.status] || { label: s.status, color: 'bg-slate-500' };
                  const pct = stats.totalLeads > 0 ? Math.round((s.count / stats.totalLeads) * 100) : 0;
                  return (
                    <div key={s.status} className="space-y-1.5">
                      <div className="flex items-center justify-between text-[10px] font-bold">
                        <span className="text-slate-400">{cfg.label}</span>
                        <span className="text-white font-black">{s.count} <span className="text-slate-600">({pct}%)</span></span>
                      </div>
                      <div className="h-1.5 bg-slate-900 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={{ delay: 0.3, duration: 0.5 }}
                          className={cn("h-full rounded-full", cfg.color)}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* GOAL CARD */}
          <div className="bg-emerald-600 rounded-[2rem] p-8 text-white shadow-2xl shadow-emerald-900/20 relative overflow-hidden group shrink-0">
            <div className="absolute -right-6 -top-6 h-24 w-24 bg-white/10 rounded-full blur-2xl group-hover:scale-125 transition-transform duration-700" />
            <div className="relative z-10">
              <p className="text-[9px] font-black uppercase tracking-widest opacity-80 mb-2">Tổng doanh thu (PAID)</p>
              {loading ? (
                <div className="h-8 w-32 bg-white/20 rounded-lg animate-pulse mb-4" />
              ) : (
                <h3 className="text-2xl font-black mb-4 italic tracking-tight text-white">
                  {stats?.totalRevenue?.toLocaleString('vi-VN') || 0}đ
                </h3>
              )}
              <Link href="/admin/crm/orders">
                <button className="text-[10px] font-black uppercase tracking-widest bg-white/20 hover:bg-white/30 px-4 py-2 rounded-xl transition-all">
                  Xem Đơn hàng →
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
