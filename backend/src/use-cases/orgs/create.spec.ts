import { OrgAlreadyExits } from "@/utils/errors/org-already-exist.js"
import { InMemoryOrgsRepository } from "@/utils/test/in-memory/in-memory-orgs-repository.js"
import { beforeEach, describe, expect, it } from "vitest"
import { CreateOrgUseCase } from "./create.js"

let orgsRepository: InMemoryOrgsRepository
let sut: CreateOrgUseCase
describe("Create Org Use Case", () => {
  beforeEach(() => {
    orgsRepository = new InMemoryOrgsRepository()
    sut = new CreateOrgUseCase(orgsRepository)
  })
  it("should be able to register org", async () => {
    const { org } = await sut.execute({
      name: "SEDEMA",
      email: "sedema@email.com",
      password: "123456",
      address: "Centro Icapui",
      whatsapp: "(88)99999-9999",
      city: "Icapui - CE"
    })

    expect(org.id).toEqual(expect.any(String))
  })
  it("should not be able to register org with same email", async () => {
    await sut.execute({
      name: "SEDEMA",
      email: "sedema@email.com",
      password: "123456",
      address: "Centro Icapui",
      whatsapp: "(88)99999-9999",
      city: "Icapui - CE"
    })

    await expect(
      sut.execute({
        name: "SEDEMA",
        email: "sedema@email.com",
        password: "123456",
        address: "Centro Icapui",
        whatsapp: "(88)99999-9999",
        city: "Icapui - CE"
      })
    ).rejects.toBeInstanceOf(OrgAlreadyExits)
  })
})