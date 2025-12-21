import type { FastifyInstance } from "fastify";
import { login } from "../controllers/orgs/login.js";
import { refresh } from "../controllers/orgs/refresh.js";
import { register } from "../controllers/orgs/register.js";

export function orgsRoutes(app: FastifyInstance) {
  app.post("/orgs", register)
  app.post("/sessions", login)
  app.patch("/token/refresh", refresh)
}