import { z } from "zod";

export const registerSchema = z
  .object({
    name: z.string().min(3, "Name must be at least three characters."),
    email: z.string().email("Invalid email address."),
    password: z.string().min(6, "Password must be at least six characters."),
    confirmPassword: z
      .string()
      .min(6, "Confirm password must be at least six characters."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

//refine takes a function and returns boolean if false sends message on confirmPassword path
