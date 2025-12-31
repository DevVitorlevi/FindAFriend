import cookie from "@fastify/cookie";
import cors from "@fastify/cors";
import fastifyJwt from "@fastify/jwt";
import multipart from '@fastify/multipart';
import fastify from "fastify";
export const app = fastify()

import { env } from '@/env/index.js';
import { v2 as cloudinary } from 'cloudinary';
import z, { ZodError } from "zod";
import { orgsRoutes } from "./http/routes/orgs.routes.js";
import { petsRoutes } from "./http/routes/pets.routes.js";

app.register(multipart)
cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
})
app.register(cookie)
app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
  cookie: {
    cookieName: "refreshToken",
    signed: false
  },
  sign: {
    expiresIn: "10m"
  }
})

app.register(cors, {
  origin: "http://localhost:3000",
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
});

//Routes
app.register(orgsRoutes)
app.register(petsRoutes)
app.setErrorHandler((error, _, reply) => {

  if (error instanceof ZodError) {
    return reply.status(400).send({
      message: 'Validation Error',
      issues: z.treeifyError(error)
    })
  }

  if (env.NODE_ENV !== 'production') {
    console.error(error)
  }

  return reply.status(500).send({
    message: 'Internal Server Error'
  })
})

export { cloudinary };
