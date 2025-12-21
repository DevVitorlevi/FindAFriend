import type { FastifyInstance } from "fastify";
import { create } from "../controllers/create.js";
import { verifyJWT } from "../middlewares/verify-jwt.js";

export function petsRoutes(app: FastifyInstance) {
  app.post("/pets/:orgId/create", { onRequest: [verifyJWT] }, create)
}