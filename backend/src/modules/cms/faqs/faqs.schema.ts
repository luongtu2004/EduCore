import { z } from 'zod';

export const createFAQSchema = z.object({
  question: z.string().min(1, 'Câu hỏi là bắt buộc'),
  answer: z.string().min(1, 'Câu trả lời là bắt buộc'),
  order: z.number().optional(),
  isActive: z.boolean().optional(),
});

export const updateFAQSchema = z.object({
  question: z.string().optional(),
  answer: z.string().optional(),
  order: z.number().optional(),
  isActive: z.boolean().optional(),
});

export type CreateFAQInput = z.infer<typeof createFAQSchema>;
export type UpdateFAQInput = z.infer<typeof updateFAQSchema>;
