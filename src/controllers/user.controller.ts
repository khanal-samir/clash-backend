import { ApiResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import bcrypt from "bcrypt";
import prisma from "../configs/db.js";
import { registerSchema } from "../validations/userValidations.js";
import { formatError, renderEmail } from "../helper.js";
import { v4 as uuid } from "uuid";
import { emailQueue, emailQueueName } from "../jobs/emailJob.js";
export const registerUser = asyncHandler(async (req, res) => {
  const body = req.body;
  const payload = registerSchema.safeParse(body); // can also use parse with try catch
  if (!payload.success && payload.error) {
    const errors = formatError(payload.error);
    return res.status(422).json(new ApiResponse(422, errors, "Invalid Data"));
  }

  const user = await prisma.user.findUnique({
    where: {
      email: payload.data.email,
    },
  });
  if (user) throw new ApiError(422, "Email already Taken.");

  payload.data.password = await bcrypt.hash(payload.data.password, 10);
  const emailVerifyToken = await bcrypt.hash(uuid(), 10);
  const url = `${process.env.APP_URL}/verify-email?email=${payload.data.email}&token=${emailVerifyToken}`;
  const html = await renderEmail("email-verify", {
    name: payload.data.name,
    url,
  });
  await emailQueue.add(emailQueueName, {
    to: payload.data.email,
    subject: "Clash | Email Verification",
    html,
  });

  const newUser = await prisma.user.create({
    data: {
      name: payload.data.name,
      email: payload.data.email,
      password: payload.data.password,
      email_verify_token: emailVerifyToken,
    },
  });

  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        {},
        "User created successfully.Please verify your email."
      )
    );
});
