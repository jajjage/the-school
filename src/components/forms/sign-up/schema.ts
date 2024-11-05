import { z } from "zod"

// const passwordSchema = z
//   .string()
//   .min(8, "Password must be at least 8 characters long")
//   .regex(/[a-z]/, "Password must contain at least one lowercase letter")
//   .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
//   .regex(/\d/, "Password must contain at least one number")
//   .regex(/[@$!%*?&#]/, "Password must contain at least one special character")

export const SignUpSchema = z.object({
  firstname: z
    .string()
    .min(3, { message: "First name must be at least 3 characters" }),
  lastname: z
    .string()
    .min(3, { message: "Last name must be at least 3 characters" }),
  email: z.string().email("You must provide a valid email"),
  password: z
    .string()
    .min(8, { message: "Your password must be at least 8 characters long" })
    .max(64, { message: "Your password cannot be longer than 64 characters" })
    .refine(
      (value) => /^[a-zA-Z0-9_.-]*$/.test(value ?? ""),
      "Password should contain only alphabets and numbers",
    ),
  //   confirmPassword: z.string(),
  // }).refine((data) => data.password === data.confirmPassword, {
  //   message: "Passwords must match",
  //   path: ["confirmPassword"], // This will trigger the error on the confirmPassword field
})
