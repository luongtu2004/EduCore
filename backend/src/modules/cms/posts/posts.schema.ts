import { z } from 'zod';

// Định nghĩa trạng thái bài viết dưới dạng mảng để validate
export const PostStatusList = ['DRAFT', 'PUBLISHED', 'ARCHIVED'] as const;

export const createPostSchema = z.object({
  title: z.string().min(1, 'Tiêu đề không được để trống'),
  slug: z.string().min(1, 'Slug không được để trống'),
  summary: z.string().optional(),
  content: z.string().min(1, 'Nội dung không được để trống'),
  thumbnail: z.string().optional(),
  categoryId: z.string().min(1, 'Danh mục không hợp lệ'), // MongoDB dùng string cho ID
  status: z.enum(PostStatusList).optional(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
});

export type CreatePostInput = z.infer<typeof createPostSchema>;

export const createCategorySchema = z.object({
  name: z.string().min(1, 'Tên danh mục không được để trống'),
});

export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
