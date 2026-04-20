import { z } from 'zod';

export const createCategorySchema = z.object({
  name: z.string().min(1, 'Tên danh mục là bắt buộc'),
  slug: z.string().min(1, 'Slug là bắt buộc'),
});

export const updateCategorySchema = z.object({
  name: z.string().optional(),
  slug: z.string().optional(),
});

export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;
