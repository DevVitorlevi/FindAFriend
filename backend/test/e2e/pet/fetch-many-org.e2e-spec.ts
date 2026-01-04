import { app } from '@/app.js'
import request from 'supertest'
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import { createAndAuthenticateOrg } from '../../utils/authenticate.js'
import { createPet } from '../../utils/create-pet.js'
import { resetDatabase } from '../../utils/reset-database.js'

describe('Fetch Many Pet Of Org (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  beforeEach(async () => {
    await resetDatabase()
  })

  it('should be able to fetch only pets of the authenticated org', async () => {
    const { token, org } = await createAndAuthenticateOrg(app)
    const { token: otherToken, org: otherOrg } =
      await createAndAuthenticateOrg(app)

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

    await createPet(app, {
      orgId: otherOrg.id,
      token: otherToken,
      name: 'Bolt',
    })

    const response = await request(app.server)
      .get(`/my/pets`)
      .query({
        orgId: org.id
      })
      .set('Authorization', `Bearer ${token}`)

    expect(response.statusCode).toBe(200)
    expect(response.body.pets).toHaveLength(2)

    response.body.pets.forEach((pet: any) => {
      expect(pet.org_id).toBe(org.id)
    })

    const petNames = response.body.pets.map((pet: any) => pet.name)
    expect(petNames).toContain('Rex')
    expect(petNames).toContain('Pingo')
    expect(petNames).not.toContain('Bolt')
  })

  it('should not allow an org to fetch pets from other org', async () => {
    const { token } = await createAndAuthenticateOrg(app)
    const { org: otherOrg } = await createAndAuthenticateOrg(app)

    const response = await request(app.server)
      .get(`/my/pets`)
      .query({ ordId: otherOrg.id })
      .set('Authorization', `Bearer ${token}`)

    expect(response.statusCode).toBe(403)
  })
})
