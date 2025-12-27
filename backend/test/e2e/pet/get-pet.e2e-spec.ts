import { app } from '@/app.js'
import request from 'supertest'
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import { createAndAuthenticateOrg } from '../../utils/authenticate.js'
import { createPet } from '../../utils/create-pet.js'
import { resetDatabase } from '../../utils/reset-database.js'

describe('Get Pet (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  beforeEach(async () => {
    await resetDatabase()
  })

  it('should be able to get pet', async () => {
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

    const response = await request(app.server).get(`/pet/${pet.id}`).send()

    expect(response.body.pet).toEqual(
      expect.objectContaining({
        id: expect.any(String),
      }),
    )
  })
})