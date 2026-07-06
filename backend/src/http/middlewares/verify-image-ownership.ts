import { prisma } from "@/lib/prisma.js";
import type { FastifyReply, FastifyRequest } from "fastify";

export async function verifyImageOwnership(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { petImageId } = request.params as { petImageId: string };
  const orgId = request.user.sub;

  try {
    const image = await prisma.petImage.findUnique({
      where: { id: petImageId },
      include: {
        pet: {
          select: {
            org_id: true,
          },
        },
      },
    });

    if (!image) {
      return reply.status(404).send({
        message: "Image not found.",
      });
    }

    if (image.pet.org_id !== orgId) {
      return reply.status(403).send({
        message: "You are not allowed to delete this image.",
      });
    }
  } catch (error) {
    return reply.status(500).send({
      message: "Internal server error.",
    });
  }
}
