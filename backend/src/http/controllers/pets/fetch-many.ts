import { makeFetchPetCityUseCase } from "@/use-cases/factories/make-fetch-pet-city-use-case.js";
import type { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";

export async function fetchMany(request: FastifyRequest, reply: FastifyReply) {
  const fetchManyQuerySchema = z.object({
    city: z.string(),
    state: z.string().length(2).toUpperCase(),
    age: z.enum(['FILHOTE', 'ADULTO', 'IDOSO']).optional(),
    size: z.enum(['PEQUENO', 'MEDIO', 'GRANDE']).optional(),
  })

  const { city, state, age, size } = fetchManyQuerySchema.parse(request.query)
  try {
    const fetchPetCityUseCase = makeFetchPetCityUseCase()
    const pets = await fetchPetCityUseCase.execute({
      city,
      state,
      age,
      size,
    })
    return reply.status(201).send({
      pets
    })
  } catch (error) {
    throw error
  }

}