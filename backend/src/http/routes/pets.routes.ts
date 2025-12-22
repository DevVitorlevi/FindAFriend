import type { FastifyInstance } from "fastify";
import { adopted } from "../controllers/pets/adopted.js";
import { create } from "../controllers/pets/create.js";
import { fetchMany } from "../controllers/pets/fetch-many.js";
import { getPet } from "../controllers/pets/get-pet.js";
import { uploadImages } from "../controllers/pets/upload-images.js";
import { verifyJWT } from "../middlewares/verify-jwt.js";
import { verifyPetOwnership } from "../middlewares/verify-pet-ownership.js";

export function petsRoutes(app: FastifyInstance) {
  app.post("/pets/:orgId/create", { onRequest: [verifyJWT] }, create)
  app.get("/pets", fetchMany)
  app.get("/pet/:petId", getPet)
  app.post("/pet/:petId/images", { onRequest: [verifyJWT, verifyPetOwnership] }, uploadImages)
  app.patch("/pet/:petId", { onRequest: [verifyJWT, verifyPetOwnership] }, adopted)
}