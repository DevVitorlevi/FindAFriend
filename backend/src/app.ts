import fastify from "fastify";

export const app = fastify()

import { env } from '@/env/index.js';
import { v2 as cloudinary } from 'cloudinary';
import z, { ZodError } from "zod";
import { orgsRoutes } from "./http/routes/orgs.routes.js";

cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
})
//Routes
app.register(orgsRoutes)
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
