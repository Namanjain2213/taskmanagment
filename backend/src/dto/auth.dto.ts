import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().min(1, 'Name is required').max(50, 'Name cannot exceed 50 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters')
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required')
});

export const updateProfileSchema = z.object({
  name: z.string().min(1, 'Name is required').max(50, 'Name cannot exceed 50 characters')
});

export type RegisterDto = z.infer<typeof registerSchema>;
export type LoginDto = z.infer<typeof loginSchema>;
export type UpdateProfileDto = z.infer<typeof updateProfileSchema>;
