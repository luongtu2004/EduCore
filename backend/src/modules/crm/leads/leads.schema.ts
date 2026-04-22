import { z } from 'zod';

export const LeadStatusList = ['NEW', 'CONTACTED', 'CONSULTING', 'TRIAL_LEARNING', 'WON', 'LOST'] as const;
export const LeadSourceList = ['WEBSITE', 'FACEBOOK', 'ZALO', 'REFERRAL', 'OFFLINE', 'AI_TEST'] as const;

export const createLeadSchema = z.object({
  fullName: z.string().min(1, 'Họ tên không được để trống'),
  email: z.string().email('Email không hợp lệ').optional().or(z.literal('')),
  phone: z.string().min(10, 'Số điện thoại không hợp lệ'),
  source: z.enum(LeadSourceList).optional(),
  note: z.string().optional(),
  courseName: z.string().optional(),
  paymentMethod: z.string().optional(),
  couponCode: z.string().optional(),
  finalPrice: z.number().optional(),
});

export type CreateLeadInput = z.infer<typeof createLeadSchema>;

export const updateLeadStatusSchema = z.object({
  status: z.enum(LeadStatusList),
  note: z.string().optional(),
});

export type UpdateLeadStatusInput = z.infer<typeof updateLeadStatusSchema>;

export const assignLeadSchema = z.object({
  assignedTo: z.string().min(1, 'ID nhân sự không hợp lệ'),
  assignedStaffName: z.string().optional(),
});

export type AssignLeadInput = z.infer<typeof assignLeadSchema>;
