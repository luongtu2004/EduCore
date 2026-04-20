import { z } from 'zod';

export const createTestimonialSchema = z.object({
  name: z.string().min(1, 'Tên học viên không được để trống'),
  score: z.string().min(1, 'Điểm số không được để trống'),
  text: z.string().min(1, 'Nội dung cảm nghĩ không được để trống'),
  image: z.string().optional(),
  isActive: z.boolean().default(true),
  order: z.number().default(0),
});

export const updateTestimonialSchema = createTestimonialSchema.partial();
