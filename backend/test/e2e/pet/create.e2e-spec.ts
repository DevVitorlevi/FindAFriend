import { app } from '@/app.js'
import request from 'supertest'
import { createAndAuthenticateOrg } from 'test/utils/authenticate.js'
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import { resetDatabase } from '../../utils/reset-database.js'

describe('Create Pet (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  beforeEach(async () => {
    await resetDatabase()
  })

  it('should be able to create pet', async () => {
    const { token, org } = await createAndAuthenticateOrg(app)

    const response = await request(app.server).post(`/pets/${org.id}/create`).set("Authorization", `Bearer ${token}`).send({
      name: "Sol",
      description: "Gata Laranja muito Fofa",
      age: "FILHOTE",
      size: "PEQUENO",
    })

    expect(response.status).toBe(201)
  })
})