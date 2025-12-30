import z from "zod";

export const registerBodySchema = z.object({
  name: z.string().min(3,
    {
      message: "O Nome Da Organizacao teve ter ao menos 3 Letras"
    }
  ),
  email: z.email({ message: "Email Invalido" }),
  password: z.string().min(8, {
    message: "A senha deve ter no ao menos 8 Caracteres"
  }),
  address: z.string(),
  cep: z
    .string()
    .regex(/^\d{5}-?\d{3}$/, 'CEP inválido'),
  whatsapp: z
    .string()
    .transform(value => value.replace(/\D/g, ''))
    .refine(value => {
      return /^\d{2}9\d{8}$/.test(value)
    }, {
      message: 'Número de WhatsApp inválido',
    }),
  city: z.string(),
  state: z.string(),
  street: z.string()
})