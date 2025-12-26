import { hash } from 'bcryptjs'
import { InMemoryOrgsRepository } from 'test/in-memory/in-memory-orgs-repository.js'
import { InMemoryPetImagesRepository } from 'test/in-memory/in-memory-pets-images-repository.js'
import { InMemoryPetsRepository } from 'test/in-memory/in-memory-pets-repository.js'
import { beforeEach, describe, expect, it } from 'vitest'
import { FetchPetCityUseCase } from '../../src/use-cases/pets/fetch-pet-city.js'

let petsRepository: InMemoryPetsRepository
let orgsRepository: InMemoryOrgsRepository
let petImagesRepository: InMemoryPetImagesRepository
let sut: FetchPetCityUseCase

describe('Fetch Pet City Use Case', () => {
  beforeEach(() => {
    orgsRepository = new InMemoryOrgsRepository()
    petImagesRepository = new InMemoryPetImagesRepository()
    petsRepository = new InMemoryPetsRepository(orgsRepository, petImagesRepository)
    sut = new FetchPetCityUseCase(petsRepository)
  })

  it('should be able to get pet to city', async () => {
    const org = await orgsRepository.create({
      name: "SEDEMA",
      email: "sedema@email.com",
      password_hash: await hash('123456', 6),
      cep: "62810-000",
      address: "Vila Serra de Peroba",
      whatsapp: "(88)99999-9999",
      state: "CE",
      city: "Icapui",
      latitude: -4.7086,
      longitude: -37.3564
    })

    const createdPet = await petsRepository.create({
      name: 'Rex',
      description: 'Cachorro dócil',
      age: 'ADULTO',
      size: 'MEDIO',
      org_id: org.id,
    })

    await petImagesRepository.create({
      pet_id: createdPet.id,
      url: 'https://example.com/image1.jpg',
    })

    await petImagesRepository.create({
      pet_id: createdPet.id,
      url: 'https://example.com/image2.jpg',
    })

    const { pets } = await sut.execute({
      city: "Icapui",
      state: "CE"
    })

    expect(pets).toHaveLength(1)
  })
})