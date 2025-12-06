/**
 * Application Constants
 * Centralized configuration values for the application
 */

// API Routes
export const API_ROUTES = {
  AUTH: {
    SIGNIN: '/api/auth/signin',
    SIGNUP: '/api/auth/signup',
    SIGNOUT: '/api/auth/signout',
    SESSION: '/api/auth/session',
  },
  TASKS: {
    BASE: '/api/tasks',
    BY_ID: (id: string) => `/api/tasks/${id}`,
  },
  USER: {
    UPDATE: '/api/user/update',
  },
} as const;

// Page Routes
export const PAGE_ROUTES = {
  HOME: '/',
  SIGNIN: '/auth/signin',
  SIGNUP: '/auth/signup',
  DASHBOARD: '/dashboard',
  PROFILE: '/profile',
} as const;

// Task Status Options
export const TASK_STATUS = {
  TODO: 'todo',
  IN_PROGRESS: 'in-progress',
  COMPLETED: 'done', // Changed to match database model
} as const;

export type TaskStatus = typeof TASK_STATUS[keyof typeof TASK_STATUS];

// Task Priority Options
export const TASK_PRIORITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
} as const;

export type TaskPriority = typeof TASK_PRIORITY[keyof typeof TASK_PRIORITY];

// Validation Constants
export const VALIDATION = {
  NAME_MIN_LENGTH: 2,
  PASSWORD_MIN_LENGTH: 6,
  TASK_TITLE_MIN_LENGTH: 1,
  TASK_TITLE_MAX_LENGTH: 200,
  TASK_DESCRIPTION_MAX_LENGTH: 1000,
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  AUTH: {
    INVALID_CREDENTIALS: 'Invalid email or password',
    USER_EXISTS: 'User with this email already exists',
    USER_NOT_FOUND: 'User not found',
    UNAUTHORIZED: 'Unauthorized access',
    SESSION_EXPIRED: 'Your session has expired. Please sign in again.',
    GOOGLE_SIGNIN_REQUIRED: 'Please sign in with Google',
  },
  VALIDATION: {
    REQUIRED_FIELD: 'This field is required',
    INVALID_EMAIL: 'Invalid email address',
    PASSWORD_TOO_SHORT: `Password must be at least ${VALIDATION.PASSWORD_MIN_LENGTH} characters`,
    NAME_TOO_SHORT: `Name must be at least ${VALIDATION.NAME_MIN_LENGTH} characters`,
  },
  TASK: {
    NOT_FOUND: 'Task not found',
    CREATE_FAILED: 'Failed to create task',
    UPDATE_FAILED: 'Failed to update task',
    DELETE_FAILED: 'Failed to delete task',
  },
  SERVER: {
    INTERNAL_ERROR: 'Something went wrong. Please try again.',
    DATABASE_ERROR: 'Database connection error',
    NETWORK_ERROR: 'Network error. Please check your connection.',
  },
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  AUTH: {
    SIGNUP_SUCCESS: 'Account created successfully',
    SIGNIN_SUCCESS: 'Signed in successfully',
    SIGNOUT_SUCCESS: 'Signed out successfully',
  },
  TASK: {
    CREATED: 'Task created successfully',
    UPDATED: 'Task updated successfully',
    DELETED: 'Task deleted successfully',
  },
  USER: {
    UPDATED: 'Profile updated successfully',
  },
} as const;

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
} as const;

// Environment Variables (with fallbacks)
export const ENV = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  MONGODB_URI: process.env.MONGODB_URI || '',
  NEXTAUTH_URL: process.env.NEXTAUTH_URL || 'http://localhost:3000',
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET || '',
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || '',
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET || '',
} as const;

// Feature Flags
export const FEATURES = {
  GOOGLE_AUTH_ENABLED: !!(ENV.GOOGLE_CLIENT_ID && ENV.GOOGLE_CLIENT_SECRET),
  DEBUG_MODE: process.env.DEBUG === 'true',
} as const;

