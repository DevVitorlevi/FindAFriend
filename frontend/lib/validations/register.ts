import z from "zod";

export const registerBodySchema = z.object({
  name: z.string().min(3, {
    message:
      "O nome da organização deve ter ao menos 3 letras",
  }),

  email: z.email({
    message: "Email inválido",
  }),

  password: z.string().min(8, {
    message:
      "A senha deve ter ao menos 8 caracteres",
  }),

  cep: z
    .string()
    .regex(/^\d{5}-?\d{3}$/, "CEP inválido"),

  whatsapp: z
    .string()
    .transform((value) =>
      value.replace(/\D/g, "")
    )
    .refine(
      (value) =>
        /^\d{2}9\d{8}$/.test(value),
      {
        message:
          "Número de WhatsApp inválido",
      }
    ),

  city: z.string(),
  state: z.string(),
});
