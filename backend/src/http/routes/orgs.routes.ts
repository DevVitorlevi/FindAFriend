import type { FastifyInstance } from "fastify";
import { register } from "../controllers/register.js";

export function orgsRoutes(app: FastifyInstance) {
  app.post("/orgs", register)
}