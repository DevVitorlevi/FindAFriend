import type { FastifyReply, FastifyRequest } from 'fastify'

export async function verifyOwnership(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { orgId } = request.params as { orgId: string }

  if (orgId !== request.user.sub) {
    return reply.status(403).send({
      message: 'Access denied.',
    })
  }
}
