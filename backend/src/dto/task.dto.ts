import { z } from 'zod';
import { TaskPriority, TaskStatus } from '../models/Task';

export const createTaskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title cannot exceed 100 characters'),
  description: z.string().min(1, 'Description is required'),
  dueDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: 'Invalid date format'
  }),
  priority: z.nativeEnum(TaskPriority),
  assignedToId: z.string().optional()
});

export const updateTaskSchema = z.object({
  title: z.string().min(1).max(100).optional(),
  description: z.string().min(1).optional(),
  dueDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: 'Invalid date format'
  }).optional(),
  priority: z.nativeEnum(TaskPriority).optional(),
  status: z.nativeEnum(TaskStatus).optional(),
  assignedToId: z.string().nullable().optional()
});

export type CreateTaskDto = z.infer<typeof createTaskSchema>;
export type UpdateTaskDto = z.infer<typeof updateTaskSchema>;
