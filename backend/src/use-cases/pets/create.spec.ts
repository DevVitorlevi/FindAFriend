import { InMemoryPetsRepository } from "@/utils/test/in-memory/in-memory-pets-repository.js"
import { beforeEach, describe, expect, it } from "vitest"
import { CreatePetUseCase } from "./create.js"

let petsRepository: InMemoryPetsRepository
let sut: CreatePetUseCase
describe("Create Pet Use Case", () => {
  beforeEach(() => {
    petsRepository = new InMemoryPetsRepository()
    sut = new CreatePetUseCase(petsRepository)
  })
  it("should be able to create pet ", async () => {
    const { pet } = await sut.execute({
      name: "Simba",
      age: "ADULTO",
      description: "Gato Laranja Fofo",
      size: "GRANDE",
      orgId: "org-1"
    })
    expect(pet.id).toEqual(expect.any(String))
  })
})