import { z } from 'zod';

export const createBannerSchema = z.object({
  title: z.string().min(1, 'Tiêu đề là bắt buộc'),
  subtitle: z.string().optional(),
  image: z.string().min(1, 'Hình ảnh là bắt buộc'),
  link: z.string().optional(),
  order: z.number().optional(),
  isActive: z.boolean().optional(),
});

export const updateBannerSchema = z.object({
  title: z.string().optional(),
  subtitle: z.string().optional(),
  image: z.string().optional(),
  link: z.string().optional(),
  order: z.number().optional(),
  isActive: z.boolean().optional(),
});

export type CreateBannerInput = z.infer<typeof createBannerSchema>;
export type UpdateBannerInput = z.infer<typeof updateBannerSchema>;
