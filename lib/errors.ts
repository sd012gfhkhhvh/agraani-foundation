/**
 * Standardized error handling utilities
 */

// Custom error classes
export class AppError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public code?: string
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export class ValidationError extends AppError {
  constructor(message: string, public fields?: Record<string, string>) {
    super(message, 400, 'VALIDATION_ERROR');
    this.name = 'ValidationError';
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = 'You must be logged in to perform this action') {
    super(message, 401, 'UNAUTHORIZED');
    this.name = 'UnauthorizedError';
  }
}

export class ForbiddenError extends AppError {
  constructor(
    message: string = 'You do not have permission to perform this action',
    public metadata?: Record<string, any>
  ) {
    super(message, 403, 'FORBIDDEN');
    this.name = 'ForbiddenError';
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string = 'Resource') {
    super(`${resource} not found`, 404, 'NOT_FOUND');
    this.name = 'NotFoundError';
  }
}

export class ConflictError extends AppError {
  constructor(message: string) {
    super(message, 409, 'CONFLICT');
    this.name = 'ConflictError';
  }
}

/**
 * Format error for API response
 */
export function formatApiError(error: unknown): {
  message: string;
  statusCode: number;
  code?: string;
  fields?: Record<string, string>;
} {
  // Handle known AppError instances
  if (error instanceof AppError) {
    return {
      message: error.message,
      statusCode: error.statusCode,
      code: error.code,
      fields: error instanceof ValidationError ? error.fields : undefined,
    };
  }

  // Handle Prisma errors
  if (error && typeof error === 'object' && 'code' in error) {
    const prismaError = error as any;
    
    // Unique constraint violation
    if (prismaError.code === 'P2002') {
      const field = prismaError.meta?.target?.[0] || 'field';
      return {
        message: `A record with this ${field} already exists`,
        statusCode: 409,
        code: 'DUPLICATE_ENTRY',
      };
    }
    
    // Record not found
    if (prismaError.code === 'P2025') {
      return {
        message: 'Record not found',
        statusCode: 404,
        code: 'NOT_FOUND',
      };
    }
    
    // Foreign key constraint
    if (prismaError.code === 'P2003') {
      return {
        message: 'Related record not found',
        statusCode: 400,
        code: 'INVALID_REFERENCE',
      };
    }
  }

  // Handle generic errors
  if (error instanceof Error) {
    // Check for specific error messages
    if (error.message.includes('Unauthorized')) {
      return {
        message: error.message,
        statusCode: 401,
        code: 'UNAUTHORIZED',
      };
    }
    
    if (error.message.includes('Forbidden') || error.message.includes('permission')) {
      return {
        message: error.message,
        statusCode: 403,
        code: 'FORBIDDEN',
      };
    }

    return {
      message: error.message,
      statusCode: 500,
      code: 'INTERNAL_ERROR',
    };
  }

  // Fallback for unknown errors
  return {
    message: 'An unexpected error occurred',
    statusCode: 500,
    code: 'UNKNOWN_ERROR',
  };
}

/**
 * Get user-friendly error message
 */
export function getUserFriendlyMessage(error: unknown): string {
  const formatted = formatApiError(error);
  
  // Map technical errors to user-friendly messages
  const friendlyMessages: Record<string, string> = {
    VALIDATION_ERROR: 'Please check your input and try again',
    UNAUTHORIZED: 'Please log in to continue',
    FORBIDDEN: 'You don\'t have permission to do that',
    NOT_FOUND: 'The item you\'re looking for doesn\'t exist',
    DUPLICATE_ENTRY: 'This item already exists',
    CONFLICT: 'This action conflicts with existing data',
    INTERNAL_ERROR: 'Something went wrong. Please try again later',
  };

  return friendlyMessages[formatted.code || ''] || formatted.message;
}

/**
 * Log error with context (for server-side logging)
 */
export function logError(error: unknown, context?: Record<string, any>) {
  console.error('[Error]', {
    error: error instanceof Error ? {
      name: error.name,
      message: error.message,
      stack: error.stack,
    } : error,
    context,
    timestamp: new Date().toISOString(),
  });
}
