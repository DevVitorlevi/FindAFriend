import type { FastifyInstance } from "fastify";
import { login } from "../controllers/orgs/login.js";
import { me } from "../controllers/orgs/me.js";
import { refresh } from "../controllers/orgs/refresh.js";
import { register } from "../controllers/orgs/register.js";
import { verifyJWT } from "../middlewares/verify-jwt.js";

export function orgsRoutes(app: FastifyInstance) {
  app.post("/orgs", register)
  app.post("/sessions", login)
  app.get("/me", { onRequest: [verifyJWT] }, me)
  app.post("/token/refresh", refresh)
}