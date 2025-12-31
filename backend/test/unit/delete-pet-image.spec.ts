import { DeletePetImageUseCase } from '@/use-cases/pets/delete-pet-image.js'
import { hash } from 'bcryptjs'
import { InMemoryOrgsRepository } from 'test/in-memory/in-memory-orgs-repository.js'
import { InMemoryPetImagesRepository } from 'test/in-memory/in-memory-pets-images-repository.js'
import { InMemoryPetsRepository } from 'test/in-memory/in-memory-pets-repository.js'
import { beforeEach, describe, expect, it } from 'vitest'

let petsRepository: InMemoryPetsRepository
let orgsRepository: InMemoryOrgsRepository
let petImagesRepository: InMemoryPetImagesRepository
let sut: DeletePetImageUseCase
describe(' Delete Use Case', () => {
  beforeEach(() => {
    orgsRepository = new InMemoryOrgsRepository()
    petImagesRepository = new InMemoryPetImagesRepository()
    petsRepository = new InMemoryPetsRepository(orgsRepository, petImagesRepository)
    sut = new DeletePetImageUseCase(petImagesRepository)
  })

  it('should be able to delete pet', async () => {
    const org = await orgsRepository.create({
      name: "SEDEMA",
      email: "sedema@email.com",
      password_hash: await hash('123456', 6),
      cep: "62810-000",
      whatsapp: "(88)99999-9999",
      state: "CE",
      city: "Icapui",
      latitude: -4.7086,
      longitude: -37.3564,
      street: "Rua das Flores",
      number_home: 1
    })

    const createdPet = await petsRepository.create({
      id: "pet-1",
      name: 'Rex',
      description: 'Cachorro dócil',
      age: 'ADULTO',
      size: 'MEDIO',
      org_id: org.id,
    })

    await petImagesRepository.create({
      id: "img-1",
      pet_id: createdPet.id,
      url: 'https://example.com/image1.jpg',
    })

    await petImagesRepository.create({
      pet_id: createdPet.id,
      url: 'https://example.com/image2.jpg',
    })

    await expect(
      sut.execute({
        imageId: "img-1"
      })
    ).resolves
  })
})