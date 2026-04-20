import { z } from 'zod';

export const convertLeadToStudentSchema = z.object({
  leadId: z.string().uuid(),
  courseId: z.string().uuid().optional(),
  paidAmount: z.number().optional(),
});

export type ConvertLeadToStudentInput = z.infer<typeof convertLeadToStudentSchema>;

export const enrollStudentSchema = z.object({
  courseId: z.string().uuid(),
  paidAmount: z.number(),
});

export type EnrollStudentInput = z.infer<typeof enrollStudentSchema>;
