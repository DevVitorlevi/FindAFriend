import { makeDeleteImageUseCase } from "@/use-cases/factories/pets/make-delete-image-use-case.js";
import { ResourceNotFound } from "@/utils/errors/resource-not-found.js";
import type { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export async function deleteImage(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const deleteImageParamsSchema = z.object({
    petImageId: z.string().uuid(),
  });

  const { petImageId } = deleteImageParamsSchema.parse(request.params);

  try {
    const deletePetImageUseCase = makeDeleteImageUseCase();

    await deletePetImageUseCase.execute({ petImageId });

    return reply.status(204).send();
  } catch (err) {
    if (err instanceof ResourceNotFound) {
      return reply.status(404).send({ message: "Image not found" });
    }

    throw err;
  }
}
