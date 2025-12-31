import type { FastifyInstance } from 'fastify'
import request from 'supertest'

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

export async function createOrg(
  app: FastifyInstance,
  options: CreateOrgOptions = {}
) {
  const orgData = {
    name: options.name ?? 'ONG Teste',
    email: options.email ?? `test-${Math.random()}@example.com`,
    password: options.password ?? 'senha123',
    cep: options.cep ?? '59000-000',
    latitude: options.latitude ?? -5.795,
    longitude: options.longitude ?? -35.209,
    whatsapp: options.whatsapp ?? '84999999999',
    state: options.state ?? 'RN',
    city: options.city ?? 'Natal',
    street: options.street ?? "Rua das Flores",
    numberHome: options.numberHome ?? 1

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