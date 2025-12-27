import { app } from '@/app.js'
import request from 'supertest'
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import { createAndAuthenticateOrg } from '../../utils/authenticate.js'
import { createPet } from '../../utils/create-pet.js'
import { resetDatabase } from '../../utils/reset-database.js'

describe('Adopted Pet (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  beforeEach(async () => {
    await resetDatabase()
  })

  it('should be able to adopted pet', async () => {
    // Criar org autenticada
    const { token, org } = await createAndAuthenticateOrg(app, {
      city: "Icapui",
      state: "CE"
    })

    // Criar um pet
    const { pet } = await createPet(app, {
      orgId: org.id,
      token,
      name: 'Rex',
    })

    const response = await request(app.server).patch(`/pet/${pet.id}`).set("Authorization", `Bearer ${token}`).send()

    expect(response.status).toBe(204)
  })
})