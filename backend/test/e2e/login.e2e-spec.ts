import { app } from '@/app.js'
import request from 'supertest'
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import { resetDatabase } from '../utils/reset-database.js'

describe('Login Org (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  beforeEach(async () => {
    await resetDatabase()
  })

  it('should be able to login a org', async () => {
    // Primeiro registrar a org
    await request(app.server)
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

    // Depois fazer login
    const response = await request(app.server)
      .post('/sessions')
      .send({
        email: 'contato@ongamigos.com',
        password: 'senha123',
      })

    expect(response.status).toBe(200)
    expect(response.body).toEqual(
      expect.objectContaining({
        token: expect.any(String),
      })
    )
  })

  it("should note be able to login with wrong password", async () => {
    // Primeiro registrar a org
    await request(app.server)
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

    // Depois fazer login
    const response = await request(app.server)
      .post('/sessions')
      .send({
        email: 'contato@ongamigos.com',
        password: 'senha1232',
      })

    expect(response.status).toBe(500)

  })
})