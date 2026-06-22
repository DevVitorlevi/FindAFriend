import { makeUpdatePetUseCase } from "@/use-cases/factories/make-update-pet-use-case.js";
import { ResourceNotFound } from "@/utils/errors/resource-not-found.js";
import type { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";

export async function update(request: FastifyRequest, reply: FastifyReply) {
  const updateBodySchema = z.object({
    name: z.string().min(1).optional(),
    description: z.string().min(1).optional(),
    age: z.enum(["FILHOTE", "ADULTO", "IDOSO"]).optional(),
    size: z.enum(["PEQUENO", "MEDIO", "GRANDE"]).optional(),
  });

  const updateParamsSchema = z.object({
    petId: z.string(),
  });

  const { name, description, age, size } = updateBodySchema.parse(request.body);
  const { petId } = updateParamsSchema.parse(request.params);

  const updatePetUseCase = makeUpdatePetUseCase();

  try {
    const pet = await updatePetUseCase.execute(petId, {
      name,
      description,
      age,
      size,
    });

    return reply.status(200).send({
      message: "Updated Pet",
      pet,
    });
  } catch (error) {
    if (error instanceof ResourceNotFound) {
      return reply.status(404).send({
        message: error.message,
      });
    }

    throw error;
  }
}
