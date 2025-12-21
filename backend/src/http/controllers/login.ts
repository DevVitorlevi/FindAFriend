import { makeLoginOrgUseCase } from '@/use-cases/factories/make-login-org-use-case.js'
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
    .setCookie('refreshToken', refreshToken, {
      path: '/',
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
    })
    .send({
      message: 'Auth User Successful',
      token,
    })
}
