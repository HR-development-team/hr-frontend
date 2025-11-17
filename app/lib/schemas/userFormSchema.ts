import z from "zod";

const passwordSchema = z
  .string()
  .min(8, "Password minimal harus 8 karakter")

  // must use lowercase
  .regex(/[a-z]/, "Password harus memiliki setidaknya satu huruf kecil")

  // must use uppercase
  .regex(/[A-Z]/, "Password harus memiliki setidaknya satu huruf besar");

export const baseSchema = z.object({
  email: z.email("Email tidak valid").nonempty("Email user tidak boleh kosong"),
  role: z.enum(["admin", "employee"]),
});

export const getUserSchema = (mode: "view" | "add" | "edit" | null) => {
  if (mode === "add") {
    return baseSchema
      .extend({
        password: passwordSchema,
        confirmPassword: z.string().min(1, "Konfirmasi password"),
      })
      .refine((data) => data.password === data.confirmPassword, {
        message: "Password tidak sama",
        path: ["confirmPassword"],
      });
  }

  // if (mode === "edit") {
  return baseSchema
    .extend({
      password: passwordSchema.optional().or(z.literal("")),
      confirmPassword: z.string().min(1).optional().or(z.literal("")),
    })
    .refine(
      (data) => {
        if (data.password && data.password.length > 0) {
          return data.password === data.confirmPassword;
        }

        return true;
      },
      {
        message: "Password tidak cocok",
        path: ["confirmPassword"],
      }
    );
  // }
};

const addSchemaStructure = baseSchema.extend({
  password: z.string(),
  confirmPassword: z.string(),
});

export type UserFormData = z.infer<typeof addSchemaStructure>;
