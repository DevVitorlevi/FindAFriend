import { makeCreatePetUseCase } from "@/use-cases/factories/make-create-pet-use-case.js";
import type { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";

export async function create(request: FastifyRequest, reply: FastifyReply) {
  const createPetBodySchema = z.object({
    name: z.string(),
    description: z.string().max(300),
    age: z.enum(['FILHOTE', 'ADULTO', 'IDOSO']),
    size: z.enum(['PEQUENO', 'MEDIO', 'GRANDE']),
  })

  const orgIdParamsSchema = z.object({
    orgId: z.string()
  })

  const { name, description, age, size } = createPetBodySchema.parse(request.body)
  const { orgId } = orgIdParamsSchema.parse(request.params)
  try {
    const createPetUseCase = makeCreatePetUseCase()
    const { pet } = await createPetUseCase.execute({
      name,
      description,
      age,
      size,
      orgId
    })
    return reply.status(201).send({
      message: "Pet Created!!",
      pet
    })
  } catch (error) {
    throw error
  }

}