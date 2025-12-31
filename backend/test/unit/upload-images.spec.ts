import { UploadPetImagesUseCase } from '@/use-cases/pets/upload-images.js'
import { ResourceNotFound } from '@/utils/errors/resource-not-found.js'
import { hash } from 'bcryptjs'
import { InMemoryOrgsRepository } from 'test/in-memory/in-memory-orgs-repository.js'
import { InMemoryPetImagesRepository } from 'test/in-memory/in-memory-pets-images-repository.js'
import { InMemoryPetsRepository } from 'test/in-memory/in-memory-pets-repository.js'
import { beforeEach, describe, expect, it, vi } from 'vitest'

// MOCKA o Cloudinary
vi.mock('@/lib/cloudinary', () => ({
  cloudinary: {
    uploader: {
      upload_stream: vi.fn((_, callback) => {
        // Simula o retorno do Cloudinary
        callback(null, {
          secure_url: 'https://fake-cloudinary-url.com/image.jpg',
        })

        return {
          end: vi.fn(),
        }
      }),
    },
  },
}))

let petsRepository: InMemoryPetsRepository
let petImagesRepository: InMemoryPetImagesRepository
let orgsRepository: InMemoryOrgsRepository
let sut: UploadPetImagesUseCase

describe('Upload Pet Images Use Case', () => {
  beforeEach(() => {
    orgsRepository = new InMemoryOrgsRepository()
    petsRepository = new InMemoryPetsRepository(orgsRepository)
    petImagesRepository = new InMemoryPetImagesRepository()
    sut = new UploadPetImagesUseCase(petsRepository, petImagesRepository)
  })

  it('should be able to upload pet images', async () => {
    const org = await orgsRepository.create({
      name: "SEDEMA",
      email: "sedema@email.com",
      password_hash: await hash("123456", 6),
      cep: "62810-000",
      whatsapp: "(88)99999-9999",
      state: "CE",
      city: "Icapui",
      latitude: -4.7086,
      longitude: -37.3564,
      street: "Rua das Flores",
      number_home: 1
    })

    const pet = await petsRepository.create({
      name: 'Rex',
      description: 'Cachorro dócil',
      age: 'ADULTO',
      size: 'MEDIO',
      org_id: org.id,
    })

    const fakeImageBuffer1 = Buffer.from('fake-image-1')
    const fakeImageBuffer2 = Buffer.from('fake-image-2')

    const { images } = await sut.execute({
      petId: pet.id,
      images: [fakeImageBuffer1, fakeImageBuffer2],
    })

    expect(images).toHaveLength(2)
    expect(images[0].url).toEqual('https://fake-cloudinary-url.com/image.jpg')
    expect(petImagesRepository.items).toHaveLength(2)
  })

  it('should not be able to upload images to non-existing pet', async () => {
    const fakeImageBuffer = Buffer.from('fake-image')

    await expect(() =>
      sut.execute({
        petId: 'non-existing-pet-id',
        images: [fakeImageBuffer],
      }),
    ).rejects.toBeInstanceOf(ResourceNotFound)
  })
})