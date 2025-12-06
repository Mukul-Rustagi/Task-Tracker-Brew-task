/**
 * Zod Validation Schemas
 * Centralized validation logic for the application
 */

import { z } from 'zod';
import { VALIDATION, TASK_STATUS, TASK_PRIORITY, ERROR_MESSAGES } from './constants';

// Auth Schemas
export const signupSchema = z.object({
  name: z
    .string()
    .min(VALIDATION.NAME_MIN_LENGTH, ERROR_MESSAGES.VALIDATION.NAME_TOO_SHORT)
    .trim(),
  email: z
    .string()
    .email(ERROR_MESSAGES.VALIDATION.INVALID_EMAIL)
    .toLowerCase()
    .trim(),
  password: z
    .string()
    .min(VALIDATION.PASSWORD_MIN_LENGTH, ERROR_MESSAGES.VALIDATION.PASSWORD_TOO_SHORT),
});

export const signinSchema = z.object({
  email: z
    .string()
    .email(ERROR_MESSAGES.VALIDATION.INVALID_EMAIL)
    .toLowerCase()
    .trim(),
  password: z.string().min(1, ERROR_MESSAGES.VALIDATION.REQUIRED_FIELD),
});

// Task Schemas
export const createTaskSchema = z.object({
  title: z
    .string()
    .min(VALIDATION.TASK_TITLE_MIN_LENGTH, ERROR_MESSAGES.VALIDATION.REQUIRED_FIELD)
    .max(VALIDATION.TASK_TITLE_MAX_LENGTH, `Title must be less than ${VALIDATION.TASK_TITLE_MAX_LENGTH} characters`)
    .trim(),
  description: z
    .string()
    .max(VALIDATION.TASK_DESCRIPTION_MAX_LENGTH, `Description must be less than ${VALIDATION.TASK_DESCRIPTION_MAX_LENGTH} characters`)
    .optional(),
  status: z
    .enum(['todo', 'in-progress', 'done'])
    .default('todo'),
  priority: z
    .enum(['low', 'medium', 'high'])
    .default('medium'),
  dueDate: z
    .union([z.string(), z.null(), z.undefined()])
    .optional()
    .transform((val) => {
      if (!val || val === '') return undefined;
      return val;
    }),
});

export const updateTaskSchema = createTaskSchema.partial();

// User Update Schema
export const updateUserSchema = z.object({
  name: z
    .string()
    .min(VALIDATION.NAME_MIN_LENGTH, ERROR_MESSAGES.VALIDATION.NAME_TOO_SHORT)
    .trim()
    .optional(),
  image: z.string().url().optional().or(z.literal('')),
});

// Types
export type SignupInput = z.infer<typeof signupSchema>;
export type SigninInput = z.infer<typeof signinSchema>;
export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;

