import { makeFetchManyOrgUseCase } from "@/use-cases/factories/make-fetch-many-org-use-case.js";
import type { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";

export async function fetchManyOfOrg(request: FastifyRequest, reply: FastifyReply) {
  const fetchManyParamsSchema = z.object({
    orgId: z.string()
  })

  const { orgId } = fetchManyParamsSchema.parse(request.params)
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