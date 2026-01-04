import { makeFetchManyOrgUseCase } from "@/use-cases/factories/make-fetch-many-org-use-case.js";
import type { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";

export async function fetchManyOfOrg(request: FastifyRequest, reply: FastifyReply) {
  const fetchManyQuerySchema = z.object({
    orgId: z.string()
  })

  const { orgId } = fetchManyQuerySchema.parse(request.query)
  try {
    const fetchManyOrgUseCase = makeFetchManyOrgUseCase()
    const { pets } = await fetchManyOrgUseCase.execute({ orgId })
    return reply.status(200).send({
      pets
    })
  } catch (error) {
    throw error
  }

}