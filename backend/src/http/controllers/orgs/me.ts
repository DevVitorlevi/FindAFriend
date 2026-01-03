import { orgPresenter } from "@/presenters/org-presenter.js";
import { makeMeUseCase } from "@/use-cases/factories/make-me-use-case.js";
import type { FastifyReply, FastifyRequest } from "fastify";

export async function me(request: FastifyRequest, reply: FastifyReply) {
  const id = request.user.sub

  try {
    const meUseCase = makeMeUseCase()
    const { org } = await meUseCase.execute({ id })

    return reply.status(200).send({
      org: orgPresenter(org)
    })
  } catch (err) {
    return reply.status(404).send({
      message: 'Organization Not Found'
    })
  }
}