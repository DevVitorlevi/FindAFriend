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
    address: options.address ?? 'Rua Teste, 123',
    latitude: options.latitude ?? -5.795,
    longitude: options.longitude ?? -35.209,
    whatsapp: options.whatsapp ?? '84999999999',
    state: options.state ?? 'RN',
    city: options.city ?? 'Natal',
  }

  const response = await request(app.server).post('/orgs').send(orgData)

  // Debug: verificar se a resposta tem org
  if (!response.body.org) {
    console.error('Response body:', response.body)
    throw new Error('Org not found in response body')
  }

  return {
    org: response.body.org,
    credentials: {
      email: orgData.email,
      password: orgData.password,
    },
  }
}