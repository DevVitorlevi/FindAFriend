import { makeFetchPetCityUseCase } from "@/use-cases/factories/pets/make-fetch-pet-city-use-case.js";
import type { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";

const fetchManyQuerySchema = z.object({
  city: z.string(),
  state: z.string().length(2).toUpperCase(),
  age: z.enum(["FILHOTE", "ADULTO", "IDOSO"]).optional(),
  size: z.enum(["PEQUENO", "MEDIO", "GRANDE"]).optional(),
});

type FetchManyQuery = z.infer<typeof fetchManyQuerySchema>;

export async function fetchMany(
  request: FastifyRequest<{ Querystring: FetchManyQuery }>,
  reply: FastifyReply,
) {
  const { city, state, age, size } = fetchManyQuerySchema.parse(request.query);

  const fetchPetCityUseCase = makeFetchPetCityUseCase();
  const pets = await fetchPetCityUseCase.execute({ city, state, age, size });

  return reply.status(200).send({ pets });
}
