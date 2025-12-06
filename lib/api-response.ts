/**
 * Standardized API Response Utilities
 * Provides consistent response format across all API routes
 */

import { NextResponse } from 'next/server';
import { HTTP_STATUS } from './constants';

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

/**
 * Success Response
 */
export function successResponse<T>(
  data: T,
  message?: string,
  statusCode: number = HTTP_STATUS.OK
): NextResponse<ApiResponse<T>> {
  return NextResponse.json(
    {
      success: true,
      data,
      ...(message && { message }),
    },
    { status: statusCode }
  );
}

/**
 * Error Response
 */
export function errorResponse(
  error: string,
  statusCode: number = HTTP_STATUS.INTERNAL_SERVER_ERROR
): NextResponse<ApiResponse> {
  return NextResponse.json(
    {
      success: false,
      error,
    },
    { status: statusCode }
  );
}

/**
 * Created Response (201)
 */
export function createdResponse<T>(
  data: T,
  message?: string
): NextResponse<ApiResponse<T>> {
  return successResponse(data, message, HTTP_STATUS.CREATED);
}

/**
 * No Content Response (204)
 */
export function noContentResponse(): NextResponse {
  return new NextResponse(null, { status: 204 });
}

/**
 * Bad Request Response (400)
 */
export function badRequestResponse(
  error: string
): NextResponse<ApiResponse> {
  return errorResponse(error, HTTP_STATUS.BAD_REQUEST);
}

/**
 * Unauthorized Response (401)
 */
export function unauthorizedResponse(
  error: string = 'Unauthorized'
): NextResponse<ApiResponse> {
  return errorResponse(error, HTTP_STATUS.UNAUTHORIZED);
}

/**
 * Forbidden Response (403)
 */
export function forbiddenResponse(
  error: string = 'Forbidden'
): NextResponse<ApiResponse> {
  return errorResponse(error, HTTP_STATUS.FORBIDDEN);
}

/**
 * Not Found Response (404)
 */
export function notFoundResponse(
  error: string = 'Resource not found'
): NextResponse<ApiResponse> {
  return errorResponse(error, HTTP_STATUS.NOT_FOUND);
}

/**
 * Conflict Response (409)
 */
export function conflictResponse(
  error: string
): NextResponse<ApiResponse> {
  return errorResponse(error, HTTP_STATUS.CONFLICT);
}

/**
 * Internal Server Error Response (500)
 */
export function internalServerErrorResponse(
  error: string = 'Internal server error'
): NextResponse<ApiResponse> {
  return errorResponse(error, HTTP_STATUS.INTERNAL_SERVER_ERROR);
}

