import { makeToggleAdoptedUseCase } from "@/use-cases/factories/make-adopted-pet-use-case.js";
import type { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";

export async function adopted(request: FastifyRequest, reply: FastifyReply) {
  const AdoptedPetParamsSchema = z.object({
    petId: z.string(),
  })

  const { petId } = AdoptedPetParamsSchema.parse(request.params)
  try {
    const toggleAdoptedUseCase = makeToggleAdoptedUseCase()
    const pet = await toggleAdoptedUseCase.execute({
      petId
    })
    return reply.status(204).send({
      pet
    })
  } catch (error) {
    throw error
  }

}