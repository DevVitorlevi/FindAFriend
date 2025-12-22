import { makeDeleteImageUseCase } from '@/use-cases/factories/make-delete-image-use-case.js'
import { ResourceNotFound } from '@/utils/errors/resource-not-found.js'
import type { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function deleteImage(request: FastifyRequest, reply: FastifyReply) {
  const deleteImageParamsSchema = z.object({
    imageId: z.string().uuid(),
  })

  const { imageId } = deleteImageParamsSchema.parse(request.params)

  try {
    const deletePetImageUseCase = makeDeleteImageUseCase()

    const { message } = await deletePetImageUseCase.execute({ imageId })

    return reply.status(200).send({ message })
  } catch (err) {
    if (err instanceof ResourceNotFound) {
      return reply.status(404).send({ message: 'Image not found' })
    }

    throw err
  }
}