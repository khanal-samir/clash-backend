import { ApiResponse } from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import bcrypt from "bcrypt";
import prisma from "../configs/db.js";
import {
  loginSchema,
  registerSchema,
  verifyEmailSchema,
} from "../validations/userValidations.js";
import { formatError, renderEmail } from "../helper.js";
import jwt from "jsonwebtoken";
import { emailQueue, emailQueueName } from "../jobs/emailJob.js";

export const registerUser = asyncHandler(async (req, res) => {
  const body = req.body;
  const payload = registerSchema.safeParse(body); // can also use parse with try catch

  if (!payload.success && payload.error) {
    const errors = formatError(payload.error);
    return res
      .status(422)
      .json(
        new ApiResponse(
          422,
          errors,
          "Invalid Data. Please check your data properly."
        )
      );
  }

  const user = await prisma.user.findUnique({
    where: {
      email: payload.data.email,
    },
  });
  if (user && user.is_verified)
    return res
      .status(400)
      .json(
        new ApiResponse(
          400,
          null,
          "Email is already taken. Please use another email."
        )
      );

  payload.data.password = await bcrypt.hash(payload.data.password, 10);
  const token = Math.floor(100000 + Math.random() * 900000).toString();

  if (user && !user.is_verified) {
    //update data
    await prisma.user.update({
      data: {
        name: payload.data.name,
        password: payload.data.password,
        email_verify_token: token,
        email_verify_token_expiry: new Date(Date.now() + 3600000),
      },
      where: {
        email: payload.data.email,
      },
    });
  } else {
    await prisma.user.create({
      data: {
        email: payload.data.email,
        name: payload.data.name,
        password: payload.data.password,
        email_verify_token: token,
        email_verify_token_expiry: new Date(Date.now() + 3600000),
      },
    });
  }

  const html = await renderEmail("email-verify", {
    name: payload.data.name,
    token,
  });
  await emailQueue.add(emailQueueName, {
    to: payload.data.email,
    subject: "Clash | Email Verification",
    html,
  });

  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        null,
        "User created successfully.Please verify your email."
      )
    );
});

export const verifyEmail = asyncHandler(async (req, res) => {
  const query = req.query;
  const payload = verifyEmailSchema.safeParse(query);
  if (!payload.success && payload.error) {
    const errors = formatError(payload.error);
    return res.status(422).json(new ApiResponse(422, errors, "Invalid Data"));
  }
  const user = await prisma.user.findUnique({
    where: {
      email: payload.data.email,
      email_verify_token: payload.data.token,
      email_verify_token_expiry: {
        gte: new Date(Date.now()),
      },
    },
  });

  if (!user)
    res
      .status(404)
      .json(
        new ApiResponse(
          404,
          null,
          "User not found.Please try again the OTP token might have expired."
        )
      );
  if (user.email_verify_token !== payload.data.token)
    return res
      .status(400)
      .json(
        new ApiResponse(400, null, "Invalid Token. Please check your mail.")
      );

  await prisma.user.update({
    data: {
      is_verified: true,
      email_verify_token: null,
      email_verify_token_expiry: null,
    },
    where: {
      email: user.email,
    },
  });

  return res.json(
    new ApiResponse(200, null, "User verified successfully. Login to procced.")
  );
});

export const loginUser = asyncHandler(async (req, res) => {
  const body = req.body;
  const payload = loginSchema.safeParse(body);

  if (!payload.success && payload.error) {
    const errors = formatError(payload.error);
    return res
      .status(422)
      .json(
        new ApiResponse(
          422,
          errors,
          "Invalid Data. Please check your data properly."
        )
      );
  }

  const user = await prisma.user.findUnique({
    where: {
      email: payload.data.email,
    },
  });

  if (!user)
    return res
      .status(404)
      .json(
        new ApiResponse(404, null, "User not found. Please check your email.")
      );

  const isPassCorrect = await bcrypt.compare(
    payload.data.password,
    user.password
  );

  if (!isPassCorrect)
    return res
      .status(404)
      .json(
        new ApiResponse(400, null, "Password is incorrect. Please try again.")
      );

  const jwtPayload = {
    id: user.id,
    name: user.name,
    email: user.email,
  };

  const token = jwt.sign(jwtPayload, process.env.SECRET_KEY!, {
    expiresIn: "15d",
  });

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        ...jwtPayload,
        token,
      },
      "User logged in successfully."
    )
  );
});

export const getUser = asyncHandler(async (req, res) => {
  const user = req.user;
  return res.json(user);
});
