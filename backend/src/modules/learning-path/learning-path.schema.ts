import { z } from 'zod';

export const createLearningPathStepSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  target: z.string().min(1),
  features: z.array(z.string()),
  color: z.string().default('emerald'),
  order: z.number().default(0),
});

export const createLearningPathSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().optional(),
  steps: z.array(createLearningPathStepSchema).optional(),
});
