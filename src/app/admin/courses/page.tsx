'use client';

import { BookOpen, Plus, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function CoursesPage() {
  return (
    <div className="min-h-screen bg-slate-50/50 p-8">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Quản lý khóa học</h1>
          <p className="text-sm text-slate-500 font-medium mt-1">Quản trị danh sách các khóa học đào tạo của EduCore.</p>
        </div>
        <Button className="h-12 rounded-2xl bg-slate-900 text-white px-6 font-bold shadow-xl shadow-slate-200 gap-2">
          <Plus className="h-5 w-5" /> Thêm khóa học
        </Button>
      </div>
      
      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-20 flex flex-col items-center justify-center text-center">
         <div className="h-20 w-20 rounded-3xl bg-slate-50 flex items-center justify-center text-slate-300 mb-6">
            <BookOpen className="h-10 w-10" />
         </div>
         <h2 className="text-xl font-black text-slate-900">Tính năng đang phát triển</h2>
         <p className="text-sm text-slate-400 mt-2 max-w-sm">
           Hệ thống quản trị khóa học đang được tối ưu hóa để mang lại trải nghiệm tốt nhất.
         </p>
      </div>
    </div>
  );
}
