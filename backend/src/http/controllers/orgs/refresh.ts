import type { FastifyReply, FastifyRequest } from "fastify";

export async function refresh(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const refreshToken = request.cookies.refreshToken;

  if (!refreshToken) {
    return reply.status(401).send({
      message: "Refresh token missing",
    });
  }

  try {
    request.cookies.accessToken = refreshToken;

    await request.jwtVerify<{ sub: string }>({
      onlyCookie: true,
    });

    const { sub } = request.user;

    const newAccessToken = await reply.jwtSign(
      { sub },
      {
        expiresIn: "10m",
      }
    );

    const newRefreshToken = await reply.jwtSign(
      { sub },
      {
        expiresIn: "7d",
      }
    );

    return reply
      .setCookie("accessToken", newAccessToken, {
        path: "/",
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 10,
      })
      .setCookie("refreshToken", newRefreshToken, {
        path: "/",
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 7,
      })
      .status(200)
      .send({
        message: "Tokens refreshed",
      });

  } catch {
    return reply.status(401).send({
      message: "Invalid or expired refresh token",
    });
  }
}