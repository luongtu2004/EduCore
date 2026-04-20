import { z } from 'zod';

export const postSchema = z.object({
  title: z.string().min(10, 'Tiêu đề phải có ít nhất 10 ký tự').max(100, 'Tiêu đề không được quá 100 ký tự'),
  slug: z.string().min(1, 'Slug không được để trống').regex(/^[a-z0-9-]+$/, 'Slug chỉ được chứa chữ thường, số và dấu gạch ngang'),
  excerpt: z.string().min(20, 'Mô tả ngắn phải có ít nhất 20 ký tự').max(200, 'Mô tả ngắn không được quá 200 ký tự'),
  content: z.string().min(50, 'Nội dung bài viết quá ngắn'),
  categoryId: z.string().min(1, 'Vui lòng chọn danh mục'),
  status: z.enum(['DRAFT', 'PUBLISHED']).default('DRAFT'),
  seoTitle: z.string().max(70, 'SEO Title nên dưới 70 ký tự').optional(),
  seoDescription: z.string().max(160, 'SEO Description nên dưới 160 ký tự').optional(),
});

export type PostFormData = z.infer<typeof postSchema>;
