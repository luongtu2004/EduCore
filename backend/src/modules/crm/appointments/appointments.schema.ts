import { z } from 'zod';

export const AppointmentStatusList = ['SCHEDULED', 'COMPLETED', 'CANCELLED', 'NO_SHOW'] as const;
export const AppointmentTypeList = ['CONSULTATION', 'TRIAL_LEARNING', 'FEEDBACK', 'OTHER'] as const;

export const createAppointmentSchema = z.object({
  leadId: z.string().optional().nullable(),
  studentId: z.string().optional().nullable(),
  title: z.string().min(1, 'Tiêu đề không được để trống'),
  startTime: z.string().or(z.date()),
  endTime: z.string().or(z.date()),
  type: z.enum(AppointmentTypeList).default('CONSULTATION'),
  status: z.enum(AppointmentStatusList).default('SCHEDULED'),
  note: z.string().optional().nullable(),
  assignedTo: z.string().optional().nullable(),
});

export const updateAppointmentSchema = createAppointmentSchema.partial();

export type CreateAppointmentInput = z.infer<typeof createAppointmentSchema>;
export type UpdateAppointmentInput = z.infer<typeof updateAppointmentSchema>;
