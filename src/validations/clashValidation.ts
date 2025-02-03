import { z } from "zod";

const titleSchema = z
  .string()
  .min(5, "Title must be at least five characters.")
  .max(50, "Title must be less than 50 characters");
const descriptionSchema = z
  .string()
  .min(6, "Description must be at least six characters.")
  .max(500, "Description must be less than 500 characters");

export const clashSchema = z.object({
  title: titleSchema,
  description: descriptionSchema,
  expired_at: z
    .string({ message: "Expire at is required." })
    .min(5, { message: "Please pass correct date" }),
  image: z.string().optional(),
});
