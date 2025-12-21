import type { FastifyInstance } from "fastify";
import { login } from "../controllers/login.js";
import { refresh } from "../controllers/refresh.js";
import { register } from "../controllers/register.js";

export function orgsRoutes(app: FastifyInstance) {
  app.post("/orgs", register)
  app.post("/sessions", login)
  app.patch("/token/refresh", refresh)
}