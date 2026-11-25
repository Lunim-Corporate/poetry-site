
import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().trim().min(2, "Name must contain at least 2 characters").max(255),
  email: z.string().trim().email("Invalid email address").max(255),
  password: z
    .string()
    .min(12, "Password must contain at least 12 characters")
    .max(72, "Password must not exceed 72 characters"),
  phoneNumber: z.string().trim().max(50).optional(),
});

export type RegisterInput = z.infer<typeof registerSchema>;
