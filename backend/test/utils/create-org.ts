import type { FastifyInstance } from 'fastify'
import request from 'supertest'

interface CreateOrgOptions {
  name?: string
  email?: string
  password?: string
  whatsapp?: string
  state?: string
  city?: string,
}

export async function createOrg(
  app: FastifyInstance,
  options: CreateOrgOptions = {}
) {
  const orgData = {
    name: options.name ?? 'ONG Teste',
    email: options.email ?? `test-${Math.random()}@example.com`,
    password: options.password ?? 'senha123',
    whatsapp: options.whatsapp ?? '84999999999',
    state: options.state ?? 'RN',
    city: options.city ?? 'Natal',

  }

  const response = await request(app.server).post('/orgs').send(orgData)


  return {
    org: response.body.org,
    credentials: {
      email: orgData.email,
      password: orgData.password,
    },
  }
}