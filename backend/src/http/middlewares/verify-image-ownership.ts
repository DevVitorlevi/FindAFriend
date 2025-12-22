
import { prisma } from "@/lib/prisma.js"
import type { FastifyReply, FastifyRequest } from "fastify"

export async function verifyImageOwnership(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { imageId } = request.params as { imageId: string }
  const orgId = request.user.sub

  try {
    // Busca a imagem com o pet relacionado
    const image = await prisma.petImage.findUnique({
      where: { id: imageId },
      include: {
        pet: {
          select: {
            org_id: true,
          },
        },
      },
    })

    if (!image) {
      return reply.status(404).send({
        message: 'Image not found.',
      })
    }

    // Verifica se o pet da imagem pertence à ONG autenticada
    if (image.pet.org_id !== orgId) {
      return reply.status(403).send({
        message: 'You are not allowed to delete this image.',
      })
    }

  } catch (error) {
    return reply.status(500).send({
      message: 'Internal server error.',
    })
  }
}