import z from "zod";

export const loginFormSchema = z.object({
  email: z.email("Email tidak valid"),
  password: z.string().min(8, "Karakter password kurang dari 8"),
});

export type LoginFormData = z.infer<typeof loginFormSchema>;
