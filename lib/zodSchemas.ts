import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email({ message: "Invalid email" }),
  password: z.string().min(1, "Password is required."),
});

export const userSchema = z.object({
  clerkId: z.string().trim().min(1, "Clerk ID is required."),
  email: z.string().trim().toLowerCase().email({ message: "Invalid email" }),
  firstName: z.string().trim().min(1, "First name is required."),
  lastName: z.string().trim().min(1, "Last name is required."),
  businessName: z.string().optional(),
  subscribed: z.boolean().default(false),
  phone: z
    .string()
    .regex(/^[0-9]+$/, { message: "Invalid phone number" })
    .length(10, { message: "Phone number must be 10 digits" })
    .transform(
      (val) => `${val.slice(0, 3)}-${val.slice(3, 6)}-${val.slice(6, 10)}`
    ),
});

export type LoginData = z.infer<typeof loginSchema>;
export type UserData = z.infer<typeof userSchema>;
