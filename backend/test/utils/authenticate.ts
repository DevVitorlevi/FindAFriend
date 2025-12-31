import type { FastifyInstance } from 'fastify'
import request from 'supertest'
import { createOrg } from './create-org.js'

interface CreateOrgOptions {
  name?: string
  email?: string
  password?: string
  cep?: string
  address?: string
  latitude?: number
  longitude?: number
  whatsapp?: string
  state?: string
  city?: string
  street?: string
  numberHome?: number
}

export async function createAndAuthenticateOrg(
  app: FastifyInstance,
  options: CreateOrgOptions = {}
) {
  const { org, credentials } = await createOrg(app, options)

  const authResponse = await request(app.server)
    .post('/sessions')
    .send({
      email: credentials.email,
      password: credentials.password,
    })

  return {
    org,
    token: authResponse.body.token,
    credentials,
  }
}