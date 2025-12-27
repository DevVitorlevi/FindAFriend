import { makeGetPetUseCase } from "@/use-cases/factories/make-get-pet-use-case.js";
import type { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";

export async function getPet(request: FastifyRequest, reply: FastifyReply) {
  const GetPetParamsSchema = z.object({
    petId: z.string()
  })
  const { petId } = GetPetParamsSchema.parse(request.params)
  try {
    const getPetUseCase = makeGetPetUseCase()
    const { pet } = await getPetUseCase.execute({
      petId
    })
    return reply.status(200).send({
      pet
    })
  } catch (error) {
    throw error
  }

}