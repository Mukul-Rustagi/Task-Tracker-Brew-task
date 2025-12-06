/**
 * Custom Error Classes and Error Handling Utilities
 */

import { HTTP_STATUS, ERROR_MESSAGES } from './constants';

// Base Application Error
export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number = HTTP_STATUS.INTERNAL_SERVER_ERROR,
    public isOperational: boolean = true
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

// Authentication Errors
export class AuthenticationError extends AppError {
  constructor(message: string = ERROR_MESSAGES.AUTH.UNAUTHORIZED) {
    super(message, HTTP_STATUS.UNAUTHORIZED);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = ERROR_MESSAGES.AUTH.UNAUTHORIZED) {
    super(message, HTTP_STATUS.FORBIDDEN);
  }
}

// Validation Errors
export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, HTTP_STATUS.BAD_REQUEST);
  }
}

// Resource Errors
export class NotFoundError extends AppError {
  constructor(message: string) {
    super(message, HTTP_STATUS.NOT_FOUND);
  }
}

export class ConflictError extends AppError {
  constructor(message: string) {
    super(message, HTTP_STATUS.CONFLICT);
  }
}

// Database Errors
export class DatabaseError extends AppError {
  constructor(message: string = ERROR_MESSAGES.SERVER.DATABASE_ERROR) {
    super(message, HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
}

/**
 * Error Handler for API Routes
 */
export function handleError(error: unknown): {
  message: string;
  statusCode: number;
} {
  // Log error for debugging
  console.error('Error occurred:', error);

  // Handle known AppError instances
  if (error instanceof AppError) {
    return {
      message: error.message,
      statusCode: error.statusCode,
    };
  }

  // Handle Mongoose/MongoDB errors
  if (error && typeof error === 'object' && 'name' in error) {
    const mongoError = error as { name: string; code?: number; message?: string };
    
    // Duplicate key error
    if (mongoError.name === 'MongoError' && mongoError.code === 11000) {
      return {
        message: ERROR_MESSAGES.AUTH.USER_EXISTS,
        statusCode: HTTP_STATUS.CONFLICT,
      };
    }

    // Validation error
    if (mongoError.name === 'ValidationError') {
      return {
        message: mongoError.message || ERROR_MESSAGES.SERVER.INTERNAL_ERROR,
        statusCode: HTTP_STATUS.BAD_REQUEST,
      };
    }

    // Cast error (invalid ObjectId)
    if (mongoError.name === 'CastError') {
      return {
        message: 'Invalid ID format',
        statusCode: HTTP_STATUS.BAD_REQUEST,
      };
    }
  }

  // Handle standard Error instances
  if (error instanceof Error) {
    return {
      message: error.message || ERROR_MESSAGES.SERVER.INTERNAL_ERROR,
      statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
    };
  }

  // Default error response
  return {
    message: ERROR_MESSAGES.SERVER.INTERNAL_ERROR,
    statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
  };
}

/**
 * Async handler wrapper for API routes
 * Catches errors and passes them to error handler
 */
export function asyncHandler<T>(
  handler: (...args: unknown[]) => Promise<T>
) {
  return async (...args: unknown[]): Promise<T> => {
    try {
      return await handler(...args);
    } catch (error) {
      throw error; // Re-throw to be caught by route handler
    }
  };
}

