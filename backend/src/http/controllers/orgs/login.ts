import { orgPresenter } from '@/presenters/org-presenter.js'
import { makeLoginOrgUseCase } from '@/use-cases/factories/make-login-org-use-case.js'
import { InvalidCredentials } from '@/utils/errors/invalid-credentials.js'
import type { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function login(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const loginBodySchema = z.object({
    email: z.email(),
    password: z.string().min(8),
  })

  const { email, password } = loginBodySchema.parse(request.body)

  try {
    const loginUseCase = makeLoginOrgUseCase()

    const { org } = await loginUseCase.execute({
      email,
      password,
    })

    const token = await reply.jwtSign(
      {},
      {
        sub: org.id,
      },
    )

    const refreshToken = await reply.jwtSign(
      {},
      {
        sub: org.id,
        expiresIn: '7d',
      },
    )

    return reply
      .status(200)
      .setCookie('accessToken', token, {
        path: '/',
        httpOnly: true,
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 10 // 10 minutos
      })
      .setCookie('refreshToken', refreshToken, {
        path: '/',
        httpOnly: true,
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 7 // 7 dias
      })
      .send({
        message: 'Auth User Successful',
        org: orgPresenter(org)
      })

  } catch (error) {
    if (error instanceof InvalidCredentials) {
      return reply.status(401).send({
        message: error.message
      })
    }
    throw error
  }
}
