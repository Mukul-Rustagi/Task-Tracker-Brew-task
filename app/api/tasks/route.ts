import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Task from '@/models/Task';
import { z } from 'zod';
import { createTaskSchema } from '@/lib/validations';
import {
  successResponse,
  createdResponse,
  unauthorizedResponse,
  errorResponse,
} from '@/lib/api-response';
import { handleError } from '@/lib/errors';
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '@/lib/constants';

// GET all tasks for the authenticated user
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return unauthorizedResponse(ERROR_MESSAGES.AUTH.UNAUTHORIZED);
    }

    await dbConnect();

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    const query: Record<string, unknown> = { userId: session.user.id };

    if (status && status !== 'all') {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const tasks = await Task.find(query).sort({ createdAt: -1 });

    return successResponse({ tasks });
  } catch (error: unknown) {
    console.error('Get tasks error:', error);
    const { message, statusCode } = handleError(error);
    return errorResponse(message, statusCode);
  }
}

// POST create a new task
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return unauthorizedResponse(ERROR_MESSAGES.AUTH.UNAUTHORIZED);
    }

    const body = await request.json();
    const validatedData = createTaskSchema.parse(body);

    await dbConnect();

    const task = await Task.create({
      ...validatedData,
      userId: session.user.id,
      dueDate: validatedData.dueDate ? new Date(validatedData.dueDate) : undefined,
    });

    return createdResponse({ task }, SUCCESS_MESSAGES.TASK.CREATED);
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return errorResponse(error.issues[0].message, 400);
    }

    console.error('Create task error:', error);
    const { message, statusCode } = handleError(error);
    return errorResponse(message, statusCode);
  }
}


