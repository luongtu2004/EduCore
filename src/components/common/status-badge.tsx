'use client';

import { cn } from '@/lib/utils';

type StatusType = 'NEW' | 'IN_PROGRESS' | 'CONVERTED' | 'LOST' | string;

export function StatusBadge({ status }: { status: StatusType }) {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'NEW':
        return { label: 'Mới', className: 'bg-blue-50 text-blue-700 border-blue-100' };
      case 'IN_PROGRESS':
        return { label: 'Đang tư vấn', className: 'bg-amber-50 text-amber-700 border-amber-100' };
      case 'CONVERTED':
        return { label: 'Đã chuyển đổi', className: 'bg-emerald-50 text-emerald-700 border-emerald-100' };
      case 'LOST':
        return { label: 'Tạm dừng', className: 'bg-slate-50 text-slate-700 border-slate-100' };
      default:
        return { label: status, className: 'bg-slate-50 text-slate-600 border-slate-100' };
    }
  };

  const config = getStatusConfig(status);

  return (
    <span className={cn(
      "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-bold transition-colors",
      config.className
    )}>
      {config.label}
    </span>
  );
}
