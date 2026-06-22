import type { FastifyInstance } from "fastify";
import { login } from "../controllers/orgs/login.js";
import { me } from "../controllers/orgs/me.js";
import { refresh } from "../controllers/orgs/refresh.js";
import { register } from "../controllers/orgs/register.js";
import { verifyJWT } from "../middlewares/verify-jwt.js";
import { orgBodySchema } from "../schemas/org.schema.js";

export function orgsRoutes(app: FastifyInstance) {
  app.post(
    "/orgs",
    {
      schema: {
        tags: ["orgs"],
        summary: "Cadastrar organização",
        body: orgBodySchema,
        response: {
          201: {
            description: "Organização criada com sucesso",
            type: "object",
            properties: {
              message: { type: "string" },
              org: { $ref: "Org#" },
            },
          },
          409: {
            description: "Email já cadastrado",
            type: "object",
            properties: {
              message: { type: "string" },
            },
          },
        },
      },
    },
    register,
  );

  app.post(
    "/sessions",
    {
      schema: {
        tags: ["orgs"],
        summary: "Login da organização",
        body: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: { type: "string", format: "email" },
            password: { type: "string", minLength: 8 },
          },
        },
        response: {
          200: {
            description: "Login realizado com sucesso",
            type: "object",
            properties: {
              message: { type: "string" },
              accessToken: { type: "string" },
              org: { $ref: "Org#" },
            },
          },
          400: {
            description: "Credenciais inválidas",
            type: "object",
            properties: { message: { type: "string" } },
          },
        },
      },
    },
    login,
  );

  app.get(
    "/me",
    {
      onRequest: [verifyJWT],
      schema: {
        tags: ["orgs"],
        summary: "Dados da organização autenticada",
        security: [{ bearerAuth: [] }],
        response: {
          200: {
            description: "Dados da org",
            type: "object",
            properties: {
              org: { $ref: "Org#" },
            },
          },
          401: {
            description: "Não autenticado",
            type: "object",
            properties: {
              message: { type: "string" },
            },
          },
        },
      },
    },
    me,
  );

  app.post(
    "/token/refresh",
    {
      schema: {
        tags: ["orgs"],
        summary: "Renovar access token via cookie",
        response: {
          200: {
            description: "Tokens renovados via cookie",
            type: "object",
            properties: { message: { type: "string" } },
          },
          401: {
            description: "Refresh token inválido ou ausente",
            type: "object",
            properties: { message: { type: "string" } },
          },
        },
      },
    },
    refresh,
  );
}
