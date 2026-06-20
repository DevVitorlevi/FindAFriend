import { makeDeletePetUseCase } from "@/use-cases/factories/make-delete-pet-use-case.js";
import { ResourceNotFound } from "@/utils/errors/resource-not-found.js";
import type { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";

export async function deletePet(request: FastifyRequest, reply: FastifyReply) {
  const deletePetParamsSchema = z.object({
    id: z.string(),
  });

  const { id } = deletePetParamsSchema.parse(request.params);
  try {
    const deletePetUseCase = makeDeletePetUseCase();
    await deletePetUseCase.execute({
      id,
    });

    return reply.status(204).send({
      message: "Delete Pet",
    });
  } catch (error) {
    if (error instanceof ResourceNotFound) {
      return reply.status(400).send({
        message: error.message,
      });
    }

    throw error;
  }
}
