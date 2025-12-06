import { NextRequest } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import { z } from "zod";
import { signupSchema } from "@/lib/validations";
import {
  createdResponse,
  errorResponse,
  conflictResponse,
} from "@/lib/api-response";
import { handleError } from "@/lib/errors";
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "@/lib/constants";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validatedData = signupSchema.parse(body);

    await dbConnect();

    // Check if user already exists
    const existingUser = await User.findOne({
      email: validatedData.email,
    });

    if (existingUser) {
      return conflictResponse(ERROR_MESSAGES.AUTH.USER_EXISTS);
    }

    // Create new user (password will be hashed by pre-save hook)
    const user = await User.create({
      name: validatedData.name,
      email: validatedData.email,
      password: validatedData.password,
      provider: "credentials",
    });

    // Return success response without password
    return createdResponse(
      {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
      },
      SUCCESS_MESSAGES.AUTH.SIGNUP_SUCCESS
    );
  } catch (error: unknown) {
    // Handle Zod validation errors
    if (error instanceof z.ZodError) {
      return errorResponse(error.issues[0].message, 400);
    }

    // Handle other errors
    console.error("Signup error:", error);
    const { message, statusCode } = handleError(error);
    return errorResponse(message, statusCode);
  }
}
