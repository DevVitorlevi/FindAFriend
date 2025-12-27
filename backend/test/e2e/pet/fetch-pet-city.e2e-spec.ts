import { app } from '@/app.js'
import request from 'supertest'
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import { createAndAuthenticateOrg } from '../../utils/authenticate.js'
import { createPet } from '../../utils/create-pet.js'
import { resetDatabase } from '../../utils/reset-database.js'

describe('Fetch Pet City (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  beforeEach(async () => {
    await resetDatabase()
  })

  it('should be able to fetch pets with city', async () => {
    // Criar org autenticada
    const { token, org } = await createAndAuthenticateOrg(app, {
      city: "Icapui",
      state: "CE"
    })

    // Criar um pet
    await createPet(app, {
      orgId: org.id,
      token,
      name: 'Rex',
    })

    await createPet(app, {
      orgId: org.id,
      token,
      name: 'Pingo',
    })

    const response = await request(app.server).get(`/pets`).query({ city: "Icapui", state: "CE" }).send()

    expect(response.body.pets).toHaveLength(2)
    expect(response.body.pets).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(String),
        }),
      ])
    )
  })
})