import { app } from '@/app.js'
import request from 'supertest'
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import { createAndAuthenticateOrg } from '../../utils/authenticate.js'
import { createFakeImage, createFakeImages } from '../../utils/create-fake-image.js'
import { createPet } from '../../utils/create-pet.js'
import { resetDatabase } from '../../utils/reset-database.js'

describe('Upload Pet Images (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  beforeEach(async () => {
    await resetDatabase()
  })

  it('should be able to upload images for a pet', async () => {
    // Criar org autenticada
    const { token, org } = await createAndAuthenticateOrg(app)

    // Criar um pet
    const { pet } = await createPet(app, {
      orgId: org.id,
      token,
      name: 'Rex',
    })

    // Criar imagem fake
    const imageBuffer = createFakeImage()

    // Fazer upload da imagem
    const response = await request(app.server)
      .post(`/pet/${pet.id}/images`)
      .set('Authorization', `Bearer ${token}`)
      .attach('file', imageBuffer, 'test-image.png')

    expect(response.status).toBe(201)
    expect(response.body.images).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(String),
          url: expect.stringContaining('cloudinary.com'),
          pet_id: pet.id,
        }),
      ])
    )
  })

  it('should be able to upload multiple images', async () => {
    const { token, org } = await createAndAuthenticateOrg(app)

    const { pet } = await createPet(app, {
      orgId: org.id,
      token,
      name: 'Miau',
    })

    const images = createFakeImages(2)

    // Fazer upload de múltiplas imagens
    const uploadRequest = request(app.server)
      .post(`/pet/${pet.id}/images`)
      .set('Authorization', `Bearer ${token}`)

    // Anexar cada imagem
    images.forEach((buffer, index) => {
      uploadRequest.attach('file', buffer, `test-image-${index}.png`)
    })

    const response = await uploadRequest

    expect(response.status).toBe(201)
    expect(response.body.images).toHaveLength(2)
    expect(response.body.images).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          url: expect.stringContaining('cloudinary.com'),
        }),
      ])
    )
  })

  it('should not upload images without authentication', async () => {
    const { org } = await createAndAuthenticateOrg(app)

    const { pet } = await createPet(app, {
      orgId: org.id,
      token: await createAndAuthenticateOrg(app).then(r => r.token),
    })

    const imageBuffer = createFakeImage()

    // Tentar upload sem token
    const response = await request(app.server)
      .post(`/pet/${pet.id}/images`)
      .attach('file', imageBuffer, 'test-image.png')

    expect(response.status).toBe(401)
  })
})