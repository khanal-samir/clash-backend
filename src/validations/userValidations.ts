import { z } from "zod";

const emailSchema = z.string().email("Invalid email address.");
const passSchema = z
  .string()
  .min(6, "Password must be at least six characters.");

export const registerSchema = z
  .object({
    name: z.string().min(3, "Name must be at least three characters."),
    email: emailSchema,
    password: passSchema,
    confirmPassword: z
      .string()
      .min(6, "Confirm password must be at least six characters."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

//refine takes a function and returns boolean if false sends message on confirmPassword path

export const verifyEmailSchema = z.object({
  email: emailSchema,
  token: z.string().length(6, "Invalid OTP token."),
});

export const loginSchema = z.object({
  email: emailSchema,
  password: passSchema,
});
