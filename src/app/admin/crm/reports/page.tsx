'use client';

import { useState, useEffect } from 'react';
import {
  BarChart3, TrendingUp, DollarSign, Target, Users, CheckCircle2,
  ArrowUpRight, ArrowDownRight, Home, ChevronRight, Loader2,
  Calendar, Download, Filter, Zap, Trophy, BookOpen, Phone
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import api from '@/lib/axios';
import Link from 'next/link';

const STATUS_LABELS: Record<string, { label: string; color: string; bg: string }> = {
  NEW:           { label: 'Mới đăng ký',    color: 'text-emerald-400', bg: 'bg-emerald-500' },
  CONTACTED:     { label: 'Đã liên hệ',     color: 'text-blue-400',    bg: 'bg-blue-500' },
  CONSULTING:    { label: 'Đang tư vấn',    color: 'text-violet-400',  bg: 'bg-violet-500' },
  TRIAL_LEARNING:{ label: 'Học thử',        color: 'text-amber-400',   bg: 'bg-amber-500' },
  WON:           { label: 'Đã đăng ký HV',  color: 'text-teal-400',    bg: 'bg-teal-500' },
  LOST:          { label: 'Không tiếp cận', color: 'text-slate-400',   bg: 'bg-slate-500' },
};

export default function CRMReportsPage() {
  const [stats, setStats] = useState<any>(null);
  const [staffStats, setStaffStats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'staff'>('overview');

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [statsRes, staffRes]: [any, any] = await Promise.all([
          api.get('/admin/crm-stats'),
          api.get('/admin/crm-staff-stats'),
        ]);
        if (statsRes.success) setStats(statsRes.data);
        if (staffRes.success) setStaffStats(staffRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const chartMax = stats?.monthlyChart
    ? Math.max(...stats.monthlyChart.map((m: any) => m.revenue), 1)
    : 1;

  return (
    <div className="min-h-screen bg-slate-900 text-slate-400 p-8">
      {/* BREADCRUMBS */}
      <nav className="flex items-center gap-2 mb-6 text-[10px] font-black uppercase tracking-widest text-slate-600">
        <Link href="/admin" className="hover:text-emerald-500 transition-colors flex items-center gap-1.5">
          <Home className="h-3 w-3" /> Dashboard
        </Link>
        <ChevronRight className="h-3 w-3 opacity-30" />
        <Link href="/admin/crm" className="hover:text-emerald-500 transition-colors">CRM</Link>
        <ChevronRight className="h-3 w-3 opacity-30" />
        <span className="text-white">Báo cáo & Thống kê</span>
      </nav>

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div className="flex items-center gap-4">
          <div className="h-12 w-2.5 bg-emerald-500 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.4)]" />
          <div>
            <h1 className="text-3xl font-black text-white tracking-tighter uppercase italic leading-none">Báo cáo & Thống kê</h1>
            <p className="text-xs font-bold text-slate-500 mt-2 uppercase tracking-widest">Phân tích hiệu suất kinh doanh toàn bộ CRM</p>
          </div>
        </div>
      </div>

      {/* TABS */}
      <div className="flex gap-2 mb-8 bg-slate-950/50 border border-white/5 p-1.5 rounded-2xl w-fit">
        {[
          { id: 'overview', label: 'Tổng quan', icon: BarChart3 },
          { id: 'staff', label: 'Hiệu suất nhân viên', icon: Trophy },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={cn(
              "flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
              activeTab === tab.id
                ? "bg-emerald-600 text-white shadow-lg shadow-emerald-900/20"
                : "text-slate-500 hover:text-white hover:bg-white/5"
            )}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-32">
          <Loader2 className="h-10 w-10 text-emerald-500 animate-spin" />
        </div>
      ) : activeTab === 'overview' ? (
        <div className="space-y-8">
          {/* KPI CARDS */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { label: 'Tổng doanh thu', value: `${((stats?.totalRevenue || 0) / 1_000_000).toFixed(1)}M đ`, icon: DollarSign, color: 'text-emerald-500', bg: 'bg-emerald-500/10', sub: `${stats?.paidOrders || 0} đơn PAID` },
              { label: 'Tổng Leads', value: (stats?.totalLeads || 0).toString(), icon: Target, color: 'text-blue-500', bg: 'bg-blue-500/10', sub: `+${stats?.newLeadsThisMonth || 0} tháng này` },
              { label: 'Học viên', value: (stats?.totalStudents || 0).toString(), icon: Users, color: 'text-purple-500', bg: 'bg-purple-500/10', sub: `+${stats?.newStudentsThisMonth || 0} tháng này` },
              { label: 'Tỷ lệ chuyển đổi', value: `${stats?.conversionRate || 0}%`, icon: Zap, color: 'text-orange-500', bg: 'bg-orange-500/10', sub: `${stats?.paidOrders || 0} đơn hàng thành công` },
            ].map((card, i) => (
              <motion.div
                key={card.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="bg-slate-950/50 border border-white/5 p-6 rounded-2xl"
              >
                <div className={cn("h-12 w-12 rounded-xl flex items-center justify-center mb-4", card.bg, card.color)}>
                  <card.icon className="h-6 w-6" />
                </div>
                <p className="text-2xl font-black text-white">{card.value}</p>
                <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mt-1">{card.label}</p>
                <p className="text-[10px] font-bold text-slate-500 mt-2">{card.sub}</p>
              </motion.div>
            ))}
          </div>

          {/* REVENUE CHART + STATUS BREAKDOWN */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Revenue Chart */}
            <div className="lg:col-span-2 bg-slate-950/50 border border-white/5 rounded-[2rem] p-8">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-lg font-black text-white uppercase tracking-tight">Doanh thu 6 tháng</h2>
                  <p className="text-[10px] text-slate-600 font-bold uppercase mt-1">Chỉ tính đơn hàng PAID</p>
                </div>
              </div>
              <div className="h-56 w-full flex items-end justify-between gap-3 px-2 mb-4">
                {(stats?.monthlyChart || []).map((m: any, i: number) => {
                  const pct = Math.max(4, (m.revenue / chartMax) * 100);
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center gap-2">
                      <div
                        className="w-full bg-slate-900 rounded-t-sm relative group hover:bg-emerald-500 transition-all cursor-pointer"
                        style={{ height: `${pct}%` }}
                      >
                        <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-800 text-emerald-400 text-[9px] font-black px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-all whitespace-nowrap">
                          {(m.revenue / 1_000_000).toFixed(1)}M
                        </div>
                      </div>
                      <span className="text-[9px] font-bold text-slate-600 uppercase">{m.month}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Status Breakdown */}
            <div className="bg-slate-950/50 border border-white/5 rounded-[2rem] p-8">
              <h2 className="text-lg font-black text-white uppercase tracking-tight mb-8">Phân tích leads</h2>
              <div className="space-y-4">
                {(stats?.statusBreakdown || []).map((s: any) => {
                  const cfg = STATUS_LABELS[s.status] || { label: s.status, color: 'text-slate-400', bg: 'bg-slate-500' };
                  const pct = stats.totalLeads > 0 ? Math.round((s.count / stats.totalLeads) * 100) : 0;
                  return (
                    <div key={s.status}>
                      <div className="flex items-center justify-between text-[10px] font-bold mb-1.5">
                        <span className={cn("font-black", cfg.color)}>{cfg.label}</span>
                        <span className="text-white">{s.count} <span className="text-slate-600">({pct}%)</span></span>
                      </div>
                      <div className="h-2 bg-slate-900 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={{ delay: 0.5, duration: 0.6 }}
                          className={cn("h-full rounded-full", cfg.bg)}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* STAFF PERFORMANCE TAB */
        <div className="space-y-6">
          <div className="bg-slate-950/50 border border-white/5 rounded-[2rem] overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 bg-white/5">
                  <th className="px-8 py-5 text-[10px] font-black text-gray-500 uppercase tracking-widest">Nhân viên</th>
                  <th className="px-6 py-5 text-[10px] font-black text-gray-500 uppercase tracking-widest text-center">Leads nhận</th>
                  <th className="px-6 py-5 text-[10px] font-black text-gray-500 uppercase tracking-widest text-center">Chốt thành công</th>
                  <th className="px-6 py-5 text-[10px] font-black text-gray-500 uppercase tracking-widest text-center">Tỷ lệ</th>
                  <th className="px-8 py-5 text-[10px] font-black text-gray-500 uppercase tracking-widest text-right">Doanh thu</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {staffStats.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-20 text-center opacity-30">
                      <Trophy className="h-12 w-12 mx-auto mb-3" />
                      <p className="text-sm font-black uppercase tracking-widest">Chưa có dữ liệu phân công</p>
                      <p className="text-xs mt-2">Hãy phân công leads cho nhân viên trong trang chi tiết Lead</p>
                    </td>
                  </tr>
                ) : (
                  staffStats.map((s, idx) => (
                    <tr key={s.staffId} className={cn("group hover:bg-white/[0.03] transition-all", idx === 0 && "bg-emerald-500/5")}>
                      <td className="px-8 py-5 relative">
                        {idx === 0 && <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500 rounded-r-sm" />}
                        <div className="flex items-center gap-4">
                          <div className="h-11 w-11 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center font-black text-emerald-500">
                            {s.staffName?.charAt(0)}
                          </div>
                          <div>
                            <p className="text-sm font-black text-white">{s.staffName}</p>
                            {idx === 0 && <span className="text-[9px] font-black text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded uppercase tracking-widest">🏆 Top performer</span>}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-center">
                        <span className="text-lg font-black text-white">{s.totalLeads}</span>
                      </td>
                      <td className="px-6 py-5 text-center">
                        <span className="text-lg font-black text-teal-400">{s.wonLeads}</span>
                      </td>
                      <td className="px-6 py-5 text-center">
                        <div className="flex flex-col items-center gap-1.5">
                          <span className={cn(
                            "text-sm font-black",
                            s.conversionRate >= 70 ? "text-emerald-400" :
                            s.conversionRate >= 40 ? "text-amber-400" : "text-red-400"
                          )}>{s.conversionRate}%</span>
                          <div className="w-20 h-1.5 bg-slate-900 rounded-full overflow-hidden">
                            <div
                              className={cn("h-full rounded-full", s.conversionRate >= 70 ? "bg-emerald-500" : s.conversionRate >= 40 ? "bg-amber-500" : "bg-red-500")}
                              style={{ width: `${s.conversionRate}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-5 text-right">
                        <span className="text-sm font-black text-white">{s.totalRevenue.toLocaleString('vi-VN')}đ</span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
