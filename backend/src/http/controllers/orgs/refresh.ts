import type { FastifyReply, FastifyRequest } from "fastify";
export async function refresh(request: FastifyRequest, reply: FastifyReply) {
  await request.jwtVerify({ onlyCookie: true })

  const token = await reply.jwtSign(
    {},
    {
      sub: request.user.sub,
    }
  )

  const refreshToken = await reply.jwtSign(
    {},
    {
      sub: request.user.sub,
      expiresIn: "7d"
    }
  )

  return reply.status(200)
    .setCookie('accessToken', token, {
      path: '/',
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 10
    })
    .setCookie('refreshToken', refreshToken, {
      path: '/',
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7
    })
    .send({
      message: 'Tokens refreshed'
    })
}