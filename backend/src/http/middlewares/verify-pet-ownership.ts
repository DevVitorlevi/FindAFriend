
import { prisma } from "@/lib/prisma.js"
import type { FastifyReply, FastifyRequest } from "fastify"

export async function verifyPetOwnership(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { petId } = request.params as { petId: string }

  const orgId = request.user.sub

  try {
    const pet = await prisma.pet.findUnique({
      where: { id: petId },
      select: { org_id: true },
    })

    if (!pet) {
      return reply.status(404).send({
        message: 'Pet not found.',
      })
    }

    if (pet.org_id !== orgId) {
      return reply.status(403).send({
        message: 'You are not allowed to edit this pet.',
      })
    }

  } catch (error) {
    return reply.status(500).send({
      message: 'Internal server error.',
    })
  }
}