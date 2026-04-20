import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().min(1, 'Email hoặc Số điện thoại không được để trống'),
  password: z.string().min(6, 'Mật khẩu phải từ 6 ký tự'),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, 'Token không được để trống'),
});

export type RefreshTokenInput = z.infer<typeof refreshTokenSchema>;
