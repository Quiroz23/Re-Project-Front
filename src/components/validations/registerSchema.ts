import { z } from "zod";

export const registerSchema = z.object({
  email: z.string().email({ message: "Introduce un correo electrónico válido" }),
  password: z
    .string()
    .min(8, { message: "La contraseña debe tener al menos 8 caracteres" }),
  group: z.string().min(1, { message: "El grupo es obligatorio y debe ser un texto válido" }),
}).superRefine((data, ctx) => {
  if (data.password === data.email) {
    ctx.addIssue({
      code: "custom",
      path: ["password"],
      message: "La contraseña no debe ser igual al correo",
    });
  }
});
