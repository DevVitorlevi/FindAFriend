import { makeUploadImagesUseCase } from '@/use-cases/factories/make-upload-image-use-case.js'
import { ResourceNotFound } from '@/utils/errors/resource-not-found.js'
import type { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function uploadImages(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const uploadImagesParamsSchema = z.object({
    petId: z.string(),
  })

  const { petId } = uploadImagesParamsSchema.parse(request.params)

  const parts = request.parts()
  const imageBuffers: Buffer[] = []

  for await (const part of parts) {
    if (part.type === 'file') {
      const buffer = await part.toBuffer()
      imageBuffers.push(buffer)
    }
  }

  if (imageBuffers.length === 0) {
    return reply.status(400).send({ message: 'No images provided' })
  }

  try {
    const uploadPetImagesUseCase = makeUploadImagesUseCase()

    const { images } = await uploadPetImagesUseCase.execute({
      petId,
      images: imageBuffers,
    })

    return reply.status(201).send({ images })
  } catch (err) {
    if (err instanceof ResourceNotFound) {
      return reply.status(404).send({ message: err.message })
    }

    throw err
  }
}
