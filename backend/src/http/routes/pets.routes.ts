import type { FastifyInstance } from "fastify";
import { create } from "../controllers/pets/create.js";
import { fetchMany } from "../controllers/pets/fetch-many.js";
import { getPet } from "../controllers/pets/get-pet.js";
import { verifyJWT } from "../middlewares/verify-jwt.js";

export function petsRoutes(app: FastifyInstance) {
  app.post("/pets/:orgId/create", { onRequest: [verifyJWT] }, create)
  app.get("/pets", fetchMany)
  app.get("/pet/:petId", getPet)
}