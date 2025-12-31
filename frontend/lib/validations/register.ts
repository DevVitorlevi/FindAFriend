import z from "zod";

export const registerBodySchema = z.object({
  name: z.string().min(3, "O nome deve ter pelo menos 3 letras"),
  email: z.email("Email inválido"),
  state: z.string().nonempty("Escolha um estado"),
  city: z.string().nonempty("Escolha uma cidade"),
  whatsapp: z
    .string()
    .regex(/^\(\d{2}\)\s9\d{4}-\d{4}$/, "WhatsApp inválido"),
  password: z.string().min(8, "Senha deve ter ao menos 8 caracteres"),
});

export type RegisterFormSchema = z.infer<typeof registerBodySchema>;
