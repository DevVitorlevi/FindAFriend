import cookie from "@fastify/cookie";
import cors from "@fastify/cors";
import fastifyJwt from "@fastify/jwt";
import multipart from "@fastify/multipart";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUI from "@fastify/swagger-ui";
import fastify from "fastify";
import { env } from "@/env/index.js";
import { v2 as cloudinary } from "cloudinary";
import z, { ZodError } from "zod";
import { orgsRoutes } from "./http/routes/orgs.routes.js";
import { petsRoutes } from "./http/routes/pets.routes.js";
import { orgResponseSchema } from "./http/schemas/org.schema.js";
import {
  petResponseSchema,
  petImageSchema,
} from "./http/schemas/pet.schema.js";

export const app = fastify({
  ajv: {
    customOptions: {
      keywords: ["example"],
    },
  },
});

await app.register(fastifySwagger, {
  openapi: {
    info: {
      title: "FindAFriend API",
      description: "API para adoção de pets",
      version: "1.0.0",
    },
    servers: [{ url: "http://localhost:3333" }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    tags: [
      { name: "orgs", description: "Organizações de adoção" },
      { name: "pets", description: "Pets disponíveis para adoção" },
    ],
  },
});

await app.register(fastifySwaggerUI, {
  routePrefix: "/docs",
});

app.addSchema(orgResponseSchema);
app.addSchema(petResponseSchema);
app.addSchema(petImageSchema);

app.register(multipart);

cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
});

app.register(cookie);

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
  cookie: {
    cookieName: "accessToken",
    signed: false,
  },
});

app.register(cors, {
  origin: "http://localhost:3000",
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
});

app.register(orgsRoutes);
app.register(petsRoutes);

app.setErrorHandler((error, _, reply) => {
  if (error instanceof ZodError) {
    return reply.status(400).send({
      message: "Validation Error",
      issues: z.treeifyError(error),
    });
  }

  if (env.NODE_ENV !== "production") {
    console.error(error);
  }

  return reply.status(500).send({
    message: "Internal Server Error",
  });
});

export { cloudinary };
