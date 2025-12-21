import { InMemoryOrgsRepository } from "@/utils/test/in-memory/in-memory-orgs-repository.js"
import { InMemoryPetImagesRepository } from "@/utils/test/in-memory/in-memory-pets-images-repository.js"
import { InMemoryPetsRepository } from "@/utils/test/in-memory/in-memory-pets-repository.js"
import { hash } from "bcryptjs"
import { beforeEach, describe, expect, it } from "vitest"
import { AdoptedPetUseCase } from "../pets/adopted.js"

let petsRepository: InMemoryPetsRepository
let orgsRepository: InMemoryOrgsRepository
let petImagesRepository: InMemoryPetImagesRepository
let sut: AdoptedPetUseCase
describe("Adopted Pet Use Case", () => {
  beforeEach(() => {
    orgsRepository = new InMemoryOrgsRepository()
    petImagesRepository = new InMemoryPetImagesRepository()
    petsRepository = new InMemoryPetsRepository(orgsRepository, petImagesRepository)
    sut = new AdoptedPetUseCase(petsRepository)
  })
  it("should be able to adopted pet ", async () => {

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

    const { pet } = await sut.execute({
      petId: createdPet.id
    })

    expect(pet.adopted).toBe(true)

  })
})