import { FetchManyOrg } from '@/use-cases/pets/fetch-many-org.js'
import { hash } from 'bcryptjs'
import { InMemoryOrgsRepository } from 'test/in-memory/in-memory-orgs-repository.js'
import { InMemoryPetImagesRepository } from 'test/in-memory/in-memory-pets-images-repository.js'
import { InMemoryPetsRepository } from 'test/in-memory/in-memory-pets-repository.js'
import { beforeEach, describe, expect, it } from 'vitest'

let petsRepository: InMemoryPetsRepository
let orgsRepository: InMemoryOrgsRepository
let petImagesRepository: InMemoryPetImagesRepository
let sut: FetchManyOrg

describe('Fetch Pet of Org Use Case', () => {
  beforeEach(() => {
    orgsRepository = new InMemoryOrgsRepository()
    petImagesRepository = new InMemoryPetImagesRepository()
    petsRepository = new InMemoryPetsRepository(orgsRepository, petImagesRepository)
    sut = new FetchManyOrg(petsRepository)
  })

  it('should be able to get pet of org', async () => {
    const org = await orgsRepository.create({
      name: "SEDEMA",
      email: "sedema@email.com",
      password_hash: await hash('123456', 6),
      whatsapp: "(88)99999-9999",
      state: "CE",
      city: "Icapui",
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
      orgId: org.id
    })

    expect(pets).toHaveLength(1)
  })

  it('should return only pets that belong to org', async () => {
    const orgA = await orgsRepository.create({
      name: 'ORG A',
      email: 'orga@email.com',
      password_hash: await hash('123456', 6),
      whatsapp: '(88)90000-0000',
      state: 'CE',
      city: 'Icapui',
    })

    const orgB = await orgsRepository.create({
      name: 'ORG B',
      email: 'orgb@email.com',
      password_hash: await hash('123456', 6),
      whatsapp: '(88)91111-1111',
      state: 'CE',
      city: 'Icapui',
    })

    await petsRepository.create({
      name: 'Rex',
      description: 'Pet da org A',
      age: 'ADULTO',
      size: 'MEDIO',
      org_id: orgA.id,
    })

    await petsRepository.create({
      name: 'Bolt',
      description: 'Pet da org B',
      age: 'ADULTO',
      size: 'MEDIO',
      org_id: orgB.id,
    })

    const { pets } = await sut.execute({
      orgId: orgA.id,
    })

    expect(pets).toHaveLength(1)
    expect(pets[0].org.id).toBe(orgA.id)
  })
})