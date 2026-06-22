import type { FastifyInstance } from "fastify";
import { adopted } from "../controllers/pets/adopted.js";
import { create } from "../controllers/pets/create.js";
import { deleteImage } from "../controllers/pets/delete-image.js";
import { fetchManyOfOrg } from "../controllers/pets/fetch-many-org.js";
import { fetchMany } from "../controllers/pets/fetch-many.js";
import { getPet } from "../controllers/pets/get-pet.js";
import { uploadImages } from "../controllers/pets/upload-images.js";
import { verifyImageOwnership } from "../middlewares/verify-image-ownership.js";
import { verifyJWT } from "../middlewares/verify-jwt.js";
import { verifyPetOwnership } from "../middlewares/verify-pet-ownership.js";
import { verifyOwnership } from "../middlewares/verify-ownership.js";
import { deletePet } from "../controllers/pets/delete.js";
import { update } from "../controllers/pets/update.js";
import { petBodySchema } from "../schemas/pet.schema.js";

export function petsRoutes(app: FastifyInstance) {
  app.post(
    "/pets/:orgId/create",
    {
      onRequest: [verifyJWT],
      schema: {
        tags: ["pets"],
        summary: "Cadastrar pet",
        security: [{ bearerAuth: [] }],
        params: {
          type: "object",
          required: ["orgId"],
          properties: {
            orgId: { type: "string", format: "uuid" },
          },
        },
        body: petBodySchema,
        response: {
          201: {
            description: "Pet criado",
            type: "object",
            properties: {
              message: { type: "string" },
              pet: { $ref: "Pet#" },
            },
          },
        },
      },
    },
    create,
  );

  app.get(
    "/pets",
    {
      schema: {
        tags: ["pets"],
        summary: "Listar pets disponíveis para adoção",
        querystring: {
          type: "object",
          required: ["city", "state"],
          properties: {
            city: { type: "string" },
            state: { type: "string", minLength: 2, maxLength: 2 },
            age: { type: "string", enum: ["FILHOTE", "ADULTO", "IDOSO"] },
            size: { type: "string", enum: ["PEQUENO", "MEDIO", "GRANDE"] },
          },
        },
        response: {
          201: {
            type: "object",
            properties: {
              pets: { type: "array", items: { $ref: "Pet#" } },
            },
          },
        },
      },
    },
    fetchMany,
  );

  app.get(
    "/pet/:petId",
    {
      schema: {
        tags: ["pets"],
        summary: "Buscar pet por ID",
        params: {
          type: "object",
          required: ["petId"],
          properties: {
            petId: { type: "string", format: "uuid" },
          },
        },
        response: {
          200: {
            description: "Dados do pet",
            type: "object",
            properties: {
              pet: { $ref: "Pet#" },
            },
          },
          404: {
            description: "Pet não encontrado",
            type: "object",
            properties: {
              message: { type: "string" },
            },
          },
        },
      },
    },
    getPet,
  );

  app.post(
    "/pet/:petId/images",
    {
      onRequest: [verifyJWT, verifyPetOwnership],
      schema: {
        tags: ["pets"],
        summary: "Upload de imagens do pet",
        security: [{ bearerAuth: [] }],
        params: {
          type: "object",
          required: ["petId"],
          properties: {
            petId: { type: "string", format: "uuid" },
          },
        },
        response: {
          201: {
            type: "object",
            properties: {
              images: { type: "array", items: { $ref: "PetImage#" } },
            },
          },
          400: {
            type: "object",
            properties: { message: { type: "string" } },
          },
          404: {
            type: "object",
            properties: { message: { type: "string" } },
          },
        },
      },
    },
    uploadImages,
  );

  app.patch(
    "/pet/:petId",
    {
      onRequest: [verifyJWT, verifyPetOwnership],
      schema: {
        tags: ["pets"],
        summary: "Marcar pet como adotado",
        security: [{ bearerAuth: [] }],
        params: {
          type: "object",
          required: ["petId"],
          properties: {
            petId: { type: "string", format: "uuid" },
          },
        },
        response: {
          204: {
            description: "Status de adoção alternado",
            type: "object",
            properties: {
              pet: { $ref: "Pet#" },
            },
          },
        },
      },
    },
    adopted,
  );

  app.delete(
    "/image/:imageId",
    {
      onRequest: [verifyJWT, verifyImageOwnership],
      schema: {
        tags: ["pets"],
        summary: "Deletar imagem do pet",
        security: [{ bearerAuth: [] }],
        params: {
          type: "object",
          required: ["imageId"],
          properties: {
            imageId: { type: "string", format: "uuid" },
          },
        },
        response: {
          204: {
            type: "object",
            properties: { message: { type: "string" } },
          },
          404: {
            type: "object",
            properties: { message: { type: "string" } },
          },
        },
      },
    },
    deleteImage,
  );

  app.get(
    "/my/pets",
    {
      onRequest: [verifyJWT, verifyOwnership],
      schema: {
        tags: ["pets"],
        summary: "Listar pets da organização autenticada",
        querystring: {
          type: "object",
          required: ["orgId"],
          properties: {
            orgId: { type: "string", format: "uuid" },
          },
        },
        security: [{ bearerAuth: [] }],
        response: {
          200: {
            description: "Pets da org",
            type: "object",
            properties: {
              pets: {
                type: "array",
                items: { $ref: "Pet#" },
              },
            },
          },
        },
      },
    },
    fetchManyOfOrg,
  );

  app.delete(
    "/pet/:petId",
    {
      onRequest: [verifyJWT, verifyPetOwnership],
      schema: {
        tags: ["pets"],
        summary: "Deletar pet",
        security: [{ bearerAuth: [] }],
        params: {
          type: "object",
          required: ["petId"],
          properties: {
            petId: { type: "string", format: "uuid" },
          },
        },
        response: {
          204: {
            type: "object",
            properties: { message: { type: "string" } },
          },
          400: {
            type: "object",
            properties: { message: { type: "string" } },
          },
        },
      },
    },
    deletePet,
  );

  app.put(
    "/pet/:petId",
    {
      onRequest: [verifyJWT, verifyPetOwnership],
      schema: {
        tags: ["pets"],
        summary: "Atualizar dados do pet",
        security: [{ bearerAuth: [] }],
        params: {
          type: "object",
          required: ["petId"],
          properties: {
            petId: { type: "string", format: "uuid" },
          },
        },
        body: {
          type: "object",
          properties: {
            name: { type: "string", minLength: 1 },
            description: { type: "string", minLength: 1 },
            age: { type: "string", enum: ["FILHOTE", "ADULTO", "IDOSO"] },
            size: { type: "string", enum: ["PEQUENO", "MEDIO", "GRANDE"] },
          },
        },
        response: {
          200: {
            type: "object",
            properties: {
              message: { type: "string" },
              pet: { $ref: "Pet#" },
            },
          },
          404: {
            type: "object",
            properties: { message: { type: "string" } },
          },
        },
      },
    },
    update,
  );
}
