import { app } from '@/app.js'
import request from 'supertest'
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import { resetDatabase } from '../utils/reset-database.js'

describe('Register Org (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  beforeEach(async () => {
    await resetDatabase()
  })

  it('should be able to register a new org', async () => {
    const response = await request(app.server)
      .post('/orgs')
      .send({
        name: 'ONG Amigos dos Animais',
        email: 'contato@ongamigos.com',
        password: 'senha123',
        cep: '59000-000',
        address: 'Rua das Flores, 123',
        latitude: -5.795,
        longitude: -35.209,
        whatsapp: '84999999999',
        state: 'RN',
        city: 'Natal',
      })

    expect(response.status).toBe(201)
  })

  it('should not be able to register with duplicate email', async () => {
    const orgData = {
      name: 'ONG Teste',
      email: 'duplicate@test.com',
      password: 'senha123',
      cep: '59000-000',
      address: 'Rua Teste, 123',
      latitude: -5.795,
      longitude: -35.209,
      whatsapp: '84999999999',
      state: 'RN',
      city: 'Natal',
    }

    await request(app.server).post('/orgs').send(orgData)

    const response = await request(app.server)
      .post('/orgs')
      .send(orgData)

    expect(response.status).toBe(409)
  })
})