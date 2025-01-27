import { ApiResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import prisma from "../configs/db.js";
import { registerSchema } from "../validations/userValidations.js";
import { formatError } from "../helpers/zodErrorHandler.js";
import { ZodError } from "zod";

export const registerUser = asyncHandler(async (req, res) => {
  const body = req.body;

  const payload = registerSchema.safeParse(body); // can also use parse with try catch
  if (!payload.success && payload.error instanceof ZodError) {
    const errors = formatError(payload.error);
    return res.status(422).json(new ApiResponse(422, errors, "Invalid Data"));
  }
  return res.json(new ApiResponse(200, payload, "validation"));
});
