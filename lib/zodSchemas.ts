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

export const inventoryItemSchema = z.object({
  make: z.string().trim().min(1, "Make is required."),
  model: z.string().trim().min(1, "Model is required."),
  year: z
    .number()
    .int({ message: "Year must be an integer." })
    .min(1900, "Year must be 1900 or later.")
    .max(2100, "Year must be 2100 or earlier.")
    .nullable()
    .refine((val) => val !== null, { message: "Year is required." }),
  price: z
    .number({ invalid_type_error: "Price must be a number." })
    .min(0, "Price cannot be negative.")
    .nullable()
    .refine((val) => val !== null, { message: "Price is required." }),
  description: z.string().optional(),
  status: z.enum(["AVAILABLE", "RESERVED", "SOLD", "LEASED"], {
    errorMap: () => ({ message: "Please select a valid status." }),
  }),
  vin: z
    .string()
    .trim()
    .toUpperCase()
    .min(17, { message: "VIN must be 17 characters" })
    .max(17, { message: "VIN must be 17 characters" }),
});

export function parseZodSchema<T>(schema: z.ZodSchema<T>, data: unknown): T {
  return schema.parse(data);
}

export type LoginData = z.infer<typeof loginSchema>;
export type UserData = z.infer<typeof userSchema>;
export type InventoryItemData = z.infer<typeof inventoryItemSchema>;
