import z from "zod";

export const createPetBodySchema = z.object({
  name: z.string(),
  description: z.string().max(300),
  age: z.enum(['FILHOTE', 'ADULTO', 'IDOSO']),
  size: z.enum(['PEQUENO', 'MEDIO', 'GRANDE']),
})