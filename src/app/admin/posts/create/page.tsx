'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, Save, Eye, Image as ImageIcon, 
  Settings, Sparkles, Loader2, CheckCircle2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import api from '@/lib/axios';
import Link from 'next/link';

export default function CreatePostPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  
  const [formData, setFormData] = useState({
    title: '',
    summary: '',
    content: '',
    thumbnail: '',
    categoryId: '',
    status: 'PUBLISHED',
    seoTitle: '',
    seoDescription: ''
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get('/cms/posts/categories');
        setCategories(response.data);
        if (response.data.length > 0) {
          setFormData(prev => ({ ...prev, categoryId: response.data[0].id }));
        }
      } catch (error) {
        console.error('Lỗi khi tải danh mục:', error);
      }
    };
    fetchCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.post('/cms/posts', formData);
      router.push('/admin/posts');
    } catch (error) {
      console.error('Lỗi khi tạo bài viết:', error);
      alert('Đã có lỗi xảy ra khi lưu bài viết.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 p-8">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link href="/admin/posts" className="h-10 w-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-emerald-600 hover:border-emerald-200 transition-all">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-2xl font-black text-slate-900">Viết bài mới</h1>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" className="h-11 rounded-xl font-bold text-xs gap-2">
            <Eye className="h-4 w-4" /> Xem thử
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="h-11 rounded-xl bg-slate-900 text-white px-8 font-bold text-xs shadow-xl shadow-slate-200 border-none gap-2"
          >
            {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Xuất bản ngay
          </Button>
        </div>
      </div>

      <form className="grid grid-cols-1 lg:grid-cols-3 gap-8" onSubmit={handleSubmit}>
        {/* MAIN CONTENT */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-10 space-y-8">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Tiêu đề bài viết</label>
              <input 
                required
                type="text" 
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                placeholder="Nhập tiêu đề hấp dẫn..." 
                className="w-full text-3xl font-black text-slate-900 placeholder:text-slate-200 border-none focus:ring-0 p-0 outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Tóm tắt ngắn</label>
              <textarea 
                rows={2}
                value={formData.summary}
                onChange={(e) => setFormData({...formData, summary: e.target.value})}
                placeholder="Một vài câu mô tả ngắn cho bài viết..." 
                className="w-full text-base font-medium text-slate-500 placeholder:text-slate-200 border-none focus:ring-0 p-0 outline-none resize-none"
              />
            </div>

            <div className="border-t border-slate-50 pt-8 space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Nội dung chính</label>
              <textarea 
                required
                rows={15}
                value={formData.content}
                onChange={(e) => setFormData({...formData, content: e.target.value})}
                placeholder="Bắt đầu viết nội dung của bạn tại đây..." 
                className="w-full text-base font-medium text-slate-700 placeholder:text-slate-200 border-none focus:ring-0 p-0 outline-none resize-none leading-relaxed"
              />
            </div>
          </div>

          {/* SEO SETTINGS */}
          <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-10">
             <div className="flex items-center gap-3 mb-8">
                <Sparkles className="h-5 w-5 text-emerald-500" />
                <h2 className="text-lg font-black text-slate-900">Tối ưu SEO</h2>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">SEO Title</label>
                  <input 
                    type="text" 
                    value={formData.seoTitle}
                    onChange={(e) => setFormData({...formData, seoTitle: e.target.value})}
                    placeholder="Tiêu đề hiển thị trên Google..." 
                    className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500/20 outline-none font-bold"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">SEO Description</label>
                  <input 
                    type="text" 
                    value={formData.seoDescription}
                    onChange={(e) => setFormData({...formData, seoDescription: e.target.value})}
                    placeholder="Mô tả ngắn hiển thị trên Google..." 
                    className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500/20 outline-none font-bold"
                  />
                </div>
             </div>
          </div>
        </div>

        {/* SIDEBAR SETTINGS */}
        <div className="space-y-8">
          <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-8 space-y-8">
            <div className="space-y-4">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1 flex items-center gap-2">
                <ImageIcon className="h-3 w-3" /> Ảnh đại diện (Thumbnail)
              </label>
              <div className="aspect-video rounded-2xl bg-slate-50 border-2 border-dashed border-slate-100 flex flex-col items-center justify-center text-slate-300 hover:border-emerald-200 hover:bg-emerald-50 transition-all cursor-pointer overflow-hidden">
                {formData.thumbnail ? (
                  <img src={formData.thumbnail} alt="" className="h-full w-full object-cover" />
                ) : (
                  <div className="text-center p-6">
                    <PlusCircle className="h-8 w-8 mx-auto mb-2 opacity-20" />
                    <p className="text-[10px] font-black uppercase tracking-widest">Tải ảnh lên</p>
                  </div>
                )}
              </div>
              <input 
                type="text" 
                value={formData.thumbnail}
                onChange={(e) => setFormData({...formData, thumbnail: e.target.value})}
                placeholder="Hoặc dán URL ảnh tại đây..." 
                className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-xs focus:ring-2 focus:ring-emerald-500/20 outline-none font-bold text-slate-500"
              />
            </div>

            <div className="space-y-4 border-t border-slate-50 pt-8">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1 flex items-center gap-2">
                <Settings className="h-3 w-3" /> Phân loại & Trạng thái
              </label>
              <div className="space-y-4">
                <div className="space-y-2">
                  <p className="text-[10px] font-bold text-slate-400 uppercase px-1">Danh mục</p>
                  <select 
                    value={formData.categoryId}
                    onChange={(e) => setFormData({...formData, categoryId: e.target.value})}
                    className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500/20 outline-none font-bold text-slate-700 appearance-none"
                  >
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <p className="text-[10px] font-bold text-slate-400 uppercase px-1">Trạng thái</p>
                  <select 
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                    className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500/20 outline-none font-bold text-slate-700 appearance-none"
                  >
                    <option value="PUBLISHED">Công khai</option>
                    <option value="DRAFT">Lưu nháp</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="p-8 rounded-[2rem] bg-slate-900 text-white shadow-2xl shadow-slate-200">
             <div className="flex items-center gap-2 text-emerald-400 mb-4">
                <CheckCircle2 className="h-5 w-5" />
                <span className="text-xs font-black uppercase tracking-widest">Sẵn sàng xuất bản</span>
             </div>
             <p className="text-xs text-slate-400 leading-relaxed font-medium">
               Hãy đảm bảo bạn đã kiểm tra kỹ nội dung và các thẻ SEO để bài viết đạt hiệu quả cao nhất trên các công cụ tìm kiếm.
             </p>
          </div>
        </div>
      </form>
    </div>
  );
}

// Bổ sung icon bị thiếu
function PlusCircle(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M8 12h8" />
      <path d="M12 8v8" />
    </svg>
  );
}
