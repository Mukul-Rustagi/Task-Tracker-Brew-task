import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Task from '@/models/Task';
import { z } from 'zod';
import { updateTaskSchema } from '@/lib/validations';
import {
  successResponse,
  unauthorizedResponse,
  notFoundResponse,
  errorResponse,
} from '@/lib/api-response';
import { handleError } from '@/lib/errors';
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '@/lib/constants';

// GET single task
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return unauthorizedResponse(ERROR_MESSAGES.AUTH.UNAUTHORIZED);
    }

    await dbConnect();

    const { id } = await params;

    const task = await Task.findOne({
      _id: id,
      userId: session.user.id,
    });

    if (!task) {
      return notFoundResponse(ERROR_MESSAGES.TASK.NOT_FOUND);
    }

    return successResponse({ task });
  } catch (error: unknown) {
    console.error('Get task error:', error);
    const { message, statusCode } = handleError(error);
    return errorResponse(message, statusCode);
  }
}

// PUT update task
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return unauthorizedResponse(ERROR_MESSAGES.AUTH.UNAUTHORIZED);
    }

    const body = await request.json();
    const validatedData = updateTaskSchema.parse(body);

    await dbConnect();

    const { id } = await params;

    const updateData: Record<string, unknown> = { ...validatedData };

    if (validatedData.dueDate !== undefined) {
      updateData.dueDate = validatedData.dueDate
        ? new Date(validatedData.dueDate)
        : null;
    }

    const task = await Task.findOneAndUpdate(
      { _id: id, userId: session.user.id },
      updateData,
      { new: true, runValidators: true }
    );

    if (!task) {
      return notFoundResponse(ERROR_MESSAGES.TASK.NOT_FOUND);
    }

    return successResponse({ task }, SUCCESS_MESSAGES.TASK.UPDATED);
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return errorResponse(error.issues[0].message, 400);
    }

    console.error('Update task error:', error);
    const { message, statusCode } = handleError(error);
    return errorResponse(message, statusCode);
  }
}

// DELETE task
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return unauthorizedResponse(ERROR_MESSAGES.AUTH.UNAUTHORIZED);
    }

    await dbConnect();

    const { id } = await params;

    const task = await Task.findOneAndDelete({
      _id: id,
      userId: session.user.id,
    });

    if (!task) {
      return notFoundResponse(ERROR_MESSAGES.TASK.NOT_FOUND);
    }

    return successResponse(
      { message: SUCCESS_MESSAGES.TASK.DELETED },
      SUCCESS_MESSAGES.TASK.DELETED
    );
  } catch (error: unknown) {
    console.error('Delete task error:', error);
    const { message, statusCode } = handleError(error);
    return errorResponse(message, statusCode);
  }
}
