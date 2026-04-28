import { z } from 'zod';

export const createLearningPathStepSchema = z.object({
  title: z.string().min(1, 'Tiêu đề giai đoạn không được để trống'),
  description: z.string().min(1, 'Mô tả giai đoạn không được để trống'),
  target: z.string().min(1, 'Mục tiêu không được để trống'),
  features: z.array(z.string()).default([]),
  color: z.string().default('emerald'),
  order: z.number().default(0),
});

export const createLearningPathSchema = z.object({
  title: z.string().min(1, 'Tiêu đề không được để trống'),
  slug: z.string().min(1, 'Slug không được để trống'),
  description: z.string().optional().nullable(),
  isActive: z.boolean().optional(),
  steps: z.array(createLearningPathStepSchema).optional().nullable(),
});

export const updateLearningPathSchema = z.object({
  title: z.string().optional(),
  slug: z.string().optional(),
  description: z.string().optional().nullable(),
  isActive: z.boolean().optional(),
  steps: z.array(createLearningPathStepSchema).optional().nullable(),
});

export const updateLearningPathStatusSchema = z.object({
  isActive: z.boolean(),
});
